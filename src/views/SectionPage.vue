<template>
  <n-card :bordered="false" class="bg-gray" v-if="section && scheme">
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/m/venue">Площадки</router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link :to="`/scheme/${scheme?.id}`"
          >{{ venue.title.ru }} {{ scheme.title.ru }}</router-link
        >
      </n-breadcrumb-item>
      <n-breadcrumb-item> Сектор {{ section.title.ru }} </n-breadcrumb-item>
    </n-breadcrumb>
    <n-h2 class="mt-15">Сектор {{ section.title.ru }}</n-h2>
    <div>
      <n-grid cols="2" :x-gap="10" :y-gap="10" item-responsive>
        <n-grid-item span="2 700:1">
          <n-card>
            <n-space>
              <n-button type="info" dashed :loading="loading" @click="addRow">
                + ряд
              </n-button>

              <n-button type="info" dashed :loading="loading" @click="addSeat">
                + место
              </n-button>

              <n-tooltip v-if="selectedSeats.length > 0">
                <template #trigger>
                  <n-button :loading="loading" @click="deleteSelected">
                    <n-icon :component="TrashOutline"></n-icon>
                  </n-button>
                </template>
                Удалить выделенные
              </n-tooltip>
              <n-tooltip v-if="selectedSeats.length > 0">
                <template #trigger>
                  <n-button :loading="loading" @click="removeSelection">
                    <n-icon :component="Ban"></n-icon>
                  </n-button>
                </template>
                Снять выделение
              </n-tooltip>

              <n-tooltip v-if="selectedSeats.length > 0">
                <template #trigger>
                  <n-button
                    :loading="loading"
                    dashed
                    @click="changeHorizontalSeatDirection">
                    <n-icon :component="SwapHorizontal"></n-icon>
                  </n-button>
                </template>
                Поменять все места в выделенных рядах
              </n-tooltip>

              <n-tooltip v-if="selectedSeats.length > 0">
                <template #trigger>
                  <n-button
                    :loading="loading"
                    dashed
                    @click="changeVerticalSeatDirection">
                    <n-icon :component="SwapVertical"></n-icon>
                  </n-button>
                </template>
                Поменять все ряды местами
              </n-tooltip>

              <n-button
                dashed
                v-if="selectedSeats.length > 0"
                @click="move('left')">
                <n-icon :component="ArrowBack"></n-icon>
              </n-button>
              <n-button
                dashed
                v-if="selectedSeats.length > 0"
                @click="move('right')">
                <n-icon :component="ArrowForward"></n-icon>
              </n-button>
              <n-button
                dashed
                v-if="selectedSeats.length > 0"
                @click="move('up')">
                <n-icon :component="ArrowUp"></n-icon>
              </n-button>
              <n-button
                dashed
                v-if="selectedSeats.length > 0"
                @click="move('down')">
                <n-icon :component="ArrowDown"></n-icon>
              </n-button>
            </n-space>
          </n-card>
          <SectionScheme :mouse-selectable="true" view="admin" class="mt-10" />
          <div class="mt-10">
            Итого мест: {{ section.seats?.length }}
            <span v-if="selectedSeats.length" class="ml-3"
              >Выделено мест: {{ selectedSeats.length }}</span
            >
          </div>
        </n-grid-item>
        <n-grid-item span="2 700:1">
          <n-card>
            <n-button type="primary" :loading="loading" @click="save">
              Сохранить
            </n-button>
          </n-card>

          <n-card class="mt-10">
            <n-grid cols="2" :x-gap="10" :y-gap="10" item-responsive>
              <n-grid-item span="2 500:1">
                <n-input-group>
                  <n-input-group-label>Мест в ряду</n-input-group-label>
                  <n-input-number placeholder="" v-model:value="seatsInRow" />
                </n-input-group>
              </n-grid-item>
              <n-grid-item span="2 500:1">
                <n-input-group>
                  <n-input-group-label>Отступ слева</n-input-group-label>
                  <n-input-number
                    placeholder=""
                    v-model:value="standardOffset" />
                </n-input-group>
              </n-grid-item>
            </n-grid>

            <n-grid
              cols="2"
              class="mt-10"
              :x-gap="10"
              :y-gap="10"
              item-responsive>
              <n-grid-item span="2 500:1">
                <n-input-group>
                  <n-input-group-label>Имя след ряда</n-input-group-label>
                  <n-input placeholder="" v-model:value="nextRow" />
                </n-input-group>
              </n-grid-item>
              <n-grid-item span="2 500:1">
                <n-input-group>
                  <n-input-group-label>След место</n-input-group-label>
                  <n-input-number placeholder="" v-model:value="nextSeat" />
                </n-input-group>
              </n-grid-item>
            </n-grid>

            <n-input-group class="mt-10">
              <n-input-group-label>Отступ движения</n-input-group-label>
              <n-input-number
                :step="2"
                placeholder=""
                v-model:value="moveValue" />
            </n-input-group>

            <div>
              <div class="mt-10"></div>
              <div class="mt-10" v-if="selectedSeats.length > 0"></div>
              <div v-if="lastSeat && selectedSeats.length === 1" class="mt-10">
                <div class="mt-4 mb-2">Выделенное место:</div>
                <n-grid cols="4" :x-gap="10">
                  <n-grid-item>
                    <n-input-group>
                      <n-input-group-label>Ряд</n-input-group-label>
                      <n-input placeholder="" v-model:value="lastSeat.row" />
                    </n-input-group>
                  </n-grid-item>
                  <n-grid-item>
                    <n-input-group>
                      <n-input-group-label>Место</n-input-group-label>
                      <n-input placeholder="" v-model:value="lastSeat.seat" />
                    </n-input-group>
                  </n-grid-item>
                  <n-grid-item>
                    <n-input-group>
                      <n-input-group-label>X</n-input-group-label>
                      <n-input-number
                        :step="2"
                        placeholder=""
                        v-model:value="lastSeat.x" />
                    </n-input-group>
                  </n-grid-item>
                  <n-grid-item>
                    <n-input-group>
                      <n-input-group-label>Y</n-input-group-label>
                      <n-input-number
                        :step="2"
                        placeholder=""
                        v-model:value="lastSeat.y" />
                    </n-input-group>
                  </n-grid-item>
                </n-grid>
              </div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NBreadcrumb,
  NBreadcrumbItem,
  NH2,
  NGrid,
  NGridItem,
  NButton,
  NInputNumber,
  NInput,
  NInputGroupLabel,
  NInputGroup,
  NSpace,
  NIcon,
  NTooltip
} from 'naive-ui'
import {
  ArrowForward,
  ArrowUp,
  ArrowDown,
  ArrowBack,
  SwapHorizontal,
  SwapVertical,
  TrashOutline,
  Ban
} from '@vicons/ionicons5'
import { storeToRefs } from 'pinia'
import { useSchemeStore } from '@/stores/scheme.store'
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import SectionScheme from '@/components/content/scheme/SectionScheme.vue'
const route = useRoute()

