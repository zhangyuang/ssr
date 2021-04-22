# 应用配置

本章节将介绍 `config.js` 支持的一些配置。了解详细的配置可以直接查看该[文件](https://github.com/ykfe/ssr/blob/dev/packages/server-utils/src/loadConfig.ts)

配置文件可通过 `config.js` 文件定义以及调用 `core.render` 方法时实时传入。会将两者配置进行合并

```js
import { render } from 'ssr-core-vue3'

const stream = await render<Readable>(this.ctx, userConfig)
```

## mode

渲染模式

- 类型: `string`
- 默认: `ssr`

通过渲染模式来决定当前应用采用服务端渲染还是客户端渲染

## stream

- 类型: `boolean`
- 默认: `false`

是否将组件编译为 `stream` 进行返回来加快展现速度。默认为 `false`, 即返回普通 `html` 字符串

## isDev

- 类型: `boolean`
- 默认: `false`

标志当前运行环境，根据 `NODE_ENV === development` 判断

## publicPath

- 类型: `string`
- 默认: `/`

静态资源的 `publicPath`, 本地开发环境一般无需配置。生产环境若走本地静态资源目录也无需配置。若需要走单独的 `CDN` 服务部署可配置为具体的 `CDN` 地址例如 `https://g.alicdn.com/path/xxx`

## useHash

- 类型: `boolean`
- 默认: `true`

构建产物是否带有 `hash`，默认生产环境开启，不建议关闭

## fePort

- 类型: `number`
- 默认: `8000`

本地开发时 `webpack-dev-server` 托管前端静态资源的端口，`Node.js Server` 会自动 `proxy` 静态资源, 无特殊需求不需要修改

## chunkName

- 类型: `string`
- 默认: `Page`

静态资源构建时默认的 `entry` 名, 默认为 `Page`。无特殊需求不需要修改

## chunkName

- 类型: `string`
- 默认: `Page`

静态资源构建时默认的 `entry` 名, 默认为 `Page`。无特殊需求不需要修改

## chunkName

- 类型: `string`
- 默认: `Page`

静态资源构建时默认的 `entry` 名, 默认为 `Page`。无特殊需求不需要修改
## webpackDevServerConfig

- 类型: `webpackDevServer.Configuration`
- 默认: `见文章上方具体配置文件`

`webpack-dev-server` 启动配置


## webpackDevServerConfig

- 类型: `webpackDevServer.Configuration`
- 默认: `见文章上方具体配置文件`

`webpack-dev-server` 启动配置

## chainBaseConfig

- 类型: `(config: WebpackChain) => vod`
- 默认: `见文章上方具体配置文件`

使用 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改 `服务端/客户端` 公共的 `Webpack` 构建配置