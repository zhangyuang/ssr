#!/usr/bin/env node

import * as yargs from 'yargs'
import { parse } from './utils/parseYml'

yargs
  .command('start', 'start clientRender', {}, async () => {
    const yml = parse()
    console.log(yml.functions.index.render)
  })
  .command('build', 'start clientBuild', {}, async () => {

  })
  .demandCommand(1, 'You need at least one command before moving on')
  .option('version', {
    alias: 'v',
    default: false
  })
  .parse()
