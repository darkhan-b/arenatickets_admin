<template>
  <n-form-item
    :label="field.name"
    :class="{ 'mb-15': !!field.formnote }"
    :required="
      field.validation?.includes('required') && !['kz', 'en'].includes(tab)
    "
    :feedback="field.formnote"
    :show-label="!['checkbox'].includes(field.type)">
    <InputGroup
      class="w-100"
      v-if="
        ['text', 'password', 'textarea'].includes(field.type) &&
        field.languages &&
        field.languages.includes(tab)
      "
      :type="field.type"
      :placeholder="field.name"
      :validationId="field.id"
      :value="selectedModel[field.id][tab]"
      v-model="selectedModel[field.id][tab]" />
    <InputGroup
      class="w-100"
      v-else-if="['text', 'password', 'textarea'].includes(field.type)"
      :type="field.type"
      :autosize="field.autosize"
      :placeholder="field.name"
      :validationId="field.id"
      :value="selectedModel[field.id]"
      v-model="selectedModel[field.id]" />
    <DateGroup
      class="w-100"
      v-else-if="['date', 'datetime'].includes(field.type)"
      :type="field.type"
      :placeholder="field.name"
      :validationId="field.id"
      :value="selectedModel[field.id]"
      v-model="selectedModel[field.id]" />
    <WYSIWYGGroup
      v-else-if="['richtext'].includes(field.type)"
      class="w-100"
      :value="selectedModel[field.id][tab]"
      v-model="selectedModel[field.id][tab]"
      :validationId="field.id" />
    <NumberInputGroup
      class="w-100"
      v-else-if="['number'].includes(field.type)"
      :placeholder="field.name"
      :validationId="field.id"
      :value="selectedModel[field.id]"
      v-model="selectedModel[field.id]" />
    <CheckboxGroup
      class="w-100"
      v-else-if="['checkbox'].includes(field.type)"
      :label="field.name"
      :value="selectedModel[field.id]"
      :validationId="field.id"
      v-model="selectedModel[field.id]" />
    <SelectGroup
      class="w-100"
      v-else-if="['select'].includes(field.type)"
      :label-field="field.select_data.title"
      :multiple="field.multiple || false"
      :language="field.select_data.language || ''"
      :autocomplete="field.autocomplete"
      :clearable="!!field.clearable"
      :model="field.select_data?.autocomplete_model || ''"
      :value="selectedModel[field.id]"
      :validationId="field.id"
      v-model="selectedModel[field.id]"
      :options="
        field.select_data?.type === 'list'
          ? field.select_data.data
          : selectOptions[field.id] || []
      " />
    <FileGroup
      class="w-100"
      v-else-if="['file'].includes(field.type)"
      v-model="selectedModel[field.id]"
      :validationId="field.id"
      :multiple="field.multiple || false"
      :value="
        selectedMedia.filter((v) => v.collection_name === field.collection)
      " />
  </n-form-item>
</template>

<script setup lang="ts">
import InputGroup from '@/components/form/InputGroup.vue'
import { NFormItem } from 'naive-ui'
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'
import NumberInputGroup from '@/components/form/NumberInputGroup.vue'
import CheckboxGroup from '@/components/form/CheckboxGroup.vue'
import SelectGroup from '@/components/form/SelectGroup.vue'
import FileGroup from '@/components/form/FileGroup.vue'
import WYSIWYGGroup from '@/components/form/WYSIWYGGroup.vue'
import DateGroup from '@/components/form/DateGroup.vue'

const eloquentStore = useEloquentStore()
const { selectedModel, selectOptions, selectedMedia } =
  storeToRefs(eloquentStore)

defineProps({
  field: Object,
  tab: String
})
</script>
