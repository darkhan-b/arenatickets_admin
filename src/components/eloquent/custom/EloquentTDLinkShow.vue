<template>
  <n-space :size="14" :wrap="false">
    <n-tooltip>
      <template #trigger>
        <n-switch
          size="small"
          v-model:value="object.active"
          @update:value="handleStatusChange" />
      </template>
      {{ object.active ? 'Снять с публикации' : 'Опубликовать' }}
    </n-tooltip>
    <n-tooltip>
      <template #trigger>
        <n-button text @click="showTimetables">
          <n-icon :component="CalendarOutline" size="medium"></n-icon>
        </n-button>
      </template>
      Сеансы
    </n-tooltip>
  </n-space>
</template>

<script setup lang="ts">
import { NSwitch, NTooltip, NIcon, NButton, NSpace } from 'naive-ui'
import { CalendarOutline } from '@vicons/ionicons5'
import $axios from '@/api/api.service'
import { useRouter } from 'vue-router'

const props = defineProps({
  object: {
    required: true,
    type: Object
  }
})

const router = useRouter()

const handleStatusChange = (val: boolean) => {
  $axios.post(`/admin/eloquent/show/${props.object?.id}`, {
    active: val,
    _method: 'patch'
  })
}

const showTimetables = () => {
  router.push({ name: 'show', params: { id: props.object.id } })
}

const rowClicked = () => {
  showTimetables()
}

defineExpose({ rowClicked })
</script>
