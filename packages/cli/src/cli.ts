#!/usr/bin/env node

import * as yargs from 'yargs'
import { Argv } from 'ssr-types'
import { parseYml, parseRoutesFromYml } from 'ssr-server-utils'
import { start } from './start'

const yamlContent = parseYml('./f.yml')
const routes = parseRoutesFromYml(yamlContent)

yargs
  .command('start', 'Start Server', {}, async (argv: Argv) => {
    process.env.NODE_ENV = 'development'
    argv.routes = routes
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
