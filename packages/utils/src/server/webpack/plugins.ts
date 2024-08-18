import { relative } from 'path'
import type { Compiler } from 'webpack'

interface FileToChunkMap {
  [filePath: string]: string
}

export class FileToChunkRelationPlugin {
  apply (compiler: Compiler) {
    compiler.hooks.emit.tapAsync(
      'FileToChunkRelationPlugin',
      (compilation, callback) => {
        const fileToChunkMap: FileToChunkMap = {}

        // Iterate through all chunks
        for (const chunk of compilation.chunks) {
          // Get all modules for this chunk
          const chunkName = chunk.name || chunk.id as string
          for (const module of chunk.modulesIterable) {
            if (module.resource) {
              let source = relative(compiler.context, module.resource)
              if (!source.startsWith('.')) {
                source = `./${source}`
              }
              fileToChunkMap[source] = chunkName
            }
          }
        }

        // Add the map as a new asset
        const content = JSON.stringify(fileToChunkMap, null, 2)
        compilation.assets['chunkMap.json'] = {
          source: () => content,
          size: () => content.length
        }

        callback()
      }
    )
  }
}
