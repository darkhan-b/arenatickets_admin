import { createApp } from 'vue'
import { createPinia } from 'pinia'

import AppProvider from './layouts/AppProvider.vue'
import router from './router'
import registerLayouts from '@/layouts/registerLayouts'
import i18nInstance from '@/services/i18initiator.service'
import { useAuthStore } from '@/stores/auth.store'
import { createYmaps } from 'vue-yandex-maps'

const app = createApp(AppProvider)
const pinia = createPinia()

app.use(i18nInstance)
app.use(pinia)
app.use(
  createYmaps({
    apikey: '6b0e53df-e812-4609-833f-f3de0546c446',
    lang: 'ru_RU'
  })
)

registerLayouts(app)

const auth = useAuthStore()

auth.getUser().then(() => {
  app.use(router) // after getting user because it checks permissions
  app.mount('#app')
})
