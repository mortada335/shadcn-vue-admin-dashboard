import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
//@ts-ignore
import { setupLayouts } from 'virtual:generated-layouts'
import { setupGuards } from './gurads'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// setupGuards(router)

export default router
