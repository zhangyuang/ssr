
export type Mode = 'none' | 'development' | 'production'

export interface IWindow extends Window {
  __USE_SSR__?: string
}

export interface INodeModule extends NodeModule {
  hot?: Hot
}
export interface Hot {
  accept (path?: string): void
}
