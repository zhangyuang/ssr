import yargs from 'yargs'

export interface Argv extends yargs.Arguments {
  appName?: string
  PORT?: Number
}
