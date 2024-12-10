<template>
  <n-card v-if="timetable" :bordered="false" class="bg-gray">
    <n-breadcrumb v-if="show">
      <n-breadcrumb-item>
        <router-link to="/m/show">События</router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link :to="`/show/${show.id}`">{{ show.title.ru }}</router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item> {{ timetable.datePlaceString }}</n-breadcrumb-item>
    </n-breadcrumb>

    <n-h2>{{ timetable.datePlaceString }}</n-h2>

    <SelectTimetableType v-if="!timetable.type" />

    <SetPricesSections v-if="timetable.type === 'sections'" />

    <SetPricesPricegroups v-if="timetable.type === 'pricegroups'" />
  </n-card>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets.store'
import { storeToRefs } from 'pinia'
import { NBreadcrumb, NBreadcrumbItem, NCard, NH2 } from 'naive-ui'
import { ref } from 'vue'
import SelectTimetableType from '@/components/content/tickets/SelectTimetableType.vue'
import SetPricesPricegroups from '@/components/content/tickets/SetPricesPricegroups.vue'
import SetPricesSections from '@/components/content/tickets/SetPricesSections.vue'

const route = useRoute()
const ticketsStore = useTicketsStore()
const { timetable, ticketsCount, show, selectedType } =
  storeToRefs(ticketsStore)

ticketsStore.loadTimetable(Number(route.params.tid))
</script>
