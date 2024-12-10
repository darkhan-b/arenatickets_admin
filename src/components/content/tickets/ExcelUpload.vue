<template>
  <n-upload
    @update:fileList="handleInput"
    :max="1"
    :multiple="false"
    accept=".xlsx"
    class="no-list"
    :file-list="fileList">
    <n-popover trigger="hover">
      <template #trigger>
        <n-button
        ><n-icon
            :component="CloudUploadOutline"
            :class="{ 'me-10': showLabel && !generalStore.isMobile }"></n-icon
          >{{
            showLabel && !generalStore.isMobile ? 'Загрузить из excel' : ''
          }}</n-button
        >
      </template>
      <div class="text-center">
        Файл должен быть формата .xlsx, только с одним листом.<br />
        Первая строка должна содержать следующие названия столбцов:<br />
        "Ряд", "Место", "Цена" и "Штрихкод". (названия должны совпадать один в
        один)<br />
        <div v-if="section">
          Загрузка билетов происходит в выбранный сектор.<br />
          Для входных билетов без места столбцы "Ряд" и "Место" надо оставить
          пустыми.<br />
        </div>
        <div v-if="pricegroupTitle">
          Для ценовых групп нужно добавить новую группу, заполнить название и<br />
          цену, и импортировать файл, где только заполнена колонка
          "Штрихкод".<br />
        </div>
        <a
          class="text-primary"
          href="/files/TicketsImportExample.xlsx"
          target="_blank"
          >Пример файла</a
        >
      </div>
    </n-popover>
  </n-upload>
</template>

<script setup lang="ts">
import { NUpload, NButton, NIcon, NPopover } from 'naive-ui'
import { ref } from 'vue'
import $axios from '@/api/api.service'
import { useTicketsStore } from '@/stores/tickets.store'
import { storeToRefs } from 'pinia'
import { useSchemeStore } from '@/stores/scheme.store'
import { CloudUploadOutline } from '@vicons/ionicons5'
import { useGeneralStore } from '@/stores/general.store'

const ticketsStore = useTicketsStore()
const schemeStore = useSchemeStore()
const generalStore = useGeneralStore()

const { timetable } = storeToRefs(ticketsStore)
const { section } = storeToRefs(schemeStore)

const fileList = ref([])

const props = defineProps({
  showLabel: {
    type: Boolean,
    default: true
  },
  pricegroupTitle: {
    type: String,
    default: ''
  },
  pricegroupPrice: {
    type: [Number, String],
    default: null
  }
})

const handleInput = async (files: any) => {
  const formData = new FormData()
  formData.append('file', files[0].file)
  if (section.value) formData.append('sectionId', section.value.id)
  if (props.pricegroupTitle)
    formData.append('pricegroupTitle', props.pricegroupTitle)
  if (props.pricegroupPrice)
    formData.append('pricegroupPrice', props.pricegroupPrice.toString())
  const res = await $axios.post(
    `/admin/timetable/${timetable.value.id}/tickets/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  fileList.value = []
  if (section.value) {
    await ticketsStore.loadSection(section.value.id)
  }
  if (props.pricegroupTitle) {
    location.reload()
  }
}
</script>
