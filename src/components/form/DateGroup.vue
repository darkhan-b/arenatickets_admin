<template>
  <div>
    <n-date-picker
      :type="type"
      v-model:formatted-value="model"
      clearable
      value-format="yyyy-MM-dd HH:mm:ss"
      default-time="19:00:00"
      :status="errors && errors[validationId] ? 'error' : ''"
      :placeholder="placeholder" />
    <ValidationMessage :validation-id="validationId" />
  </div>
</template>

<script setup lang="ts">
import { NDatePicker } from 'naive-ui'
import { useGeneralStore } from '@/stores/general.store'
import { storeToRefs } from 'pinia'
import ValidationMessage from '@/components/form/ValidationMessage.vue'
import { onMounted, ref, watch } from 'vue'
const generalStore = useGeneralStore()
const { errors } = storeToRefs(generalStore)
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    default: 'date'
  },
  validationId: String,
  value: String
})

const model: any = ref(null)

onMounted(() => {
  model.value = props.value
})

watch(model, (v) => {
  if (v !== undefined) {
    emit('update:modelValue', v)
  }
})
</script>
