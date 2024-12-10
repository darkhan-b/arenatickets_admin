<template>
  <div>
    <n-checkbox
      @update:checked="handleInput"
      :checked="value === 1 || value === true"
      :label="label"
      :status="errors && errors[validationId] ? 'error' : ''" />
    <ValidationMessage :validation-id="validationId" />
  </div>
</template>

<script setup lang="ts">
import { NCheckbox } from 'naive-ui'
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
  label: String,
  value: {}
})

const handleInput = (v: any) => {
  emit('update:modelValue', v)
}
</script>
