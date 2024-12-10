<template>
  <div>
    <yandex-map v-model="map" :settings="settings" width="100%" height="400px">
      <yandex-map-default-scheme-layer />
      <yandex-map-default-features-layer />
      <yandex-map-controls :settings="{ position: 'right' }">
        <yandex-map-zoom-control />
      </yandex-map-controls>
      <yandex-map-default-marker
        :settings="{
          coordinates: [selectedModel.x_coord, selectedModel.y_coord]
        }">
      </yandex-map-default-marker>
      <yandex-map-listener
        :settings="{
          onClick: clickEvent
        }" />
    </yandex-map>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import {
  YandexMap,
  YandexMapListener,
  YandexMapControls,
  YandexMapZoomControl,
  YandexMapDefaultMarker,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer
} from 'vue-yandex-maps'
import { useEloquentStore } from '@/stores/eloquent.store'
import { storeToRefs } from 'pinia'

const eloquentStore = useEloquentStore()
const { selectedModel } = storeToRefs(eloquentStore)
const map = shallowRef<null | any>(null)

const settings = {
  location: {
    center: [
      selectedModel.value.x_coord || 76.976494,
      selectedModel.value.y_coord || 43.22953
    ],
    zoom: 13
  }
}

const clickEvent = (obj: any, e: any) => {
  selectedModel.value.x_coord = e.coordinates[0]
  selectedModel.value.y_coord = e.coordinates[1]
}
</script>
