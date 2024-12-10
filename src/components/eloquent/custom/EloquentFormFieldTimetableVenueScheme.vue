<template>
  <div></div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'
import $axios from '@/api/api.service'

const eloquentStore = useEloquentStore()
const { selectedModel, selectOptions } = storeToRefs(eloquentStore)

const showId = computed(() => {
  return selectedModel.value.show_id
})

watch(
  showId,
  async (value) => {
    const res = await $axios.get(`/admin/schemes/show/${value}`)
    selectOptions.value.venue_scheme_id = res.data.schemes
    selectedModel.value.venue_id = res.data.venue_id
    if (
      selectedModel.value.venue_scheme_id &&
      !res.data.schemes.find((d: any) => d.id === selectedModel.value.venue_scheme_id)
    ) {
      selectedModel.value.venue_scheme_id = null
    }
  },
  { immediate: true }
)
</script>
