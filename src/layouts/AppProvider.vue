<template>
  <n-config-provider
    :theme-overrides="themeOverrides"
    :locale="ruRU"
    :date-locale="dateRuRU">
    <n-message-provider placement="bottom-right">
      <n-dialog-provider>
        <App />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import App from '@/App.vue'
import themeOverrides from '@/assets/themeOverrides'
import {
  NMessageProvider,
  NDialogProvider,
  NConfigProvider,
  ruRU,
  dateRuRU
} from 'naive-ui'
</script>
