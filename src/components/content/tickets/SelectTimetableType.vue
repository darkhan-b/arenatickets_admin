<template>
  <div>
    <n-h4>Тип билетов на сеанс</n-h4>
    <n-grid cols="2 600:3" :x-gap="10">
      <n-grid-item>
        <n-radio-group
          class="pointer h-100"
          v-model:value="timetableType"
          value="sections"
          @click="timetableType = 'sections'">
          <n-card class="h-100">
            <n-radio value="sections">По секторам</n-radio>
            <div class="mt-10">
              <n-text :depth="3">
                Пользователь видит схему площадки, выбирает сектор, внутри
                которого либо кол-во входных мест, либо конкретные сиденья
              </n-text>
            </div>
          </n-card>
        </n-radio-group>
      </n-grid-item>
      <n-grid-item>
        <n-radio-group
          class="pointer h-100"
          v-model:value="timetableType"
          value="pricegroups"
          @click="timetableType = 'pricegroups'">
          <n-card class="h-100">
            <n-radio value="pricegroups">По ценовым группам</n-radio>
            <div class="mt-10">
              <n-text :depth="3">
                Пользователь не видит площадки, а выбирает билеты из ценовой
                группы
              </n-text>
            </div>
          </n-card>
        </n-radio-group>
      </n-grid-item>
    </n-grid>
    <n-button
      class="mt-15"
      type="primary"
      @click="saveType"
      v-if="timetableType"
      :loading="loading">
      {{ $t('save') }}
    </n-button>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets.store'
import { storeToRefs } from 'pinia'
import {
  NButton,
  NCard,
  NGrid,
  NGridItem,
  NH4,
  NRadio,
  NRadioGroup,
  NText
} from 'naive-ui'
import { ref } from 'vue'
import $axios from '@/api/api.service'

const route = useRoute()
const ticketsStore = useTicketsStore()
const { timetable, selectedType } = storeToRefs(ticketsStore)

const timetableType = ref(null)
const loading = ref(false)

const saveType = async () => {
  loading.value = true
  try {
    await $axios.post(`/admin/timetable/${route.params.tid}/type`, {
      type: timetableType.value
    })
    timetable.value.type = timetableType.value
    selectedType.value = true
  } finally {
    loading.value = false
  }
}
</script>
