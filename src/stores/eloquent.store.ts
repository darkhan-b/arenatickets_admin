import { defineStore } from 'pinia'
import $axios from '@/api/api.service'
import { eloquentNormalize } from '@/services/adapter.service'
import { useAuthStore } from '@/stores/auth.store'

export const useEloquentStore = defineStore('eloquent', {
  state: () => ({
    model: '',
    config: <any>null,
    selectedModel: <any>null,
    selectOptions: <any>null,
    showForm: false,
    needsToReload: false,
    needsToFullReload: false,
    list: <any>null,
    actionsCell: <any>null,
    customConditions: <any>{},
    selectedMedia: []
  }),
  getters: {
    dataTableColumns: (state) => {
      const authStore = useAuthStore()
      if (!state.config?.fields) return []
      return Object.values(state.config?.fields).filter(
        (field: any) =>
          field.table &&
          (!field.permissions || authStore.hasPermissions(field.permissions))
      )
    },
    dataTablePagination: (state) => {
      if (!state.list) return {}
      return {
        page: state.list.current_page,
        pageCount: state.list.last_page,
        pageSize: state.list.per_page,
        itemCount: state.list.total,
        prefix({ itemCount }: { itemCount: any }) {
          return `Записей: ${itemCount}.`
        }
      }
    }
  },
  actions: {
    async loadConfig() {
      try {
        const res = await $axios.get(`/admin/eloquent/${this.model}/config`)
        this.config = res.data
      } catch (e) {
        console.log(e)
      }
    },
    async loadDataTable(
      params: any = {},
      model: string | null = null,
      main: boolean = true
    ) {
      if (main) this.list = []
      try {
        const res = await $axios.get(
          `/admin/eloquent/${model || this.model}?${new URLSearchParams(
            params
          ).toString()}`
        )
        if (main) {
          this.list = res.data.list
          this.selectOptions = res.data.select_data
        }
        return res.data?.list?.data || []
      } catch (e) {
        console.log(e)
        return []
      }
    },
    async createModelPrepare(params: any = {}) {
      try {
        const res = await $axios.get(
          `/admin/eloquent/${this.model}/create?${new URLSearchParams({
            ...params,
            ...this.customConditions
          }).toString()}`
        )
        this.selectedModel = Array.isArray(res.data.object)
          ? {}
          : res.data.object
        this.selectOptions = res.data.select_models
        this.selectedMedia = res.data.media
        this.showForm = true
      } catch (e) {
        console.log(e)
      }
    },
    async editModelPrepare(id: number) {
      try {
        const res = await $axios.get(`/admin/eloquent/${this.model}/${id}/edit`)
        this.selectedModel = Array.isArray(res.data.object)
          ? {}
          : res.data.object
        this.selectOptions = res.data.select_models
        this.selectedMedia = res.data.media
        this.showForm = true
      } catch (e) {
        console.log(e)
      }
    },
    async saveModel() {
      try {
        let res
        const data = eloquentNormalize(this.selectedModel, this.config.fields)
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        if (this.selectedModel?.id) {
          res = await $axios.post(
            `/admin/eloquent/${this.model}/${this.selectedModel.id}`,
            data,
            config
          )
        } else {
          res = await $axios.post(`/admin/eloquent/${this.model}`, data, config)
        }
        return !!res?.data?.id
      } catch (e) {
        console.log(e)
        return false
      }
    },
    async customCreate(model: string, data: any) {
      try {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        const res = await $axios.post(`/admin/eloquent/${model}`, data, config)
        return res?.data || null
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async deleteModel(id: number) {
      try {
        await $axios.delete(`/admin/eloquent/${this.model}/${id}`)
        return true
      } catch (e) {
        console.log(e)
        return false
      }
    },
    async cloneModel(id: number) {
      try {
        await $axios.post(`/admin/eloquent/${this.model}/${id}/clone`)
        return true
      } catch (e) {
        console.log(e)
        return false
      }
    },
    async loadExcel() {
      try {
        const res = await $axios.post(
          `admin/eloquent/${this.model}/excel/export`,
          {},
          { responseType: 'blob' }
        )
        return res.data
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async deleteMedia(id: number) {
      try {
        await $axios.post('/admin/media/delete', { _method: 'delete', id })
        return true
      } catch (e) {
        console.log(e)
        return false
      }
    },
    async autocompleteSearch(
      model: string | undefined,
      search: string,
      field: string = 'title',
      ids: Array<number> = []
    ) {
      try {
        return await $axios.get(
          `/admin/eloquent/${model}/autocomplete/${field}?search=${search}&ids=${ids}`
        )
      } catch (e) {
        console.log(e)
        return []
      }
    },
    async getModel(id: number, model: string | null = null) {
      try {
        return await $axios.get(
          `/admin/eloquent/${model || this.model}/${id}/get`
        )
      } catch (e) {
        console.log(e)
        return null
      }
    }
  }
})
