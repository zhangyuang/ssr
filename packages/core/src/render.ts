import { Readable, Stream } from 'stream'
import { loadConfig, StringToStream, mergeStream2, setHeader, judgeServerFramework, judgeFramework, getViteServerEntry, getCustomScript } from 'ssr-common-utils'
import { ISSRContext, UserConfig, IConfig, Vue3RenderRes } from 'ssr-types'
import type { ViteDevServer } from 'vite'

const defaultConfig = loadConfig()
const sf = judgeServerFramework()
const f = judgeFramework()
const viteServerEntry = getViteServerEntry()
type RenderRes = string|Readable|Vue3RenderRes

function render (ctx: ISSRContext, options?: UserConfig & { stream: true }): Promise<Readable>
function render (ctx: ISSRContext, options?: UserConfig & { stream: false }): Promise<string>
function render (ctx: ISSRContext, options?: UserConfig): Promise<string>
function render<T> (ctx: ISSRContext, options?: UserConfig): Promise<T>

async function render (ctx: ISSRContext, options?: UserConfig) {
  const extraConfig: UserConfig = options?.dynamicFile?.configFile ? require(options.dynamicFile.configFile).userConfig : {}
  const config: IConfig = Object.assign({}, defaultConfig, extraConfig, options ?? {})
  // support combine dynamic customeHeadScript when call render
  config.customeHeadScript = getCustomScript(defaultConfig.customeHeadScript, ctx).concat(getCustomScript(config.customeHeadScript, ctx))
  config.customeFooterScript = getCustomScript(defaultConfig.customeFooterScript, ctx).concat(getCustomScript(config.customeFooterScript, ctx))

  const { isVite, isDev } = config
  if (!isDev && options?.dynamicFile?.assetManifest) {
    config.isVite = !!(require(options.dynamicFile.assetManifest).vite)
  }

  setHeader(ctx, sf)

  const serverRes: RenderRes = isVite ? await viteRender(ctx, config) : await commonRender(ctx, config)
  if (serverRes instanceof Stream) {
    if (f !== 'ssr-plugin-react18') {
      const stream = mergeStream2(new StringToStream('<!DOCTYPE html>'), serverRes)
      stream.on('error', (e: any) => {
        console.log(e)
      })
      return stream
    }
    return serverRes
  } else {
    if (f === 'ssr-plugin-vue3') {
      let { html, teleportsContext } = serverRes as Vue3RenderRes
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
    } else {
      return `<!DOCTYPE html>${serverRes}`
    }
  }
}

let viteServer: ViteDevServer | boolean = false

async function viteRender (ctx: ISSRContext, config: IConfig) {
  const { isDev, dynamicFile } = config
  let serverRes
  if (isDev) {
    const { createServer } = await import('vite')
    const { serverConfig } = await import(f)
    viteServer = !viteServer ? await createServer(serverConfig) : viteServer
    const { serverRender } = await (viteServer as ViteDevServer).ssrLoadModule(viteServerEntry)
    serverRes = await serverRender(ctx, config)
  } else {
    const { serverRender } = require(dynamicFile.serverBundle)
    const serverRes = await serverRender(ctx, config)
    return serverRes
  }
  return serverRes
}

async function commonRender (ctx: ISSRContext, config: IConfig) {
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
