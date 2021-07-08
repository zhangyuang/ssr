const config = [
  {
    title: '为什么要选择 SSR',
    path: 'why'
  },
  {
    title: '指引',
    routes: [
      { title: '什么是服务端渲染', path: 'features$ssr' },
      { title: '快速开始', path: 'features$started' },
      { title: '在线案例', path: 'features$demo' },
      { title: 'Serverless', path: 'features$serverless' },
      { title: '技术选型', path: 'features$technology' },
      { title: '目录结构', path: 'features$structure' },
      { title: '约定式路由', path: 'features$feRoutes' },
      { title: '本地开发', path: 'features$develop' },
      { title: '数据获取', path: 'features$fetch' },
      { title: '组件通信', path: 'features$communication' },
      // { title: '代码分割 ', path: 'features$dynamic' },
      { title: '使用Vite', path: 'features$vite' },
      { title: '插件机制', path: 'features$plugin' },
      { title: '构建产物', path: 'features$build' },
      { title: '应用部署', path: 'features$deploy' },
      { title: '渲染降级', path: 'features$csr' },
      { title: 'FAQ', path: 'features$faq' },
      { title: '开发交流', path: 'features$issue' }
    ]
  },
  {
    title: 'API',
    routes: [
      { title: '应用配置', path: 'api$config' }
    ]
  },
  {
    title: '插件列表',
    routes: [
      { title: '官方插件', path: 'plugin$index' }
    ]
  }
]

export {
  config
}
