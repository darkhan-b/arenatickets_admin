<template>
  <n-card title="Турникеты" :bordered="false" class="bg-gray">
    <n-tabs type="line" animated @update:value="handleUpdateValue">
      <n-tab-pane name="Логи">
        <div v-if="timetable_id">
          <n-card v-if="summary" style="max-width: 450px">
            <h3 v-if="summary.timetable">
              {{ summary.timetable.show.title.ru }} -
              {{ summary.timetable.datePlaceString }}
            </h3>
            <n-row gutter="30">
              <n-col :span="12">
                <n-statistic :label="'Продано'">
                  {{ formatNumber(summary.sold) }}
                </n-statistic>
              </n-col>
              <n-col :span="12">
                <n-statistic :label="'Прошло'">
                  {{ formatNumber(summary.passed) }}
                </n-statistic>
              </n-col>
            </n-row>
          </n-card>
          <EloquentTable
            class="no-pad"
            v-if="loaded && timetable_id"
            ref="eloquentTable" />
        </div>
        <div class="mt-15" v-if="!timetable_id">Сеанс не выбран</div>
      </n-tab-pane>
      <n-tab-pane name="Настройки">
        <div style="max-width: 600px">
          <n-space vertical :size="10">
            <div v-for="(d, dind) in tourniquet_data" :key="`id-${d.id}`">
              <div
                class="mt-15 mb-15"
                v-if="dind === 0 || d.note != tourniquet_data[dind - 1].note">
                <h3>{{ d.note }}</h3>
              </div>
              <div class="mt-15">
                <b>{{ d.id }}:</b>
              </div>
              <div class="mt-5">
                <n-space align="center">
                  <div>Сектора:</div>
                  <n-dynamic-tags
                    :disabled="d.opened_for_all"
                    v-model:value="d.allowed_sectors" />
                  <n-checkbox v-model:checked="d.opened_for_all"
                    >Открыт для всех</n-checkbox
                  >
                </n-space>
              </div>
              <div class="mt-10">
                <n-input
                  placeholder="Текст ошибки, если сектор не подходит"
                  v-model:value="d.error_message" />
              </div>
            </div>
          </n-space>
          <div class="mt-15">
            <n-button type="primary" class="mt-15" @click="save"
              >Сохранить</n-button
            >
          </div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Сеанс">
        <div style="max-width: 600px" class="mt-15">
          <n-input-group v-if="loaded">
            <n-input-group-label
              >Сеанс, открытый для турникетов</n-input-group-label
            >
            <select-group
              class="w-100"
              :value="timetable_id"
              v-model="timetable_id"
              autocomplete-search-field="date"
              :autocomplete="true"
              model="timetable"
              :clearable="true"
              :multiple="false" />
          </n-input-group>
          <div class="mt-15">
            <n-button type="primary" class="mt-15" @click="save"
              >Сохранить</n-button
            >
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NInputGroup,
  NInputGroupLabel,
  NButton,
  NInput,
  NSpace,
  NDynamicTags,
  NTabs,
  NTabPane,
  NCheckbox,
  NStatistic,
  NRow,
  NCol,
  useDialog
} from 'naive-ui'
import { onMounted, ref } from 'vue'
import $axios from '@/api/api.service'
import SelectGroup from '@/components/form/SelectGroup.vue'
import EloquentTable from '@/views/EloquentTable.vue'
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'
import { formatNumber } from '@/services/helper.service'

const eloquentStore = useEloquentStore()
const dialog = useDialog()

const { model, customConditions } = storeToRefs(eloquentStore)

const timetable_id = ref(null)
const tourniquet_data = ref([])
const summary = ref(null)
const loaded = ref(false)
const eloquentTable = ref(null)

onMounted(async () => {
  await fetchData()
  await fullLogsRequest()
})

const fetchData = async () => {
  const res = await $axios.get(`admin/tourniquet/get`)
  tourniquet_data.value = res.data.tourniquets
  timetable_id.value = res.data.timetable_id
  loaded.value = true
}

const save = async () => {
  const res = await $axios.post(`admin/tourniquet/sync`, {
    timetable_id: timetable_id.value,
    tourniquets: tourniquet_data.value
  })
  tourniquet_data.value = res.data.tourniquets
  timetable_id.value = res.data.timetable_id
  dialog.info({
    title: 'Сохранено успешно'
  })
}

const loadLogs = async () => {
  const res = await $axios.get(`admin/tourniquet/logs`)
  summary.value = res.data.summary
}

const loadEloquentTable = () => {
  model.value = 'tourniquet_pass'
  customConditions.value = {
    timetable_id: timetable_id.value
  }
  setTimeout(() => {
    eloquentTable?.value?.loadData(true)
  }, 100)
}

const fullLogsRequest = async () => {
  loadEloquentTable()
  await loadLogs()
}

const handleUpdateValue = async (value) => {
  if (value == 'Логи') {
    await fullLogsRequest()
  }
}
</script>
