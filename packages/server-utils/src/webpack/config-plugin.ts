import { parse as parseImports } from 'es-module-lexer'
import type { Compiler, WebpackPluginInstance, compilation } from 'webpack'
import { loadConfig } from '../loadConfig'

const webpackCommentRegExp = /webpackChunkName:\s?"(.*)?"\s?\*/

const pageMap: Record<string, string> = {}
const dependenciesMap: Record<string, string[]> = {}
const pageChunkRe = /['"](.*)?['"]/

const normalizePath = (path: string) => {
  const { alias } = loadConfig()
  for (const a in alias) {
    path = path.replace(a, alias[a])
  }
  return path
}

export class WebpackChunkNamePlugin implements WebpackPluginInstance {
  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(
      'ChunkNamePlugin',
      (compilation) => {
        compilation.hooks.succeedModule.tap(
          'ChunkNamePlugin',
          (module: compilation.Module) => {
            if (module.rawRequest?.includes('ssr-declare-routes' || module.rawRequest?.includes('ssr-manual-routes'))) {
              const content = module._source._value
              const imports = parseImports(content)[0]
              for (let index = 0; index < imports.length; index++) {
                const { s: start, e: end } = imports[index]
                let rawUrl: string = content.slice(start, end)
                if (!rawUrl.includes('render')) continue
                rawUrl = normalizePath(rawUrl)
                const chunkName = webpackCommentRegExp.exec(rawUrl)![1]
                rawUrl = rawUrl.replace(/\/\*(.*)?\*\//, '')
                const originUrl = pageChunkRe.exec(rawUrl)![1]
                pageMap[originUrl] = chunkName
              }
            }
          }
        )
      }
    )
  }
}
const checkOrigin = (request: string) => {
  for (const originUrl in pageMap) {
    if (request.includes(originUrl)) {
      return pageMap[originUrl]
    }
  }
  return false
}

const getDependenciesPath = (module) => {
  if (!module.request) return 'void'
  const { request, originModule } = module
  return require.resolve(normalizePath(request), {
    paths: [process.cwd(originModule.context)]
  })
}
export class WebpackChunkNamePlugin2 implements WebpackPluginInstance {
  apply (compiler: Compiler) {

    compiler.hooks.compilation.tap(
      'ChunkNamePlugin',
      (compilation) => {
        compilation.hooks.succeedModule.tap(
          'ChunkNamePlugin',
          (module) => {
            const resource = module.resource
            if (!resource) {
              return
            }
            const pageChunkName = checkOrigin(resource)
            if (pageChunkName || resource.includes('client-entry')) {
              const { dependencies } = module
              const chunkname = resource.includes('client-entry') ? 'client-entry' : pageChunkName
              for (const d of dependencies) {
                const importerId = getDependenciesPath(d)
                if (!dependenciesMap[importerId]) {
                  dependenciesMap[importerId] = []
                }
                dependenciesMap[importerId].push(chunkname)
              }
            } else if (dependenciesMap[id]) {
              const { importedIds, dynamicallyImportedIds } = this.getModuleInfo(id)!
              for (const importerId of importedIds) {
                if (!dependenciesMap[importerId]) {
                  dependenciesMap[importerId] = []
                }
                dependenciesMap[importerId] = dependenciesMap[importerId].concat(dependenciesMap[id])
              }
              for (const dyImporterId of dynamicallyImportedIds) {
                if (!dependenciesMap[dyImporterId]) {
                  dependenciesMap[dyImporterId] = ['dynamic']
                }
                dependenciesMap[dyImporterId] = dependenciesMap[dyImporterId].concat(dependenciesMap[id])
              }
            }
          }
        )
      }
    )
  }
}
