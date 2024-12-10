<template>
  <n-button @click="exportSubscribers" type="default"
    ><n-icon :component="CloudDownloadOutline" class="me-10"></n-icon>Экспорт в
    excel</n-button
  >
</template>

<script setup lang="ts">
import { NButton, NIcon, useDialog } from 'naive-ui'
import { CloudDownloadOutline } from '@vicons/ionicons5'
import { useEloquentStore } from '@/stores/eloquent.store'
import { openExcelData } from '@/services/helper.service'
const eloquentStore = useEloquentStore()
const dialog = useDialog()

const exportSubscribers = async () => {
  const excelData = await eloquentStore.loadExcel()
  if (excelData) {
    openExcelData(excelData)
  } else {
    dialog.warning({
      title: 'Пустой результат',
      content: 'Не найдено записей по запросу'
    })
  }
}
</script>
