import { loadConfig } from './loadConfig'

export const cssBuildConfig = () => {
  const { outputName } = loadConfig()
  return [{
    filename: outputName.cssfileName,
    chunkFilename: outputName.cssChunkFilename
  }]
}
