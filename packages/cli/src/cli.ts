#!/usr/bin / env node

import * as yargs from 'yargs'
import { Argv } from '@ssr/utils'
import { start } from './start'
import { parse } from './utils/parseYml'

yargs
  .default('yml', () => parse('./f.yml'))
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
