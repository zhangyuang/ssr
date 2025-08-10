import type {UserConfig} from 'ssr-types'

exports.userConfig = {
  // mode: 'csr',
  chainBaseConfig: (chain) => {
    chain.module
      .rule('markdown')
      .test(/\.md$/)
      .type('asset/source')
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
