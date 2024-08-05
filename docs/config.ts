import type {UserConfig} from 'ssr-types'

exports.userConfig = {
  chainBaseConfig: (chain) => {
    chain.module
      .rule('markdown')
      .test(/\.md$/)
      .use('raw-loader')
      .loader(require.resolve('raw-loader'))
      .end()
  },
  jsInline: 'all',
  cssInline: 'all',
  dynamic: false,
  chainClientConfig: chain => {
    chain.optimization
      .splitChunks({
        chunks: 'async',
        cacheGroups: {
          vendors: {
            test: (module) => {
              return module.resource &&
            /\.md$/.test(module.resource)
            },
            name: 'md-vendor'
          }
        }
      })
      .end()
  },
  customeHeadScript: [
    {
      content: `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?be62d221290c448fc952ff5807b44515";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`
    }
  ]
} as UserConfig
