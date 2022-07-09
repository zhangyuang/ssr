import { parse as parseImports } from 'es-module-lexer'
import { Compiler, WebpackPluginInstance, compilation } from 'webpack'
import type { SSRModule } from 'webpack'
import { create } from 'enhanced-resolve'
import { loadConfig } from '../loadConfig'
// const bar: typeof compilation.foo = 1
// console.log(bar)

const webpackCommentRegExp = /webpackChunkName:\s?"(.*)?"\s?\*/
const pageMap: Record<string, string> = {}
const dependenciesMap: Record<string, string[]> = {}
const pageChunkRe = /['"](.*)?['"]/
const { alias } = loadConfig()

const ssrResolve = create.sync({
  alias
})
console.log(ssrResolve({}, '/Users/zhangyuang/Desktop/github/ssr/packages/plugin-vue3/esm/entry/client-entry.js', 'pinia'))

export class WebpackChunkNamePlugin implements WebpackPluginInstance {
  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(
      'ChunkNamePlugin',
      (compilation: compilation.Compilation) => {

        compilation.hooks.succeedModule.tap(
          'ChunkNamePlugin',
          (module: SSRModule) => {
            if (module.resource?.includes('ssr-declare-routes' || module.resource?.includes('ssr-manual-routes'))) {
              const content = module._source._value
              const imports = parseImports(content)[0]
              for (let index = 0; index < imports.length; index++) {
                const { s: start, e: end, n: rawPath } = imports[index]
                const rawUrl: string = content.slice(start, end)
                if (!rawUrl.includes('render')) continue
                const chunkName = webpackCommentRegExp.exec(rawUrl)![1]
                const entirePath = ssrResolve(module.resource, rawPath)
                if (!entirePath) {
                  throw new Error(`ssr resolve error with resource ${module.resource} and path ${rawPath}`)
                }
                pageMap[entirePath] = chunkName
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
  return ''
}

// const getDependenciesPath = (dependency, module: compilation.Module) => {
//   const { request } = dependency
//   const { context } = module
//   return require.resolve(normalizePath(request), {
//     paths: [context!]
//   })
// }
export class WebpackChunkNamePlugin2 implements WebpackPluginInstance {
  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(
      'ChunkNamePlugin',
      (compilation) => {
        compilation.hooks.succeedModule.tap(
          'ChunkNamePlugin',
          (module: SSRModule) => {
            const { resource } = module
            if (!resource) {
              return
            }
            const pageChunkName = checkOrigin(resource)
            if (pageChunkName || resource.includes('client-entry')) {
              const { dependencies } = module
              const chunkName = resource.includes('client-entry') ? 'client-entry' : pageChunkName
              if (dependencies) {
                for (const d of dependencies) {
                  const { request } = d
                  if (request) {
                    console.log(resource, request)
                    const importerId = ssrResolve(resource, request)
                    if (!importerId) {
                      throw new Error(`ssr resolve error with resource ${resource} and path ${request}`)
                    }
                    if (!dependenciesMap[importerId]) {
                      dependenciesMap[importerId] = []
                    }
                    dependenciesMap[importerId].push(chunkName)
                  }
                }
              }
            }
            // else if (dependenciesMap[id]) {
            //   const { importedIds, dynamicallyImportedIds } = this.getModuleInfo(id)!
            //   for (const importerId of importedIds) {
            //     if (!dependenciesMap[importerId]) {
            //       dependenciesMap[importerId] = []
            //     }
            //     dependenciesMap[importerId] = dependenciesMap[importerId].concat(dependenciesMap[id])
            //   }
            //   for (const dyImporterId of dynamicallyImportedIds) {
            //     if (!dependenciesMap[dyImporterId]) {
            //       dependenciesMap[dyImporterId] = ['dynamic']
            //     }
            //     dependenciesMap[dyImporterId] = dependenciesMap[dyImporterId].concat(dependenciesMap[id])
            //   }
            // }
          }
        )
      }
    )
  }
}
