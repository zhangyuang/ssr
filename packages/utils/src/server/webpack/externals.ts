import { contains, containsPattern, readFromPackageJson, readDir } from './external-utils'
import { sync } from 'execa'
import { getDependencies } from '../build-utils'
import { logErr } from '../log'
import { defaultExternal } from '../static'

const scopedModuleRegex = new RegExp('@[a-zA-Z0-9][\\w-.]+\/[a-zA-Z0-9][\\w-.]+([a-zA-Z0-9.\/]+)?', 'g')

function getModuleName(request: string, includeAbsolutePaths: boolean) {
  let req = request
  const delimiter = '/'

  if (includeAbsolutePaths) {
    req = req.replace(/^.*?\/node_modules\//, '')
  }
  // check if scoped module
  if (scopedModuleRegex.test(req)) {
    // reset regexp
    scopedModuleRegex.lastIndex = 0
    return req.split(delimiter, 2).join(delimiter)
  }
  return req.split(delimiter)[0]
}

function wrap(whitelist: Array<string | RegExp>) {
  const allDependencies: Record<string, string> = {}
  whitelist.forEach(item => {
    if (typeof item === 'string') {
      try {
        allDependencies[item] = '1'
        const { stdout } = sync('node', ['-e', `console.log(require.resolve('${item}'))`, '--preserve-symlinks=1'])
        getDependencies(stdout, allDependencies)
      } catch (error) {
        logErr(`Please check package.json, current program use ${item} but don't specify it in dependencies`)
      }
    }
  })
  return whitelist.concat(Object.keys(allDependencies).map(item => new RegExp(item)))
}


function nodeExternals(options: any) {
  options = options || {}
  const whitelist: Array<string | RegExp> = wrap([].concat(options.whitelist || []))
  const binaryDirs = [].concat(options.binaryDirs || ['.bin'])
  const importType = options.importType || 'commonjs'
  const modulesDir = options.modulesDir || 'node_modules'
  const modulesFromFile = !!options.modulesFromFile
  const includeAbsolutePaths = !!options.includeAbsolutePaths
  function isNotBinary(x: string) {
    return !contains(binaryDirs, x)
  }

  // create the node modules list
  let nodeModules: string[] = []
  if (modulesFromFile) {
    nodeModules = readFromPackageJson(options.modulesFromFile)
  } else {
    if (Array.isArray(modulesDir)) {
      modulesDir.map(str => {
        nodeModules = nodeModules.concat(readDir(str).filter(isNotBinary))
      })
    } else {
      nodeModules = readDir(modulesDir).filter(isNotBinary)
    }
  }

  return function (context: any, request: string, callback: (...params: any) => any) {
    const moduleName = getModuleName(request, includeAbsolutePaths)
    if (contains(nodeModules, moduleName) || defaultExternal.includes(moduleName)) {
      if (containsPattern(whitelist, request) && !defaultExternal.includes(moduleName)) {
        // 白名单中的需要被处理
        return callback()
      }
      // 否则 被 external
      // mark this module as external
      // https://webpack.js.org/configuration/externals/
      return callback(null, importType + ' ' + request)
    }
    callback()
  }
}

export {
  nodeExternals
}
