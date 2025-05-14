# Vue3低代码平台核心模块 (Core)

## 概述

Core模块是Vue3低代码平台的核心部分，包含了物料平台(Material)和渲染引擎(Render)两个核心子模块。这两个模块共同构成了低代码平台的基础架构，负责组件的描述、管理、渲染和交互。

## 架构设计

```
/core
├── index.ts                # 核心模块入口
├── material/               # 物料平台
│   ├── index.ts            # 物料模块入口
│   ├── types/              # 物料类型定义
│   ├── services/           # 物料服务
│   │   └── material-registry.ts  # 物料注册服务
│   └── utils/              # 物料工具
│       └── component-utils.ts     # 组件工具函数
└── render/                 # 渲染引擎
    ├── index.ts            # 渲染模块入口
    ├── types/              # 渲染类型定义
    ├── render-engine.tsx   # 渲染引擎实现
    ├── component-wrapper.tsx # 组件包装器
    └── styles/             # 渲染样式
```

## 核心功能

### 1. 物料平台模块 (Material)

物料平台是组件物料的管理和描述系统，提供了统一的物料描述协议和注册服务。

#### 1.1 主要功能

- **物料描述协议**：定义了统一的物料描述格式，包括组件的属性、事件、插槽等信息
- **物料注册服务**：提供物料的注册、查询和管理功能
- **组件工具函数**：提供组件节点的创建、操作和查询等工具方法

#### 1.2 关键类和接口

- **MaterialRegistry**：物料注册管理服务，单例模式实现
- **MaterialComponent**：物料组件描述接口
- **ComponentNode**：页面组件节点描述接口
- **ComponentUtils**：组件工具函数集合

#### 1.3 物料描述协议

物料描述协议是一套标准化的组件描述格式，包括：

- **组件基本信息**：ID、名称、类型、分类等
- **属性定义**：支持多种类型的属性（字符串、数字、布尔、对象、数组、函数、插槽、节点、选择、颜色）
- **事件定义**：事件名称、描述、参数等
- **插槽定义**：插槽名称、描述、限制等
- **组件关系**：容器属性、根组件标识等

### 2. 渲染引擎模块 (Render)

渲染引擎负责将物料组件描述转换为实际可交互的Vue组件，实现拖拽、选择等功能。

#### 2.1 主要功能

- **组件树渲染**：根据组件树结构递归渲染组件
- **组件包装**：为组件添加拖拽、选择等交互能力
- **事件处理**：处理组件的选中、拖拽、属性变更等事件
- **多种渲染模式**：支持设计、预览、运行三种模式

#### 2.2 关键组件

- **RenderEngine**：渲染引擎主组件，负责渲染组件树
- **ComponentWrapper**：组件包装器，为组件添加交互能力

#### 2.3 渲染模式

渲染引擎支持三种渲染模式：

- **设计模式(DESIGN)**：用于编辑器，支持拖拽、选择等交互
- **预览模式(PREVIEW)**：渲染最终效果但不可编辑
- **运行模式(RUNTIME)**：在实际环境中运行，完全可交互

## API参考

### 物料平台API

#### MaterialRegistry

```typescript
// 获取单例实例
static getInstance(): MaterialRegistry

// 注册物料库
registerLibrary(library: MaterialLibrary): void

// 注册单个物料组件
registerComponent(component: MaterialComponent): void

// 获取物料库
getLibrary(libraryId: string): MaterialLibrary | undefined

// 获取所有物料库
getAllLibraries(): MaterialLibrary[]

// 获取物料组件
getComponent(componentId: string): MaterialComponent | undefined

// 根据组件类型获取物料组件
getComponentByType(type: string): MaterialComponent | undefined

// 获取所有物料组件
getAllComponents(): MaterialComponent[]

// 根据分类获取物料组件
getComponentsByCategory(category: string): MaterialComponent[]

// 移除物料库
removeLibrary(libraryId: string): void

// 移除物料组件
removeComponent(componentId: string): void

// 清空所有物料
clear(): void
```

#### ComponentUtils

```typescript
// 创建组件节点
createComponentNode(componentType: string, props?: Record<string, any>, children?: ComponentNode[]): ComponentNode

// 根据物料组件创建组件节点
createNodeFromMaterial(materialComponent: MaterialComponent): ComponentNode

// 克隆组件节点
cloneNode(node: ComponentNode): ComponentNode

// 生成唯一ID
generateId(): string

// 查找组件节点
findNodeById(rootNode: ComponentNode, nodeId: string): ComponentNode | undefined

// 获取组件的物料描述
getMaterialComponent(componentType: string): MaterialComponent | undefined

// 检查组件是否容器组件
isContainer(componentType: string): boolean

// 添加子节点
addChild(parent: ComponentNode, child: ComponentNode, index?: number): void

// 添加节点到插槽
addToSlot(parent: ComponentNode, slotName: string, child: ComponentNode): void

// 移除节点
removeNode(rootNode: ComponentNode, nodeId: string): boolean

// 移动节点
moveNode(rootNode: ComponentNode, nodeId: string, targetId: string, position: 'before' | 'after' | 'inside'): boolean
```

