<template>
  <n-space :size="14" :wrap="false">
    <n-tooltip>
      <template #trigger>
        <n-button text @click.stop="showDetails">
          <n-icon :component="EyeOutline" size="large"></n-icon>
        </n-button>
      </template>
      Детали заказа
    </n-tooltip>

    <n-tooltip>
      <template #trigger>
        <n-button text @click.stop="printTickets">
          <n-icon :component="PrintOutline" size="large"></n-icon>
        </n-button>
      </template>
      Печать билетов
    </n-tooltip>

    <n-tooltip v-if="object.email && object.paid">
      <template #trigger>
        <n-button text @click.stop="mailTickets">
          <n-icon :component="MailOutline" size="large"></n-icon>
        </n-button>
      </template>
      Отправить билеты на почту
    </n-tooltip>
  </n-space>

  <n-modal
    v-model:show="showModal"
    closable
    preset="card"
    size="medium"
    :style="{ width: '800px' }"
    :title="`Детали заказа # ${object.id}`">
    <n-grid :cols="2" item-responsive :x-gap="20" :y-gap="20">
      <n-grid-item span="2 700:1">
        <n-h4>О заказе</n-h4>
        <n-table striped>
          <tbody>
            <tr>
              <td>Id заказа</td>
              <td>{{ details.id }}</td>
            </tr>
            <tr>
              <td>Событие</td>
              <td>{{ details.timetable?.show?.title?.ru }}</td>
            </tr>
            <tr>
              <td>Сеанс</td>
              <td>{{ formatDateTime(details.timetable?.date) }}</td>
            </tr>
            <tr>
              <td>API</td>
              <td>{{ details.vendor }}</td>
            </tr>
            <tr>
              <td>Начальная сумма</td>
              <td>{{ formatCurrency(details.original_price) }}</td>
            </tr>
            <tr>
              <td>Внутренняя комиссия</td>
              <td>{{ formatCurrency(details.internal_fee) }}</td>
            </tr>
            <tr>
              <td>Верхняя комиссия</td>
              <td>{{ formatCurrency(details.external_fee) }}</td>
            </tr>
            <tr v-if="details.discount_rate">
              <td>Скидка на мероприятие</td>
              <td>{{ details.discount_rate }}%</td>
            </tr>
            <tr v-if="details.promocode_discount_rate">
              <td>Скидка по промокоду</td>
              <td>
                {{ details.promocode_discount_rate }}% ({{ details.promocode }})
              </td>
            </tr>
            <tr>
              <td>Финальная сумма</td>
              <td>{{ formatCurrency(details.price) }}</td>
            </tr>
            <tr v-if="details.pay_system">
              <td>Метод оплаты</td>
              <td>
                <span class="badge" :class="`${details.pay_system}`">
                  {{ $t(details.pay_system) }}
                </span>
              </td>
            </tr>
            <tr v-if="details.pay_system_imitated">
              <td>Метод оплаты (имитированный)</td>
              <td>
                <span class="badge" :class="`${details.pay_system_imitated}`">
                  {{ $t(details.pay_system_imitated) }}
                </span>
              </td>
            </tr>
            <tr>
              <td>Сумма оплаты</td>
              <td>
                {{ formatCurrency(details.pay_sum) }}
              </td>
            </tr>
            <tr>
              <td>Создан</td>
              <td>{{ formatDateTime(details.created_at) }}</td>
            </tr>
            <tr>
              <td>Статус</td>
              <td>
                <n-tag v-if="details.reservation" type="warning">Резерв</n-tag>
                <n-tag v-if="details.paid" type="success">Оплачен</n-tag>
                <n-tag v-if="!details.paid && !details.deleted_at" type="info"
                  >Создан</n-tag
                >
                <n-tag v-if="details.deleted_at" type="error">Удален</n-tag>
              </td>
            </tr>
            <tr>
              <td>Билеты отправлены</td>
              <td>
                <n-tag v-if="details.sent" type="success">Отправлены</n-tag>
                <n-tag v-if="!details.sent" type="default">Нет</n-tag>
              </td>
            </tr>
            <tr v-if="details.comment">
              <td>Комментарий</td>
              <td>{{ details.comment }}</td>
            </tr>
            <tr v-if="details.pay_id">
              <td>Id платежа</td>
              <td style="word-break: break-all">{{ details.pay_id }}</td>
            </tr>
            <tr>
              <td>Указывать в отчете организатора</td>
              <td>
                <n-tag v-if="details.show_to_organizer" type="success">Да</n-tag>
                <n-tag v-if="!details.show_to_organizer" type="default">Нет</n-tag>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-grid-item>
      <n-grid-item span="2 700:1">
        <n-h4>О клиенте</n-h4>
        <n-table striped>
          <tbody>
            <tr>
              <td>Тип покупателя</td>
              <td>
                <n-tag type="info" v-if="details.initiatedBy === 'organizer'"
                  >Организатор</n-tag
                >
                <n-tag
                  type="success"
                  v-else-if="details.initiatedBy === 'kassir'"
                  >Кассир</n-tag
                >
                <n-tag type="default" v-else>Пользователь</n-tag>
              </td>
            </tr>
            <tr>
              <td>Имя</td>
              <td>{{ details.name }}</td>
            </tr>
            <tr>
              <td>Телефон</td>
              <td>{{ details.phone }}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{{ details.email }}</td>
            </tr>
          </tbody>
        </n-table>
        <n-h4>О Билете</n-h4>
        <n-table striped>
          <tbody>
            <tr v-for="item in details.order_items" :key="`item-${item.id}`">
              <td v-if="item.section">Сектор: {{ item.section.title.ru }}</td>
              <td v-if="item.row">Ряд: {{ item.row }}</td>
              <td v-if="item.seat">Место: {{ item.seat }}</td>
              <td v-if="!item.row && !item.seat && item.pricegroup" colspan="2">
                {{ item.pricegroup.title.ru }}
              </td>
              <td
                v-if="!item.row && !item.seat && !item.pricegroup"
                colspan="2">
                Входной
              </td>
              <td>{{ formatCurrency(item.price) }}</td>
            </tr>
          </tbody>
        </n-table>
      </n-grid-item>
    </n-grid>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NButton,
  NGrid,
  NGridItem,
  NH4,
  NIcon,
  NModal,
  NSpace,
  NTable,
  NTag,
  NTooltip,
  useDialog
} from 'naive-ui'
import { EyeOutline, MailOutline, PrintOutline } from '@vicons/ionicons5'
import { ref } from 'vue'
import { useEloquentStore } from '@/stores/eloquent.store'
import { formatCurrency, formatDateTime } from '@/services/helper.service'
import $axios from '@/api/api.service'

const props = defineProps({
  object: {
    required: true,
    type: Object
  }
})

const eloquentStore = useEloquentStore()
const dialog = useDialog()
const showModal = ref(false)
const details = ref(null)

const showDetails = async () => {
  try {
    const res = await eloquentStore.getModel(props.object.id, 'order')
    details.value = res?.data
    showModal.value = true
  } catch (e) {
    console.log(e)
  }
  showModal.value = true
}

const rowClicked = () => {
  showDetails()
}

const printTickets = () => {
  window.open(props.object.ticketsLink, '_blank')
}

const mailTickets = () => {
  $axios.post(`/admin/order/${props.object.id}/tickets/send`).then((res) => {
    if (res.data) {
      dialog.success({ title: 'Письмо отправлено' })
    }
  })
}

defineExpose({ rowClicked })
</script>
