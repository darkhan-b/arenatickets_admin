<template>
  <n-tabs type="line" animated @update:value="handleUpdateValue">
    <n-tab-pane name="order" tab="Активные"></n-tab-pane>
    <n-tab-pane name="deleted_order" tab="Удаленные"></n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabPane, NTabs } from 'naive-ui'
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'

const eloquentStore = useEloquentStore()
const { model, needsToFullReload } = storeToRefs(eloquentStore)

const handleUpdateValue = (val: string) => {
  model.value = val
  needsToFullReload.value = true
}
</script>
