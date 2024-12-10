import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/LoginPage.vue'
import AdminIntro from '../views/AdminIntro.vue'
import EloquentTable from '../views/EloquentTable.vue'
import NotFoundPage from '../views/404Page.vue'
import auth from '@/middleware/auth'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        layout: 'empty'
      }
    },
    {
      path: '/',
      name: 'statistics',
      component: AdminIntro,
      meta: {
        middleware: [auth],
        permissions: ['admin_panel']
      }
    },
    {
      path: '/m/:model',
      name: 'model',
      component: EloquentTable,
      meta: {
        middleware: [auth],
        permissions: ['admin_panel']
      }
    },
    {
      path: '/scheme/:id',
      name: 'scheme',
      component: () => import('../views/SchemePage.vue'),
      meta: {
        middleware: [auth],
        permissions: ['admin_shows']
      }
    },
    {
      path: '/section/:id',
      name: 'section',
      component: () => import('../views/SectionPage.vue'),
      meta: {
        middleware: [auth],
        permissions: ['admin_shows']
      }
    },
    {
      path: '/show/:id',
      name: 'show',
      component: () => import('../views/show/ShowTimetablesPage.vue'),
      meta: {
        middleware: [auth],
        permissions: ['admin_shows']
      }
    },
    {
      path: '/show/:id/:tid/prices',
      name: 'setPrices',
      component: () => import('../views/show/SetTimetablesPricesPage.vue'),
      meta: {
        middleware: [auth],
        permissions: ['admin_shows']
      }
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('../views/ReportPage.vue'),
      meta: {
        middleware: [auth],
        permissions: ['admin_panel']
      }
    },
    {
      path: '/tourniquet',
      name: 'tourniquet',
      component: () => import('../views/TourniquetPage.vue'),
      meta: {
        middleware: [auth],
        permissions: ['admin_panel']
      }
    },
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: NotFoundPage,
      meta: {
        layout: 'empty'
      }
    }
  ]
})

function nextFactory(context: any, middleware: any[], index: number) {
  const subsequentMiddleware = middleware[index]
  if (!subsequentMiddleware) return context.next
  return (...parameters: any[]) => {
    context.next(...parameters)
    const nextMiddleware = nextFactory(context, middleware, index + 1)
    subsequentMiddleware({ ...context, next: nextMiddleware })
  }
}

router.beforeEach((to, from, next) => {
  if (to.meta.permissions) {
    const store = useAuthStore()
    const permissions = to.meta.permissions as string[]
    if (!store.hasPermissions(permissions)) return next('/login')
  }

  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware]
    const context = { from, next, router, to }
    const nextMiddleware = nextFactory(context, middleware, 1)
    return middleware[0]({ ...context, next: nextMiddleware })
  }

  return next()
})

export default router
