module.exports = {
  chainBaseConfig: (chain) => {
    chain.module
      .rule('markdown')
      .test(/\.md$/)
      .use('raw-loader')
      .loader(require.resolve('raw-loader'))
      .end()
  }
}
