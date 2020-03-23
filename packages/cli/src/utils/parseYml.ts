import * as Yaml from 'js-yaml'
import * as fs from 'fs'
import { resolve } from 'path'
import { getCwd } from './getCwd'

const parse = () => {
  const cwd = getCwd()
  const yamlPath = resolve(cwd, './f.yml')
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8').toString()
  const result = Yaml.safeLoad(yamlContent)
  return result
}

export {
  parse
}
