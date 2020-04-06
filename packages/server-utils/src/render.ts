import { getCwd } from './cwd'
import { IFaaSContext, IGlobal, FaasRouteItem }from 'ssr-types'
import { findRoute } from './findRoute'
import { parseYml, parseRoutesFromYml } from './parse'

declare const global: IGlobal

const ymlContent = parseYml('./f.yml')
const faasRoutes = parseRoutesFromYml(ymlContent)

const render = async (ctx: IFaaSContext) => {

  const cwd = getCwd()
  const isLocal = process.env.NODE_ENV === 'development' || ctx.env === 'local' // 标志非正式环境

  if (!global.renderToNodeStream) {
    // for this issue https://github.com/ykfe/egg-react-ssr/issues/4
    global.renderToString = require(cwd + '/node_modules/react-dom/server').renderToString
  }
  if (!global.serverRender || isLocal) {
    const faasRouteItem = findRoute<FaasRouteItem>(faasRoutes, ctx.path)
    const { funcName } = faasRouteItem
    global.serverRender = require(`${cwd}/build/${funcName}/server/Page.server`).default
  }

  const serverRes = await global.serverRender(ctx, {
    faasRoutes: faasRoutes
  })

  const htmlStr = global.renderToString(serverRes)
  return htmlStr
}

export {
  render
}
