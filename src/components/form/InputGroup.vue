<template>
  <div>
    <n-input
      @input="handleInput"
      :type="type"
      :autosize="autosize"
      :value="value"
      :status="errors && errors[validationId] ? 'error' : ''"
      :placeholder="placeholder" />
    <ValidationMessage :validation-id="validationId" />
  </div>
</template>

<script setup lang="ts">
import { NInput } from 'naive-ui'
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
  type: {
    default: 'text'
  },
  autosize: {
    type: [Boolean, String],
    default: false
  },
  validationId: String,
  value: String
})

const handleInput = (v: string) => {
  emit('update:modelValue', v)
}
</script>
