/**
 * 物料平台路由配置
 */
import type { RouteRecordRaw } from 'vue-router';

export const materialPlatformRoutes: RouteRecordRaw[] = [
  {
    path: '/material-platform',
    name: 'MaterialPlatform',
    component: () => import('../views/material-platform/MaterialPlatform.vue'),
    meta: {
      title: '物料平台',
      icon: 'component'
    },
    children: [
      {
        path: 'dashboard',
        name: 'MaterialDashboard',
        component: () => import('../views/material-platform/dashboard.tsx'),
        meta: {
          title: '物料概览',
          icon: 'dashboard'
        }
      },
      {
        path: 'components',
        name: 'MaterialComponents',
        component: () => import('../views/material-platform/components.tsx'),
        meta: {
          title: '组件管理',
          icon: 'list'
        }
      },
      {
        path: 'materials',
        name: 'MaterialManagement',
        component: () => import('../views/material-platform/pages/MaterialList.tsx'),
        meta: {
          title: '物料管理',
          icon: 'component'
        }
      },
      {
        path: 'create',
        name: 'MaterialCreate',
        component: () => import('../views/material-platform/pages/material/MaterialCreate.tsx'),
        meta: {
          title: '创建物料',
          icon: 'plus',
          hideInMenu: true
        }
      },
      {
        path: 'edit/:id',
        name: 'MaterialEdit',
        component: () => import('../views/material-platform/pages/material/MaterialEdit.tsx'),
        meta: {
          title: '编辑物料',
          icon: 'edit',
          hideInMenu: true
        }
      },
      {
        path: 'detail/:id',
        name: 'MaterialDetail',
        component: () => import('../views/material-platform/pages/material/MaterialDetail.tsx'),
        meta: {
          title: '物料详情',
          icon: 'info',
          hideInMenu: true
        }
      },
      {
        path: 'import',
        name: 'MaterialImport',
        component: () => import('../views/material-platform/pages/material/MaterialImport.tsx'),
        meta: {
          title: '导入物料',
          icon: 'upload',
          hideInMenu: true
        }
      },
      {
        path: 'upload',
        name: 'MaterialUpload',
        component: () => import('../views/material-platform/components/MaterialUploader.vue'),
        meta: {
          title: '组件上传',
          icon: 'upload'
        }
      },
      {
        path: 'preview',
        name: 'MaterialPreview',
        component: () => import('../views/material-platform/components/MaterialPreview.vue'),
        meta: {
          title: '组件预览',
          icon: 'view'
        }
      },
      {
        path: 'groups',
        name: 'MaterialGroups',
        component: () => import('../views/material-platform/pages/MaterialGroups.tsx'),
        meta: {
          title: '分组管理',
          icon: 'folder'
        }
      }
    ]
  }
];

export default materialPlatformRoutes; 