const schemeStore = useSchemeStore()
const {
  venue,
  scheme,
  section,
  selectedSeats,
  lastSeat,
  maxRow,
  numberOfRows
} = storeToRefs(schemeStore)

const loading = ref(false)
const fixRow = ref(false)
const nextRow = ref('1')
const nextSeat = ref(1)
const bottomRowIndex = ref(1)
const standardOffset = ref(30)
const seatsInRow = ref(10)
const moveValue = ref(10)
const widthOfSeat = ref(20)
const marginBetweenSeats = ref(10)

schemeStore.getSectionDetails(Number(route.params.id))

const save = async () => {
  loading.value = true
  try {
    await schemeStore.saveSectionSeats()
  } finally {
    loading.value = false
  }
}

const addRow = () => {
  for (let i = 0; i < Number(seatsInRow.value); i++) {
    // for (
    //   var i = Number(nextSeat.value);
    //   i < Number(seatsInRow.value) + Number(nextSeat.value);
    //   i++
    // ) {
    section.value.seats.push({
      row: nextRow.value,
      seat: i + Number(nextSeat.value),
      x:
        Number(standardOffset.value) +
        (i + 1) * (widthOfSeat.value + marginBetweenSeats.value),
      y:
        Number(
          isNaN(Number(nextRow.value)) ? bottomRowIndex.value : nextRow.value
        ) *
        (widthOfSeat.value + marginBetweenSeats.value)
    })
  }
  save()
}

const addSeat = () => {
  const widthForSeat = widthOfSeat.value + marginBetweenSeats.value
  section.value.seats.push({
    row: nextRow.value,
    seat: nextSeat.value,
    x: Number(standardOffset.value) + nextSeat.value * widthForSeat,
    y:
      Number(
        isNaN(Number(nextRow.value)) ? bottomRowIndex.value : nextRow.value
      ) * widthForSeat
  })
  nextSeat.value++
  fixRow.value = true
  save()
}

const deleteSelected = async () => {
  loading.value = true
  try {
    await schemeStore.deleteSelectedSeats()
  } finally {
    loading.value = false
  }
}

const removeSelection = () => {
  selectedSeats.value = []
  lastSeat.value = null
}

const move = (direction: string) => {
  section.value.seats.forEach((item: any) => {
    if (selectedSeats.value.includes(item.id)) {
      switch (direction) {
        case 'left':
          item.x = item.x - moveValue.value
          break
        case 'right':
          item.x = item.x + moveValue.value
          break
        case 'up':
          item.y = item.y - moveValue.value
          break
        case 'down':
          item.y = item.y + moveValue.value
          break
      }
    }
  })
}

const rowsList = computed(() => {
  const rowsInfo: any = {}
  section.value.seats.forEach((seat: any) => {
    if (!rowsInfo[seat.row]) rowsInfo[seat.row] = 0
    rowsInfo[seat.row] = Math.max(rowsInfo[seat.row], seat.y)
  })
  return Object.keys(rowsInfo).sort((a, b) => rowsInfo[a] - rowsInfo[b])
})

const changeHorizontalSeatDirection = () => {
  const rowsToChange: any[] = []
  section.value.seats.forEach((seat: any) => {
    if (
      selectedSeats.value.includes(seat.id) &&
      !rowsToChange.includes(seat.row)
    ) {
      rowsToChange.push(seat.row)
      let rowSeats = section.value.seats
        .filter((s: any) => s.row === seat.row)
        .sort((a: any, b: any) => (Number(a.seat) > Number(b.seat) ? 1 : -1))
      let mirrored = JSON.parse(JSON.stringify(rowSeats)).sort(
        (a: any, b: any) => (Number(a.seat) < Number(b.seat) ? 1 : -1)
      )
      rowSeats.forEach((rs: any, ind: number) => {
        rs.x = mirrored[ind].x
      })
    }
  })
}

const changeVerticalSeatDirection = () => {
  const revertedRowsList = [...rowsList.value].reverse()
  const rowsMapping: any = {}
  rowsList.value.forEach((row, index) => {
    rowsMapping[row] = revertedRowsList[index]
  })
  section.value.seats.forEach((seat: any) => {
    seat.row = rowsMapping[seat.row]
  })
}

watch(maxRow, (val) => {
  if (val) nextRow.value = (Number(val) + 1).toString()
})

watch(numberOfRows, (val) => {
  bottomRowIndex.value = val ? val + 1 : 1
})
</script>
