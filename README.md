# Vue3 低代码开发系统 - 项目结构优化

## 项目概述

这是一个基于Vue3+TypeScript+Composition API开发的低代码平台，采用了模块化设计，支持组件拖拽、属性配置、代码生成等功能。系统由三个主要模块组成：物料平台、渲染引擎和低代码开发平台。

## 优化后的项目结构

```
/
├── src/                      # 源代码
│   ├── core/                 # 核心模块
│   │   ├── material/         # 物料核心模块
│   │   │   ├── services/     # 物料服务
│   │   │   ├── types/        # 物料类型定义
│   │   │   └── utils/        # 物料工具函数
│   │   └── render/           # 渲染核心模块
│   │
│   ├── packages/             # 组件库
│   │   └── ...               # 其他组件
│   │
│   │
│   ├── views/                # 页面视图
│   │   ├── dashboard/        # 仪表盘页面
│   │   ├── draggingDragging/ # 低代码编辑器页面
│   │   │   ├── components/   # 编辑器组件
│   │   │   ├── hooks/        # 编辑器钩子函数
│   │   │   └── style/        # 编辑器样式
│   │   ├── home/             # 首页
│   │   └── material-platform/# 物料平台页面
            ├── MaterialPlatform.vue          # 物料平台主组件
            ├── dashboard.tsx                 # 仪表板页面
            ├── components.tsx                # 组件管理页面
            ├── components/                   # 共享UI组件
            │   ├── MaterialCard.vue          # 物料卡片组件
            │   ├── MaterialPreview.vue       # 物料预览组件
            │   ├── MaterialUploader.vue      # 物料上传组件
            │   ├── GroupManagement.vue       # 分组管理组件
            │   └── MaterialPanel.jsx         # 物料面板组件
            ├── pages/                        # 页面组件
            │   ├── MaterialList.tsx          # 物料列表页面
            │   ├── MaterialGroups.tsx        # 分组管理页面
            │   └── material/                 # 物料相关页面
            │       ├── MaterialCreate.tsx    # 物料创建页面
            │       ├── MaterialEdit.tsx      # 物料编辑页面
            │       ├── MaterialDetail.tsx    # 物料详情页面
            │       └── MaterialImport.tsx    # 物料导入页面
            └── services/                     # 服务层
                └── materialService.ts        # 物料服务API
│   │
│   ├── components/           # 通用组件
│   │
│   ├── stores/               # Pinia状态管理
│   │   ├── draggingDragging/ # 低代码编辑器状态
│   │   └── ...               # 其他状态
│   │
│   ├── router/               # 路由配置
│   │   ├── index.ts          # 主路由配置
│   │   └── material-platform.routes.ts # 物料平台路由
│   │
│   ├── api/                  # API接口
│   ├── utils/                # 工具函数
│   ├── assets/               # 静态资源
│   └── types/                # 全局类型定义
│
├── public/                   # 公共资源
├── docs/                     # 文档
└── ...                       # 其他配置文件
```

## 系统架构

整个系统采用了模块化、解耦合的设计理念，由三大核心部分组成：

### 1. 物料平台

物料平台负责组件物料的管理，提供了组件上传、配置、预览和发布功能：

- **物料描述协议**：使用标准的物料描述格式，支持组件的属性、事件和插槽定义
- **物料服务**：提供物料的注册、查询和管理功能
- **物料组件**：实际可用于拖拽的组件实现

### 2. 渲染引擎

渲染引擎负责组件的渲染和交互，是低代码平台的核心部分：

- **RenderEngine**：根据物料类型动态渲染组件
- **ComponentWrapper**：为组件添加拖拽、选择等交互功能
- **组件加载器**：按需动态加载组件

### 3. 低代码开发平台

低代码开发平台是面向用户的可视化开发环境：

- **拖拽编辑器**：提供拖拽、配置界面
- **属性面板**：根据物料描述动态生成配置面板
- **代码生成器**：将可视化配置转换为Vue组件代码

## 物料平台协议设计

我们设计了一套完整的物料平台协议，支持组件的描述、注册、渲染和交互：

### 基础协议

基础协议定义了组件的基本信息、属性、事件和插槽：

```typescript
// 物料组件描述
interface MaterialComponent {
  componentId: string;       // 组件唯一标识
  name: string;              // 组件名称
  type: string;              // 组件类型
  category: string;          // 组件分类
  title: string;             // 组件标题
  description?: string;      // 组件描述
  properties: MaterialProperty[]; // 组件属性列表
  events?: MaterialEvent[];  // 组件事件列表
  slots?: MaterialSlot[];    // 组件插槽列表
  isContainer?: boolean;     // 是否容器组件
}

// 页面节点描述
interface ComponentNode {
  id: string;                // 节点ID
  componentType: string;     // 组件类型
  props: Record<string, any>;// 组件属性配置
  events?: Record<string, string>; // 事件配置
  children?: ComponentNode[]; // 子节点列表
  slots?: Record<string, ComponentNode[]>; // 插槽内容
}

// 页面结构描述
interface PageSchema {
  id: string;                // 页面ID
  name: string;              // 页面名称
  title: string;             // 页面标题
  root: ComponentNode;       // 页面根组件
}
```

