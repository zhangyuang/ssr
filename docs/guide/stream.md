# 以流的形式返回

这一章讲述的是，当我们获取到打包后的serverRender方法后，应该如何将它渲染为流，以及和我们的模版文件结合成一个完整的流返回给客户端。使用流相较于使用字符串可以大大缩短我们的ttfb(首次请求返回)时间。同时还告诉你如何通过config的字段来切换CSR/SSR两种渲染模式。

## 流的优势

流相比一次性写到内存中，它会先写到到一个缓冲区，然后再由消费者去读取，不用将整个文件写进内存，节省了内存空间。并且可以缩短浏览器接收到响应的第一个字节的时间。

## 完整过程

这里我们要将前端组件编译为完整的html文档结构返回给浏览器，并且需要处理ssr降级为csr的情况

```js
//ykfe-utils/src/renderToStream.js

/** @params
 * ctx 当前请求上下文
 * config 当前应用配置
 * */
const renderToStream = async (ctx, config) => {
  const baseDir = config.baseDir || process.cwd()
  const isLocal = config.env === 'local'
  const serverJs = config.serverJs

  if (config.type !== 'ssr') {
    // 如果当前是非ssr渲染模式，则直接返回不包含子组件的空layout
    const string = require('yk-cli/bin/renderLayout')
    return string
  }

  if (!global.renderToNodeStream) {
    // for this issue https://github.com/ykfe/egg-react-ssr/issues/4
    global.renderToNodeStream = require(baseDir + '/node_modules/react-dom/server').renderToNodeStream
  }

  if (isLocal) {
    // 本地开发环境下每次刷新的时候清空require服务端文件的缓存，保证服务端与客户端渲染结果一致
    delete require.cache[serverJs]
  }

  if (!global.serverStream || isLocal) {
    // 同理本地开发环境下保证global.serverStream是当前最新的
    global.serverStream = require(serverJs).default
  }

  const serverRes = await global.serverStream(ctx)
  const stream = global.renderToNodeStream(serverRes)
  // 此时返回的stream已经是完整的html文档
  return stream
}

```

## 总结

通过以上代码，我们可以很好的兼容CSR/SSR两种渲染模式，他们共用了layout组件来作为自己的模版，当需要修改骨架时，无需在多个地方修改。其次当你降级为CSR渲染模式时，我们无需调用serverRender方法而是直接将layout组件渲染为一个html字符串返回，这样减小了服务端的压力，在流量过大时，可以开启此选项来降级。同时我们可以发现上述代码还有一定的性能提升空间，我们最后将多个stream依次返回给了客户端，其实这里我们可以结合[bigpipe](https://github.com/bigviewjs/bigview)的理念，来实现服务端/客户端并行渲染。