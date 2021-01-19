import { startClientServer, startServerBuild, startFaasServer } from 'ssr-webpack'

const start = async () => {
  await Promise.all([startClientServer(), startServerBuild()])
  startFaasServer()
}

export {
  start
}
