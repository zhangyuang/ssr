import { resolve } from 'path'
import { loadConfig, getCwd, StringToStream, mergeStream2 } from 'ssr-server-utils'
import { createRenderer } from 'vue-server-renderer'
import { ISSRContext, UserConfig } from 'ssr-types'

const cwd = getCwd()
const defaultConfig = loadConfig()
const { renderToStream, renderToString } = createRenderer()

async function render<T=string> (ctx: ISSRContext, options?: UserConfig): Promise<T> {
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
  // @ts-expect-error
  return stream ? mergeStream2(new StringToStream('<!DOCTYPE html>'), renderToStream(serverRes)) : `<!DOCTYPE html>${await renderToString(serverRes)}`
}

export {
  render
}
