# 渲染引擎模块（Render Engine）

渲染引擎模块是低代码平台的核心执行引擎，负责根据页面结构描述（Schema）和组件物料，动态渲染出可交互的页面。本模块提供了组件的动态渲染、拖拽交互、属性配置等核心功能。

## 模块设计

渲染引擎模块采用了组件化设计，主要包含以下部分：

1. **RenderEngine**：渲染引擎主组件，负责管理组件注册和页面渲染
2. **ComponentWrapper**：组件包装器，为每个渲染的组件提供拖拽、选择等交互能力
3. **类型定义**：定义渲染引擎的配置项、事件类型等

## 渲染引擎（RenderEngine）

RenderEngine是渲染引擎的核心组件，负责以下功能：

1. **组件注册管理**：提供组件的注册、获取和管理功能
2. **页面渲染**：根据页面结构描述渲染组件树
3. **事件处理**：处理组件拖拽、选择、属性变更等事件
4. **上下文提供**：为子组件提供渲染上下文

### 渲染模式

渲染引擎支持三种渲染模式：

```typescript
export enum RenderMode {
  /** 设计模式，用于设计器，支持拖拽、选择等 */
  DESIGN = 'design',
  /** 预览模式，可以交互但不可以编辑 */
  PREVIEW = 'preview',
  /** 运行模式，适用于发布后的应用 */
  RUNTIME = 'runtime'
}
```

### 渲染引擎事件

渲染引擎通过事件机制与外部交互：

```typescript
export enum RenderEngineEvent {
  /** 组件选中事件 */
  COMPONENT_SELECTED = 'component-selected',
  /** 组件拖拽开始 */
  DRAG_START = 'drag-start',
  /** 组件拖拽中 */
  DRAG_OVER = 'drag-over',
  /** 组件拖拽结束 */
  DRAG_END = 'drag-end',
  /** 组件属性变更 */
  PROP_CHANGE = 'prop-change',
  /** 组件结构变更 */
  SCHEMA_CHANGE = 'schema-change',
  /** 组件添加 */
  COMPONENT_ADDED = 'component-added',
  /** 组件移除 */
  COMPONENT_REMOVED = 'component-removed',
  /** 组件移动 */
  COMPONENT_MOVED = 'component-moved'
}
```

### 渲染上下文

渲染引擎通过上下文向子组件提供渲染所需的信息和方法：

```typescript
export interface RenderContext {
  /** 渲染模式 */
  mode: RenderMode;
  /** 当前选中的组件ID */
  selectedId: string | null;
  /** 设置选中组件 */
  selectComponent: (id: string | null) => void;
  /** 渲染配置项 */
  options: RenderEngineOptions;
  /** 获取组件配置 */
  getComponent: (componentType: string) => MaterialComponentRegistry | null;
  /** 处理组件拖拽 */
  handleDragEvent: (event: ComponentDragEvent) => void;
}
```

## 组件包装器（ComponentWrapper）

ComponentWrapper是每个物料组件的包装器，为组件提供以下功能：

1. **组件渲染**：根据组件类型和属性渲染实际组件
2. **交互能力**：提供选择、拖拽、编辑等交互能力
3. **子组件渲染**：递归渲染子组件和插槽内容
4. **事件处理**：处理组件的各种交互事件

### 包装器配置

组件包装器支持以下配置项：

```typescript
export interface ComponentWrapperOptions {
  /** 是否可选择 */
  selectable?: boolean;
  /** 是否已选中 */
  selected?: boolean;
  /** 是否显示占位符 */
  showPlaceholder?: boolean;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 是否可编辑 */
  editable?: boolean;
  /** 是否显示轮廓 */
  showOutline?: boolean;
  /** 组件层级 */
  level?: number;
}
```

## 与物料平台的集成

渲染引擎通过以下机制与物料平台集成：

1. **组件注册**：物料平台将组件注册到渲染引擎中
2. **组件获取**：渲染引擎从注册表中获取组件进行渲染
3. **事件通知**：渲染引擎通过事件机制通知物料平台组件状态的变化

这种松耦合的设计使得渲染引擎能够专注于组件的渲染和交互，而物料平台专注于组件的管理和描述。

## 使用示例

### 基本使用

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
import { RenderEngine, ComponentWrapper } from '@/core/render';
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
  componentMap: {
    'Button': ButtonComponent,
    'Container': ContainerComponent
  }
});

// 组件选中事件处理
const handleComponentSelected = (nodeId) => {
  console.log('选中组件:', nodeId);
};
</script>
```

### 注册组件

```typescript
// 获取渲染引擎实例
const renderEngine = ref();

// 注册组件
onMounted(() => {
  if (renderEngine.value) {
    renderEngine.value.registerComponent({
      componentMeta: buttonComponent,
      renderConfig: {
        componentId: buttonComponent.componentId,
        component: ButtonComponent
      }
    });
  }
});
```

### 动态加载组件

渲染引擎支持按需加载组件，只有在页面中实际使用的组件才会被加载：

```typescript
// 启用自动注册
<RenderEngine
  :schema="pageSchema"
  :options="renderOptions"
  :autoRegister="true"
/>
```

当启用自动注册后，渲染引擎会自动从options.componentMap中加载页面所需的组件，无需手动注册。 