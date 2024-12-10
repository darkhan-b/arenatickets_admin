<template>
  <n-card class="bottom-panel" v-if="section">
    <n-space justify="space-between" align="center">
      <div>
        <n-space>
          <n-input-number
            type="number"
            :step="100"
            :min="0"
            placeholder="Указать цену"
            v-model:value="price" />
          <n-input-number
            type="number"
            v-if="sectionType === 'enter'"
            :step="1"
            :min="0"
            placeholder="Кол-во билетов"
            v-model:value="amountOfEnterTickets" />
          <n-input placeholder="Комментарий" v-model:value="comment"></n-input>
          <ExcelUpload v-if="section" />
        </n-space>
      </div>

      <div>
        <n-space align="center">
          <n-button
            v-if="selectedSeats.length"
            text
            type="default"
            @click="selectedSeats = []"
            ><n-icon :component="BanOutline" class="me-10"></n-icon>Снять
            выделение</n-button
          >

          <n-button
            v-if="sectionType === 'seats' && selectedSeats.length > 0"
            @click="deleteSelected">
            <n-icon
              color="red"
              :component="TrashOutline"
              class="me-10"></n-icon>
            выделенные
          </n-button>

          <!--          <div-->
          <!--            class="dropdown d-inline-block align-middle ml-3"-->
          <!--            v-if="invitationsToBeCreated && price > 0">-->
          <!--            <a-->
          <!--              role="button"-->
          <!--              class="btn btn-info btn-themed btn-fill dropdown-toggle"-->
          <!--              id="dropdownMenuButton"-->
          <!--              @click="showPIndex = !showPIndex"-->
          <!--              data-toggle="dropdown"-->
          <!--              aria-haspopup="true"-->
          <!--              aria-expanded="false">-->
          <!--              Пригласительные ({{ invitationsToBeCreated }})-->
          <!--            </a>-->
          <!--            <div-->
          <!--              class="dropdown-menu"-->
          <!--              :class="{ show: showPIndex }"-->
          <!--              aria-labelledby="dropdownMenuButton">-->
          <!--              <a class="dropdown-item pointer" @click="saveTickets(true, true)"-->
          <!--                >Прятать цену</a-->
          <!--              >-->
          <!--              <a class="dropdown-item pointer" @click="saveTickets(true, false)"-->
          <!--                >Оставить цену</a-->
          <!--              >-->
          <!--            </div>-->
          <!--          </div>-->
          <n-button
            type="primary"
            dashed
            @click="saveTickets(true)"
            v-if="price > 0">
            Пригласительные
          </n-button>
          <n-button type="primary" @click="saveTickets(false)" v-if="price > 0">
            {{ sectionType === 'seats' ? 'Добавить' : 'Установить' }}
          </n-button>
        </n-space>
      </div>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { NButton, NCard, NIcon, NInput, NInputNumber, NSpace } from 'naive-ui'
import { useSchemeStore } from '@/stores/scheme.store'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { BanOutline, TrashOutline } from '@vicons/ionicons5'
import { useTicketsStore } from '@/stores/tickets.store'
import ExcelUpload from '@/components/content/tickets/ExcelUpload.vue'

const schemeStore = useSchemeStore()
const ticketsStore = useTicketsStore()

const { section, selectedSeats } = storeToRefs(schemeStore)
const { price, sectionType, amountOfEnterTickets } = storeToRefs(ticketsStore)

const comment = ref('')

const saveTickets = async (invitationOrder: false) => {
  await ticketsStore.saveTickets({
    groupId: section.value.id,
    invitationOrder,
    hidePrice: false,
    comment: comment.value
  })
}

const deleteSelected = () => {
  ticketsStore.deleteTickets()
}
</script>

<style scoped lang="scss">
.bottom-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
}
</style>
