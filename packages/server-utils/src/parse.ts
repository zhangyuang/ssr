import * as fs from 'fs'
import { resolve, join } from 'path'
import * as Yaml from 'js-yaml'
import * as Shell from 'shelljs'
import { Yml, FaasRouteItem } from 'ssr-types'
import { promisifyFsReadDir } from './promisify'
import { getCwd, getPagesDir, getFeDir } from './cwd'
import { loadConfig } from './loadConfig'

const debug = require('debug')('ssr:parse')
const { cloudIDE, dynamic, prefix } = loadConfig()

const parseYml = (path: string): Yml => {
  const cwd = getCwd()
  const yamlPath = resolve(cwd, path)
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8').toString()
  // tslint:disable-next-line
  const result = Yaml.safeLoad(yamlContent) as Yml
  return result
}

const parseRoutesFromYml = (yamlContent: Yml) => {
  const routes: FaasRouteItem[] = []

  for (const funcName in yamlContent.functions) {
    const func = yamlContent.functions[funcName]
    func.render && func.events.forEach(event => {
      const http = cloudIDE ? event.apigw : event.http
      if (http) {
        routes.push({
          path: http.path,
          ...func.render,
          funcName
        })
      }
    })
  }
  return routes
}

const hasDeclaretiveRoutes = () => {
  return fs.existsSync(join(getFeDir(), './route.js'))
}
const parseFeRoutes = async () => {
  const pageDir = getPagesDir()
  const feDir = getFeDir()
  const cwd = getCwd()
  if (!fs.existsSync(join(cwd, './node_modules/ssr-temporary-routes'))) {
    Shell.mkdir(`${cwd}/node_modules/ssr-temporary-routes`)
  }
  let routes = ''
  if (!hasDeclaretiveRoutes()) {
    // 根据目录结构生成前端路由表
    const folders = await promisifyFsReadDir(pageDir) // 读取web目录
    const defaultLayout = `${join(feDir, './components/layout/index.tsx')}`
    const arr = []
    for (const folder of folders) {
      const abFolder = join(pageDir, folder)
      if (fs.statSync(abFolder).isDirectory()) {
        // 读取web下子目录
        const files = await promisifyFsReadDir(abFolder)
        const route: any = {
          layout: `require('${defaultLayout}').default`
        }
        for (const file of files) {
          const abFile = join(abFolder, file)
          if (file.includes('render')) {
            /* /news */
            route.path = folder === 'index' ? '/' : `/${folder}`
            route.component = `${abFile}`
            debug(`parse "${abFile.replace(cwd, '')}" to "${route.path}" \n`)
          }

          if (file.includes('render$')) {
            /* /news/:id */
            route.path = `/${folder}/:${getDynamicParam(file)}`
            route.component = `${abFile}`
            debug(`parse "${abFile.replace(cwd, '')}" to "${route.path}" \n`)
          }

          if (/render\$[\s\S]+\$/.test(file)) {
            /* /news:id? */
            route.path = `/${folder}/:${getDynamicParam(file)}?`
            route.component = `${abFile}`
            debug(`parse "${abFile.replace(cwd, '')}" to "${route.path}" \n`)
          }

          if (/fetch/i.test(file)) {
            route.fetch = `require('${abFile}').default`
          }

          if (/layout/i.test(file)) {
            route.layout = `require('${abFile}').default`
          }
        }
        if (!route.path) {
          throw new Error(`cannot find render file in ${folder}`)
        }
        if (prefix) {
          route.path = prefix ? `/${prefix}${route.path}` : route.path
        }
        if (dynamic) {
          route.webpackChunkName = folder
        }
        arr.push(route)
      }
    }
    // 添加默认根路由
    fs.existsSync(join(pageDir, './render.tsx')) && arr.push({
      path: prefix ? `/${prefix}/` : '/',
      layout: `require('${defaultLayout}').default`,
      fetch: fs.existsSync(join(pageDir, './fetch.ts')) && `require('${join(pageDir, './fetch.ts')}').default`,
      component: `require('${join(pageDir, './render.tsx')}').default`
    })

    debug('The result that parse web folder to routes is: ', arr)
    routes = `module.exports =${JSON.stringify(arr)
        .replace(/"layout":("(.+?)")/g, (global, m1, m2) => {
          return `"layout": ${m2.replace(/\^/g, '"')}`
        })
        .replace(/"fetch":("(.+?)")/g, (global, m1, m2) => {
          return `"fetch": ${m2.replace(/\^/g, '"')}`
        })
        }`
    if (!dynamic) {
      // 如果禁用路由分割则无需引入 react-loadable
      routes = routes.replace(/"component":("(.+?)")/g, (global, m1, m2) => {
        return `"component": require('${m2.replace(/\^/g, '"')}').default`
      })
    } else {
      const re = /"webpackChunkName":("(.+?)")/g
      routes = routes.replace(/"component":("(.+?)")/g, (global, m1, m2) => {
        const currentWebpackChunkName = re.exec(routes)![2]
        return `"component":  __isBrowser__ ? require('react-loadable')({
          loader: () => import(/* webpackChunkName: "${currentWebpackChunkName}" */ '${m2.replace(/\^/g, '"')}'),
          loading: function Loading () {
            return require('react').createElement('div')
          }
        }) : require('${m2.replace(/\^/g, '"')}').default`
      })
    }
  } else {
    // 使用了声明式路由的需要把 path 替换为绝对路径
    routes = fs.readFileSync(join(getFeDir(), './route.js')).toString()
    routes = relativeToAbsolute(routes)
    routes = relativeToAbsolute(routes) // 需要 执行两次 否则会有遗漏，这里后续可以考虑下怎么写正则表达式优化一下使得一次就可以替换完成
  }

  fs.writeFileSync(resolve(cwd, './node_modules/ssr-temporary-routes/route.js'), routes)
}

const relativeToAbsolute = (routes: string) => {
  const requireRe = /require\((.*)?\)\.default/g
  let res = requireRe.exec(routes)
  const arr = []
  while (res) {
    arr.push(res[1])
    res = requireRe.exec(routes)
  }
  arr.forEach(str => {
    str = str.replace(/'/, '')
    if (str.startsWith('/')) {
      return
    }
    routes = routes.replace(str, `${resolve(getFeDir(), str)}`)
  })
  return routes
}
const getDynamicParam = (url: string) => {
  return url.split('$')[1].replace(/\.[\s\S]+/, '')
}

const checkDependencies = () => {
  const cwd = getCwd()
  if (!fs.existsSync(join(cwd, './node_modules'))) {
    throw new Error(`node_modules is not found in ${cwd}, please run yarn or npm install`)
  }
}
export {
  parseYml,
  parseRoutesFromYml,
  parseFeRoutes,
  checkDependencies
}
