import { useCookie } from '@/composable/useCookie'
import { type Router } from 'vue-router'

export const setupGuards = (router: Router) => {
  return
  router.beforeEach((to) => {
    if (to.path == '/login') return true
    const isLoggedIn = !!(useCookie('user-data').value || useCookie('refresh-token').value)
    if (!isLoggedIn && to.path != '/login') return { path: '/login' }
    return true
  })
}
