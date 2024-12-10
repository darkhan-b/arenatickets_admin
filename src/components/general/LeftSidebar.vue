<template>
  <div>
    <n-button
      class="menu-toggle-btn"
      v-if="windowWidth <= 768"
      circle
      @click="collapsed = !collapsed">
      <n-icon
        :component="collapsed ? MenuOutline : CloseOutline"
        size="small"></n-icon>
    </n-button>
    <n-layout-sider
      class="left-menu"
      :class="{ collapsed }"
      bordered
      collapse-mode="width"
      :collapsed-width="windowWidth > 768 ? 64 : 0"
      :width="240"
      style="height: 100vh"
      :collapsed="collapsed"
      :show-trigger="windowWidth > 768"
      @collapse="collapsed = true"
      @expand="collapsed = false">
      <div class="top-menu-part">
        <n-collapse arrow-placement="right">
          <n-collapse-item name="1">
            <template #header>
              <n-space vertical>
                <div v-if="!collapsed">
                  <div class="client-name">
                    <img src="/images/logo_writing.svg" alt="" />
                  </div>
                </div>
                <n-icon v-if="collapsed" :component="PersonOutline" size="22" />
              </n-space>
            </template>
            <div v-if="!collapsed" class="user-name mb-15">{{ user.name }}</div>

            <n-tooltip>
              <template #trigger>
                <n-button text @click="logout">
                  <n-icon :component="LogOutOutline" size="22" />
                  <span v-if="!collapsed" class="ms-10">Выйти</span>
                </n-button>
              </template>
              Выйти
            </n-tooltip>
          </n-collapse-item>
        </n-collapse>
        <n-button
          class="menu-close-btn"
          text
          v-if="windowWidth <= 768"
          circle
          @click="collapsed = !collapsed">
          <n-icon :component="CloseOutline" size="large" color="gray"></n-icon>
        </n-button>
      </div>
      <n-menu
        ref="menu"
        :collapsed="collapsed"
        :collapsed-width="64"
        v-model:value="selectedKey"
        :collapsed-icon-size="22"
        :options="menuOptions" />
    </n-layout-sider>
  </div>
</template>

<script setup lang="ts">
import {
  NMenu,
  NLayoutSider,
  NIcon,
  NTooltip,
  NButton,
  NCollapse,
  NCollapseItem,
  NSpace
} from 'naive-ui'
import { h, onMounted, ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import {
  LogOutOutline,
  MenuOutline,
  CloseOutline,
  FishOutline,
  MapOutline,
  RocketOutline,
  PeopleOutline,
  StarOutline,
  CalendarOutline,
  CartOutline,
  FileTrayFullOutline,
  ReaderOutline,
  PersonOutline,
  AlertCircleOutline,
  WifiOutline,
  DiamondOutline,
  TicketOutline,
  ScanOutline
} from '@vicons/ionicons5'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useGeneralStore } from '@/stores/general.store'
import { storeToRefs } from 'pinia'
const authStore = useAuthStore()
const generalStore = useGeneralStore()
const route = useRoute()
const router = useRouter()

const { windowWidth } = storeToRefs(generalStore)
const { clientName, user } = storeToRefs(authStore)

const collapsed = ref(windowWidth.value <= 768)
const selectedKey = ref('/')
const menu: any = ref(null)

// no idea why does not work without timeout, nextTick not working either
onMounted(() => {
  setTimeout(() => {
    selectedKey.value = route.path
    menu?.value?.showOption(route.path)
  }, 50)
})

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const logout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

function renderLink(routeName: string, title: string, routeParams = {}) {
  return () =>
    h(
      RouterLink,
      {
        to: {
          name: routeName,
          params: routeParams
        }
      },
      { default: () => title }
    )
}

function renderExternalLink(routeName: string, title: string) {
  return () =>
    h(
      'a',
      {
        href: routeName,
        target: '_blank'
      },
      { default: () => title }
    )
}

