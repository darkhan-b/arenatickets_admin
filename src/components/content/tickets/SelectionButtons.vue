<template>
  <div>
    <n-dropdown trigger="click" :options="options" @select="handleSelect">
      <n-button type="default">Выделить</n-button>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import { NButton, NDropdown } from 'naive-ui'
import { useSchemeStore } from '@/stores/scheme.store'
import { storeToRefs } from 'pinia'

const options = [
  {
    label: 'Места без билетов',
    key: 'notickets'
  },
  {
    label: 'Все билеты',
    key: 'tickets'
  },
  {
    label: 'Все места',
    key: 'seats'
  },
  {
    label: 'Снять выделенние',
    key: 'noselection'
  }
]

const schemeStore = useSchemeStore()

const { selectedSeats, seats } = storeToRefs(schemeStore)

const handleSelect = (option: any) => {
  selectedSeats.value = []
  if (option === 'noselection') return
  seats.value.forEach((item: any) => {
    if (option === 'notickets') {
      if (!item.ticket) schemeStore.seatPressed(item)
    }
    if (option === 'tickets') {
      if (item.ticket) schemeStore.seatPressed(item)
    }
    if (option === 'seats') {
      schemeStore.seatPressed(item)
    }
  })
}
</script>
