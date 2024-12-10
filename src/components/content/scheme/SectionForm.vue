<template>
  <n-card v-if="section">
    <div class="bg-white p-3 mt-2 border">
      <div>
        <div>
          <div>Название</div>
          <n-grid
            :cols="langs.length"
            :x-gap="10"
            :y-gap="10"
            :key="`tit-${key}`"
            item-responsive>
            <n-grid-item
              v-for="l in langs"
              :key="`title-${l}`"
              :span="`${langs.length} 400:1`">
              <n-input-group>
                <n-input-group-label>{{ l }}</n-input-group-label>
                <n-input placeholder="" v-model:value="section.title[l]" />
              </n-input-group>
            </n-grid-item>
          </n-grid>
        </div>

        <div class="mt-15">
          <n-grid :cols="2" :x-gap="10" :y-gap="10" item-responsive>
            <n-grid-item span="2 400:1">
              <n-input-group>
                <n-input-group-label>Цвет сектора</n-input-group-label>
                <n-color-picker
                  :disabled="!!section.svg.custom"
                  v-model:value="section.svg.color"
                  :show-alpha="false" />
              </n-input-group>
            </n-grid-item>
            <n-grid-item span="2 400:1">
              <n-input-group>
                <n-input-group-label>Цвет текста</n-input-group-label>
                <n-color-picker
                  v-model:value="section.svg.title_color"
                  :show-alpha="false" />
              </n-input-group>
            </n-grid-item>
            <n-grid-item span="2 400:2">
              <n-input-group>
                <n-input-group-label>Размер текста</n-input-group-label>
                <n-input-number
                  v-model:value="section.svg.title_size"
                  placeholder="" />
              </n-input-group>
            </n-grid-item>
          </n-grid>
        </div>

        <div class="mt-15">
          <n-space :inline="true" align="start" :size="10">
            <n-checkbox v-model:checked="section.for_sale"
              >Для продажи</n-checkbox
            >
            <n-checkbox v-model:checked="section.show_title"
              >Показывать название</n-checkbox
            >
            <n-checkbox v-model:checked="section.entrance"
              >Без мест (для api)</n-checkbox
            >
          </n-space>
        </div>
      </div>

      <n-collapse class="mt-10">
        <n-collapse-item title="Ручная настройка точек" name="1">
          <div>
            <n-grid
              class="mt-10"
              cols="12"
              :x-gap="10"
              :y-gap="10"
              style="align-items: center"
              :key="`pp-${pind}`"
              v-for="(p, pind) in section.svg.points"
              item-responsive>
              <n-grid-item span="12 400:3">
                Точка {{ pind + 1 }}:
                <!--            ({{ cumulativeX(pind) }}-->
                <!--            {{ cumulativeY(pind) }})-->
              </n-grid-item>
              <n-grid-item span="5 400:3">
                <n-input-number
                  :step="10"
                  :disabled="!!section.svg.custom"
                  v-model:value="p[0]" />
              </n-grid-item>
              <n-grid-item span="5 400:3">
                <n-input-number
                  :step="10"
                  :disabled="!!section.svg.custom"
                  v-model:value="p[1]" />
              </n-grid-item>
              <n-grid-item span="2 400:3">
                <n-button @click="removePoint(pind)">
                  <n-icon :component="TrashBinOutline" size="small"></n-icon>
                </n-button>
              </n-grid-item>
            </n-grid>
            <n-button
              class="mt-10"
              type="info"
              dashed
              :disabled="!!section.svg.custom"
              @click="addPoint">
              + точку
            </n-button>
          </div>
        </n-collapse-item>
      </n-collapse>
      <div class="mt-10">
        <n-grid
          cols="4"
          :x-gap="10"
          :y-gap="10"
          style="align-items: center"
          item-responsive>
          <n-grid-item span="4 400:1">Точка названия:</n-grid-item>
          <n-grid-item
            span="4 400:1"
            v-for="(t, tind) in titlePoints"
            :key="`point-${t}`">
            <n-input-group>
              <n-input-group-label>{{ t }}</n-input-group-label>
              <n-input-number
                v-model:value="section.svg.text[tind]"
                placeholder="" />
            </n-input-group>
          </n-grid-item>
        </n-grid>
      </div>

      <div class="mt-15">
        <div>Кастомный svg код (при наличии точки и цвет игнорируются)</div>
        <n-input
          type="textarea"
          placeholder=""
          v-model:value="section.svg.custom"
          rows="6"></n-input>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NGrid,
  NGridItem,
  NInput,
  NInputNumber,
  NInputGroupLabel,
  NInputGroup,
  NColorPicker,
  NCheckbox,
  NButton,
  NSpace,
  NIcon,
  NCollapse,
  NCollapseItem
} from 'naive-ui'
import { TrashBinOutline } from '@vicons/ionicons5'
import { useSchemeStore } from '@/stores/scheme.store'
import { useGeneralStore } from '@/stores/general.store'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const schemeStore = useSchemeStore()
const generalStore = useGeneralStore()

const { section } = storeToRefs(schemeStore)
const { langs } = storeToRefs(generalStore)

const titlePoints = ['x', 'y', 'Угол']
const key = ref(1)

const addPoint = () => {
  section.value.svg.points.push([50, 50])
}
const removePoint = (index: number) => {
  section.value.svg.points.splice(index, 1)
}

watch(section, () => {
  key.value++
})
</script>