### 增强协议

我们参考了阿里巴巴低代码引擎的物料规范，设计了增强型协议，支持更多高级特性：

```typescript
// 扩展物料组件描述
interface EnhancedMaterialComponent extends MaterialComponent {
  npm?: {                    // NPM包信息
    package: string;         // 包名
    version: string;         // 版本
    exportName: string;      // 导出名称
  };
  group?: string;            // 组件在面板中的分组
  configure?: {              // 组件编辑配置
    props?: MaterialConfigureProp[]; // 属性面板配置
    component?: {            // 组件能力配置
      isContainer?: boolean; // 是否容器组件
      isModal?: boolean;     // 组件是否带浮层
      nestingRule?: {...};   // 嵌套规则
    };
    supports?: {             // 通用扩展配置能力
      events?: string[];     // 支持的事件列表
      loop?: boolean;        // 支持循环设置
      condition?: boolean;   // 支持条件设置
    };
  };
}

// 资产包描述
interface MaterialAssets {
  version: string;           // 资产包协议版本
  packages: MaterialPackage[]; // 资产包列表
  components: EnhancedMaterialComponent[]; // 组件描述列表
  sort: {                    // 组件分类
    groupList: string[];     // 组件分组列表
    categoryList: string[];  // 分类列表
  };
}
```

### 渲染引擎实现

渲染引擎提供了组件的渲染和交互功能，支持以下特性：

- **按需加载**：只加载页面中实际使用的组件
- **组件包装**：为组件添加拖拽、选择、编辑等交互功能
- **事件处理**：处理组件拖拽、选择、属性变更等事件
- **插槽渲染**：支持默认插槽和命名插槽的渲染
- **组件注册**：提供组件的注册和管理功能

## 使用方式

### 注册物料组件

```typescript
// 1. 创建组件描述
const buttonComponent: EnhancedMaterialComponent = {
  componentId: 'example-button',
  name: 'ExampleButton',
  type: 'Button',
  category: 'UI组件',
  title: '按钮',
  properties: [
    {
      name: 'type',
      label: '类型',
      type: 'select',
      defaultValue: 'default'
    }
  ],
  group: '基础组件'
};

// 2. 创建组件渲染配置
const buttonRegistry: MaterialComponentRegistry = {
  componentMeta: buttonComponent,
  renderConfig: {
    componentId: buttonComponent.componentId,
    component: ButtonComponent // 实际组件
  }
};

// 3. 将组件注册到渲染引擎
renderEngine.value.registerComponent(buttonRegistry);
```

### 渲染页面

```vue
<template>
  <RenderEngine
    :schema="pageSchema"
    :options="renderOptions"
    @component-selected="handleComponentSelected"
  >
    <template #default>
      <ComponentWrapper :node="pageSchema.root" />
    </template>
  </RenderEngine>
</template>

<script setup>
import { ref } from 'vue';
import { RenderEngine, ComponentWrapper } from '@/core';
import { RenderMode } from '@/core/render/types';

// 页面数据
const pageSchema = ref({
  id: 'example-page',
  name: 'ExamplePage',
  title: '示例页面',
  root: {
    id: 'root-container',
    componentType: 'Container',
    props: { title: '示例容器' },
    children: [
      {
        id: 'button-1',
        componentType: 'Button',
        props: { type: 'primary', text: '按钮' }
      }
    ]
  }
});

// 渲染配置
const renderOptions = ref({
  mode: RenderMode.DESIGN,
  editable: true,
  componentMap: { /* 组件映射 */ }
});
</script>
```

## 优化方向

1. **核心模块抽离**：将物料和渲染核心功能抽离到core目录，提供统一的API
2. **统一物料描述格式**：规范物料描述协议，确保所有组件遵循相同的格式
3. **动态组件加载优化**：改进组件的动态加载机制，支持懒加载和按需加载
4. **状态管理优化**：使用Pinia进行状态管理，并添加持久化支持
5. **路由结构优化**：规范路由配置，支持路由守卫和动态路由
6. **类型系统完善**：完善TypeScript类型定义，提高代码质量和开发体验
7. **组件库扩展**：丰富物料组件库，支持更多类型的组件

## 技术栈

- Vue 3.x
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router
- Less

## 贡献指南

欢迎贡献代码或提出建议。请先fork项目，创建分支，提交修改，然后创建Pull Request。
