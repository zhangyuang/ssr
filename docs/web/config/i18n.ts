export interface I18nConfig {
  defaultLanguage: string
  languages: Language[]
  translations: Record<string, Record<string, string>>
}

export interface Language {
  code: string
  name: string
  nativeName: string
}

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'en',
  languages: [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English'
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '简体中文'
    }
  ],
  translations: {
    en: {
      // Header translations
      'header.docs': 'Docs',
      'header.api': 'API',
      'header.faq': 'FAQ',
      'header.changelog': 'Changelog',
      'header.memory': 'Memory Analysis Tool',
      'header.donation': 'Project Donation',
      'header.github': 'Github',
      
      // Home page translations
      'home.title': 'Future-oriented SSR Framework',
      'home.desc': 'Support React17-19, Vue2-3',
      'home.subtitle': 'Support Rspack/Rolldown-Vite/Webpack',
      'home.startButton': 'Get Started',
      'home.docsButton': 'View Docs',
      'home.whyTitle': 'Why Choose SSR',
      'home.whyContent': 'Powerful features and timely support',
      'home.feature1.title': 'Highly Customizable',
      'home.feature1.desc': 'Plugin architecture supports any combination of frontend and backend frameworks',
      'home.feature2.title': 'Ready to Use',
      'home.feature2.desc': 'Built-in 10+ scaffold extensions like Antd, Vant, TS, Hooks',
      'home.feature3.title': 'Perfect Serverless Support',
      'home.feature3.desc': 'One-click deployment to various Serverless platforms',
      
      // Menu translations
      'menu.whySSR': 'Why Choose SSR',
      'menu.guide': 'Guide',
      'menu.whatIsSSR': 'What is Server-Side Rendering',
      'menu.quickStart': 'Quick Start',
      'menu.v7Guide': 'v7 Upgrade Guide',
      'menu.onlineDemo': 'Online Demo',
      'menu.techStack': 'Technology Stack',
      'menu.structure': 'Directory Structure',
      'menu.frontendRoutes': 'Frontend Routes',
      'menu.localDev': 'Local Development',
      'menu.dataFetch': 'Data Fetching',
      'menu.communication': 'Component Communication',
      'menu.usingVite': 'Using Vite',
      'menu.build': 'Build Output',
      'menu.deploy': 'Application Deployment',
      'menu.csr': 'Rendering Degradation',
      'menu.ssg': 'Pre-rendering',
      'menu.faq': 'FAQ',
      'menu.memory': 'Memory Analysis',
      'menu.issue': 'Development Communication',
      'menu.thinking': 'Design Philosophy',
      'menu.sponsor': 'Project Donation',
      'menu.api': 'API',
      'menu.appConfig': 'Application Configuration',
      'menu.officialPlugins': 'Official Plugins',
      
      // Footer translations
      'footer.relatedLinks': 'Related Links',
      'footer.contactUs': 'Contact Us',
      'footer.communityGroup': 'Community Group',
      'footer.frontendManual': 'Frontend Development Manual',
      'footer.viteAnalysis': 'Vite Source Code Analysis',
      'footer.memoryTool': 'Memory Analysis Tool',
      'footer.zhihu': 'Zhihu'
    },
    zh: {
      // Header translations
      'header.docs': '文档',
      'header.api': 'API',
      'header.faq': '常见问题',
      'header.changelog': '发布记录',
      'header.memory': '内存分析工具',
      'header.donation': '项目捐赠',
      'header.github': 'Github',
      
      // Home page translations
      'home.title': '面向未来的 SSR 框架',
      'home.desc': '同时支持React17-19，Vue2-3',
      'home.subtitle': '同时支持 Rspack/Rolldown-Vite/Webpack',
      'home.startButton': '开始学习',
      'home.docsButton': '查看文档',
      'home.whyTitle': '为什么要选择 SSR',
      'home.whyContent': '无比强大的功能支持，及时的答疑服务',
      'home.feature1.title': '极易定制',
      'home.feature1.desc': '框架使用插件化架构支持任意前端框架和服务端框架的组合',
      'home.feature2.title': '开箱即用',
      'home.feature2.desc': '内置 10+ 脚手架配套扩展，如Antd、Vant、TS、Hooks等',
      'home.feature3.title': '完美支持 Serverless',
      'home.feature3.desc': '一键发布到各种Serverless平台，也支持传统Web Server，比如Egg、Midway、Nest等。',
      
      // Menu translations
      'menu.whySSR': '为什么要选择 SSR',
      'menu.guide': '指引',
      'menu.whatIsSSR': '什么是服务端渲染',
      'menu.quickStart': '快速开始',
      'menu.v7Guide': 'v7升级指南',
      'menu.onlineDemo': '在线案例',
      'menu.techStack': '技术选型',
      'menu.structure': '目录结构',
      'menu.frontendRoutes': '前端路由',
      'menu.localDev': '本地开发',
      'menu.dataFetch': '数据获取',
      'menu.communication': '组件通信',
      'menu.usingVite': '使用 vite',
      'menu.build': '构建产物',
      'menu.deploy': '应用部署',
      'menu.csr': '渲染降级',
      'menu.ssg': '预渲染',
      'menu.faq': 'FAQ',
      'menu.memory': '内存分析',
      'menu.issue': '开发交流',
      'menu.thinking': '设计思路',
      'menu.sponsor': '项目捐赠',
      'menu.api': 'API',
      'menu.appConfig': '应用配置',
      'menu.officialPlugins': '官方插件',
      
      // Footer translations
      'footer.relatedLinks': '相关链接',
      'footer.contactUs': '联系我们',
      'footer.communityGroup': '交流群',
      'footer.frontendManual': '前端开发手册',
      'footer.viteAnalysis': 'Vite 源码解析',
      'footer.memoryTool': '内存分析工具',
      'footer.zhihu': '知乎'
    }
  }
}

// Helper function to get current language from URL or localStorage
export function getCurrentLanguage(): string {
  if (typeof window !== 'undefined') {
    // Check URL path first
    const path = window.location.pathname
    const langMatch = path.match(/^\/(zh|en)\//)
    if (langMatch) {
      return langMatch[1]
    }
    
    // Check localStorage
    const savedLang = localStorage.getItem('ssr-docs-lang')
    if (savedLang && ['en', 'zh'].includes(savedLang)) {
      return savedLang
    }
    
    // Check browser language
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('zh')) {
      return 'zh'
    }
  }
  
  return i18nConfig.defaultLanguage
}

// Helper function to get translation
export function t(key: string, lang?: string): string {
  const currentLang = lang || getCurrentLanguage()
  return i18nConfig.translations[currentLang]?.[key] || key
}

// Helper function to switch language
export function switchLanguage(newLang: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ssr-docs-lang', newLang)
    
    // Update URL path
    const currentPath = window.location.pathname
    const currentLang = getCurrentLanguage()
    
    let newPath = currentPath
    if (currentPath.startsWith(`/${currentLang}/`)) {
      newPath = currentPath.replace(`/${currentLang}/`, `/${newLang}/`)
    } else if (currentPath === '/' || !currentPath.startsWith('/zh/') && !currentPath.startsWith('/en/')) {
      newPath = `/${newLang}${currentPath}`
    }
    
    window.location.href = newPath
  }
}