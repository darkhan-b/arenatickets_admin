import { defineStore } from 'pinia'

export const useGeneralStore = defineStore('general', {
  state: () => ({
    errors: <{ [key: string]: [string] }>{},
    loading: false,
    windowWidth: 0,
    langs: ['kz', 'ru', 'en']
  }),
  actions: {
    setErrors(errors: any) {
      this.errors = errors || {}
    }
  },
  getters: {
    isMobile: (state) => {
      return state.windowWidth <= 768
    }
  }
})
