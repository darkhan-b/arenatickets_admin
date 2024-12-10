<template>
  <n-space :wrap="false" :size="14">
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
        <n-button text @click="toWidgetPage">
          <n-icon :component="LinkOutline" size="large"></n-icon>
        </n-button>
      </template>
      Страница виджета
    </n-tooltip>
    <n-tooltip>
      <template #trigger>
        <n-button text @click="showStatistics">
          <n-icon :component="BarcodeOutline" size="large"></n-icon>
        </n-button>
      </template>
      Статистика
    </n-tooltip>
    <n-tooltip>
      <template #trigger>
        <n-button text @click="showSetPrices">
          <n-icon :component="TicketOutline" size="large"></n-icon>
        </n-button>
      </template>
      Проставить цены
    </n-tooltip>
  </n-space>

  <n-modal
    v-model:show="showModal"
    closable
    preset="card"
    size="medium"
    :style="{ width: '800px' }"
    :title="` ${details?.show?.title?.ru} ${details?.dateString}`">
    <n-grid :x-gap="12" :y-gap="12" cols="3">
      <n-grid-item v-for="field in fields" :key="`ind-${field.id}`">
        <n-card>
          <n-statistic :label="field.label">
            {{ details[field.id] }}
          </n-statistic>
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NSwitch,
  NTooltip,
  NIcon,
  NButton,
  NSpace,
  NModal,
  NGrid,
  NGridItem,
  NCard,
  NStatistic
} from 'naive-ui'
import { BarcodeOutline, LinkOutline, TicketOutline } from '@vicons/ionicons5'
import $axios from '@/api/api.service'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useEloquentStore } from '@/stores/eloquent.store'

const authStore = useAuthStore()
const eloquentStore = useEloquentStore()
const { client } = storeToRefs(authStore)

const props = defineProps({
  object: {
    required: true,
    type: Object
  }
})

const router = useRouter()
const showModal = ref(false)
const details = ref(null)
const fields = [
  { id: 'totalTickets', label: 'Итого билетов' },
  { id: 'soldTickets', label: 'Продано билетов' },
  { id: 'availableTickets', label: 'Билетов в продаже' },
  { id: 'returnedTickets', label: 'Возвращено билетов' },
  { id: 'revenue', label: 'Выручка' },
  { id: 'ticketsScanned', label: 'Билетов просканировано' }
]

const handleStatusChange = (val: boolean) => {
  $axios.post(`/admin/eloquent/timetable/${props.object?.id}`, {
    active: val,
    _method: 'patch'
  })
}

const showSetPrices = () => {
  router.push({
    name: 'setPrices',
    params: {
      id: props.object.show_id,
      tid: props.object.id
    }
  })
}

const showStatistics = async () => {
  try {
    const res = await eloquentStore.getModel(props.object.id, 'timetable')
    details.value = res?.data
    showModal.value = true
  } catch (e) {
    console.log(e)
  }
  showModal.value = true
}

const rowClicked = () => {
  showSetPrices()
}

const toWidgetPage = () => {
  window.open(
    `${import.meta.env.VITE_WIDGET_URL}/${client.value.id}/t/${
      props.object.show_id
    }/${props.object.uuid}`,
    '_blank'
  )
}

defineExpose({ rowClicked })
</script>
