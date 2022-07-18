import { promises as fs } from 'fs'
import { join } from 'path'
import { ParseFeRouteItem } from 'ssr-types'
import { normalizeEndPath } from 'ssr-common-utils'
import { getFeDir, accessFile, writeRoutes, cpManualRoutes, getPagesDir, judgeFramework } from './cwd'
import { loadConfig } from './loadConfig'

export const getOutputPublicPath = () => {
  // return /client/
  const { publicPath, isDev } = loadConfig()
  const path = normalizeEndPath(publicPath)
  return isDev ? path : `${path}client/`
}

export const getImageOutputPath = () => {
  const { publicPath, isDev } = loadConfig()
  const imagePath = 'static/images'
  const normalizePath = normalizeEndPath(publicPath)
  return {
    publicPath: isDev ? `${normalizePath}${imagePath}` : `${normalizePath}client/${imagePath}`,
    imagePath
  }
}

const parseFeRoutes = async () => {
  const dir = getPagesDir()
  const { dynamic, routerPriority, routerOptimize } = loadConfig()
  const framework = judgeFramework()
  // 根据目录结构生成前端路由表
  const pathRecord = [''] // 路径记录
  // @ts-expect-error
  const route: ParseFeRouteItem = {}
  let arr = await renderRoutes(dir, pathRecord, route)
  if (routerPriority) {
    // 路由优先级排序
    arr.sort((a, b) => {
      // 没有显示指定的路由优先级统一为 0
      return (routerPriority![b.path] || 0) - (routerPriority![a.path] || 0)
    })
  }

  if (routerOptimize) {
    // 路由过滤
    if (routerOptimize.include && routerOptimize.exclude) {
      throw new Error('include and exclude cannot exist synchronal')
    }
    if (routerOptimize.include) {
      arr = arr.filter(route => routerOptimize?.include?.includes(route.path))
    }
    if (routerOptimize.exclude) {
      arr = arr.filter(route => !routerOptimize?.exclude?.includes(route.path))
    }
  }

  const layoutPath = '@/components/layout/index'
  const AppPath = '@/components/layout/App'
  const layoutFetch = await accessFile(join(getFeDir(), './components/layout/fetch.ts'))
  const accessStore = await accessFile(join(getFeDir(), './store/index.ts'))
  const re = /"webpackChunkName":("(.+?)")/g
  const isReact = framework === 'ssr-plugin-react'
  let routes = `
      // The file is provisional which will be overwritten when restart
      export const FeRoutes = ${JSON.stringify(arr)} 
      export { default as Layout } from "${layoutPath}"
      export { default as App } from "${AppPath}"
      ${layoutFetch ? 'export { default as layoutFetch } from "@/components/layout/fetch"' : ''}
      ${accessStore && !isReact ? 'export * as store from "@/store/index"' : ''}
      ${accessStore && isReact ? 'export * from "@/store/index"' : ''}
      `
  routes = routes.replace(/"component":("(.+?)")/g, (global, m1, m2) => {
    const currentWebpackChunkName = re.exec(routes)![2]
    if (dynamic) {
      return `"component": function dynamicComponent () {
          return import(/* webpackChunkName: "${currentWebpackChunkName}" */ '${m2.replace(/\^/g, '"')}')
        }
        `
    } else {
      return `"component": require('${m2.replace(/\^/g, '"')}').default`
    }
  })
  re.lastIndex = 0
  routes = routes.replace(/"fetch":("(.+?)")/g, (global, m1, m2) => {
    const currentWebpackChunkName = re.exec(routes)![2]
    return `"fetch": () => import(/* webpackChunkName: "${currentWebpackChunkName}-fetch" */ '${m2.replace(/\^/g, '"')}')`
  })
  await writeRoutes(routes, 'ssr-declare-routes.js')
  await cpManualRoutes()
}

const renderRoutes = async (pageDir: string, pathRecord: string[], route: ParseFeRouteItem): Promise<ParseFeRouteItem[]> => {
  let arr: ParseFeRouteItem[] = []
  const pagesFolders = await fs.readdir(pageDir)
  const prefixPath = pathRecord.join('/')
  const aliasPath = `@/pages${prefixPath}`
  const routeArr: ParseFeRouteItem[] = []
  const fetchExactMatch = pagesFolders.filter(p => p.includes('fetch'))
  for (const pageFiles of pagesFolders) {
    const abFolder = join(pageDir, pageFiles)
    const isDirectory = (await fs.stat(abFolder)).isDirectory()
    if (isDirectory) {
      // 如果是文件夹则递归下去, 记录路径
      pathRecord.push(pageFiles)
      const childArr = await renderRoutes(abFolder, pathRecord, Object.assign({}, route))
      pathRecord.pop() // 回溯
      arr = arr.concat(childArr)
    } else {
      // 遍历一个文件夹下面的所有文件
      if (!pageFiles.includes('render') || (!pageFiles.endsWith('.vue') && !pageFiles.endsWith('.tsx') && !pageFiles.endsWith('.ts') && !pageFiles.endsWith('.js') && !pageFiles.endsWith('.jsx'))) {
        continue
      }
      // 拿到具体的文件
      if (pageFiles.includes('render$')) {
        /* /news/:id */
        route.path = `${prefixPath}/:${getDynamicParam(pageFiles)}`
        route.component = `${aliasPath}/${pageFiles}`
        let webpackChunkName = pathRecord.join('-')
        if (webpackChunkName.startsWith('-')) {
          webpackChunkName = webpackChunkName.replace('-', '')
        }
        route.webpackChunkName = `${webpackChunkName}-${getDynamicParam(pageFiles).replace(/\/:\??/g, '-').replace('?', '-optional').replace('*', '-all')}`
      } else if (pageFiles.includes('render')) {
        /* /news */
        route.path = `${prefixPath}`
        route.component = `${aliasPath}/${pageFiles}`
        let webpackChunkName = pathRecord.join('-')
        if (webpackChunkName.startsWith('-')) {
          webpackChunkName = webpackChunkName.replace('-', '')
        }
        route.webpackChunkName = webpackChunkName
      }

      if (fetchExactMatch.length >= 2) {
        // fetch文件数量 >=2 启用完全匹配策略 render$id => fetch$id, render => fetch
        const fetchPageFiles = `${pageFiles.replace('render', 'fetch').split('.')[0]}.ts`
        if (fetchExactMatch.includes(fetchPageFiles)) {
          route.fetch = `${aliasPath}/${fetchPageFiles}`
        }
      } else if (fetchExactMatch.includes('fetch.ts')) {
        // 单 fetch 文件的情况 所有类型的 render 都对应该 fetch
        route.fetch = `${aliasPath}/fetch.ts`
      }
      routeArr.push({ ...route })
    }
  }
  routeArr.forEach((r) => {
    if (r.path?.includes('index')) {
      // /index 映射为 /
      if (r.path.split('/').length >= 3) {
        r.path = r.path.replace('/index', '')
      } else {
        r.path = r.path.replace('index', '')
      }
    }

    r.path && arr.push(r)
  })

  return arr
}

const getDynamicParam = (url: string) => {
  return url.split('$').filter(r => r !== 'render' && r !== '').map(r => r.replace(/\.[\s\S]+/, '').replace('#', '?')
    .replace('&', '*')
  ).join('/:')
}

export {
  parseFeRoutes
}
