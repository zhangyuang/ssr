module.exports = {
  title: 'Egg + React + SSR 服务端渲染',
  head: [
    ['link', { rel: 'icon', href: 'https://avatars1.githubusercontent.com/u/50347314?s=200&v=4' }],
    ['meta', { name: 'keywords', itemprop: 'keywords', content: '服务端渲染, React, Egg, SSR, ReactSSR'}],
    ['meta', { property: 'og:title', content: 'Egg + React + SSR 服务端渲染'}],
    ['meta', { property: 'og:description', content: 'Egg + React + SSR 服务端渲染, 最小而美的服务端渲染应用骨架'}],
    ['script', {}, `var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?ad212e8d41079dc41abaeda9b36e2501";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })()`]
  ],
  locales: {
    '/': {
      lang: 'zh-CN',
      description: '最小而美的服务端渲染应用骨架',
    },
    '/en/': {
       // 英文版，待补充
       lang: 'en-US'
    }
  },
  themeConfig: {
    locales: {
      '/': {
        nav: [
          { text: '指南', link: '/guide/' },
          { text: '配置', link: '/config/' },
          { text: 'Github', link: 'https://github.com/ykfe/egg-react-ssr' },
        ],
        selectText: '选择语言',
        label: '简体中文',
        sidebar: {
          '/guide/': [
            {
              collapsable: false,
              children: [
                '',
                'gettingStarted',
                'isomorphism',
                'config',
                'getInitialProps',
                'hydrate',
                'stream',
                'ssr-csr',
                'hmr',
                'optimize',
                'dev',
                'publish',
                'deploy',
                'loadable',
                'ts',
                'serverless',
                'thinking',
                'faq'
                // 'update'
              ],
            }
          ]
        }
      },
      '/en/': {
        selectText: 'Languages',
        label: 'English(待补充)'
      }
    }
  }
}
