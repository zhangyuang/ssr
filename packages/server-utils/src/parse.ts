import * as fs from 'fs'
import { resolve } from 'path'
import * as Yaml from 'js-yaml'
import { Yml, Routes } from 'ssr-types'
import { getCwd } from './cwd'

const parseYml = (path: string) => {
  const cwd = getCwd()
  const yamlPath = resolve(cwd, path)
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8').toString()
  const result = Yaml.safeLoad(yamlContent)
  return result
}

const parseRoutesFromYml = (yamlContent: Yml): Routes[] => {
  const routes = []
  for (const key in yamlContent.functions) {
    const func = yamlContent.functions[key]
    func.events.forEach(event => {
      if (event.http) {
        routes.push({
          path: event.http.path,
          ...func.render
        })
      }
    })
  }
  return routes
}

export {
  parseYml,
  parseRoutesFromYml
}