### 渲染引擎API

#### RenderEngine

```typescript
// Props
props: {
  // 组件树结构
  schema: ComponentNode,
  // 选中的组件ID
  selectedId?: string,
  // 渲染引擎配置
  options?: RenderEngineOptions
}

// 事件
emits: [
  // 组件选中事件
  'component-selected',
  // 组件拖拽开始
  'drag-start',
  // 组件拖拽中
  'drag-over',
  // 组件拖拽结束
  'drag-end',
  // 组件属性变更
  'prop-change',
  // 组件结构变更
  'schema-change',
  // 组件添加
  'component-added',
  // 组件移除
  'component-removed',
  // 组件移动
  'component-moved'
]
```

#### RenderEngineOptions

```typescript
interface RenderEngineOptions {
  // 渲染模式
  mode?: RenderMode;
  // 是否启用编辑功能
  editable?: boolean;
  // 是否显示组件占位符
  showPlaceholder?: boolean;
  // 是否启用拖拽功能
  draggable?: boolean;
  // 是否启用选择功能
  selectable?: boolean;
  // 是否显示组件轮廓
  showOutline?: boolean;
  // 自定义组件映射
  componentMap?: Record<string, any>;
  // 自定义属性转换器
  propTransformers?: Record<string, (value: any) => any>;
  // 事件处理器
  eventHandlers?: Record<string, (...args: any[]) => void>;
}
```

## 使用示例

### 1. 注册物料组件

```typescript
import { MaterialRegistry } from '@/core/material';

// 获取物料注册服务实例
const registry = MaterialRegistry.getInstance();

// 注册物料组件
registry.registerComponent({
  componentId: 'button-001',
  name: 'ElButton',
  type: 'el-button',
  category: '基础组件',
  title: '按钮',
  description: '常用的操作按钮',
  icon: 'button-icon',
  properties: [
    {
      name: 'type',
      label: '类型',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: '主要按钮', value: 'primary' },
        { label: '成功按钮', value: 'success' },
        { label: '警告按钮', value: 'warning' },
        { label: '危险按钮', value: 'danger' },
        { label: '信息按钮', value: 'info' }
      ]
    },
    {
      name: 'text',
      label: '文本',
      type: 'string',
      defaultValue: '按钮'
    }
  ],
  events: [
    {
      name: 'click',
      label: '点击事件',
      description: '点击按钮时触发'
    }
  ],
  isContainer: false
});
```

### 2. 使用渲染引擎渲染组件

```vue
<template>
  <RenderEngine 
    :schema="schema" 
    :selectedId="selectedId"
    :options="renderOptions"
    @component-selected="handleComponentSelected"
    @schema-change="handleSchemaChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RenderEngine, RenderMode } from '@/core/render';
import { ComponentUtils } from '@/core/material';

// 创建一个简单的组件树
const schema = ref(
  ComponentUtils.createComponentNode('el-container', {}, [
    ComponentUtils.createComponentNode('el-header', { height: '60px' }, [
      ComponentUtils.createComponentNode('el-button', { type: 'primary', text: '点击我' })
    ]),
    ComponentUtils.createComponentNode('el-main', {})
  ])
);

const selectedId = ref('');
const renderOptions = {
  mode: RenderMode.DESIGN,
  editable: true,
  draggable: true,
  selectable: true,
  showOutline: true
};

// 处理组件选中事件
const handleComponentSelected = (node) => {
  selectedId.value = node.id;
};

// 处理组件结构变更事件
const handleSchemaChange = (newSchema) => {
  console.log('Schema changed:', newSchema);
};
</script>
```

## 最佳实践

1. **组件描述规范化**：遵循物料描述协议，确保组件描述完整、准确
2. **组件粒度设计**：合理设计组件粒度，使组件既有足够的复用性又有足够的定制性
3. **渲染模式区分**：根据不同场景选择合适的渲染模式，设计时使用DESIGN模式，预览时使用PREVIEW模式
4. **拖拽交互优化**：优化拖拽交互体验，提供明确的拖拽位置提示
5. **性能优化**：对于大型组件树，考虑使用虚拟滚动和懒加载等技术提升性能

## 扩展与定制

1. **自定义组件映射**：通过RenderEngineOptions的componentMap自定义组件实现
2. **属性转换器**：使用propTransformers自定义属性转换逻辑
3. **事件处理器**：通过eventHandlers注册自定义事件处理函数
4. **样式定制**：覆盖默认样式，实现自定义外观 