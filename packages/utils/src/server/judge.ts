import { coerce } from 'semver'
import { getPkgJson } from './cwd'

export const getPkgMajorVersion = (pkgName: string) => {
  const antdVersion = getPkgJson().dependencies?.[pkgName] ?? getPkgJson().devDependencies?.[pkgName]
  return coerce(antdVersion)?.major
}
