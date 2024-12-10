<template>
  <div class="position-relative">
    <ZoomBlock
      v-if="schemeView === 'plan'"
      @scale="scale = $event"
      :scale="scale" />
    <div
      class="venue-wrapper"
      :class="`view-${view} ${panEnabled ? '' : 'pan-disabled'}`"
      v-if="schemeView === 'plan'"
      ref="venueWrapper">
      <svg
        class="venue-svg"
        id="venueSvg"
        ref="venueSvg"
        v-if="scheme"
        :style="
          panEnabled
            ? ''
            : `transform: scale(${scale}) translate(${
                scheme ? scheme.x : 0
              }px,${scheme ? scheme.y : 0}px); width: ${maxWScaled}px;`
        "
        :class="{
          transitionTransform: zooming,
          'position-absolute': !panEnabled,
          'position-relative': panEnabled,
          'w-100': ['admin', 'set-prices'].includes(view)
        }"
        @touchstart="touchStart"
        @mousedown="touchStart"
        @touchend="touchEnd"
        @mouseup="touchEnd"
        :viewBox="`0 0 ${scheme ? scheme.width : 600} ${
          scheme ? scheme.height : 600
        }`">
        <template v-for="(s, sind) in scheme.sections" :key="'path-' + sind">
          <SectionSvgCanvas
            @click="selectSector(sind, s)"
            @textSelected.stop="selectSector(sind, s, true)"
            :sec="s"
            :textSel="textSelected"
            :class="{
              blocked: sectorIsBlocked(s) && s.for_sale,
              not_for_sale: !s.for_sale,
              closed: sectionIsClosed(s.id),
              hasTickets: numberOfTickets(s.id) > 0
            }"
            :fill="getColorForSection(s)"
            @touchstart="sectionDragStart"
            @mousedown="sectionDragStart"
            @mouseup="sectionDragEnd"
            @mouseleave="sectionDragEnd"
            @mousemove="sectionDrag"
            :data-toggle="
              ['user', 'set-prices'].includes(view) && s.for_sale
                ? 'tooltip'
                : ''
            "
            :title="`${
              numberOfTickets(s.id) > 0
                ? $t('tickets_of') + ': ' + numberOfTickets(s.id)
                : $t('no_tickets')
            }`" />
        </template>
      </svg>
    </div>
    <div v-if="schemeView === 'list'" class="pb-5">
      <template v-for="(s, sind) in scheme.sections" :key="'sect-' + sind">
        <div class="section-row" v-if="s.for_sale">
          <div class="row align-items-center">
            <div class="col">
              <div class="section-title">{{ s.title.ru }}</div>
              <div class="text-muted">
                {{ $t('places_left') }}: {{ numberOfTickets(s.id) }}
              </div>
            </div>
            <div class="col-auto"></div>
            <div class="col-auto">
              <n-button
                type="primary"
                :disabled="sectorIsBlocked(s)"
                @click="selectSector(sind, s)">
                {{ $t('choose_seats') }}
              </n-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useSchemeStore } from '@/stores/scheme.store'
import { storeToRefs } from 'pinia'
import ZoomBlock from '@/components/content/scheme/ZoomBlock.vue'
import SectionSvgCanvas from '@/components/content/scheme/SectionSvgCanvas.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useTicketsStore } from '@/stores/tickets.store'

const emit = defineEmits(['sectionPressed'])
const props = defineProps({
  view: {
    type: String,
    default: 'user'
  },
  panEnabled: {
    type: Boolean,
    default: false
  },
  dragEnabled: {
    type: Boolean,
    default: true
  },
  selectedSections: {
    type: Array,
    default: () => []
  },
  selectedColor: {
    type: String,
    default: ''
  }
})

const schemeStore = useSchemeStore()
const ticketsStore = useTicketsStore()

const { scheme, schemeView, section } = storeToRefs(schemeStore)
const { closedSections, ticketsCnt } = storeToRefs(ticketsStore)

const panPause = 150
const scale = ref(1)
const zooming = ref(false)
const panning = ref(false)
const movingSector = ref(false)
const immediateMovingSector = ref(false)
const startPoint: any = ref(null)
const initialBlockPoint: any = ref(null)
const venueSvg: any = ref(null)
const textSelected = ref(false)
let dragTimeout: any = null

const sectorIsBlocked = (section: any) => {
  if (['admin', 'set-prices', 'select-sections'].includes(props.view))
    return false
  return numberOfTickets(section.id) < 1
}

const numberOfTickets = (sectorId: number) => {
  return ticketsCnt.value?.[sectorId]?.cnt || 0
}

const getColorForSection = (section: any) => {
  if (props.view !== 'select-sections') return ''
  if (props.selectedSections.find((s: any) => s.id === section.id)) {
    return props.selectedColor
  }
  return 'rgba(0,0,0,0.1)'
}

const selectSector = (
  index: number,
  pressedSector: any,
  text: boolean = false
) => {
  if (movingSector.value) return
  if (sectorIsBlocked(pressedSector)) return
  if (props.view === 'user' && !pressedSector.for_sale) return
  if (props.view === 'select-sections') {
    emit('sectionPressed', pressedSector)
    return
  }
  section.value = section.value?.id === pressedSector.id ? null : pressedSector
  textSelected.value = section.value && text
}

const sectionIsClosed = (id: number) => {
  if (['admin', 'set-prices', 'select-sections'].includes(props.view))
    return false
  if (props.view !== 'set-prices') return false
  return !!closedSections.value.find((obj: any) => obj.section_id === id)
}

const touchStart = () => {
  setTimeout(() => {
    panning.value = true
  }, panPause)
}

const touchEnd = () => {
  setTimeout(() => {
    panning.value = false
  }, panPause)
}

const sectionDragStart = (e: any) => {
  if (!section.value || !props.dragEnabled) return
  if (dragTimeout) clearTimeout(dragTimeout)
  movingSector.value = false
  immediateMovingSector.value = false
  dragTimeout = setTimeout(() => {
    movingSector.value = true
    immediateMovingSector.value = true
  }, 100)
  startPoint.value = [e.clientX, e.clientY]
  if (textSelected.value) {
    initialBlockPoint.value = [
      section.value.svg.text[0],
      section.value.svg.text[1]
    ]
    return
  }
  if (!section.value.svg.points[0]) return
  initialBlockPoint.value = [
    section.value.svg.points[0][0],
    section.value.svg.points[0][1]
  ]
}

const sectionDragEnd = () => {
  if (!props.dragEnabled) return
  setTimeout(() => {
    movingSector.value = false
  }, 100)
  startPoint.value = null
  initialBlockPoint.value = null
  immediateMovingSector.value = false
}

const sectionDrag = (e: any) => {
  if (!props.dragEnabled) return
  if (immediateMovingSector.value && section.value && startPoint.value) {
    const coeff =
      venueSvg.value.getBoundingClientRect().width / scheme.value.width
    if (textSelected.value) {
      section.value.svg.text[0] =
        (e.clientX - startPoint.value[0]) / coeff + initialBlockPoint.value[0]
      section.value.svg.text[1] =
        (e.clientY - startPoint.value[1]) / coeff + initialBlockPoint.value[1]
    } else {
      section.value.svg.points[0][0] =
        (e.clientX - startPoint.value[0]) / coeff + initialBlockPoint.value[0]
      section.value.svg.points[0][1] =
        (e.clientY - startPoint.value[1]) / coeff + initialBlockPoint.value[1]
    }
  }
}

const maxWScaled = computed(() => {
  if (!scheme.value || !scheme.value.width) return 0
  return Math.max(1, scale.value) * scheme.value.width
})

onBeforeUnmount(() => {
  section.value = null
})
</script>
