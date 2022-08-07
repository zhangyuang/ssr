// @ts-nocheck
import { resolve } from 'path'
import { contains, containsPattern, readFromPackageJson, readDir } from './external-utils'
import { getCwd } from '../cwd'
import { getDependencies } from '../build-utils'
import { logErr } from '../log'

const scopedModuleRegex = new RegExp('@[a-zA-Z0-9][\\w-.]+\/[a-zA-Z0-9][\\w-.]+([a-zA-Z0-9.\/]+)?', 'g')

function getModuleName(request, includeAbsolutePaths) {
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

function wrap(whitelist) {
  const map = {}
  const allDependencies = {}
  whitelist.forEach(item => {
    if (typeof item === 'string') {
      try {
        getDependencies(require.resolve(item), allDependencies)
      } catch (error) {
        logErr(`Please check package.json, current program use ${item} but don't specify it in dependencies`)
      }
    }
  })
  return whitelist.concat( Object.keys(allDependencies).map(item => new RegExp(item)))
}


function nodeExternals(options) {
  options = options || {}
  let whitelist = [].concat(options.whitelist || []);
  whitelist = wrap(whitelist)
  const binaryDirs = [].concat(options.binaryDirs || ['.bin'])
  const importType = options.importType || 'commonjs'
  const modulesDir = options.modulesDir || 'node_modules'
  const modulesFromFile = !!options.modulesFromFile
  const includeAbsolutePaths = !!options.includeAbsolutePaths
  // helper function
  function isNotBinary(x) {
    return !contains(binaryDirs, x)
  }

  // create the node modules list
  let nodeModules = []
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

  // return an externals function
  return function (context, request, callback) {
    const moduleName = getModuleName(request, includeAbsolutePaths)
    if (contains(nodeModules, moduleName) && !containsPattern(whitelist, request)) {
      if (typeof importType === 'function') {
        return callback(null, importType(request))
      }
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
