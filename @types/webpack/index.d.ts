import webpack = require('webpack')

declare module 'webpack' {
  interface SSRModule extends webpack.compilation.Module {
    resource?: string
    dependencies?: {request: string}[]
  }
}
