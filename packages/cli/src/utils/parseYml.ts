import * as fs from 'fs'
import { resolve } from 'path'
import * as Yaml from 'js-yaml'
import { getCwd } from './getCwd'

const parse = (path: string) => {
  const cwd = getCwd()
  const yamlPath = resolve(cwd, path)
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8').toString()
  const result = Yaml.safeLoad(yamlContent)
  return result
}

export {
  parse
}
