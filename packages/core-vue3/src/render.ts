import { Readable, Stream } from 'stream'
import { loadConfig, StringToStream, mergeStream2, judgeServerFramework } from 'ssr-common-utils'
import { ISSRContext, UserConfig, ISSRNestContext, IConfig } from 'ssr-types'
import type { ViteDevServer } from 'vite'
import type { Vue3RenderRes } from 'ssr-plugin-vue3'

const defaultConfig = loadConfig()
const serverFrameWork = judgeServerFramework()

function render (ctx: ISSRContext, options?: UserConfig & {stream: true}): Promise<Readable>
function render (ctx: ISSRContext, options?: UserConfig & {stream: false}): Promise<string>
function render (ctx: ISSRContext, options?: UserConfig): Promise<string>
function render<T> (ctx: ISSRContext, options?: UserConfig): Promise<T>

async function render (ctx: ISSRContext, options?: UserConfig) {
  const extraConfig: UserConfig = options?.dynamicFile?.configFile ? require(options.dynamicFile.configFile).userConfig : {}
  const config: IConfig = Object.assign({}, defaultConfig, options ?? {}, extraConfig)
  const { isVite, isDev } = config

  if (!isDev && options?.dynamicFile?.assetManifest) {
    config.isVite = !!(require(options.dynamicFile.assetManifest).vite)
  }
  if (serverFrameWork === 'ssr-plugin-midway') {
    ctx.response.type = 'text/html;charset=utf-8'
  } else if (serverFrameWork === 'ssr-plugin-nestjs') {
    (ctx as ISSRNestContext).response.setHeader('Content-type', 'text/html;charset=utf-8')
  }

  const serverRes = isVite ? await viteRender(ctx, config) : await commonRender(ctx, config)
  if (serverRes instanceof Stream) {
    const stream = mergeStream2(new StringToStream('<!DOCTYPE html>'), serverRes)
    stream.on('error', (e: any) => {
      console.log(e)
    })
    return stream
  } else {
    let { html, teleportsContext } = serverRes
    if (teleportsContext.teleports) {
      const { teleports } = teleportsContext
      const cheerio = require('cheerio')
      const $ = cheerio.load(html)
      for (const target in teleports) {
        const content = teleports[target]
        $(target).append(content)
      }
      html = $.html()
    }
    return `<!DOCTYPE html>${html}`
  }
}

let viteServer: ViteDevServer|boolean = false

async function viteRender (ctx: ISSRContext, config: IConfig): Promise<Vue3RenderRes> {
  const { isDev, vue3ServerEntry, dynamicFile } = config
  let serverRes
  if (isDev) {
    const { createServer } = await import('vite')
    const { serverConfig } = await import('ssr-plugin-vue3')
    viteServer = !viteServer ? await createServer(serverConfig) : viteServer
    const { serverRender } = await (viteServer as ViteDevServer).ssrLoadModule(vue3ServerEntry)
    serverRes = await serverRender(ctx, config)
  } else {
    const { serverRender } = require(dynamicFile.serverBundle)
    const serverRes = await serverRender(ctx, config)
    return serverRes
  }
  return serverRes
}

async function commonRender (ctx: ISSRContext, config: IConfig): Promise<Vue3RenderRes> {
  const { isDev, dynamicFile } = config
  const serverBundle = dynamicFile.serverBundle

  if (isDev) {
    delete require.cache[serverBundle]
  }

  const { serverRender } = require(dynamicFile.serverBundle)
  const serverRes = await serverRender(ctx, config)
  return serverRes
}

export { render }
