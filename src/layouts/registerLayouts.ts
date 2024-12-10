import AdminLayout from '@/layouts/AdminLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'

export default (app: any) => {
  app.component('admin-layout', AdminLayout)
  app.component('empty-layout', EmptyLayout)

  registerEloquentCustomComponents(app)
}

function registerEloquentCustomComponents(app: any) {
  const components = import.meta.glob('@/components/eloquent/custom/*.vue', {
    eager: true
  })

  Object.entries(components).forEach(([path, definition]) => {
    // @ts-ignore
    const componentName = path
      ?.split('/')
      .pop()
      .replace(/\.\w+$/, '')
    // @ts-ignore
    app.component(componentName, definition.default)
  })
}
