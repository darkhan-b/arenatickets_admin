<template>
  <div v-if="errors[validationId]">
    <n-text type="error">
      {{ errors[validationId].join(', ') }}
    </n-text>
  </div>
</template>

<script setup lang="ts">
import { useGeneralStore } from '@/stores/general.store'
import { storeToRefs } from 'pinia'
import { NText } from 'naive-ui'

defineProps({
  validationId: String
})

const generalStore = useGeneralStore()
const { errors } = storeToRefs(generalStore)
</script>
