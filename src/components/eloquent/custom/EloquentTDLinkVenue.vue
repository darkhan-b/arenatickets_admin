<template>
  <n-tooltip>
    <template #trigger>
      <n-button text @click.stop="scheme">
        <n-icon :component="StorefrontOutline" size="medium"></n-icon>
      </n-button>
    </template>
    Рассадка
  </n-tooltip>

  <n-modal
    v-model:show="showModal"
    closable
    preset="card"
    size="medium"
    :style="{ width: '600px' }"
    title="Выберите рассадку">
    <n-list hoverable clickable show-divider>
      <n-list-item
        v-for="s in schemes"
        :key="`s-${s.id}`"
        @click="schemeSelected(s.id)">
        [{{ s.id }}] {{ s.title.ru }}
      </n-list-item>
      <n-list-item @click="createNewInit">
        <n-button type="info" text size="medium">
          <n-icon class="me-10" :component="AddSharp" size="small"></n-icon>
          Создать новую
        </n-button>
      </n-list-item>
    </n-list>
  </n-modal>

  <n-modal
    v-model:show="showModalNew"
    closable
    preset="dialog"
    size="medium"
    :style="{ width: '600px' }"
    :show-icon="false"
    positive-text="Продолжить"
    @positive-click="createNewSubmit"
    title="Новая рассадка">
    <n-input
      class="mt-10"
      v-model:value="newName"
      placeholder="Название новой рассадки"
      clearable />
  </n-modal>
</template>

<script setup lang="ts">
import {
  NButton,
  NIcon,
  NList,
  NListItem,
  NInput,
  NModal,
  NTooltip
} from 'naive-ui'
import { AddSharp, StorefrontOutline } from '@vicons/ionicons5'
import { ref } from 'vue'
import { useEloquentStore } from '@/stores/eloquent.store'
import { useRouter } from 'vue-router'

const props = defineProps({
  object: {
    required: true,
    type: Object
  }
})

const eloquentStore = useEloquentStore()
const router = useRouter()
const showModal = ref(false)
const showModalNew = ref(false)
const schemes = ref([])
const newName = ref('')

const scheme = async () => {
  schemes.value = await eloquentStore.loadDataTable(
    {
      page: 1,
      sort: 'title',
      order: 'desc',
      search: `venue_id=${props.object.id}`
    },
    'venue_scheme',
    false
  )
  showModal.value = true
}

const schemeSelected = async (id: number) => {
  await router.push({ name: 'scheme', params: { id } })
}

const createNewInit = () => {
  showModal.value = false
  showModalNew.value = true
}

const createNewSubmit = async () => {
  if (!newName.value) return
  const scheme = await eloquentStore.customCreate('venue_scheme', {
    venue_id: props.object.id,
    title: {
      ru: newName.value,
      en: newName.value,
      kz: newName.value
    }
  })
  if (scheme?.id) {
    showModalNew.value = false
    await router.push({ name: 'scheme', params: { id: scheme.id } })
  }
}

const rowClicked = () => {
  scheme()
}

defineExpose({ rowClicked })
</script>
