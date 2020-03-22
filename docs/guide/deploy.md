# 最佳发布实践

Node.js应用相比于传统的前端界面应用，发布方式是复杂了许多。传统的页面发布我只需要更新一下页面中的`js/css`代码或者改一下引用的静态资源版本号，再在一些发布平台中点一下发布更新一下CDN中html文件的内容就可以马上生效了。大部分发布在1-2分钟内即可修改完毕发布。但是引入Node.js后，每次的发布都需要经历部署，构建，机器分批关闭重启等阶段。至少需要5-6分钟的时间才可以走完一遍流程，机器性能差的话需要十几分钟。而且一点小小的修改都需要走一遍这个流程，相信不少人都对此十分厌烦。

我们团队基于多个线上SSR应用发布经验，独创出了一套无需重启应用即可更新页面的发布方式。并且将其开源普适化，在底层打平这些差异，上层无需过多关注实现逻辑

## 准备

为了实现这套发布方式你需要什么

- 需要一个CDN服务用于托管静态资源文件，无论是前端的bundle还是服务端的bundle都放在CDN上。同时将config中的静态资源地址全部替换为相应的CDN地址
- 配置发布管理平台，可以是可视化的管理平台，或者是纯json文本，并且提供http/rpc服务让Node应用可以获取到当前最新的资源版本号配置情况
- ykfe-utils 版本大于 2.7.0

使用CDN地址的config配置如下

![](https://img.alicdn.com/tfs/TB1hgE5qGL7gK0jSZFBXXXZZpXa-1246-986.jpg)

## 适用场景

本发布方式只适用于你修改React组件后的页面更新，如果你修改了Node.js的逻辑层相关代码，例如egg的controller, service等代码，必须重启应用才能生效。

## 实现原理浅析

通过config中的injectScript我们可以控制加载的前端资源的地址，这里可以简单替换为CDN地址无需做任何处理。所以关键是serverBundle如何从CDN中读取。
这里我们在`ykfe-utils@2.7.0`的底层，打平了这一层的差异。你可以在`config.serverJs`中填写CDN地址，我们检测到这是一个CDN地址路径后会执行对应的逻辑

```js
import fs from 'fs'
import Shell from 'shelljs'
import axios from 'axios'
import { resolve } from 'path'
import { Context }from 'midway'
import { Config }from './interface/config'
import { Global }from './interface/global'

declare const global: Global


const resolveDir = (path: string) => resolve(process.cwd(), path)

const getServerBundle = async (cdn: string, path: string) => {
  console.log('\x1B[32m get serverBundle from CDN file', cdn)
  const res = await axios.get(cdn)
  const str = res.data
  Shell.mkdir(resolveDir('./.serverBundle'))
  fs.writeFileSync(path, str)
  const serverJs = require(path).default
  return serverJs
}

const renderToStream = async (ctx: Context, config: Config) => {
  const baseDir = config.baseDir || process.cwd()
  const isLocal = process.env.NODE_ENV === 'development' || config.env === 'local' // 标志非正式环境
  const useCDN = config.useCDN
  let serverJs = config.serverJs
  let version
  let serverJsPath: string = ''
  if (useCDN) {
    try {
      version = (/\d+(\.\d+)+/.exec(serverJs as string) as string[])[0] // cdn地址必须带有版本号
      serverJsPath = resolveDir(`./.serverBundle/server${version}.js`)
    } catch (error) {
      console.log('请检查cdn地址是否符合规范并带有版本号', error)
      return
    }
  }

  if (isLocal && typeof serverJs === 'string') {
    // 本地开发环境(预发环境|测试环境)下每次刷新的时候清空require服务端文件的缓存，保证服务端与客户端渲染结果一致
    useCDN ? delete require.cache[serverJsPath] : delete require.cache[serverJs]
  }
  if (useCDN) {
    try {
      try {
        fs.statSync(serverJsPath)
        if (isLocal) {
          // 本地开发环境每次都从cdn拉取文件
          serverJs = await getServerBundle(serverJs as string, serverJsPath)
        }
      } catch (error) {
        // 首次访问本地没有对应的serverJsPath的情况需要从cdn拉取文件
        serverJs = await getServerBundle(serverJs as string, serverJsPath)
      }
      if (!isLocal) {
        // 正式环境直接require serverBundle
        console.log('\x1B[32m get serverBundle from local file', serverJsPath)
        serverJs = require(serverJsPath).default
      }
    } catch (error) {
      console.log('error', error)
    }
  }
  let csr
  if (ctx.request && ctx.request.query) {
    // 兼容express和koa的query获取
    csr = ctx.request.query.csr
  }
  if (config.type !== 'ssr' || csr) {
    const renderLayout = require('yk-cli/lib/renderLayout').default
    const str = await renderLayout(ctx)
    return str
  }

  if (!global.renderToNodeStream) {
    // for this issue https://github.com/ykfe/egg-react-ssr/issues/4
    global.renderToNodeStream = require(baseDir + '/node_modules/react-dom/server').renderToNodeStream
  }
  if (!global.serverStream || isLocal) {
    global.serverStream = typeof serverJs === 'string' ? require(serverJs).default : serverJs
  }
  const serverRes = await global.serverStream(ctx)
  const stream = global.renderToNodeStream(serverRes)
  return stream
}

export default renderToStream

```

总结一下renderToStream干了什么事情

- 如果你填写了CDN地址，则将CDN的资源下载下来并且写入本地文件，且文件名带有版本号
- 非生产环境必须每次都拉去CDN的资源并且清空之前的缓存，这时候我们可以使用覆盖式发布的方式，在测试环境或者是预发环境每次用同一个版本号来更新静态资源
- 生产环境直接从本地硬盘中require即可，如果当前没有文件，则从CDN拉取

## 注意事项

- 前端bundle和服务端bundle需要同步更新，不能出现新的前端bundle对应旧的服务端bundle，或者是反过来的情况。这样会导致页面的渲染出现错误。即要么全都用CDN文件，要么全用本地文件
- CDN地址必须带有版本号，否则无法做版本追溯以及获得最佳生产环境体验
- 当我们在预发环境或者测试环境期望每次用同一个版本号来测试，这时候请设置`config.env='local'`,会清空之前的文件缓存并且从CDN拉取文件。但生产环境不要出现该设置