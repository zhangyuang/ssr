module.exports = function (api) {
  const isEs = process.env.BABEL_ENV === 'es'
  api.cache(true)

  const presets = [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        modules: isEs ? 'false' : 'auto',
        targets: {
          ie: '9'
        }
      }
    ],
    '@babel/preset-react'
  ]
  const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-transform-runtime',
    'add-module-exports'
  ]

  return {
    presets,
    plugins
  }
}
