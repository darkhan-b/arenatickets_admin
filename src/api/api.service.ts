import axios from 'axios'
import { useGeneralStore } from '@/stores/general.store'
import { storeToRefs } from 'pinia'
import { tokenService } from '@/services/token.service'
import router from './../router'

const $axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

$axios.interceptors.request.use(
  (config) => {
    const generalStore = useGeneralStore()
    const { loading } = storeToRefs(generalStore)
    loading.value = true

    const token = tokenService.getToken()
    config.headers['Authorization'] = token
      ? `Bearer ${token}`
      : `${import.meta.env.VITE_API_TOKEN}`
    config.headers['X-API-TOKEN'] = `${import.meta.env.VITE_API_TOKEN}`

    return config
  },
  (error) => Promise.reject(error)
)

$axios.interceptors.response.use(
  (response) => {
    const generalStore = useGeneralStore()
    const { loading } = storeToRefs(generalStore)
    loading.value = false
    generalStore.setErrors(null)
    return response
  },
  function (error) {
    const status = error.response?.status || 500
    const message = error.response?.data?.message || null
    if (message) {
      try {
        // @ts-ignore
        window.$message.error(message.trimEllipsis(500), {
          closable: true,
          duration: 5000
        })
      } catch (e) {}
    }

    const generalStore = useGeneralStore()
    const { loading, errors } = storeToRefs(generalStore)
    loading.value = false
    errors.value = error.response?.data?.errors || {}

    if (status === 401) {
      // unauthenticated
      tokenService.destroyToken()
      router.push({ name: 'login' }).catch(() => {})
    }
    // if (status === 422) { // validation errors
    //
    // }
    return Promise.reject(error)
  }
)

String.prototype.trimEllipsis = function (length) {
    return this.length > length ? this.substring(0, length) + "..." : this;
}

export default $axios
