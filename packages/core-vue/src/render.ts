import { resolve } from 'path'
import { Readable } from 'stream'
import { loadConfig, getCwd, StringToStream, mergeStream2, judgeServerFramework } from 'ssr-common-utils'
import { ISSRContext, UserConfig, ISSRNestContext, IConfig } from 'ssr-types'

const cwd = getCwd()
const defaultConfig = loadConfig()
const serverFrameWork = judgeServerFramework()

function render (ctx: ISSRContext, options?: UserConfig & {stream: true}): Promise<Readable>
function render (ctx: ISSRContext, options?: UserConfig & {stream: false}): Promise<string>
function render (ctx: ISSRContext, options?: UserConfig): Promise<string>
function render<T> (ctx: ISSRContext, options?: UserConfig): Promise<T>

async function render (ctx: ISSRContext, options?: UserConfig) {
  const config = Object.assign({}, defaultConfig, options ?? {})
  const { isVite } = config

  if (serverFrameWork === 'ssr-plugin-midway') {
    ctx.response.type = 'text/html;charset=utf-8'
  } else if (serverFrameWork === 'ssr-plugin-nestjs') {
    (ctx as ISSRNestContext).response.setHeader('Content-type', 'text/html;charset=utf-8')
  }

  const serverRes = isVite ? await viteRender(ctx, config) : await commonRender(ctx, config)
  if (serverRes instanceof Readable) {
    const stream = mergeStream2(new StringToStream('<!DOCTYPE html>'), serverRes)
    stream.on('error', (e: any) => {
      console.log(e)
    })
    return stream
  } else {
    return `<!DOCTYPE html>${serverRes}`
  }
}

async function viteRender (ctx: ISSRContext, config: IConfig): Promise<string|Readable> {
  const { isDev, chunkName, vueServerEntry } = config
  let serverRes
  if (isDev) {
    const { createServer } = await import('vite')
    const { serverConfig } = await import('ssr-plugin-vue')
    const viteServer = await createServer(serverConfig)
    const { serverRender } = await viteServer.ssrLoadModule(vueServerEntry)
    serverRes = await serverRender(ctx, config)
  } else {
    const serverFile = resolve(cwd, `./build/server/${chunkName}.server.js`)
    const { serverRender } = require(serverFile)
    const serverRes = await serverRender(ctx, config)
    return serverRes
  }
  return serverRes
}

async function commonRender (ctx: ISSRContext, config: IConfig): Promise<string|Readable> {
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
