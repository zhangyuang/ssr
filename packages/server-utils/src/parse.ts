import * as fs from 'fs'
import { resolve, join } from 'path'
import * as Yaml from 'js-yaml'
import { Yml, Routes, Argv } from 'ssr-types'
import { getCwd, getFeDir } from './cwd'
import { processError } from './errorCatch'

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

const parseFeRoutes = (argv: Argv) => {
  const feDir = getFeDir()
  const arr = []
  const route = {}
  if (!argv.mpa) {

    fs.readdir(feDir, (err, folders: string[]) => {
      processError(err)
      folders.map(file => {
        const absolutePath = join(feDir, `/${file}`)
        console.log(absolutePath)
        route.fetch = /fetch/i.test(file) && fs.existsSync(absolutePath) ? absolutePath : false
        route.layout = /layout/i.test(file) && fs.existsSync(absolutePath) ? absolutePath : join(feDir, `/layout.tsx`
        route.component = /render/i.test(file) && fs.existsSync(absolutePath) ? absolutePath : false
      })
    })
  } else {
    // todo mpa
  }
  arr.push(route)

  return arr
}

export {
  parseYml,
  parseRoutesFromYml,
  parseFeRoutes
}
