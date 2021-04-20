export default [
  {
    title: '为什么要选择 SSR',
    path: 'why'
  },
  {
    title: '指引',
    routes: [
      { title: '快速开始', path: 'features$started' },
      { title: '插件机制 ', path: 'features$plugin' },
      { title: '约定式路由', path: 'features$feRoutes' },
      { title: '本地开发 ', path: 'features$develop' },
      { title: '组件通信 ', path: 'features$communication' },
      { title: '使用Vite ', path: 'features$vite' },
      { title: '应用部署 ', path: 'features$deploy' },
      { title: '渲染降级', path: 'features$csr' },
      { title: 'FAQ', path: 'features$faq' }

    ]
  },
  {
    title: 'Api Routes',
    routes: [
      {
        title: 'Static File Serving',
        path: 'api-routes$static-file-serving'
      },
      {
        title: 'Fast Refresh',
        path: 'api-routes$fast-refresh'
      },
      {
        title: 'TypeScript',
        path: 'api-routes$typescript'
      },
      {
        title: 'Environment Variables',
        path: 'api-routes$environment-variables'
      },
      {
        title: 'Supported Browsers and Features',
        path: 'api-routes$supported-browsers-features'
      }
    ]
  }
]
