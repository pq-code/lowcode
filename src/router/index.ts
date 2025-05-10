import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import materialPlatformRoutes from './material-platform.routes'

// 定义meta类型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

// 导出路由映射，用于侧边栏菜单
export const routerMap = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: '仪表盘'
    }
  },
  {
    path: '/lowcode',
    name: 'LowCode',
    meta: {
      title: '低代码编辑器'
    }
  },
  {
    path: '/material-platform',
    name: 'MaterialPlatform',
    meta: {
      title: '物料平台'
    }
  }
]

// 基础路由
const baseRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/Home.vue'),
    meta: {
      title: '低代码开发系统'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/dashboard.vue'),
    meta: {
      title: '仪表盘'
    }
  },
  {
    path: '/lowcode',
    name: 'LowCode',
    component: () => import('@/views/draggingDragging/draggingDragging.vue'),
    meta: {
      title: '低代码编辑器'
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// 合并所有路由
const routes: Array<RouteRecordRaw> = [
  ...baseRoutes,
  ...materialPlatformRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置守卫
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // 设置页面标题
  document.title = `${to.meta.title || 'Vue3 低代码开发系统'}`
  next()
})

export default router 
 