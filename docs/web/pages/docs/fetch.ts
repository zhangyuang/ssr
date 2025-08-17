import { ISSRContext } from 'ssr-types'
import { getCurrentLanguage } from '@/config/i18n'
import { getConfig } from './config'

export default async ({ router }, ctx?: ISSRContext) => {
 
  const page = router.params.page
  const lang = getCurrentLanguage()
  const data = (await import(`@/markdown/${lang}/${page.replace(/\$/g, '/')}.md`)).default
  if (__isBrowser__) {
    if (page === 'features/v7') {
      document.title = lang === 'zh' 
        ? 'ssr框架v7发布，全网首个同时支持Rspack,Rolldown-Vite,Webpack的ssr框架'
        : 'SSR Framework v7 Released - First Framework Supporting Rspack, Rolldown-Vite, Webpack'
    } else {
      document.title = lang === 'zh' ? 'ssr 框架官方文档' : 'SSR Framework Official Documentation'
    }
  }
  return {
    docsContent: data,
    pagePath: page,
    config: getConfig(lang)
  }
}
