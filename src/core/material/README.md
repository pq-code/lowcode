# 物料平台模块（Material Platform）

物料平台模块是低代码平台的核心组成部分，负责管理组件物料的注册、获取、分析和生成。本模块提供了一套完整的物料描述协议和相关服务，使其他模块能够快速接入和使用组件物料。

## 模块设计

物料平台模块采用了分层设计：

1. **类型定义层**：定义物料描述协议和相关类型
2. **服务层**：提供物料的注册、获取、分析等服务
3. **工具层**：提供组件分析、转换等工具函数

## 物料描述协议

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
```

### 增强协议

增强协议扩展了基础协议，提供了更丰富的组件描述能力：

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
    };
    supports?: {             // 通用扩展配置能力
      events?: string[];     // 支持的事件列表
      loop?: boolean;        // 支持循环设置
      condition?: boolean;   // 支持条件设置
    };
  };
}
```

### 资产包协议

资产包协议用于描述一组组件的集合：

```typescript
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

## 服务说明

### MaterialRegistry

物料注册服务，用于管理组件的注册和获取：

```typescript
// 注册组件
materialRegistry.registerComponent(componentRegistry);

// 获取组件
const component = materialRegistry.getComponent(componentId);

// 根据分组获取组件
const components = materialRegistry.getComponentsByGroup(group);
```

### MaterialAssetsService

物料资产服务，用于管理资产包：

```typescript
// 添加组件到资产包
assetsService.addComponent(component);

// 导出资产包为JSON
const json = assetsService.exportToJSON();

// 从JSON导入资产包
assetsService.importFromJSON(json);
```

## 使用示例

### 注册组件

```typescript
import { MaterialRegistry } from '@/core/material/services/material-registry';
import type { EnhancedMaterialComponent, MaterialComponentRegistry } from '@/core/material/types/enhanced';

// 创建组件描述
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

// 创建组件注册信息
const buttonRegistry: MaterialComponentRegistry = {
  componentMeta: buttonComponent,
  renderConfig: {
    componentId: buttonComponent.componentId,
    component: ButtonComponent // 实际组件
  }
};

// 注册组件
const registry = new MaterialRegistry();
registry.registerComponent(buttonRegistry);
```

## 与渲染引擎的集成

物料平台模块通过MaterialRenderBridge接口与渲染引擎集成：

```typescript
interface MaterialRenderBridge {
  registerComponent(info: MaterialComponentRegistry): void;
  registerComponents(infoList: MaterialComponentRegistry[]): void;
  getComponent(componentId: string): MaterialComponentRegistry | null;
  getAllComponents(): MaterialComponentRegistry[];
  unregisterComponent(componentId: string): void;
}
```

这种设计使物料平台和渲染引擎能够高效协作，避免不必要的组件重复注册和加载。 