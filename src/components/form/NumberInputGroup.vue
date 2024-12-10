<template>
  <div>
    <n-input-number
      @update:value="handleInput"
      :value="value"
      :status="errors && errors[validationId] ? 'error' : ''"
      :placeholder="placeholder" />
    <ValidationMessage :validation-id="validationId" />
  </div>
</template>

<script setup lang="ts">
import { NInputNumber } from 'naive-ui'
import { useGeneralStore } from '@/stores/general.store'
import { storeToRefs } from 'pinia'
import ValidationMessage from '@/components/form/ValidationMessage.vue'
const generalStore = useGeneralStore()
const { errors } = storeToRefs(generalStore)
const emit = defineEmits(['update:modelValue'])

defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  validationId: String,
  value: {}
})

const handleInput = (v: any) => {
  emit('update:modelValue', v)
}
</script>
