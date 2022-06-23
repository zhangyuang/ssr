import { parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'
import type { Compiler, WebpackPluginInstance, compilation } from 'webpack'

const webpackCommentRegExp = /webpackChunkName:\s?"(.*)?"\s?\*/
const chunkNameRe = /chunkName=(.*)/

export class WebpackChunkNamePlugin implements WebpackPluginInstance {
  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(
      'ChunkNamePlugin',
      (compilation) => {
        // console.log('这是一个示例插件！')
        compilation.hooks.succeedModule.tap(
          'ChunkNamePlugin',
          (module: compilation.Module) => {
            if (module.rawRequest?.includes('ssr-declare-routes' || module.rawRequest?.includes('ssr-manual-routes'))) {
              const content = module._source._value
              const str = new MagicString(content)
              const imports = parseImports(content)[0]
              for (let index = 0; index < imports.length; index++) {
                const { s: start, e: end } = imports[index]
                const rawUrl = content.slice(start, end)
                if (!rawUrl.includes('render')) continue
                const chunkName = webpackCommentRegExp.exec(rawUrl)![1]
                // str = str.appendRight(end - 1, `?chunkName=${chunkName}`)
              }
              module._source._value = str.toString()
            }
          }
        )
      }
    )
  }
}
export class WebpackChunkNamePlugin2 implements WebpackPluginInstance {
  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(
      'ChunkNamePlugin',
      (compilation) => {
        // console.log('这是一个示例插件！')
        compilation.hooks.succeedModule.tap(
          'ChunkNamePlugin',
          (module: compilation.Module) => {
            if (module.rawRequest?.includes('ssr-declare-routes' || module.rawRequest?.includes('ssr-manual-routes'))) {
              const content = module._source._value
              console.log(content)
            }
          }
        )
      }
    )
  }
}
