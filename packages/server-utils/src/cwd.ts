import { join, isAbsolute } from 'path'

const getCwd = () => {
  const cwd = process.cwd()
  if (process.env.APP_ROOT) {
    // avoid repeat cwd path
    if (!isAbsolute(process.env.APP_ROOT)) {
      return join(cwd, process.env.APP_ROOT)
    }
    return process.env.APP_ROOT
  }
  return cwd
}

const getFeDir = () => {
  // fe component folder
  const cwd = process.cwd()
  if (process.env.FE_ROOT) {
    // avoid repeat cwd path
    if (!isAbsolute(process.env.FE_ROOT)) {
      return join(cwd, process.env.FE_ROOT)
    }
    return process.env.APP_ROOT
  }
  return join(cwd, './web')
}

export {
  getCwd,
  getFeDir
}
