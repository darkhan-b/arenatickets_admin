<template>
  <div>
    <n-alert title="Предпросмотр" type="warning" v-if="!selectedModel.id">
      Для предпросмотра необходимо сохранить дизайн
    </n-alert>
    <iframe
      id="ticket-iframe"
      v-if="selectedModel.id"
      :src="`${apiUrl}/ticket/design/${selectedModel.id}/example?tkn=${xApiToken}&${serializedParams}#toolbar=0&navpanes=0`"
      style="width: 100%; height: 780px"></iframe>
  </div>
</template>

<script setup lang="ts">
import { NAlert } from 'naive-ui'
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'
import { watch, ref } from 'vue'

const eloquentStore = useEloquentStore()
const { selectedModel } = storeToRefs(eloquentStore)

const apiUrl = import.meta.env.VITE_API_URL.replace('.kz/api', '.kz')
const xApiToken = encodeURIComponent(import.meta.env.VITE_API_TOKEN)

const serializedParams = ref('')

watch(
  selectedModel,
  (v) => {
    serializedParams.value = serialize(v)
  },
  { deep: true }
)

const serialize = (obj: any) => {
  return new URLSearchParams(obj).toString()
}
</script>
