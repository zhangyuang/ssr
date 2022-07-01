import { parse as parseImports } from 'es-module-lexer'
import type { Compiler, WebpackPluginInstance, compilation } from 'webpack'
import { loadConfig } from '../loadConfig'

const webpackCommentRegExp = /webpackChunkName:\s?"(.*)?"\s?\*/

const pageMap: Record<string, string> = {}
const dependenciesMap: Record<string, string[]> = {}
const pageChunkRe = /['"](.*)?['"]/

export class WebpackChunkNamePlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    const { alias } = loadConfig()
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
                for (const a in alias) {
                  rawUrl = rawUrl.replace(a, alias[a])
                }
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
export class WebpackChunkNamePlugin2 implements WebpackPluginInstance {
  apply(compiler: Compiler) {

    compiler.hooks.compilation.tap(
      'ChunkNamePlugin',
      (compilation) => {
        console.log(compilation.getModule)
        compilation.hooks.buildModule.tap(
          'ChunkNamePlugin',
          (module) => {
            const resource = module.resource
            if (resource?.includes('web/pages/index/render.vue?vue&type=script&lang=ts&setup=true')) {
              console.log(module)
            }
            // const resource = module.resource
            // if (!resource) {
            //   return
            // }
            // const isPageChunk = checkOrigin(resource)
            // if (isPageChunk || resource.includes('client-entry')) {
            //   // if (resource.includes('render.vue')) {
            //   //   debugger
            //   //   // console.log('xxxxxxx', module.dependencies)
            //   // }
            //   if (resource.includes('web/pages/index/render.vue?vue&type=script&lang=ts&setup=true')) {
            //     module.dependencies.forEach(item => {
            //       console.log(item.request)
            //     })
            //   }
            // const { importedIds, dynamicallyImportedIds } = info
            // const chunkname = id.includes('client-entry') ? 'client-entry' : chunkNameRe.exec(id)![1]
            // for (const importerId of importedIds) {
            //   if (!dependenciesMap[importerId]) {
            //     dependenciesMap[importerId] = []
            //   }
            //   dependenciesMap[importerId].push(chunkname)
            // }
            // for (const dyImporterId of dynamicallyImportedIds) {
            //   if (!dependenciesMap[dyImporterId]) {
            //     dependenciesMap[dyImporterId] = ['dynamic']
            //   }
            //   dependenciesMap[dyImporterId].push(chunkname)
            // }
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
