/**
 * Vuei18n 多國語系套件
 *
 * @since 0.0.1
 * @version 0.0.1
 * @author MPWEI
 * @date 2020/01/23
 */

import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: 'zh-tw',
    messages: {
      'en-us': require('~/locales/en-us.json'),
      'zh-tw': require('~/locales/zh-tw.json')
    },
    silentTranslationWarn: true
  })

  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }

    return `/${app.i18n.locale}/${link}`
  }
}
