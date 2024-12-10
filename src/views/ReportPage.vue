<template>
  <n-card title="Сформировать отчет" :bordered="false" class="bg-gray">
    <div style="max-width: 600px">
      <n-space vertical :size="20" class="mt-15">
        <n-grid cols="2" :x-gap="10">
          <n-grid-item>
            <n-input-group>
              <n-input-group-label>Дата от</n-input-group-label>
              <n-date-picker
                class="w-100"
                placeholder=""
                v-model:value="date_from" />
            </n-input-group>
          </n-grid-item>
          <n-grid-item>
            <n-input-group>
              <n-input-group-label>Дата до</n-input-group-label>
              <n-date-picker
                class="w-100"
                placeholder=""
                v-model:value="date_to" />
            </n-input-group>
          </n-grid-item>
        </n-grid>
        <n-input-group>
          <n-input-group-label>События</n-input-group-label>
          <select-group
            class="w-100"
            v-model="show_ids"
            :autocomplete="true"
            model="show"
            :multiple="true" />
        </n-input-group>
        <n-input-group>
          <n-input-group-label>Сеансы</n-input-group-label>
          <select-group
            class="w-100"
            v-model="timetable_ids"
            autocomplete-search-field="date"
            :autocomplete="true"
            model="timetable"
            :multiple="true" />
        </n-input-group>
        <n-input-group v-if="report_type !== 'unsold'">
          <n-input-group-label>Площадки</n-input-group-label>
          <select-group
            class="w-100"
            v-model="venue_ids"
            :autocomplete="true"
            model="venue"
            :multiple="true" />
        </n-input-group>
        <n-input-group v-if="report_type !== 'unsold'">
          <n-input-group-label>Категории</n-input-group-label>
          <select-group
            class="w-100"
            v-model="category_ids"
            :autocomplete="true"
            model="category"
            :multiple="true" />
        </n-input-group>
        <n-input-group v-if="report_type !== 'unsold'">
          <n-input-group-label>Организаторы</n-input-group-label>
          <select-group
            autocomplete-search-field="name"
            class="w-100"
            v-model="organizer_ids"
            :autocomplete="true"
            model="organizer"
            :multiple="true" />
        </n-input-group>

        <n-input-group v-if="authStore.hasPermissions(['admin_clients'])">
          <n-input-group-label>Клиенты</n-input-group-label>
          <select-group
            autocomplete-search-field="title"
            class="w-100"
            v-model="client_ids"
            :autocomplete="true"
            model="client"
            :multiple="true" />
        </n-input-group>

        <n-radio-group v-model:value="report_type" class="w-100">
          <n-radio-button value="sales">Продажи</n-radio-button>
          <n-radio-button value="refunds">Возвраты</n-radio-button>
          <n-radio-button value="unsold">Непроданные</n-radio-button>
        </n-radio-group>

        <n-button type="primary" class="mt-15" @click="submit"
          >Сформировать</n-button
        >
      </n-space>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {
  NButton,
  NCard,
  NDatePicker,
  NGrid,
  NGridItem,
  NInputGroup,
  NInputGroupLabel,
  NRadioButton,
  NRadioGroup,
  NSpace,
  useDialog
} from 'naive-ui'
import { ref } from 'vue'
import $axios from '@/api/api.service'
import SelectGroup from '@/components/form/SelectGroup.vue'
import { useAuthStore } from '@/stores/auth.store'
import moment from 'moment'

const dialog = useDialog()
const authStore = useAuthStore()

const date_from = ref(null)
const date_to = ref(null)
const show_ids = ref([])
const timetable_ids = ref([])
const venue_ids = ref([])
const category_ids = ref([])
const organizer_ids = ref([])
const client_ids = ref([])
const report_type = ref('sales')

const submit = async () => {
  const res = await $axios.post(`admin/report/sales/excel`, {
    report_type: report_type.value,
    date_from: date_from.value
      ? moment(date_from.value).format('YYYY-MM-DD')
      : null,
    date_to: date_to.value ? moment(date_to.value).format('YYYY-MM-DD') : null,
    venue_ids: venue_ids.value,
    show_ids: show_ids.value,
    timetable_ids: timetable_ids.value,
    category_ids: category_ids.value,
    organizer_ids: organizer_ids.value,
    client_ids: client_ids.value
  })
  if (res.data) {
    location.href = res.data
  } else {
    dialog.warning({
      title: 'Пустой результат',
      content: 'Не найдено записей по запросу'
    })
  }
}
</script>
