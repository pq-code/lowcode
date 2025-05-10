/**
 * 物料平台路由配置
 */
import type { RouteRecordRaw } from 'vue-router';

const materialPlatformRoutes: Array<RouteRecordRaw> = [
  {
    path: '/material-platform',
    name: 'MaterialPlatform',
    component: () => import('@/views/material-platform/MaterialPlatform.vue'),
    meta: {
      title: '物料平台'
    },
    children: [
      {
        path: 'upload',
        name: 'MaterialUpload',
        component: () => import('@/views/material-platform/components/MaterialUploader.vue'),
        meta: {
          title: '上传组件'
        }
      },
      {
        path: 'create',
        name: 'MaterialCreate',
        component: () => import('@/views/material-platform/components/MaterialUploader.vue'),
        meta: {
          title: '创建物料'
        }
      },
      {
        path: 'preview/:id',
        name: 'MaterialPreview',
        component: () => import('@/views/material-platform/components/MaterialPreview.vue'),
        meta: {
          title: '物料预览'
        }
      },
      {
        path: 'edit/:id',
        name: 'MaterialEdit',
        component: () => import('@/views/material-platform/components/MaterialUploader.vue'),
        meta: {
          title: '编辑物料'
        }
      },
      {
        path: 'groups',
        name: 'MaterialGroups',
        component: () => import('@/views/material-platform/components/GroupManagement.vue'),
        meta: {
          title: '分组管理'
        }
      }
    ]
  }
];

export default materialPlatformRoutes; 