import { promises as fs } from 'fs'
import { resolve, join } from 'path'
import * as Shell from 'shelljs'
import { ParseFeRouteItem } from 'ssr-types'
import { getCwd, getPagesDir, getFeDir, accessFile } from './cwd'
import { loadConfig } from './loadConfig'

const debug = require('debug')('ssr:parse')
const { dynamic, prefix } = loadConfig()
const pageDir = getPagesDir()
const cwd = getCwd()

const parseFeRoutes = async () => {
  const isVue = require(join(cwd, './package.json')).dependencies.vue
  if (!isVue && process.env.BUILD_TOOL === 'vite') {
    console.log('vite模式目前暂时只支持 vue,当前 --vite 指令无效请直接使用 ssr start, react 将会在下一个版本支持，敬请期待')
    return
  }

  if (!await accessFile(join(cwd, './node_modules/ssr-temporary-routes'))) {
    Shell.mkdir(join(cwd, './node_modules/ssr-temporary-routes'))
  }

  let routes = ''
  const declaretiveRoutes = await accessFile(join(getFeDir(), './route.ts')) // 是否存在自定义路由
  if (!declaretiveRoutes) {
    // 根据目录结构生成前端路由表
    const pathRecord = [''] // 路径记录
    const route: ParseFeRouteItem = {}
    const arr = await renderRoutes(pageDir, pathRecord, route)

    debug('Before the result that parse web folder to routes is: ', arr)

    if (isVue) {
      const layoutPath = '@/components/layout/index.vue'
      const accessVueApp = await accessFile(join(getFeDir(), './components/layout/App.vue'))
      const layoutFetch = await accessFile(join(getFeDir(), './components/layout/fetch.ts'))
      const AppPath = `@/components/layout/App.${accessVueApp ? 'vue' : 'tsx'}`
      const re = /"webpackChunkName":("(.+?)")/g
      routes = `
        export const FeRoutes = ${JSON.stringify(arr)} 
        export { default as Layout } from "${layoutPath}"
        export { default as App } from "${AppPath}"
        ${layoutFetch ? 'export { default as layoutFetch } from "@/components/layout/fetch.ts"' : ''}
        `
      routes = routes.replace(/"component":("(.+?)")/g, (global, m1, m2) => {
        const currentWebpackChunkName = re.exec(routes)![2]
        if (dynamic) {
          return `"component":  __isBrowser__ ? () => import(/* webpackChunkName: "${currentWebpackChunkName}" */ '${m2.replace(/\^/g, '"')}') : require('${m2.replace(/\^/g, '"')}').default`
        } else {
          return `"component":  require('${m2.replace(/\^/g, '"')}').default`
        }
      })
      re.lastIndex = 0
      routes = routes.replace(/"fetch":("(.+?)")/g, (global, m1, m2) => {
        const currentWebpackChunkName = re.exec(routes)![2]
        return `"fetch": __isBrowser__ ? () => import(/* webpackChunkName: "${currentWebpackChunkName}-fetch" */ '${m2.replace(/\^/g, '"')}') : require('${m2.replace(/\^/g, '"')}').default`
      })
    } else {
      // React 场景
      const layoutPath = '@/components/layout/index.tsx'
      const accessReactApp = await accessFile(join(getFeDir(), './components/layout/App.tsx'))
      const layoutFetch = await accessFile(join(getFeDir(), './components/layout/fetch.ts'))
      const re = /"webpackChunkName":("(.+?)")/g
      routes = `
        ${dynamic ? 'import loadable from "react-loadable"' : ''}
        export const FeRoutes = ${JSON.stringify(arr)} 
        export { default as Layout } from "${layoutPath}"
        ${accessReactApp ? 'export { default as App } from "@/components/layout/App.tsx"' : ''}
        ${layoutFetch ? 'export { default as layoutFetch } from "@/components/layout/fetch.ts"' : ''}
        `
      routes = routes.replace(/"component":("(.+?)")/g, (global, m1, m2) => {
        const currentWebpackChunkName = re.exec(routes)![2]
        if (dynamic) {
          return `"component":  __isBrowser__ ? loadable({
            loader: () => import(/* webpackChunkName: "${currentWebpackChunkName}" */ '${m2.replace(/\^/g, '"')}'),
            loading: function Loading () {
              return require('react').createElement('div')
            }
          }) : require('${m2.replace(/\^/g, '"')}').default`
        } else {
          return `"component":  require('${m2.replace(/\^/g, '"')}').default`
        }
      })
      re.lastIndex = 0
      routes = routes.replace(/"fetch":("(.+?)")/g, (global, m1, m2) => {
        const currentWebpackChunkName = re.exec(routes)![2]
        return `"fetch": __isBrowser__ ? () => import(/* webpackChunkName: "${currentWebpackChunkName}-fetch" */ '${m2.replace(/\^/g, '"')}') : require('${m2.replace(/\^/g, '"')}').default`
      })
    }
  } else {
    // 使用了声明式路由
    routes = (await fs.readFile(join(getFeDir(), './route.ts'))).toString()
  }

  debug('After the result that parse web folder to routes is: ', routes)

  await fs.writeFile(resolve(cwd, './node_modules/ssr-temporary-routes/route.js'), routes)
  await fs.copyFile(resolve(__dirname, '../src/packagejson.tpl'), resolve(cwd, './node_modules/ssr-temporary-routes/package.json'))
  if (process.env.TEST && process.env.BUILD_TOOL === 'vite') {
    // 开发同学本地开发时 vite 场景将路由表写一份到 repo 下面而不是 example 下面，否则 client-entry 会找不到该文件
    Shell.rm('-rf', resolve(__dirname, '../../../node_modules/ssr-temporary-routes/'))
    Shell.cp('-r', resolve(cwd, './node_modules/ssr-temporary-routes/'), resolve(__dirname, '../../../node_modules/ssr-temporary-routes/'))
  }
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
      // 拿到具体的文件
      if (pageFiles.includes('render')) {
        /* /news */
        route.path = `${prefixPath}`
        route.component = `${aliasPath}/${pageFiles}`
        if (dynamic) {
          let webpackChunkName = pathRecord.join('-')
          if (webpackChunkName.startsWith('-')) {
            webpackChunkName = webpackChunkName.replace('-', '')
          }
          route.webpackChunkName = webpackChunkName
        }
      }

      if (pageFiles.includes('render$')) {
        /* /news/:id */
        route.path = `${prefixPath}/:${getDynamicParam(pageFiles)}`
        route.component = `${aliasPath}/${pageFiles}`
        // fetch文件数量>=2 启用完全匹配策略
        if (fetchExactMatch.length >= 2) {
          const fetchPageFiles = `fetch${pageFiles.replace('render', '').replace('.vue', '.ts')}`
          if (fetchExactMatch.includes(fetchPageFiles)) {
            route.fetch = `${aliasPath}/${fetchPageFiles}`
          }
        }
        if (dynamic) {
          let webpackChunkName = pathRecord.join('-')
          if (webpackChunkName.startsWith('-')) {
            webpackChunkName = webpackChunkName.replace('-', '')
          }
          route.webpackChunkName = `${webpackChunkName}-${getDynamicParam(pageFiles)}`
        }
      }

      if (pageFiles.includes('fetch')) {
        route.fetch = `${aliasPath}/${pageFiles}`
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

    if (r.path && prefix) {
      // 统一添加公共前缀
      r.path = `/${prefix}${r.path}`
    }
    r.path && arr.push(r)
  })

  return arr
}

const getDynamicParam = (url: string) => {
  return url.split('$').filter(r => r !== 'render' && r !== '').map(r => r.replace(/\.[\s\S]+/, '')).join('/:')
}

export {
  parseFeRoutes
}
