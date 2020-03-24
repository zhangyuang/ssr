#!/usr/bin/env node

import * as yargs from 'yargs'
import { parse } from './utils/parseYml'
import { Argv } from './interface/argv'

yargs
  .default('yml', () => parse('./f.yml'))
  .command('start', 'Start Server', {}, async (argv: yargs.Arguments<Argv>) => {
    console.log(argv.yml)
  })
  // .command('build', 'build server and client files', {}, async () => {

  // })
  .demandCommand(1, 'You need at least one command before moving on')
  .option('version', {
    alias: 'v',
    default: false
  })
  .parse()
