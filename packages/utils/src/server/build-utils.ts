import { resolve, sep } from 'path'

export const normalizePosixPath = (value: string): string => {
  return sep === '\\'
    ? value.replace(/\\/g, '/')
    : value
}
export function getPkgName (modulePath: string, packageFolder = 'node_modules') {
  if (typeof modulePath === 'string' && modulePath.includes(packageFolder)) {
    const path = normalizePosixPath(modulePath)
    const segments = path.split('/')
    const index = segments.lastIndexOf(packageFolder)

    if (index > -1) {
      const name = segments[index + 1] || ''
      const scopedName = segments[index + 2] || ''

      if (name[0] === '@') {
        return scopedName ? `${name}/${scopedName}` : ''
      }

      if (name) {
        return name
      }
    }
  }
  return ''
}
export const getDependencies = (abPath: string, allDependencies: Record<string, string>) => {
  const lastIndex = abPath.lastIndexOf('node_modules')
  if (lastIndex === -1) {
    return
  }
  const pkgName = getPkgName(abPath)

  const pkgJson = resolve(abPath.slice(0, lastIndex), `./node_modules/${pkgName}/package.json`)
  const { dependencies = {}, peerDependencies = {} }: {
    dependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
  } = require(pkgJson)
  Object.entries(Object.assign(dependencies, peerDependencies)).forEach(([key, value]) => {
    if (!allDependencies[key]) {
      allDependencies[key] = value
      try {
        const childId = require.resolve(key, {
          paths: [abPath]
        })
        getDependencies(childId, allDependencies)
      } catch (error) {
        // ignore it, some package has not correct main field or exports field in package.json like @babel/runtime cause require.resolve throw error
      }
    }

  })
}
