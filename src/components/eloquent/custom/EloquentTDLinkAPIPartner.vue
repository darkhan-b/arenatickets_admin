<template>
  <n-tooltip>
    <template #trigger>
      <n-button text @click.stop="showAccess">
        <n-icon :component="KeyOutline" size="medium"></n-icon>
      </n-button>
    </template>
    Доступы
  </n-tooltip>

  <n-modal
    v-model:show="showModal"
    closable
    preset="card"
    size="medium"
    :style="{ width: '600px' }"
    title="Доступы партнера">
    <n-space vertical :size="10">
      <div>Токен:</div>
      <n-tag type="info">{{ details.token }}</n-tag>
      <div>Публичный ключ:</div>
      <n-button @click="copyPublicKey">Скачать</n-button>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { NButton, NIcon, NModal, NTooltip, NTag, NSpace } from 'naive-ui'
import { KeyOutline } from '@vicons/ionicons5'
import { ref } from 'vue'
import { useEloquentStore } from '@/stores/eloquent.store'

const props = defineProps({
  object: {
    required: true,
    type: Object
  }
})

const eloquentStore = useEloquentStore()
const showModal = ref(false)
const details = ref(null)

const showAccess = async () => {
  try {
    const res = await eloquentStore.getModel(props.object.id, 'api_partner')
    details.value = res?.data
    showModal.value = true
  } catch (e) {
    console.log(e)
  }
}

const copyPublicKey = () => {
  if (!details.value) return
  var element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + (details.value.public_key || '')
  )
  element.setAttribute('download', 'public.pem')
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const rowClicked = () => {
  showAccess()
}

defineExpose({ rowClicked })
</script>
