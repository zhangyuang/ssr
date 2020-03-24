
export interface Argv {
  yml?: Yml
}

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
      }
    }
  },
  events: {
    http: {
      path: string
      method: string[]
    }
  }
}
