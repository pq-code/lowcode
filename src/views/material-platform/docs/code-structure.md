# 物料平台代码结构说明

## 概述

物料平台是一个用于管理、预览和使用组件物料的系统。本文档详细说明了物料平台的代码结构和各文件的作用。

## 目录结构

```
src/views/material-platform/
├── index.ts                   # 导出主组件和路由配置
├── MaterialPlatform.vue       # 主布局组件
├── README.md                  # 项目说明
├── components/                # 共享组件
│   ├── MaterialCard.vue       # 物料卡片组件
│   ├── MaterialPreview.vue    # 物料预览组件
│   ├── MaterialUploader.vue   # 物料上传组件
│   └── GroupManagement.vue    # 分组管理组件
├── pages/                     # 页面组件
│   ├── dashboard/             # 仪表盘页面
│   │   ├── index.tsx          # 仪表盘组件
│   │   └── style.css          # 仪表盘样式
│   ├── materials/             # 物料管理页面
│   │   └── index.tsx          # 物料列表组件
│   ├── groups/                # 分组管理页面
│   │   └── index.tsx          # 分组管理组件
│   ├── upload/                # 上传页面
│   │   └── index.tsx          # 上传组件
│   └── preview/               # 预览页面
│       └── index.tsx          # 预览组件
├── services/                  # API服务
│   └── materialService.ts     # 物料服务API
├── hooks/                     # 自定义钩子
│   ├── useMaterials.ts        # 物料管理相关钩子
│   └── useGroups.ts           # 分组管理相关钩子
├── types/                     # 类型定义
│   └── index.ts               # 类型定义
└── docs/                      # 文档
    ├── optimization-guide.md  # 优化指南
    └── code-structure.md      # 代码结构说明（本文档）
```

## 主要文件说明

### 入口文件

- **index.ts**: 导出主组件和路由配置，作为物料平台的入口点。

### 主布局组件

- **MaterialPlatform.vue**: 物料平台的主布局组件，包含顶部导航、侧边栏和主内容区。

### 类型定义

- **types/index.ts**: 定义了物料平台所有的类型，包括物料、分组等类型。

### 自定义钩子

- **hooks/useMaterials.ts**: 封装物料管理相关的业务逻辑，包括物料的加载、过滤、创建、更新和删除等操作。
- **hooks/useGroups.ts**: 封装分组管理相关的业务逻辑，包括分组的加载、创建、更新和删除等操作。

### API服务

- **services/materialService.ts**: 封装与后端API的通信，提供物料和分组的CRUD操作。

### 组件

- **components/MaterialCard.vue**: 物料卡片组件，用于展示物料的基本信息。
- **components/MaterialPreview.vue**: 物料预览组件，用于预览物料的渲染效果。
- **components/MaterialUploader.vue**: 物料上传组件，用于上传和创建物料。
- **components/GroupManagement.vue**: 分组管理组件，用于管理物料分组。

### 页面

- **pages/dashboard/index.tsx**: 仪表盘页面，展示物料平台的概览信息。
- **pages/materials/index.tsx**: 物料管理页面，展示物料列表和提供物料管理功能。
- **pages/groups/index.tsx**: 分组管理页面，提供分组的管理功能。
- **pages/upload/index.tsx**: 上传页面，用于上传和创建物料。
- **pages/preview/index.tsx**: 预览页面，用于预览物料的渲染效果。

## 数据流

物料平台的数据流遵循以下模式：

1. **API层（services）**: 负责与后端API通信，获取和管理数据。
2. **业务逻辑层（hooks）**: 封装业务逻辑，处理数据，并提供给组件使用。
3. **UI层（components & pages）**: 负责渲染UI和处理用户交互。

示例数据流：

```
用户点击加载物料按钮
↓
页面组件调用 hooks 中的 loadMaterials 方法
↓
loadMaterials 方法调用 services 中的 fetchMaterialsByGroup 方法
↓
fetchMaterialsByGroup 方法与后端API通信，获取物料数据
↓
数据返回给 loadMaterials 方法，更新状态
↓
页面组件重新渲染，展示最新的物料数据
```

## 组件设计

物料平台的组件设计遵循以下原则：

1. **单一职责**: 每个组件只负责一项功能。
2. **可复用性**: 设计可复用的组件，减少代码重复。
3. **关注点分离**: 使用 hooks 分离业务逻辑和 UI 展示。

## 路由结构

物料平台的路由结构如下：

- **/material-platform**: 物料平台首页，默认重定向到物料管理页面。
- **/material-platform/materials**: 物料管理页面，展示物料列表和提供物料管理功能。
- **/material-platform/upload**: 上传页面，用于上传和创建物料。
- **/material-platform/preview**: 预览页面，用于预览物料的渲染效果。
- **/material-platform/preview/:id**: 物料详情预览页面，用于预览指定物料的渲染效果。
- **/material-platform/groups**: 分组管理页面，提供分组的管理功能。
- **/material-platform/create**: 创建物料页面，用于创建新的物料。
- **/material-platform/edit/:id**: 编辑物料页面，用于编辑指定物料。
- **/material-platform/detail/:id**: 物料详情页面，展示指定物料的详细信息。 