<template>
  <div>
    <n-upload
      :default-upload="false"
      :default-file-list="value"
      @update:fileList="handleInput"
      @remove="deleteMedia"
      :max="multiple ? 10 : 1"
      :multiple="multiple"
      list-type="image-card">
      Загрузить
    </n-upload>
    <ValidationMessage :validation-id="validationId" />
  </div>
</template>

<script setup lang="ts">
import { NUpload, useDialog } from 'naive-ui'
import ValidationMessage from '@/components/form/ValidationMessage.vue'
import { useEloquentStore } from '@/stores/eloquent.store'
const emit = defineEmits(['update:modelValue'])
const eloquentStore = useEloquentStore()
const dialog = useDialog()

defineProps({
  validationId: String,
  value: {},
  multiple: {
    type: Boolean,
    default: false
  }
})

const handleInput = (v: any) => {
  emit('update:modelValue', v)
}

const deleteMedia = async (v: any) => {
  if (v.file.status && v.file.status === 'pending') return
  return new Promise((resolve) => {
    dialog.error({
      title: 'Удаление',
      content: 'Вы уверены?',
      positiveText: 'Да',
      negativeText: 'Отмена',
      maskClosable: false,
      onPositiveClick: () => {
        eloquentStore.deleteMedia(v.file.id).then((res) => resolve(res))
      }
    })
  })
}
</script>
