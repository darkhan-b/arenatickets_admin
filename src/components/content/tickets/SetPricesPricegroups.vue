<template>
  <div style="max-width: 1000px">
    <div v-if="pricegroups.length">
      <n-space vertical :size="10" class="mt-10">
        <n-card
          v-for="(p, pind) in pricegroups"
          :class="{ submitted: !!p.id }"
          :key="`pricegroup-${pind}`">
          <n-grid :cols="12" :x-gap="10" :y-gap="10" item-responsive>
            <n-grid-item span="12 500:6 950:3">
              <label class="small-label" v-if="p.id">Название</label>
              <n-input v-model:value="p.title.ru" placeholder="Название" />
            </n-grid-item>
            <n-grid-item span="6 950:2">
              <label class="small-label" v-if="p.id">Кол-во билетов</label>
              <n-input-number
                v-model:value="p.amount"
                placeholder="Кол-во билетов" />
            </n-grid-item>
            <n-grid-item span="6 950:2">
              <label class="small-label" v-if="p.id">Цена</label>
              <n-input-number v-model:value="p.price" placeholder="Цена" />
            </n-grid-item>
            <n-grid-item span="12 640:6 768:5">
              <label class="small-label" v-if="p.id">&nbsp;</label>
              <n-space>
                <n-button
                  type="primary"
                  :loading="loading"
                  :disabled="!p.amount || !p.price || !p.title.ru"
                  @click="savePricegroup(p, false)"
                  >Сохранить</n-button
                >
                <n-tooltip>
                  <template #trigger>
                    <n-button
                      type="primary"
                      dashed
                      :loading="loading"
                      :disabled="!p.amount || !p.price || !p.title.ru"
                      @click="savePricegroup(p, true)"
                      ><n-icon :component="IdCardOutline"></n-icon
                    ></n-button>
                  </template>
                  Пригласительные
                </n-tooltip>
                <n-tooltip v-if="timetable.reservation_sale && p.id">
                  <template #trigger>
                    <n-button type="default" @click="attachSections(p)"
                      ><n-icon :component="AppsOutline"></n-icon
                    ></n-button>
                  </template>
                  Привязать сектора
                </n-tooltip>
                <ExcelUpload
                  :show-label="false"
                  v-if="p.title.ru && p.price && !p.id"
                  :pricegroup-price="p.price"
                  :pricegroup-title="p.title.ru" />
                <n-button type="default" @click="deletePricegroup(p, pind)"
                  ><n-icon color="red" :component="TrashOutline"></n-icon
                ></n-button>
              </n-space>
            </n-grid-item>
          </n-grid>
        </n-card>
      </n-space>

      <div class="mt-15">
        <n-button @click="addPricegroup" type="primary">Добавить</n-button>
      </div>
    </div>

    <n-empty
      v-if="!pricegroups.length"
      style="max-width: 400px"
      description="У сеанса нет ни одной ценовой группы">
      <template #extra>
        <n-button @click="addPricegroup" type="primary"> Добавить </n-button>
      </template>
    </n-empty>

    <n-modal
      v-model:show="showModal"
      closable
      preset="card"
      size="medium"
      :style="{ width: '600px' }"
      title="Выберите сектора">
      <div>
        <n-input-group>
          <n-input-group-label>Цвет категории</n-input-group-label>
          <n-color-picker
            v-model:value="selectedPricegroup.color"
            :show-alpha="false" />
        </n-input-group>
        <div class="mt-10">
          Выберите сектора, которые относятся к категории, на схеме ниже:
        </div>
        <n-space :size="10" align="center">
          <n-tag
            type="success"
            v-for="section in selectedPricegroup.sections"
            :key="`sec-${section.id}`"
            >{{ section.title.ru }}</n-tag
          >
        </n-space>
        <br />
        <VenueScheme
          class="mt-15"
          view="select-sections"
          :selected-sections="selectedPricegroup.sections"
          :selected-color="selectedPricegroup.color"
          @section-pressed="sectionPressed"
          :drag-enabled="false" />
        <div class="text-end">
          <n-button type="primary" :loading="loading" @click="saveSections"
            >Сохранить</n-button
          >
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { useTicketsStore } from '@/stores/tickets.store'
import { storeToRefs } from 'pinia'
import {
  NButton,
  NCard,
  NEmpty,
  NGrid,
  NGridItem,
  NIcon,
  NInput,
  NInputNumber,
  NModal,
  NSpace,
  NColorPicker,
  NInputGroupLabel,
  NInputGroup,
  NTag,
  NTooltip,
  useMessage
} from 'naive-ui'
import { onUnmounted, ref } from 'vue'
import { TrashOutline, IdCardOutline, AppsOutline } from '@vicons/ionicons5'
import ExcelUpload from '@/components/content/tickets/ExcelUpload.vue'
import VenueScheme from '@/components/content/scheme/VenueScheme.vue'
import { useRoute } from 'vue-router'

const ticketsStore = useTicketsStore()
const message = useMessage()
const route = useRoute()

const { pricegroups, timetable } = storeToRefs(ticketsStore)
const comment = ref('')
const showModal = ref(false)
const selectedPricegroup = ref(null)
const loading = ref(false)

ticketsStore.loadPricegroups(route.params.tid || null)

const addPricegroup = () => {
  pricegroups.value.push({
    title: {
      ru: '',
      en: '',
      kz: ''
    },
    sections: [],
    color: null,
    price: null,
    amount: null
  })
}

const savePricegroup = async (
  priceGroup: any,
  invitationOrder = false,
  hidePrice = false
) => {
  loading.value = true
  const res = await ticketsStore.savePricegroup(
    priceGroup,
    comment.value,
    invitationOrder,
    hidePrice
  )
  loading.value = false
  if (res) {
    message.success('Сохранено', {
      closable: true,
      duration: 5000
    })
  }
}

const saveSections = async () => {
  await savePricegroup(selectedPricegroup.value)
  showModal.value = false
}

const attachSections = (priceGroup: any) => {
  selectedPricegroup.value = priceGroup
  showModal.value = true
}

const sectionPressed = (section: any) => {
  if (!selectedPricegroup.value) return
  const index = selectedPricegroup.value.sections.findIndex(
    (item: any) => item.id === section.id
  )
  if (index !== -1) {
    selectedPricegroup.value.sections.splice(index, 1)
  } else {
    selectedPricegroup.value.sections.push(section)
  }
}

const deletePricegroup = (priceGroup: any, index: number) => {
  ticketsStore.deletePricegroup(priceGroup, index)
}

onUnmounted(() => {
  pricegroups.value = []
})
</script>
