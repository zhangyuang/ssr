import * as fs from 'fs'
import * as http from 'http'
import { promisify } from 'util'

const promisifyFsReadDir = promisify(fs.readdir)

const getPromisify = async (url: string) => {
  return await new Promise((resolve, reject) => {
    http.get(url, res => {
      if (res.statusCode! < 200 || res.statusCode! >= 300) {
        return reject(new Error(`statusCode=${res.statusCode}`))
      }
      let body: Buffer[] = []
      res.on('data', function (chunk) {
        body.push(chunk)
      })
      res.on('end', function () {
        try {
          body = JSON.parse(Buffer.concat(body).toString())
        } catch (e) {
          reject(e)
        }
        resolve(body)
      })
    })
  })
}
export {
  promisifyFsReadDir,
  getPromisify
}
