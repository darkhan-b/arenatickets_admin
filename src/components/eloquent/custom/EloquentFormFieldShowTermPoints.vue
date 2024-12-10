<template>
  <div>
    <n-card
      embedded
      :title="`Условие ${index + 1}`"
      class="mb-15"
      :key="`term-${index}`"
      v-for="(point, index) in selectedModel.showTermPoints">
      <template #header-extra>
        <n-button
          @click="deleteCondition(index)"
          type="default"
          circle
          quaternary>
          <n-icon :component="Close" size="small"></n-icon>
        </n-button>
      </template>
      <n-space vertical size="medium">
        <div v-for="l in langs" :key="`input-${index}-${l}`">
          <n-input
            type="textarea"
            placeholder="Текст условия"
            autosize
            v-model:value="point.title[l]">
            <template #prefix>
              {{ l }}
            </template>
          </n-input>
        </div>
      </n-space>
    </n-card>
    <div class="mt-30 text-end">
      <n-button @click="addCondition"
        ><n-icon :component="AddSharp" size="small" class="me-10"></n-icon
        >Добавить пункт</n-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NInput, NCard, NSpace, NIcon } from 'naive-ui'
import { Close, AddSharp } from '@vicons/ionicons5'
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'

const eloquentStore = useEloquentStore()
const { selectedModel } = storeToRefs(eloquentStore)

const langs = ['ru', 'en', 'kz']

const addCondition = () => {
  if (!selectedModel.value.showTermPoints)
    selectedModel.value.showTermPoints = []
  selectedModel.value.showTermPoints.push({
    title: {
      ru: '',
      en: '',
      kz: ''
    }
  })
}

const deleteCondition = (index: string | number) => {
  selectedModel.value.showTermPoints.splice(index, 1)
}
</script>
