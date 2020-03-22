import https from 'https'
import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import { promisify } from 'util'
import { exec } from 'child_process'
import { Optional } from '../interface/option'

const webpackWithPromise = promisify(webpack)

const processError = (err: string) => {
  if (err) {
    console.log('err', err)
    process.exit()
  }
}

const execWithPromise = promisify(exec)

const resolveApp = (source: string) => {
  // 以根目录为基准
  return path.resolve(__dirname, `../../${source}`)
}

export {
  webpackWithPromise,
  processError,
  execWithPromise,
  downloadWithPromise,
  resolveApp
}
