<template>
  <div>
    <n-grid
      :cols="12"
      :x-gap="10"
      :y-gap="10"
      class="admin-scheme-view"
      item-responsive
      style="padding-bottom: 100px">
      <n-grid-item span="12 768:4">
        <VenueScheme view="set-prices" :drag-enabled="false" />
        <div v-if="section">
          <div class="mt-10">
            <n-h4>Тип билетов сектора</n-h4>
            <n-space>
              <n-radio
                :checked="sectionType === 'seats'"
                :disabled="!changeType"
                @change="sectionType = 'seats'">
                По местам
              </n-radio>
              <n-radio
                :checked="sectionType === 'enter'"
                :disabled="!changeType"
                @change="sectionType = 'enter'">
                Входные
              </n-radio>
            </n-space>
          </div>
          <div v-if="sectionType === 'seats'" class="mt-10">
            <n-space align="center">
              <SelectionButtons />
              <div>Выделено: {{ selectedSeats.length }}</div>
            </n-space>
          </div>

          <div class="mt-10">
            <n-checkbox
              :checked="isSectionClosed"
              @update:checked="closeSectionToggle"
              >{{ isSectionClosed ? 'Открыть' : 'Закрыть' }}</n-checkbox
            >
            <n-checkbox
              v-if="sectionType === 'seats' && 1 == 2"
              :checked="isSectionProhibitedForSeatSelection"
              @update:checked="seatSelectionSectionToggle"
              >{{
                isSectionProhibitedForSeatSelection
                  ? 'Разрешить выбор мест'
                  : 'Запретить выбор мест'
              }}</n-checkbox
            >
          </div>
        </div>
      </n-grid-item>
      <n-grid-item span="12 768:8">
        <SectionScheme
          view="admin"
          v-if="sectionType === 'seats'"
          :mouse-selectable="true" />
        <div v-if="sectionType === 'enter'">
          <n-space :size="5">
            <div
              v-for="(t, tind) in tickets"
              :key="`ticket-${tind}`"
              class="ticket-icon">
              <n-icon :component="TicketOutline"></n-icon>
            </div>
          </n-space>
        </div>
      </n-grid-item>
    </n-grid>
    <TicketsPanel />
  </div>
</template>

<script setup lang="ts">
import { useSchemeStore } from '@/stores/scheme.store'
import { storeToRefs } from 'pinia'
import {
  NCheckbox,
  NGrid,
  NGridItem,
  NH4,
  NIcon,
  NRadio,
  NSpace
} from 'naive-ui'
import VenueScheme from '@/components/content/scheme/VenueScheme.vue'
import SectionScheme from '@/components/content/scheme/SectionScheme.vue'
import { watch } from 'vue'
import TicketsPanel from '@/components/content/tickets/TicketsPanel.vue'
import { useTicketsStore } from '@/stores/tickets.store'
import SelectionButtons from '@/components/content/tickets/SelectionButtons.vue'
import { TicketOutline } from '@vicons/ionicons5'

const schemeStore = useSchemeStore()
const ticketsStore = useTicketsStore()

const { section, selectedSeats } = storeToRefs(schemeStore)
const {
  sectionType,
  changeType,
  tickets,
  isSectionClosed,
  isSectionProhibitedForSeatSelection
} = storeToRefs(ticketsStore)

const closeSectionToggle = (val: boolean) => {
  ticketsStore.closeSectionToggle(val)
}

const seatSelectionSectionToggle = (val: boolean) => {
  ticketsStore.seatSelectionSectionToggle(val)
}

watch(section, (sec) => {
  if (sec) ticketsStore.loadSection(sec.id)
})
</script>
