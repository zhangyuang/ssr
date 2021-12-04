import { resolve } from 'path'
import { loadConfig, getCwd, StringToStream, mergeStream2 } from 'ssr-server-utils'
import { renderToNodeStream, renderToString } from '@vue/server-renderer'
import { ISSRContext, UserConfig, ExpressContext, IConfig } from 'ssr-types'

const cwd = getCwd()
const defaultConfig = loadConfig()

function render (ctx: ISSRContext, options?: UserConfig): Promise<string>
function render<T> (ctx: ISSRContext, options?: UserConfig): Promise<T>

async function render (ctx: ISSRContext, options?: UserConfig) {
  const config = Object.assign({}, defaultConfig, options ?? {})
  const { stream, isVite } = config

  if (!ctx.response.type && typeof ctx.response.type !== 'function') {
    ctx.response.type = 'text/html;charset=utf-8'
  } else if (!(ctx as ExpressContext).response.hasHeader?.('content-type')) {
    (ctx as ExpressContext).response.setHeader?.('Content-type', 'text/html;charset=utf-8')
  }

  const serverRes = isVite ? await viteRender(ctx, config) : await commonRender(ctx, config)
  if (stream) {
    const stream = mergeStream2(new StringToStream('<!DOCTYPE html>'), renderToNodeStream(serverRes))
    stream.on('error', (e: any) => {
      console.log(e)
    })
    return stream
  } else {
    return `<!DOCTYPE html>${await renderToString(serverRes)}`
  }
}

async function viteRender (ctx: ISSRContext, config: IConfig) {
  const { isDev, chunkName, vue3ServerEntry } = config
  let serverRes
  if (isDev) {
    const { createServer } = await import('vite')
    const { serverConfig } = await import('ssr-plugin-vue3')
    const viteServer = await createServer(serverConfig)
    const { serverRender } = await viteServer.ssrLoadModule(vue3ServerEntry)
    serverRes = await serverRender(ctx, config)
  } else {
    const serverFile = resolve(cwd, `./build/server/${chunkName}.server.js`)
    const { serverRender } = require(serverFile)
    const serverRes = await serverRender(ctx, config)
    return serverRes
  }
  return serverRes
}

async function commonRender (ctx: ISSRContext, config: IConfig) {
  const { isDev, chunkName } = config
  const serverFile = resolve(cwd, `./build/server/${chunkName}.server.js`)

  if (isDev) {
    delete require.cache[serverFile]
  }

  const { serverRender } = require(serverFile)
  const serverRes = await serverRender(ctx, config)
  return serverRes
}

export { render }
