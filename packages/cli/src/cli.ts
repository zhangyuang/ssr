#!/usr/bin/env node

import * as yargs from 'yargs'
import { Argv } from 'ssr-types'
import { parseYml, parseRoutesFromYml, parseFeRoutes, processError } from 'ssr-server-utils'
import { start } from './start'

const ymlContent = parseYml('./f.yml')
const ymlRoutes = parseRoutesFromYml(ymlContent)

try {
  yargs
    .command('start', 'Start Server', {}, async (argv: Argv) => {
      argv.faasRoutes = ymlRoutes
      await parseFeRoutes(argv)
      process.env.NODE_ENV = 'development'
      await start(argv)
    })
    .command('build', 'build server and client files', {}, async () => {
      process.env.NODE_ENV = 'production'

    })
    .demandCommand(1, 'You need at least one command before moving on')
    .option('version', {
      alias: 'v',
      default: false
    })
    .parse()
} catch (error) {
  processError(error)
}
