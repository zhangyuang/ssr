import { resolve } from 'path'
import { Readable, Stream } from 'stream'
import { loadConfig, getCwd, StringToStream, mergeStream2, setHeader } from 'ssr-common-utils'
import type { ISSRContext, UserConfig, IConfig } from 'ssr-types'
import type { ViteDevServer } from 'vite'

const cwd = getCwd()
const defaultConfig = loadConfig()

function render (ctx: ISSRContext, options?: UserConfig & {stream: true}): Promise<Readable>
function render (ctx: ISSRContext, options?: UserConfig & {stream: false}): Promise<string>
function render (ctx: ISSRContext, options?: UserConfig): Promise<string>
function render<T> (ctx: ISSRContext, options?: UserConfig): Promise<T>

async function render (ctx: ISSRContext, options?: UserConfig) {
  const config = Object.assign({}, defaultConfig, options ?? {})
  const { isVite } = config
  setHeader(ctx)
  const serverRes = isVite ? await viteRender(ctx, config) : await commonRender(ctx, config)
  if (serverRes instanceof Stream) {
    const stream = mergeStream2(new StringToStream('<!DOCTYPE html>'), serverRes)
    stream.on('error', (e: any) => {
      console.log(e)
    })
    return stream
  } else {
    return `<!DOCTYPE html>${serverRes}`
  }
}
let viteServer: ViteDevServer|boolean = false
async function viteRender (ctx: ISSRContext, config: IConfig): Promise<string|Stream> {
  const { isDev, chunkName, reactServerEntry } = config
  let serverRes
  if (isDev) {
    const { createServer } = await import('vite')
    const { serverConfig } = await import('ssr-plugin-react')
    viteServer = !viteServer ? await createServer(serverConfig) : viteServer
    const { serverRender } = await (viteServer as ViteDevServer).ssrLoadModule(reactServerEntry)
    serverRes = await serverRender(ctx, config)
  } else {
    const serverFile = resolve(cwd, `./build/server/${chunkName}.server.js`)
    const { serverRender } = require(serverFile)
    const serverRes = await serverRender(ctx, config)
    return serverRes
  }
  return serverRes
}

async function commonRender (ctx: ISSRContext, config: IConfig): Promise<string|Stream> {
  const { isDev, chunkName } = config
  const serverFile = resolve(cwd, `./build/server/${chunkName}.server.js`)

  if (isDev) {
    delete require.cache[serverFile]
  }

  const { serverRender } = require(serverFile)
  const serverRes = await serverRender(ctx, config)
  return serverRes
}

export {
  render
}
