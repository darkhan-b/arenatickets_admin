<template>
  <n-card title="Интро" :bordered="false" class="bg-gray" style="max-width: 800px">
    <n-skeleton v-if="loading" text :repeat="3"></n-skeleton>
    <n-space vertical :size="12">
      <n-input-group v-if="authStore.hasPermissions(['admin_clients'])">
        <n-input-group-label>Клиент</n-input-group-label>
        <select-group
          autocomplete-search-field="title"
          class="w-100"
          v-model="clientId"
          :clearable="true"
          :autocomplete="true"
          model="client"
          :multiple="false" />
      </n-input-group>
      <n-grid :x-gap="12" :y-gap="12" :cols="2">
        <n-grid-item v-for="(stat, sIndex) in stats" :key="`ind-${sIndex}`">
          <n-card class="h-100">
            <n-statistic :label="stat.title">
              {{ formatNumber(stat.value) }}
            </n-statistic>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NGrid,
  NGridItem,
  NSkeleton,
  NStatistic,
  NInputGroup,
  NSpace,
  NInputGroupLabel
} from 'naive-ui'
import SelectGroup from '@/components/form/SelectGroup.vue'
import $axios from '@/api/api.service'
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { formatNumber } from '@/services/helper.service'

const authStore = useAuthStore()
const stats = ref(null)
const loading = ref(true)
const clientId = ref(null)

onMounted(() => {
  load()
})

const load = () => {
  $axios.get(`admin/dashboard?clientId=${clientId.value || ''}`).then((res) => {
    stats.value = res.data.data
    loading.value = false
  })
}

watch(clientId, (v) => {
  if (v) load()
})
</script>
