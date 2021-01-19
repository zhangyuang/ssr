import { resolve } from 'path'
import { renderToString, renderToNodeStream } from 'react-dom/server'
import { buildConfig, getCwd, StringStream, mergeStream } from 'ssr-server-utils'
import { IFaaSContext } from 'ssr-types'

const cwd = getCwd()
const { isDev, chunkName, fePlugin } = buildConfig
const isLocal = isDev ?? process.env.NODE_ENV !== 'production'
const serverFile = resolve(cwd, `./build/server/${chunkName ?? 'Page'}.server.js`)

async function render (ctx: IFaaSContext, options = {}) {
  const { stream } = options
  if (isLocal) {
    // clear cache in development environment
    delete require.cache[serverFile]
  }
  ctx.type = 'text/html'
  const serverRender = require(serverFile).default
  const serverRes = await serverRender(ctx, buildConfig)
  return stream ? mergeStream(new StringStream('<!DOCTYPE html>'), renderToNodeStream(serverRes)) : '<!DOCTYPE html>' + renderToString(serverRes)
}

export {
  render
}
