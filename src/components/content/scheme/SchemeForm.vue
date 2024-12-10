<template>
  <n-card>
    <n-grid
      cols="3"
      :x-gap="10"
      :y-gap="10"
      item-responsive
      style="max-width: 560px; align-items: center">
      <n-grid-item span="3 400:1">
        <n-text strong>Параметры схемы:</n-text>
      </n-grid-item>
      <n-grid-item span="3 400:1">
        <n-input-group>
          <n-input-group-label>Ширина</n-input-group-label>
          <n-input-number
            placeholder="px"
            step="10"
            v-model:value="scheme.width" />
        </n-input-group>
      </n-grid-item>
      <n-grid-item span="3 400:1">
        <n-input-group>
          <n-input-group-label>Высота</n-input-group-label>
          <n-input-number
            placeholder="px"
            step="10"
            v-model:value="scheme.height" />
        </n-input-group>
      </n-grid-item>
      <n-grid-item span="3 400:1">
        <n-text strong>Отступы:</n-text>
      </n-grid-item>
      <n-grid-item span="3 400:1">
        <n-input-group>
          <n-input-group-label>Слева</n-input-group-label>
          <n-input-number placeholder="px" step="1" v-model:value="scheme.x" />
        </n-input-group>
      </n-grid-item>
      <n-grid-item span="3 400:1">
        <n-input-group>
          <n-input-group-label>Сверху</n-input-group-label>
          <n-input-number placeholder="px" step="1" v-model:value="scheme.y" />
        </n-input-group>
      </n-grid-item>
    </n-grid>
  </n-card>
</template>

<script lang="ts" setup>
import {
  NCard,
  NGrid,
  NGridItem,
  NInputNumber,
  NInputGroupLabel,
  NInputGroup,
  NText
} from 'naive-ui'
import { useSchemeStore } from '@/stores/scheme.store'
import { storeToRefs } from 'pinia'
const schemeStore = useSchemeStore()

const { scheme } = storeToRefs(schemeStore)
</script>
