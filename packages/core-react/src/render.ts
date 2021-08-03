import { resolve } from 'path'
import { renderToString, renderToNodeStream } from 'react-dom/server'
import { loadConfig, getCwd, StringToStream, mergeStream2 } from 'ssr-server-utils'
import { ISSRContext, UserConfig } from 'ssr-types'

const cwd = getCwd()
const defaultConfig = loadConfig()

async function render<T = string> (ctx: ISSRContext, options?: UserConfig): Promise<T> {
  const config = Object.assign({}, defaultConfig, options ?? {})
  const { isDev, chunkName, stream } = config
  const isLocal = isDev || process.env.NODE_ENV !== 'production'
  const serverFile = resolve(cwd, `./build/server/${chunkName ?? 'Page'}.server.js`)
  if (isLocal) {
    // clear cache in development environment
    delete require.cache[serverFile]
  }

  const serverRender = require(serverFile).default
  const serverRes = await serverRender(ctx, config)

  if (typeof ctx.response.type !== 'function') {
    // midway/koa 场景设置默认 content-type
    ctx.response.type = 'text/html'
  }

  if (stream) {
    // @ts-expect-error
    const stream = mergeStream2(new StringToStream('<!DOCTYPE html>'), renderToNodeStream(serverRes))
    stream.on('error', (e: any) => {
      console.log(e)
    })
    return stream
  } else {
    // @ts-expect-error
    return '<!DOCTYPE html>' + renderToString(serverRes)
  }
}

export {
  render
}
