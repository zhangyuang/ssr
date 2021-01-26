import { startFaasServer } from './server'

const start = async (config) => {
  startFaasServer(config)
}

export {
  start
}
