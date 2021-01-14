import { resolve } from 'path'
import { renderToString } from 'react-dom/server'
import { getCwd, findRoute, parseYml, parseRoutesFromYml } from 'ssr-server-utils'
import { IFaaSContext, FaasRouteItem } from 'ssr-types'

const debug = require('debug')('ssr:render')
const isDev = process.env.NODE_ENV !== 'production'
const cwd = getCwd()
const ymlContent = isDev ? parseYml('./f.yml') : parseYml('./f.origin.yml')
const faasRoutes = parseRoutesFromYml(ymlContent)

const render = async (ctx: IFaaSContext) => {
  const start = Date.now()

  const faasRouteItem = findRoute<FaasRouteItem>(faasRoutes, ctx.req.path)
  const { funcName } = faasRouteItem

  const abFilePath = resolve(cwd, `./build/${funcName}/server/Page.server.js`)

  debug(`Render function name: ${funcName} with path ${ctx.req.path} by ${abFilePath}`)
  if (isDev) {
    // clear cache in development environment
    delete require.cache[abFilePath]
  }

  const serverRender = require(abFilePath).default
  const serverRes = await serverRender(ctx, {
    faasRoutes: faasRoutes
  })

  const htmlStr: string = renderToString(serverRes)
  debug(`Page rendering spend ${Date.now() - start}ms`)
  ctx.type = 'text/html'
  return '<!DOCTYPE html>' + htmlStr
}

export {
  render
}
