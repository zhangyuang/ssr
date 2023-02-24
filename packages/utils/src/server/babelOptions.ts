import type { babel as Babel, getBabelOutputPlugin as GetBabelOutputPlugin } from '@rollup/plugin-babel'
import { loadConfig } from './loadConfig'
import type { Plugin } from 'rollup'

export const getBabelOptions = (babel: typeof Babel, getBabelOutputPlugin: typeof GetBabelOutputPlugin) => {
  const { babelExtraModule } = loadConfig()
  return [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.vue', '.tsx', '.js'],
      exclude: /node_modules|\.(css|less|sass)/
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.vue', '.tsx', '.js'],
      include: babelExtraModule as any,
      exclude: /node_modules|\.(css|less|sass)/
    })
    // getBabelOutputPlugin({
    //   presets: [['@babel/preset-env', {
    //     modules: false,
    //     ...corejsOptions
    //   }]],
    //   plugins: [
    //     [
    //       '@babel/plugin-transform-runtime',
    //       {
    //         corejs: false
    //       }
    //     ]
    //   ]
    // })
  ] as Plugin[]
}
