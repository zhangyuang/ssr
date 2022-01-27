
import * as yargs from 'yargs'

export type Argv = yargs.Arguments<{
  tencent?: boolean
  vite?: boolean
  test?: boolean
  noclean?: boolean
  showArgs?: boolean
  analyze?: boolean
  html?: boolean
  legacy?: boolean
}>
