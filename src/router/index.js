import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: '首页',
    component: () => import('@/views/index')
  },
  {
    path: '/v1.0',
    name: 'v1.0',
    component: () => import('@/views/1.0/index')
  },
  {
    path: '/v1.1',
    name: 'v1.1',
    component: () => import('@/views/1.1/index')
  }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
