<template>
  <div v-if="show">
    <n-card :bordered="false" class="bg-gray">
      <n-breadcrumb>
        <n-breadcrumb-item>
          <router-link to="/m/show">События</router-link>
        </n-breadcrumb-item>
        <n-breadcrumb-item> {{ show.title.ru }}</n-breadcrumb-item>
      </n-breadcrumb>
    </n-card>

    <EloquentTable ref="eloq" />
  </div>
</template>

<script setup lang="ts">
import {
  NButton,
  NCard,
  NIcon,
  NGrid,
  NGridItem,
  NSpace,
  NTooltip,
  NSkeleton,
  NBreadcrumb,
  NBreadcrumbItem,
  NH2
} from 'naive-ui'
import EloquentTable from '@/views/EloquentTable.vue'
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const eloquentStore = useEloquentStore()
const route = useRoute()
const { model, config, list, customConditions } = storeToRefs(eloquentStore)
const eloq: any = ref(null)
const show = ref(null)

model.value = 'timetable'
config.value = null
list.value = null
customConditions.value = {
  show_id: route.params.id
}
onMounted(async () => {
  const res = await eloquentStore.getModel(route.params.id, 'show')
  if (res) {
    show.value = res.data
    await nextTick()
    await eloq?.value?.loadData(true)
  }
})
</script>
