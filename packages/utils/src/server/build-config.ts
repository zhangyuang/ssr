import { loadConfig } from './loadConfig'

export const getBuildConfig = () => {
  const { outputName } = loadConfig()
  return {
    jsBuldConfig: {
      fileName: outputName.fileName,
      chunkFileName: outputName.chunkFileName
    },
    cssBuildConfig: [{
      filename: outputName.cssfileName,
      chunkFilename: outputName.cssChunkFilename
    }]
  }
}
