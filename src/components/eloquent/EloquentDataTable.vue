<template>
  <div class="table-wrap">
    <div>
      Записей:
      <transition>
        <span v-if="dataTablePagination.itemCount">{{
          formatNumber(dataTablePagination.itemCount)
        }}</span>
      </transition>
    </div>
    <table class="eloquent-table table table-striped admin-table mb-0 mt-10">
      <thead>
        <tr>
          <!--        <th v-if="config.checks"></th>-->
          <th
            v-for="field in dataTableColumns"
            :key="`th-${field.id}`"
            @click="sortClicked(field)"
            class="filter-column no-break"
            :class="{ sortable: field.tablesort, sorted: sort === field.id }"
            :data-ord="field.id">
            {{ field.name }}
            <n-icon
              v-if="sort === field.id"
              class="sort-icon"
              :class="{ reverted: order === 'asc' }"
              :component="ArrowDown"
              color="gray"
              size="tiny"></n-icon>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr class="search-sub">
          <!--                    <td v-if="config.checks">-->
          <!--                      <input type="checkbox" -->
          <!--                             v-model="checkedall" -->
          <!--                             @click="checkAll($event)"/>-->
          <!--                    </td>-->
          <td v-for="field in dataTableColumns" :key="`subth-${field.id}`">
            <n-select
              placeholder="-"
              v-if="field.table_show"
              label-field="title"
              value-field="id"
              v-model:value="q[field.id]"
              @update:value="searchChange"
              :options="field.table_show"
              clearable></n-select>
            <n-select
              v-else-if="field.table_filter_select"
              placeholder="-"
              :label-field="field.select_data?.title || 'title'"
              :render-label="
                (v) =>
                  `[${v.id}] ${
                    v.title?.ru || v[field.select_data?.title || 'title']
                  }`
              "
              value-field="id"
              v-model:value="q[field.id]"
              @update:value="searchChange"
              :options="
                field.select_data?.type === 'list'
                  ? field.select_data.data
                  : selectOptions
                  ? selectOptions[field.id]
                  : []
              "
              clearable>
            </n-select>
            <n-input
              v-else-if="field.tablesearch"
              v-model:value="q[field.id]"
              @update:value="searchChange"
              placeholder="Поиск"
              clearable />
          </td>
          <td></td>
        </tr>

        <tr
          v-for="(object, objectIndex) in data"
          :key="`tr-${objectIndex}`"
          @click="rowClicked(objectIndex)"
          :class="
            (config.trclass
              ? config.trclass + '-' + object[config.trclass]
              : '') +
            ' ' +
            (config.rowClickable ? 'tr-clickable' : '')
          ">
          <!--          <td v-if="config.checks">-->
          <!--            <input type="checkbox" @click="checkId(object.id,$event,ind)" :checked="checked.includes(object.id)" :data-ind="ind" :data-id="object.id" class="item-check"/>-->
          <!--          </td>-->
          <td
            v-for="(field, fieldIndex) in dataTableColumns"
            :key="`tr-${objectIndex}-td-${fieldIndex}`">
            <component
              v-if="field.tdComponent"
              :is="field.tdComponent"
              :object="object"
              :field="field" />
            <EloquentTDComponent v-else :object="object" :field="field" />
          </td>
          <td class="actions-td" @click.stop>
            <n-space class="no-break" :size="14" style="flex-wrap: nowrap">
              <component
                v-if="config.tdLinkComponent"
                :is="config.tdLinkComponent"
                :ref="
                  (el) => {
                    tdLinkComponent[objectIndex] = el
                  }
                "
                :object="object"></component>

              <n-tooltip
                v-if="
                  config.edit &&
                  authStore.hasPermissions(config.permissions?.edit || [])
                ">
                <template #trigger>
                  <n-button text @click.stop="editClicked(object)">
                    <n-icon :component="BuildOutline" size="medium"></n-icon>
                  </n-button>
                </template>
                Изменить
              </n-tooltip>

              <n-tooltip
                v-if="
                  config.duplicate &&
                  authStore.hasPermissions(config.permissions?.duplicate || [])
                ">
                <template #trigger>
                  <n-button text @click.stop="duplicateClicked(object)">
                    <n-icon :component="CopyOutline" size="small"></n-icon>
                  </n-button>
                </template>
                <span>Копировать</span>
              </n-tooltip>

              <n-tooltip
                v-if="
                  config.delete &&
                  authStore.hasPermissions(config.permissions?.delete || [])
                ">
                <template #trigger>
                  <n-button
                    type="error"
                    text
                    @click.stop="deleteClicked(object)">
                    <n-icon :component="TrashBinOutline" size="medium"></n-icon>
                  </n-button>
                </template>
                Удалить
              </n-tooltip>
            </n-space>
          </td>
        </tr>
      </tbody>
    </table>

    <n-pagination
      v-if="dataTablePagination.pageCount > 1"
      class="mt-30"
      :page="page"
      @update:page="pageUpdate"
      :page-count="dataTablePagination.pageCount" />
  </div>
</template>

<script setup lang="ts">
import { useEloquentStore } from '@/stores/eloquent.store'
import { useAuthStore } from '@/stores/auth.store'
import { storeToRefs } from 'pinia'
import {
  NButton,
  NIcon,
  NInput,
  NPagination,
  NSelect,
  NSpace,
  NTooltip,
  useDialog
} from 'naive-ui'
import {
  ArrowDown,
  CopyOutline,
  BuildOutline,
  TrashBinOutline
} from '@vicons/ionicons5'
import { ref } from 'vue'
import EloquentTDComponent from '@/components/eloquent/EloquentTDComponent.vue'
import { formatNumber } from '@/services/helper.service'

const authStore = useAuthStore()
const eloquentStore = useEloquentStore()
const { config, dataTableColumns, dataTablePagination, selectOptions } =
  storeToRefs(eloquentStore)
const dialog = useDialog()
const emit = defineEmits(['sort', 'search', 'page'])
defineProps({
  sort: String,
  order: String,
  page: Number,
  data: Array
})

const q = ref({})
const tdLinkComponent = ref([])
let timer: any = null

const editClicked = (row: any) => {
  eloquentStore.editModelPrepare(row.id)
}

const deleteClicked = (row: any) => {
  dialog.error({
    title: 'Удаление',
    content: 'Вы уверены?',
    positiveText: 'Да',
    negativeText: 'Отмена',
    maskClosable: false,
    onPositiveClick: async () => {
      if (await eloquentStore.deleteModel(row.id))
        eloquentStore.needsToReload = true
    }
  })
}

const duplicateClicked = async (row: any) => {
  await eloquentStore.cloneModel(row.id)
  eloquentStore.needsToReload = true
}

const sortClicked = (field: any) => {
  if (field.tablesort) {
    emit('sort', field)
  }
}
const pageUpdate = (v: number) => {
  emit('page', v)
}
const searchChange = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    emit('search', q.value)
  }, 250)
}

const rowClicked = (index) => {
  if (!config.value.rowClickable) return
  tdLinkComponent.value[index].rowClicked()
}
</script>
