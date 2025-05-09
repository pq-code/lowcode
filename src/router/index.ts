import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

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
    path: '/dragging-dragging',
    name: 'DraggingDragging',
    meta: {
      title: '低代码编辑器'
    }
  }
]

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
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
    path: '/dragging-dragging',
    name: 'DraggingDragging',
    component: () => import('@/views/draggingDragging/draggingDragging.vue'),
    meta: {
      title: '低代码编辑器'
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置守卫
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // 设置页面标题
  document.title = `${to.meta.title || '低代码平台'}`
  next()
})

export default router 
 