<template>
  <span v-if="field.attributes">
    <div
      v-for="(a, aind) in field.attributes"
      :key="`aind-${aind}`"
      v-html="attributeValue(a)"></div>
  </span>
  <span v-else-if="value?.tdclass || value?.title" :class="value.tdclass">{{
    value.title
  }}</span>
  <span v-else-if="field.format_number">{{ formatNumber(value) }}</span>
  <span v-else-if="field.format_date">{{ formatDate(value) }}</span>
  <span v-else-if="field.format_datetime">{{ formatDateTime(value) }}</span>
  <span v-else-if="field.table_image">
    <n-image
      width="75"
      class="admin-table-img"
      v-if="value"
      :src="value"
      fallback-src="/images/nophoto.jpeg"
      alt="" />
  </span>
  <span v-else-if="field.languages">{{ value.ru || '-' }}</span>
  <span v-else v-html="value"></span>
</template>

<script setup lang="ts">
import {
  formatNumber,
  formatDate,
  formatDateTime
} from '@/services/helper.service'
import { computed } from 'vue'
import { NImage } from 'naive-ui'
const props = defineProps({
  field: {
    required: true,
    type: Object
  },
  object: {
    required: true,
    type: Object
  }
})

const value = computed(() => {
  let assumedValue = props.object[props.field.id]
  if (props.field.table_show) {
    if (assumedValue === 1 || assumedValue === true) assumedValue = 'true'
    if (assumedValue === 0 || assumedValue === false) assumedValue = 'false'
    return props.field.table_show.find((x: any) => x.id === assumedValue)
  }
  if (props.field.table_field)
    assumedValue = props.object[props.field.table_field]
  return assumedValue || ''
})

const attributeValue = (attribute: any) => {
  let obj = props.object[attribute.id]
  if (!obj) return ''
  if (!Array.isArray(obj)) obj = [obj]
  let str = ``
  obj.forEach((o: any, ind: number) => {
    if (ind > 0) str += '<br/>'
    if (!attribute.skipId) str += `[${o.id}] `
    if (attribute.fn) {
      const tmpFunc = eval(`(${attribute.fn})`)
      str += tmpFunc(o)
      return
    }
    if (o[attribute.value]) {
      str += attribute.translate ? o[attribute.value]['ru'] : o[attribute.value]
    }
  })

  return str
}
</script>
