import { parse as parseImports } from 'es-module-lexer'
import webpack, { Compiler, WebpackPluginInstance, compilation } from 'webpack'
import { create } from 'enhanced-resolve'
import { loadConfig } from '../loadConfig'

const webpackCommentRegExp = /webpackChunkName:\s?"(.*)?"\s?\*/
const pageMap: Record<string, string> = {}
const dependenciesMap: Record<string, string[]> = {}
const pageChunkRe = /['"](.*)?['"]/
const { alias } = loadConfig()

const ssrResolve = create.sync({
  alias
})

declare module 'webpack' {

  export interface compilation {
    resource: string
    // export class Compilation {
    //   resource =1
    // }

    // Module: {
    //   resource: string
    // }
  }
}

export class WebpackChunkNamePlugin implements WebpackPluginInstance {
  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(
      'ChunkNamePlugin',
      (compilation: compilation.Compilation) => {
        const foo = webpack['compilation'].resource
        compilation.hooks.succeedModule.tap(
          'ChunkNamePlugin',
          (module: compilation.Module) => {
            if (module.resource?.includes('ssr-declare-routes' || module.resource?.includes('ssr-manual-routes'))) {
              const content = module._source._value
              const imports = parseImports(content)[0]
              for (let index = 0; index < imports.length; index++) {
                const { s: start, e: end, n: rawPath } = imports[index]
                const rawUrl: string = content.slice(start, end)
                if (!rawUrl.includes('render')) continue
                const chunkName = webpackCommentRegExp.exec(rawUrl)![1]
                const entirePath = ssrResolve(module.resource, rawPath)
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
  return false
}

const getDependenciesPath = (dependency, module: compilation.Module) => {
  const { request } = dependency
  const { context } = module
  return require.resolve(normalizePath(request), {
    paths: [context!]
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
            const { resource } = module
            if (!resource) {
              return
            }
            const pageChunkName = checkOrigin(resource)
            if (pageChunkName || resource.includes('client-entry')) {
              const { dependencies } = module
              const chunkname = resource.includes('client-entry') ? 'client-entry' : pageChunkName
              for (const d of dependencies) {
                // console.log(d._module())
                // if (d.request) {
                //   console.log(d.request)
                //   const childModule = compilation.getModule(d)
                //   console.log(childModule)

                // }

                // if (d.request) {
                //   const importerId = getDependenciesPath(d, module)
                //   if (!dependenciesMap[importerId]) {
                //     dependenciesMap[importerId] = []
                //   }
                //   dependenciesMap[importerId].push(chunkname)
                // }
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
