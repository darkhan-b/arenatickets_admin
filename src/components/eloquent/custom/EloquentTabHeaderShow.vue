<template>
  <n-tabs
    type="line"
    animated
    @update:value="handleUpdateValue"
    default-value="active">
    <n-tab-pane name="all" tab="Все"></n-tab-pane>
    <n-tab-pane name="active" tab="Активные"></n-tab-pane>
    <n-tab-pane name="finished" tab="Завершенные"></n-tab-pane>
    <n-tab-pane name="draft" tab="Черновики"></n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabPane, NTabs } from 'naive-ui'
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const eloquentStore = useEloquentStore()
const { model, needsToFullReload, customConditions } =
  storeToRefs(eloquentStore)

const handleUpdateValue = (val: string) => {
  // model.value = val
  switch (val) {
    case 'active':
      customConditions.value = { active: true, finished: false }
      break
    case 'all':
      customConditions.value = {}
      break
    case 'finished':
      customConditions.value = { finished: true }
      break
    case 'draft':
      customConditions.value = { active: false }
      break
  }
  needsToFullReload.value = true
}

onMounted(() => {
  customConditions.value = { active: true, finished: false }
})
</script>
