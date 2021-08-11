import { resolve } from 'path'
import { loadConfig, getCwd, StringToStream, mergeStream2 } from 'ssr-server-utils'
import { renderToNodeStream, renderToString } from '@vue/server-renderer'
import { ISSRContext, UserConfig, ExpressContext } from 'ssr-types'

const cwd = getCwd()
const defaultConfig = loadConfig()

async function render<T = string> (ctx: ISSRContext, options?: UserConfig): Promise<T> {
  const config = Object.assign({}, defaultConfig, options ?? {})
  const { isDev, chunkName, stream } = config
  const isLocal = isDev || process.env.NODE_ENV !== 'production'
  const serverFile = resolve(cwd, `./build/server/${chunkName}.server.js`)
  if (isLocal) {
    // clear cache in development environment
    delete require.cache[serverFile]
  }
  if (typeof ctx.response.type !== 'function' && !ctx.response.type) {
    // midway/koa 场景设置默认 content-type
    ctx.response.type = 'text/html;charset=utf-8'
  } else if (!(ctx as ExpressContext).response.hasHeader('content-type')) {
    // express 场景
    (ctx as ExpressContext).response.setHeader?.('Content-type', 'text/html;charset=utf-8')
  }

  const serverRender = require(serverFile).default
  const serverRes = await serverRender(ctx, config)

  if (stream) {
    // @ts-expect-error
    const stream = mergeStream2(new StringToStream('<!DOCTYPE html>'), renderToNodeStream(serverRes))
    stream.on('error', (e: any) => {
      console.log(e)
    })
    return stream
  } else {
    // @ts-expect-error
    return `<!DOCTYPE html>${await renderToString(serverRes)}`
  }
}

export { render }
