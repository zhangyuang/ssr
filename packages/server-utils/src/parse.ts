import * as fs from 'fs'
import { resolve, join } from 'path'
import * as Yaml from 'js-yaml'
import { Yml, Routes, Argv, FeRouteItem } from 'ssr-types'
import { promisifyFsReadDir } from './promisify'
import { getCwd, getFeDir } from './cwd'

const parseYml = (path: string) => {
  const cwd = getCwd()
  const yamlPath = resolve(cwd, path)
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8').toString()
  const result = Yaml.safeLoad(yamlContent)
  return result
}

const parseRoutesFromYml = (yamlContent: Yml): Routes[] => {
  const routes = []
  for (const funcName in yamlContent.functions) {
    const func = yamlContent.functions[funcName]
    func.events.forEach(event => {
      if (event.http) {
        routes.push({
          path: event.http.path,
          funcName,
          ...func.render
        })
      }
    })
  }
  return routes
}

const parseFeRoutes = async (argv: Argv): Promise<FeRouteItem[]> => {
  // 根据目录结构生成前端路由表
  const feDir = getFeDir()
  const folders = await promisifyFsReadDir(feDir) // 读取web目录
  const defaultLayout = join(feDir, `/layout.tsx`)
  const arr = []
  if (!argv.mpa) {
    for (let i in folders) {
      const folder = folders[i]
      const abFolder = join(feDir, folder)
      if (fs.statSync(abFolder).isDirectory()) {
        // 读取web下子目录
        const files = await promisifyFsReadDir(abFolder)
        const route: FeRouteItem = {
          layout: defaultLayout
        }

        for (let j in files) {
          const file = files[j]
          const abFile = join(abFolder, file)

          if (/render/.test(file)) {
            route.path = `/${folder}`
            route.component = abFile
          }

          if (/render\$/.test(file)) {
            route.path = `/${folder}/:${getDynamicParam(file)}`
            route.component = abFile
          }

          if (/fetch/i.test(file)) {
            route.fetch = abFile
          }

          if (/layout/i.test(file)) {
            route.layout = abFile
          }
        }

        arr.push(route)
      }
    }
    // 添加默认根路由
    fs.existsSync(join(feDir, './render.tsx')) && arr.push({
      path: '/',
      layout: defaultLayout,
      fetch: fs.existsSync(join(feDir, './fetch.ts')) && join(feDir, './fetch.ts'),
      component: join(feDir, './render.tsx')
    })

  } else {
    // todo mpa

  }

  return arr
}

const getDynamicParam = (url: string) => {
  return url.split('$')[1].replace(/\.[\s\S]+/,'')
}

export {
  parseYml,
  parseRoutesFromYml,
  parseFeRoutes
}
