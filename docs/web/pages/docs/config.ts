import { getCurrentLanguage, t } from '@/config/i18n'

const getConfig = (lang?: string) => {
  const currentLang = lang || getCurrentLanguage()
  
  return [
    {
      title: t('menu.whySSR', currentLang),
      path: 'why'
    },
    {
      title: t('menu.guide', currentLang),
      routes: [
        { title: t('menu.whatIsSSR', currentLang), path: 'features$ssr' },
        { title: t('menu.quickStart', currentLang), path: 'features$started' },
        { title: t('menu.v7Guide', currentLang), path: 'features$v7' },
        { title: t('menu.onlineDemo', currentLang), path: 'features$demo' },
        { title: t('menu.techStack', currentLang), path: 'features$technology' },
        { title: t('menu.structure', currentLang), path: 'features$structure' },
        { title: t('menu.frontendRoutes', currentLang), path: 'features$feRoutes' },
        { title: t('menu.localDev', currentLang), path: 'features$develop' },
        { title: t('menu.dataFetch', currentLang), path: 'features$fetch' },
        { title: t('menu.communication', currentLang), path: 'features$communication' },
        { title: t('menu.usingVite', currentLang), path: 'features$vite' },
        { title: t('menu.build', currentLang), path: 'features$build' },
        { title: t('menu.deploy', currentLang), path: 'features$deploy' },
        { title: t('menu.csr', currentLang), path: 'features$csr' },
        { title: t('menu.ssg', currentLang), path: 'features$ssg' },
        { title: t('menu.faq', currentLang), path: 'features$faq' },
        { title: t('menu.memory', currentLang), path: 'features$memory' },
        { title: t('menu.issue', currentLang), path: 'features$issue' },
        { title: t('menu.thinking', currentLang), path: 'features$thinking' },
        { title: t('menu.sponsor', currentLang), path: 'features$sponsor' }
      ]
    },
    {
      title: t('menu.api', currentLang),
      routes: [
        { title: t('menu.appConfig', currentLang), path: 'api$config' }
      ]
    },
  ]
}

// Legacy export for backward compatibility
const config = getConfig()

export {
  config,
  getConfig
}
