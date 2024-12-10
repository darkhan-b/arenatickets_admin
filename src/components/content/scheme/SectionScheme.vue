<template>
  <div class="position-relative">
    <ZoomBlock :min-scale="0.4" :max-scale="2" @scale="scale = $event" />
    <div class="scheme-price-bubbles" v-if="prices.length > 0">
      <div
        class="scheme-price-bubble"
        v-for="(p, pind) in prices"
        :key="`price-${pind}`">
        <span class="price-color" :class="`color-${pind}`"></span>
        <span>{{ formatNumber(p) }} ₸</span>
      </div>
    </div>

    <div
      class="venue-wrapper"
      :class="`view-${view} ${panEnabled ? 'overflow-hidden' : 'pan-disabled'}`"
      ref="venueWrapper"
      id="venueWrapper">
      <div
        class="seats-wrapper position-relative"
        :style="`width:${maxWScaled}px; height: ${maxH}px; ${
          panEnabled ? 'transition:none;' : 'transform: scale(' + scale + ')'
        }`"
        ref="vwRef"
        id="seats-wrapper"
        @touchstart="handleMouseDown"
        @mousedown="handleMouseDown">
        <div
          class="drag-area-box"
          v-if="dragging"
          :style="selectAreaStyle"></div>
        <div
          v-for="(s, sind) in seats"
          :class="[
            {
              hasTicket: s.ticket && s.ticket.price,
              selected: selectedSeats.includes(s.id),
              dragHovered: selectedIndexesByDragging.includes(sind),
              sold: s.ticket && s.ticket.sold,
              soldAsInvitation: s.ticket && s.ticket.soldAsInvitation,
              blocked: s.ticket && s.ticket.blocked
            },
            s.ticket ? 'color-' + prices.indexOf(s.ticket.price) : ''
          ]"
          @click="seatPressed(s)"
          ref="seatRefs"
          :id="'seat-' + sind"
          class="seat"
          :key="'seat-' + sind"
          :style="`left: ${s.x}px; top: ${s.y}px;`">
          {{ s.seat }}
        </div>
        <div
          class="seat-row"
          @click="rowPressed(r)"
          v-for="r in Object.keys(rows)"
          :key="'row-' + r"
          :style="`top: ${rows[r].y}px; left: ${rows[r].x}px`">
          {{ rows[r].title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ZoomBlock from '@/components/content/scheme/ZoomBlock.vue'
import { useSchemeStore } from '@/stores/scheme.store'
import { storeToRefs } from 'pinia'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { formatNumber } from '@/services/helper.service'
import { useTicketsStore } from '@/stores/tickets.store'
import { useGeneralStore } from '@/stores/general.store'

const props = defineProps({
  view: {
    type: String,
    default: 'user'
  },
  mouseSelectable: {
    type: Boolean,
    default: false
  }
})

const schemeStore = useSchemeStore()
const ticketsStore = useTicketsStore()
const generalStore = useGeneralStore()
const { scheme, selectedSeats, lastSeat, seats, rows, maxW, maxH } =
  storeToRefs(schemeStore)
const { prices } = storeToRefs(ticketsStore)

const POINT_MODEL = ['offsetX', 'offsetY', 'clientX', 'clientY']
const selectedIndexesByDragging: any = ref([])
const panEnabled = ref(false)
const dragging = ref(false)
const scale = ref(1)
const point = reactive({
  clientX: 0,
  clientY: 0,
  offsetX: 0,
  offsetY: 0
})
const startPoint = reactive({
  clientX: 0,
  clientY: 0,
  offsetX: 0,
  offsetY: 0
})
const endPoint = reactive({
  clientX: 0,
  clientY: 0,
  offsetX: 0,
  offsetY: 0
})
const selfPoint = reactive({
  clientX: 0,
  clientY: 0,
  offsetX: 0,
  offsetY: 0
})
const childrenDOMPoints: any = ref([])
const seatRefs = ref([])
const vwRef: any = ref(null)

const seatPressed = (seat: any) => {
  schemeStore.seatPressed(seat)
}

const rowPressed = (row: string | number) => {
  seats.value.forEach((item: any) => {
    if (item.row === row) seatPressed(item)
  })
}

const throttle = (method: Function, delay = 30) => {
  let timer: any = null
  return function () {
    if (timer) return
    const args = arguments
    timer = setTimeout(() => {
      // @ts-ignore
      method.apply(this, args)
      timer = null
    }, delay)
  }
}

const handleMouseDown = async (e: any) => {
  if (!props.mouseSelectable || panEnabled.value || generalStore.isMobile) {
    return
  }
  selectedIndexesByDragging.value = []
  await nextTick()
  resetPoint(e)
  updatePointData(point, e)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('mousemove', handleMouseMoveThrottled)
}

const handleMouseUp = (e: any) => {
  dragging.value = false
  updatePointData(point, e)
  resetPoint(e)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('mousemove', handleMouseMoveThrottled)
  selectedIndexesByDragging.value.forEach((index: any) => {
    seatPressed(seats.value[index])
  })
  selectedIndexesByDragging.value = []
  setTimeout(() => (selectedIndexesByDragging.value = []), 30)
}

const handleMouseMove = async (e: any) => {
  dragging.value = true
  updatePointData(endPoint, e)
  updatePointData(point, e)
  await nextTick()
  childrenDOMPoints.value.forEach((child: any) => {
    const isSelected = checkIfChildInSelectArea(child.point)
    if (isSelected) {
      selectedIndexesByDragging.value.push(
        Number(child.instance.id.replace('seat-', ''))
      )
      selectedIndexesByDragging.value = [
        ...new Set(selectedIndexesByDragging.value)
      ]
    }
  })
}

const handleMouseMoveThrottled = throttle(handleMouseMove)

const resetPoint = (e: any) => {
  updatePointData(startPoint, e)
  updatePointData(endPoint, e)
}

const updatePointData = (pointObj: any, pointData: any) => {
  POINT_MODEL.forEach((key) => {
    pointObj[key] = pointData[key]
  })
}

const checkIfChildInSelectArea = (childItem: any) => {
  const startClientX = startPoint.clientX
  const startClientY = startPoint.clientY
  const endClientX = endPoint.clientX
  const endClientY = endPoint.clientY
  const selectPoint = {
    left: Math.min(startClientX, endClientX),
    top: Math.min(startClientY, endClientY),
    width: Math.abs(startClientX - endClientX),
    height: Math.abs(startClientY - endClientY)
  }
  return (
    selectPoint.left <= childItem.left + childItem.width &&
    selectPoint.left + selectPoint.width >= childItem.left &&
    selectPoint.top <= childItem.top + childItem.height &&
    selectPoint.top + selectPoint.height >= childItem.top
  )
}

const collectDOMPoints = () => {
  const DOMRect = vwRef.value.getBoundingClientRect()
  selfPoint.clientX = DOMRect.left || DOMRect.x
  selfPoint.clientY = DOMRect.top || DOMRect.y
  childrenDOMPoints.value = seatRefs.value.map((child: any) => ({
    point: child.getBoundingClientRect(),
    instance: child
  }))
}

const maxWScaled = computed(() => {
  if (scale.value < 1) return maxW.value
  return maxW.value * scale.value
})

const selectAreaStyle = computed(() => {
  const startClientX = startPoint.clientX - selfPoint.clientX
  const endClientX = endPoint.clientX - selfPoint.clientX
  const startClientY = startPoint.clientY - selfPoint.clientY
  const endClientY = endPoint.clientY - selfPoint.clientY
  const { left, top, width, height } = {
    left: Math.min(startClientX, endClientX),
    top: Math.min(startClientY, endClientY),
    width: Math.abs(startClientX - endClientX),
    height: Math.abs(startClientY - endClientY)
  }
  return {
    left: `${left / scale.value}px`,
    top: `${top / scale.value}px`,
    width: `${width / scale.value}px`,
    height: `${height / scale.value}px`,
    zIndex: 444,
    border: '1px solid #6FCF97',
    // backgroundColor: 'rgba(194, 2, 13, 0.2)',
    position: 'absolute'
  }
})

watch(dragging, (val) => {
  if (!val) return
  collectDOMPoints()
})
</script>
