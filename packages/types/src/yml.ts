import * as yargs from 'yargs'

export type Argv = yargs.Arguments<{ yml?: Yml }>

export interface Yml {
  service: string
  provider: {
    name: string
    runtime: string
  },
  functions: {
    [index: string]: {
      handler: string
      render: {
        component: string
        layout?: string
        fetch?: string
        mode: string
        injectScript: string[]
        injectCss: string[]
        serverBundle: string
      },
      events: Events[]
    }
  },
}

interface Events {
  http?: Http[]
}

interface Http {
  path: string
  method: string[]
}
