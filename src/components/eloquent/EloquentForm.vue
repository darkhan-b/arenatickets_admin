<template>
  <div>
    <n-form ref="eloquentForm" :model="selectedModel">
      <n-tabs type="line" animated>
        <n-tab-pane
          v-for="tab in tabs"
          :name="tab"
          :tab="$t(tab)"
          class="tab-pane"
          :key="`tab-${tab}`">
          <div v-if="config.tabcomponents && config.tabcomponents[tab]">
            <component :tab="tab" :is="config.tabcomponents[tab]"></component>
          </div>
          <n-grid x-gap="10" cols="12">
            <template v-for="field in fieldsForTab(tab)">
              <n-grid-item
                v-if="
                  field.form &&
                  (!field.permissions ||
                    authStore.hasPermissions(field.permissions))
                "
                :span="field.cols || 12"
                :key="`field-${field.id}`">
                <component
                  v-if="field.formFieldComponent"
                  :is="field.formFieldComponent"
                  :field="field"
                  :tab="tab" />
                <EloquentFormField v-else :field="field" :tab="tab" />
                <component
                  v-if="field.additionalFormFieldComponent"
                  :is="field.additionalFormFieldComponent"
                  :field="field"
                  :tab="tab" />
              </n-grid-item>
            </template>
          </n-grid>
        </n-tab-pane>
      </n-tabs>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'
import { NForm, NTabPane, NTabs, NGrid, NGridItem, useMessage } from 'naive-ui'
import { computed } from 'vue'
import EloquentFormField from '@/components/eloquent/EloquentFormField.vue'
import { useAuthStore } from '@/stores/auth.store'

const eloquentStore = useEloquentStore()
const authStore = useAuthStore()
const message = useMessage()
const { config, selectedModel } = storeToRefs(eloquentStore)

const tabs = computed(() =>
  config?.value?.tabs?.length ? config.value.tabs : ['general']
)

const saveModel = async () => {
  if (await eloquentStore.saveModel()) {
    eloquentStore.showForm = false
    message.info('Сохранено успешно', {
      closable: true,
      duration: 5000
    })
    eloquentStore.needsToReload = true
  }
}

function fieldsForTab(tab: string) {
  return Object.values(config?.value?.fields).filter(
    (field: any) =>
      (!field.tab && tab === 'general') || field.tab?.includes(tab)
  )
}

defineExpose({ saveModel })
</script>

<style scoped>
.tab-pane {
  padding: 12px;
  box-sizing: border-box;
}
</style>
