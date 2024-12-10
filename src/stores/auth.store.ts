import { defineStore } from 'pinia'
import $axios from '@/api/api.service'
import { tokenService } from '@/services/token.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: <any>{}
  }),
  getters: {
    clientName: (state) => {
      return state.user?.client?.title || 'Arenatickets'
    },
    client: (state) => {
      return state.user?.client || null
    },
    hasPermissions: (state) => {
      return (permissions: string[]) =>
        permissions.every((permission) =>
          state.user?.permissionsList?.includes(permission)
        )
    }
  },
  actions: {
    async login(params: any): Promise<boolean> {
      try {
        const res = await $axios.post('/auth/login', params)
        if (res?.data?.data?.token) {
          tokenService.saveToken(res.data.data.token)
          return await this.getUser()
        }
        return false
      } catch (e) {
        return false
      }
    },
    async getUser(): Promise<boolean> {
      if (!tokenService.getToken()) return false
      try {
        const res = await $axios.get('/auth/user')
        if (res?.data?.data?.user) {
          this.$patch({ user: res?.data?.data?.user })
          return true
        }
        return false
      } catch (e) {
        return false
      }
    },
    async logout() {
      tokenService.destroyToken()
    }
  }
})
