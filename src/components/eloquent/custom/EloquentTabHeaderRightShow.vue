<template>
  <n-tooltip>
    <template #trigger>
      <n-button @click="sync" class="ms-10" type="default"
        ><n-icon :component="Refresh"></n-icon
      ></n-button>
    </template>
    Синхронизировать список событий с API третьих сторон
  </n-tooltip>
</template>

<script setup lang="ts">
import { NButton, NIcon, NTooltip, useDialog } from 'naive-ui'
import { Refresh } from '@vicons/ionicons5'
import { useEloquentStore } from '@/stores/eloquent.store'
import $axios from '@/api/api.service'

const dialog = useDialog()
const eloquentStore = useEloquentStore()

const sync = async () => {
  try {
    await $axios.post(`/admin/shows/sync`)
    eloquentStore.needsToReload = true
    dialog.success({ title: 'Данные обновлены' })
  } catch (e) {
    dialog.error({ title: 'Что-то пошло не так' })
  }
}
</script>
