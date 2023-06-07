import { loadConfig } from './loadConfig'
import { judgeFramework } from './cwd'

export const getBuildConfig = () => {
  const { useHash, assetsDir, isVite } = loadConfig()
  const output = {
    chunkFileName: useHash ? `${assetsDir}/[name].[contenthash:8].chunk.js` : `${assetsDir}/[name].chunk.js`,
    fileName: useHash ? `${assetsDir}/[name].[contenthash:8].js` : `${assetsDir}/[name].js`,
    cssfileName: useHash ? `${assetsDir}/[name].[contenthash:8].css` : `${assetsDir}/[name].css`,
    cssChunkFilename: useHash ? `${assetsDir}/[name].[contenthash:8].chunk.css` : `${assetsDir}/[name].chunk.css`
  }
  return {
    imagePathForVite: `${assetsDir}/[name].[hash].[ext]`,
    jsBuldConfig: {
      fileName: isVite ? `${assetsDir}/[name].[hash].chunk.js` : output.fileName,
      chunkFileName: isVite ? `${assetsDir}/[name].[hash].chunk.js` : output.chunkFileName
    },
    entryChunk: `${assetsDir}/Page.[hash].chunk.js`,
    clientEntryChunk: `${assetsDir}/Page.[hash].chunk.[ext]`,
    viteAssetChunk: `${assetsDir}/[name].[hash].chunk.[ext]`,
    cssBuildConfig: [{
      filename: output.cssfileName,
      chunkFilename: output.cssChunkFilename
    }]
  }
}

export const terserConfig = () => {
  const { isDev } = loadConfig()
  const shouldUseSourceMap = isDev || Boolean(process.env.GENERATE_SOURCEMAP)
  return {
    terserOptions: {
      keep_fnames: judgeFramework().includes('ssr-plugin-react'),
      parse: {
        ecma: 8
      },
      compress: {
        ecma: 5,
        warnings: false,
        comparisons: false,
        inline: 2
      },
      mangle: {
        safari10: true
      },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true
      }
    },
    extractComments: false,
    parallel: true,
    cache: true,
    sourceMap: shouldUseSourceMap
  }
}
