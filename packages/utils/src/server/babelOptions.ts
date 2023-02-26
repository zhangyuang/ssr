import type { babel as Babel } from '@rollup/plugin-babel'
import type { Plugin } from 'rollup'
import { loadConfig } from './loadConfig'

export const getBabelOptions = ({
  babel
}: {
  babel: typeof Babel
}
) => {
  const { babelExtraModule, corejsOptions, babelOptions } = loadConfig()
  return [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.vue', '.tsx', '.js'],
      include: babelExtraModule!.concat(babelOptions?.include ?? []),
      presets: [['@babel/preset-env', {
        modules: false,
        ...corejsOptions
      }]]
    })
  ] as Plugin[]
}
