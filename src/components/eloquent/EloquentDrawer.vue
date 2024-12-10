<template>
  <n-drawer
    v-model:show="showForm"
    :width="windowWidth > 600 ? 600 : windowWidth"
    placement="right"
    v-if="config">
    <n-drawer-content :title="config.title" closable>
      <EloquentForm ref="form" />
      <template #footer>
        <n-button type="primary" :loading="loading" @click="saveModel">
          Сохранить
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { NButton, NDrawer, NDrawerContent } from 'naive-ui'
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'
import EloquentForm from '@/components/eloquent/EloquentForm.vue'
import { useGeneralStore } from '@/stores/general.store'
import { ref } from 'vue'

const eloquentStore = useEloquentStore()
const generalStore = useGeneralStore()
const { showForm, config } = storeToRefs(eloquentStore)
const { loading, windowWidth } = storeToRefs(generalStore)
const form = ref(null)
const saveModel = () => {
  form?.value?.saveModel()
}
</script>
