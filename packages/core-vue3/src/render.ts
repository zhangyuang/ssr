import { resolve } from 'path'
import { loadConfig, getCwd, StringToStream } from 'ssr-server-utils'
import { renderToStream, renderToString } from '@vue/server-renderer'
import { ISSRContext, UserConfig } from 'ssr-types'
const mergeStream = require('merge-stream')
const cwd = getCwd()
const defaultConfig = loadConfig()

async function render<T = string>(ctx: ISSRContext, options?: UserConfig): Promise<T> {
  const config = Object.assign({}, defaultConfig, options ?? {})
  const { isDev, chunkName, stream } = config
  const isLocal = isDev || process.env.NODE_ENV !== 'production'
  const serverFile = resolve(cwd, `./build/server/${chunkName}.server.js`)
  if (isLocal) {
    // clear cache in development environment
    delete require.cache[serverFile]
  }
  if (typeof ctx.response.type === 'function') {
    ctx.response.type('.html')
  } else {
    ctx.response.type = 'text/html'
  }
  const serverRender = require(serverFile).default

  const serverRes = await serverRender(ctx, config)

  return stream
    ? mergeStream(new StringToStream('<!DOCTYPE html>'), renderToStream(serverRes))
    : `<!DOCTYPE html>${await renderToString(serverRes)}`
}

export { render }
