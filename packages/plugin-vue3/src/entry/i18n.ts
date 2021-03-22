const { createI18n } = require('vue-i18n')
const i18n = createI18n({
  // 默认配置
  locale: 'en',
  messages: {},
  globalInjection: true,
  // 用户配置
  // @ts-expect-error
  ...vueI18N.config,
  // 模式锁定，传统模式SSR有bug
  legacy: false
})

export {
  i18n
}
