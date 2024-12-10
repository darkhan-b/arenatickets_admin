<template>
  <div>
    <transition>
      <n-card
        v-if="config"
        :title="config.title"
        :bordered="false"
        class="bg-gray">
        <component
          v-if="config.tabHeaderComponent"
          :is="config.tabHeaderComponent" />

        <template #header-extra>
          <n-button v-if="config.add" type="primary" @click="addModel">
            <n-icon class="me-10" :component="AddSharp"></n-icon>
            <span>Добавить</span>
          </n-button>
          <component
            v-if="config.tabHeaderRightComponent"
            :is="config.tabHeaderRightComponent" />
        </template>

        <EloquentDataTable
          class="mt-10"
          :sort="sort"
          :order="order"
          :page="page"
          @sort="startSorting"
          @search="startSearching"
          @page="handlePageChange"
          :data="list?.data || []" />
      </n-card>
    </transition>
    <EloquentDrawer />
  </div>
</template>

<script setup lang="ts">
import { NButton, NCard, NIcon, NTabPane, NTabs } from 'naive-ui'
import { AddSharp } from '@vicons/ionicons5'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'
import EloquentDrawer from '@/components/eloquent/EloquentDrawer.vue'
import EloquentDataTable from '@/components/eloquent/EloquentDataTable.vue'
import { removeNullsFromObject } from '@/services/helper.service'
const route = useRoute()
const eloquentStore = useEloquentStore()
const { model, config, list, customConditions } = storeToRefs(eloquentStore)
const loading = ref(true)
const page = ref(1)
const sort = ref('')
const order = ref('')
const q = ref('')
const search = ref({})

const loadData = async (
  initial: boolean = false,
  refreshPage: boolean = true
) => {
  loading.value = true
  if (initial) {
    page.value = 1
    sort.value = ''
    order.value = ''
    q.value = ''
    if (refreshPage) search.value = {}
  }
  try {
    if (initial) {
      if (refreshPage) config.value = null
      await eloquentStore.loadConfig()
      sort.value = config.value.initial_order[0]
      order.value = config.value.initial_order[1]
    }
    let searchString = new URLSearchParams(
      removeNullsFromObject({ ...search.value, ...customConditions.value })
    ).toString()
    if (q.value) searchString += `&q=${q.value}`
    await eloquentStore.loadDataTable({
      page: page.value,
      sort: sort.value,
      order: order.value,
      search: searchString
    })
  } finally {
    loading.value = false
  }
}

const addModel = async () => {
  await eloquentStore.createModelPrepare()
}

const handlePageChange = async (v: number) => {
  page.value = v
  await loadData()
}

const startSorting = (field: any) => {
  order.value =
    field.id !== sort.value ? 'asc' : order.value === 'desc' ? 'asc' : 'desc'
  sort.value = field.id
  loadData()
}

const startSearching = (v: any) => {
  search.value = v
  page.value = 1
  loadData()
}

watch(
  () => route.params.model,
  async (val) => {
    if (!val) return
    model.value = val.toString()
    customConditions.value = {}
    await loadData(true)
  },
  {
    immediate: true
  }
)

watch(
  () => eloquentStore.needsToReload,
  async (val) => {
    if (val) {
      await loadData()
      eloquentStore.needsToReload = false
    }
  }
)

watch(
  () => eloquentStore.needsToFullReload,
  async (val) => {
    if (val) {
      await loadData(true, false)
      eloquentStore.needsToFullReload = false
    }
  }
)

defineExpose({ loadData })
</script>
