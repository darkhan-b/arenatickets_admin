<template>
  <n-layout has-sider>
    <LeftSidebar />
    <n-layout :style="{ height: '100vh' }" class="bg-gray">
      <slot></slot>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import '@/assets/scss/app.scss'
import LeftSidebar from '@/components/general/LeftSidebar.vue'
import { NLayout } from 'naive-ui'
</script>
