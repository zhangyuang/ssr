#!/usr/bin/env node

import * as yargs from 'yargs'
import { Argv } from 'ssr-types'
import { parseFeRoutes } from 'ssr-server-utils'
import { start } from './start'

yargs
  .command('start', 'Start Server', {}, async (argv: Argv) => {
    argv.routes = parseFeRoutes(argv)
    process.env.NODE_ENV = 'development'
    // await start(argv)
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
