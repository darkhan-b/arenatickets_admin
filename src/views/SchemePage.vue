<template>
  <n-card :bordered="false" class="bg-gray" v-if="venue">
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/m/venue">Площадки</router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{ venue.title.ru }} {{ scheme.title.ru }}</n-breadcrumb-item
      >
    </n-breadcrumb>
    <n-h2 class="mt-15">{{ title }}</n-h2>
    <div>
      <div class="container-fluid" v-if="venue && scheme">
        <n-grid x-gap="12" cols="1 900:2">
          <n-grid-item span="1">
            <n-skeleton text :repeat="2" v-if="!showScheme" />
            <transition>
              <VenueScheme view="admin" v-if="showScheme" />
            </transition>
          </n-grid-item>
          <n-grid-item span="1">
            <n-card>
              <n-space>
                <n-button type="primary" @click="save"> Сохранить </n-button>
                <n-button type="info" dashed @click="addSection">
                  + сектор
                </n-button>
                <n-button
                  type="default"
                  dashed
                  v-if="section"
                  @click="goToSection">
                  План сектора
                </n-button>
                <n-tooltip v-if="section">
                  <template #trigger>
                    <n-button @click="deleteSection" type="error">
                      <n-icon
                        :component="TrashBinOutline"
                        size="small"></n-icon>
                    </n-button>
                  </template>
                  {{ $t('deleteSection') }}
                </n-tooltip>
              </n-space>
            </n-card>
            <div>
              <SchemeForm class="mt-10" />
              <SectionForm class="mt-10" />
            </div>
          </n-grid-item>
        </n-grid>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {
  NButton,
  NCard,
  NIcon,
  NGrid,
  NGridItem,
  NSpace,
  NTooltip,
  NSkeleton,
  NBreadcrumb,
  NBreadcrumbItem,
  NH2
} from 'naive-ui'
import { TrashBinOutline } from '@vicons/ionicons5'
import VenueScheme from '@/components/content/scheme/VenueScheme.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useSchemeStore } from '@/stores/scheme.store'
import { storeToRefs } from 'pinia'
import SectionForm from '@/components/content/scheme/SectionForm.vue'
import SchemeForm from '@/components/content/scheme/SchemeForm.vue'

const route = useRoute()
const router = useRouter()
const schemeStore = useSchemeStore()
const { venue, scheme, section } = storeToRefs(schemeStore)

schemeStore.loadScheme(route.params.id)

const showScheme = ref(false)

const title = computed(() => {
  if (!venue.value || !scheme.value) return 'Загрузка'
  return `${venue.value?.title?.ru || ''} (${scheme.value?.title?.ru || ''})`
})

const addSection = async () => {
  scheme.value.sections.push({
    title: {
      ru: '',
      kz: '',
      en: ''
    },
    note: {
      ru: '',
      kz: '',
      en: ''
    },
    svg: {
      points: [
        [0, 0],
        [100, 0],
        [0, 100],
        [-100, 0]
      ],
      text: [50, 60],
      color: '#f4500d',
      text_color: '#000000',
      text_size: 14,
      custom: ''
    },
    entrance: 0,
    for_sale: 1,
    show_title: 1
  })
  await save()
  section.value = scheme.value.sections[scheme.value.sections.length - 1]
}

const save = async () => {
  await schemeStore.saveScheme()
}

const deleteSection = async () => {
  await schemeStore.deleteSection()
}

const goToSection = () => {
  router.push({ name: 'section', params: { id: section.value.id } })
}

onMounted(() => {
  setTimeout(() => {
    showScheme.value = true
  }, 100)
})

onUnmounted(() => {
  schemeStore.schemeUnmount()
})
</script>
