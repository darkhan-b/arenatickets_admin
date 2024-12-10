<template>
  <div>
    <n-select
      :multiple="multiple"
      filterable
      :render-label="renderLabel"
      value-field="id"
      :placeholder="placeholder"
      :options="autocomplete ? remoteOptions : options"
      @update:value="handleInput"
      :filter="filter"
      @focus="handleBlur"
      @search="handleSearch"
      :remote="autocomplete"
      :value="value"
      :clearable="clearable"
      :status="errors && errors[validationId] ? 'error' : ''" />
    <ValidationMessage :validation-id="validationId" />
  </div>
</template>

<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { useGeneralStore } from '@/stores/general.store'
import { storeToRefs } from 'pinia'
import ValidationMessage from '@/components/form/ValidationMessage.vue'
import { computed, onMounted, ref } from 'vue'
import { copyObject } from '@/services/helper.service'
import { useEloquentStore } from '@/stores/eloquent.store'

const generalStore = useGeneralStore()
const { autocompleteSearch } = useEloquentStore()
const { errors } = storeToRefs(generalStore)
const emit = defineEmits(['update:modelValue'])
const remoteOptions = ref([])

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Выбор'
  },
  validationId: String,
  value: [String, Number, Array],
  multiple: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: Boolean,
    default: false
  },
  autocompleteSearchField: {
    type: String,
    default: 'title'
  },
  options: {
    type: Array
  },
  language: {
    type: String,
    default: ''
  },
  labelField: {
    type: String,
    default: 'title'
  },
  model: {
    type: String
  }
})

const renderLabel = (v: any) => {
  if (props.autocomplete && (v.text || v.label)) {
    return v.text || v.label
  }
  let str = `[${v.id}] `
  str +=
    props.language && v[props.labelField]
      ? v[props.labelField][props.language]
      : v[props.labelField]
  return str
}

const computedValues = computed(() => {
  if (Array.isArray(props.value) && props.value.length) {
    let f = props.value[0]
    if (typeof f === 'object') return props.value.map((v: any) => v.id)
  }
  return props.value
})

onMounted(() => {
  if (computedValues.value) {
    emit('update:modelValue', copyObject(computedValues.value))
    if (props.autocomplete) {
      handleSearch('', [computedValues.value])
    }
  }
})

const handleInput = (v: any) => {
  emit('update:modelValue', v)
}

const handleBlur = () => {
  if (props.autocomplete) {
    handleSearch('')
  }
}

const filter = (pattern, option) => {
  if (option?.id?.toString()?.includes(pattern)) return true
  let string = ''
  if (props.autocomplete && (option.text || option.label)) {
    string = option.text || option.label
  } else {
    string =
      props.language && option[props.labelField]
        ? option[props.labelField][props.language]
        : option[props.labelField]
  }
  return string?.toLowerCase()?.includes(pattern)
}

const handleSearch = (v: any, ids: Array<any> = []) => {
  if (!props.autocomplete) return
  autocompleteSearch(props.model, v, props.autocompleteSearchField, ids).then(
    (res: any) => {
      remoteOptions.value = res.data || []
    }
  )
}
</script>
