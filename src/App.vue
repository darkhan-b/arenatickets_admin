<template>
  <n-message-provider>
    <component :is="layout" v-if="loaded">
      <RouterView v-slot="{ Component }">
        <transition name="route" mode="out-in" appear>
          <component :is="Component" />
        </transition>
      </RouterView>
      <n-spin size="large" class="global-loader" v-if="loading"></n-spin>
    </component>
  </n-message-provider>
</template>

<script setup lang="ts">
import '@/assets/scss/app.scss'
import { RouterView, useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { NMessageProvider, NSpin } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useGeneralStore } from '@/stores/general.store'
import { storeToRefs } from 'pinia'

const route = useRoute()
const loaded = ref(false)
const generalStore = useGeneralStore()
const { loading, windowWidth } = storeToRefs(generalStore)

// @ts-ignore
window.$message = useMessage()

const layout = computed(() => {
  const metaLayout = route?.meta?.layout
  if (metaLayout) return `${metaLayout}-layout`
  return 'admin-layout'
})

onMounted(() => {
  loaded.value = true
  handleResize()
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}
</script>

<style scoped lang="scss">
.global-loader {
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -20px;
  margin-top: -20px;
  z-index: 4;
}
</style>
