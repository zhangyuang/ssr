import { resolve } from 'path'
import { renderToString, renderToNodeStream } from 'react-dom/server'
import { loadConfig, getCwd, StringToStream, mergeStream } from 'ssr-server-utils'
import { IFaaSContext } from 'ssr-types'

const cwd = getCwd()
const { buildConfig } = loadConfig()
const { isDev, chunkName } = buildConfig
const isLocal = isDev ?? process.env.NODE_ENV !== 'production'
const serverFile = resolve(cwd, `./build/server/${chunkName ?? 'Page'}.server.js`)

async function render (ctx: IFaaSContext, options = {}) {
  const config = Object.assign({}, buildConfig, options)
  const { stream } = config
  if (isLocal) {
    // clear cache in development environment
    delete require.cache[serverFile]
  }
  ctx.type = 'text/html'
  const serverRender = require(serverFile).default
  const serverRes = await serverRender(ctx, config)
  return stream ? mergeStream(new StringToStream('<!DOCTYPE html>'), renderToNodeStream(serverRes)) : '<!DOCTYPE html>' + renderToString(serverRes)
}

export {
  render
}
