import { coerce } from 'semver'
import { getPkgJson } from './cwd'

export const judgeAntd = () => {
  const antdVersion = getPkgJson().dependencies?.['antd'] ?? getPkgJson().devDependencies?.['antd']
  return coerce(antdVersion)?.major
}
