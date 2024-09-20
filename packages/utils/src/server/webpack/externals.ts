import { contains, containsPattern, readFromPackageJson, readDir } from './external-utils'
import { getDependencies } from '../build-utils'
import { defaultExternal, nameSpaceBuiltinModules } from '../static'
import { requireWithPreserveLinks } from '../cwd'

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
      const entryFile = requireWithPreserveLinks(item)
      if (entryFile) {
        getDependencies(entryFile, allDependencies)
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
    if (!options.isServer) {
      if (request.startsWith('@external:')) {
        // only external in client
        return callback(null, importType + ' ' + request.slice(10))
      } else {
        return callback()
      }
    }
    const moduleName = getModuleName(request, includeAbsolutePaths)
    if (nameSpaceBuiltinModules.includes(moduleName)) {
      // external node nartive module
      return callback(null, importType + ' ' + request)
    }
    if (contains(nodeModules, moduleName) || defaultExternal.includes(moduleName)) {
      if (containsPattern(whitelist, request)) {
        // 白名单中的一定需要被处理
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
