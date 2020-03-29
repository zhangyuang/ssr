#!/usr/bin/env node

import * as yargs from 'yargs'
import { Argv, parseYml, parseRoutesFromYml } from '@ssr/utils'
import { start } from './start'

const yamlContent = parseYml('./f.yml')

yargs
  .default('Routes', () => parseRoutesFromYml(yamlContent))
  .command('start', 'Start Server', {}, async (argv: Argv) => {
    await start(argv)
  })
  .command('build', 'build server and client files', {}, async () => {
    //
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .option('version', {
    alias: 'v',
    default: false
  })
  .parse()
