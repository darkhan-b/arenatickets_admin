import { createI18n } from 'vue-i18n'
import { messages } from '@/lang'

const i18nInstance = createI18n({
  locale: 'ru',
  fallbackLocale: 'en',
  ...messages
})

export default i18nInstance

export const i18n = i18nInstance.global
