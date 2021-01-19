import { startClientBuild, startServerBuild } from 'ssr-webpack'

const build = async () => {
  await Promise.all([startClientBuild(), startServerBuild()])
}

export {
  build
}
