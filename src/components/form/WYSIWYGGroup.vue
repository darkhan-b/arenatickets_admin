<template>
  <div>
    <QuillEditor ref="quill" theme="snow" @update:content="handleInput" />
    <ValidationMessage :validation-id="validationId" />
  </div>
</template>

<script setup lang="ts">
import ValidationMessage from '@/components/form/ValidationMessage.vue'
const emit = defineEmits(['update:modelValue'])
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { onMounted, ref } from 'vue'

const quill = ref(null)

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    default: 'text'
  },
  validationId: String,
  value: {}
})

onMounted(() => {
  if (props.value) quill.value.setHTML(props.value)
})

const handleInput = () => {
  emit('update:modelValue', quill.value.getHTML())
}
</script>