const menuOptions: MenuOption[] = [
  {
    label: renderLink('statistics', 'Статистика'),
    key: '/',
    icon: renderIcon(RocketOutline),
    permissions: ['admin_panel']
  },
  {
    label: renderLink('model', 'События', { model: 'show' }),
    show: authStore.hasPermissions(['admin_shows']),
    icon: renderIcon(StarOutline),
    key: '/m/show'
  },
  {
    label: renderLink('model', 'Сеансы', { model: 'timetable' }),
    show: authStore.hasPermissions(['admin_shows']),
    icon: renderIcon(CalendarOutline),
    key: '/m/timetable'
  },
  {
    label: 'Площадки',
    icon: renderIcon(MapOutline),
    key: 'venues_parent',
    show: authStore.hasPermissions(['admin_shows']),
    children: [
      {
        label: renderLink('model', 'Города', { model: 'city' }),
        key: '/m/city'
      },
      {
        label: renderLink('model', 'Площадки', { model: 'venue' }),
        key: '/m/venue'
      },
      {
        label: renderLink('model', 'Рассадки', { model: 'venue_scheme' }),
        key: '/m/venue_scheme'
      },
      {
        label: renderLink('model', 'Категории мест', {
          model: 'venue_category'
        }),
        key: '/m/venue_category'
      }
    ]
  },
  {
    label: renderLink('model', 'Заказы', { model: 'order' }),
    show: authStore.hasPermissions(['admin_shows']),
    icon: renderIcon(CartOutline),
    key: '/m/order'
  },
  {
    label: renderLink('model', 'Промокоды', { model: 'promocode' }),
    show: authStore.hasPermissions(['admin_shows']),
    icon: renderIcon(DiamondOutline),
    key: '/m/promocode'
  },
  {
    label: renderLink('model', 'Макеты билетов', { model: 'ticket_design' }),
    show: authStore.hasPermissions(['admin_shows']),
    icon: renderIcon(TicketOutline),
    key: '/m/ticket_design'
  },
  {
    label: renderLink('model', 'Клиенты', { model: 'client' }),
    show: authStore.hasPermissions(['admin_clients']),
    icon: renderIcon(FishOutline),
    key: '/m/client'
  },
  {
    label: 'Пользователи',
    show: authStore.hasPermissions(['admin_shows']),
    icon: renderIcon(PeopleOutline),
    key: '/m/organizer',
    children: [
      {
        label: renderLink('model', 'Организаторы', { model: 'organizer' }),
        show: authStore.hasPermissions(['admin_shows']),
        key: '/m/organizer'
      },
      {
        label: renderLink('model', 'Партнеры', { model: 'api_partner' }),
        show: authStore.hasPermissions(['admin_shows']),
        key: '/m/api_partner'
      },
      {
        label: renderLink('model', 'Покупатели', { model: 'consumer' }),
        show: authStore.hasPermissions(['admin_shows']),
        key: '/m/consumer'
      },
      {
        label: renderLink('model', 'Сотрудники', { model: 'staff' }),
        show: authStore.hasPermissions(['admin_panel']),
        key: '/m/staff'
      }
    ]
  },
  {
    label: renderLink('report', 'Отчеты'),
    show: authStore.hasPermissions(['admin_panel']),
    icon: renderIcon(ReaderOutline),
    key: '/report'
  },
  {
    label: 'Сайт',
    show: authStore.hasPermissions(['admin_shows']),
    icon: renderIcon(WifiOutline),
    key: '/site',
    children: [
      {
        label: renderLink('model', 'Страницы', { model: 'page' }),
        key: '/m/page'
      },
      {
        label: renderLink('model', 'Слайды', { model: 'slide' }),
        key: '/m/slide'
      },
      {
        label: renderLink('model', 'Категории', { model: 'category' }),
        key: '/m/category'
      },
      {
        label: renderLink('model', 'Настройки', { model: 'setting' }),
        key: '/m/setting'
      },
      {
        label: renderLink('model', 'Переводы', { model: 'translation' }),
        key: '/m/translation'
      },
      {
        label: renderLink('model', 'Email подписки', { model: 'subscription' }),
        key: '/m/subscription'
      }
    ]
  },
  {
    label: renderLink('model', 'Условия', { model: 'show_term' }),
    show: authStore.hasPermissions(['admin_panel']),
    icon: renderIcon(AlertCircleOutline),
    key: '/m/show_term'
  },
  {
    label: 'Документация',
    show: authStore.hasPermissions(['admin_shows']),
    icon: renderIcon(FileTrayFullOutline),
    key: '/docs',
    children: [
      {
        label: renderExternalLink(
          'https://api.arenatickets.kz/doc/partner',
          'Партнерам'
        ),
        key: '/doc/partner'
      },
      {
        label: renderExternalLink(
          'https://api.arenatickets.kz/scan/release.apk',
          'Скан приложение'
        ),
        key: '/scan/release'
      }
    ]
  },
  {
    label: renderLink('tourniquet', 'Турникеты'),
    show: authStore.hasPermissions(['admin_panel']),
    icon: renderIcon(ScanOutline),
    key: '/tourniquet'
  }
]
</script>

<style lang="scss" scoped>
.left-menu {
  .top-menu-part {
    min-height: 34px;
    display: flex;
    flex-direction: column;
    padding: 18px 10px 18px 32px;
    border-bottom: 1px solid rgb(239, 239, 245);
    .client-name {
      img {
        height: 40px;
      }
    }
    .user-name {
      font-weight: 500;
      font-size: 13px;
      color: #828282;
    }
    :deep .n-collapse-item__header-main {
      justify-content: space-between;
    }
  }
  .bottom-menu-part {
    bottom: 0;
    left: 0;
    position: absolute;
    padding: 0 32px;
    height: 65px;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    width: calc(100% - 65px);
    border-top: 1px solid rgb(239, 239, 245);
    z-index: 2;
    background: white;
    img.t-img {
      max-width: 113px;
      width: 100%;
      object-fit: contain;
    }
    .client-name {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
      margin-bottom: 8px;
    }
  }
  &.collapsed {
    .bottom-menu-part {
      padding: 0;
      justify-content: center;
      width: calc(100% - 1px);
      align-items: center;
      img.t-img {
        max-width: 28px;
      }
    }
    .top-menu-part {
      padding: 18px;
      align-items: center;
      justify-content: center;
      :deep .n-collapse-item-arrow {
        display: none !important;
      }
      :deep .n-collapse-item__header-main {
        justify-content: center;
      }
      :deep .n-collapse-item__content-inner {
        text-align: center;
      }
    }
  }
}
.menu-toggle-btn {
  position: fixed;
  bottom: 15px;
  right: 15px;
  z-index: 3;
}
.menu-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 3;
}

@media screen and (max-width: 768px) {
  .left-menu {
    position: absolute;
    z-index: 4;
    overflow: hidden;
    .top-menu-part {
      padding-top: 40px;
    }
  }
}
</style>
