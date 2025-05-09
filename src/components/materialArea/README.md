# 低代码平台组件描述规范

本文档规定了低代码平台中组件描述文件的标准结构和规范，以确保组件能被正确渲染和使用。

## 组件描述基本结构

每个组件描述对象应包含以下必要字段：

```typescript
{
  // 组件在UI中显示的名称
  componentName: string;
  
  // 组件类型标识，用于组件渲染引擎匹配
  type: string;
  
  // 组件图标，用于在组件面板中显示
  icon: string;
  
  // 组件分组，用于在组件面板中分类
  group: string;
  
  // 组件npm包信息，用于动态导入
  npm?: {
    // 导出的组件名称
    exportName: string;
    
    // 组件所在的包名
    package?: string;
    
    // 组件路径，必须使用@/开头的绝对路径
    component: string;
    
    // 是否需要解构导入
    destructuring?: boolean;
  };
  
  // 组件属性配置
  props: {
    // 各种属性配置...
  };
  
  // 初始子元素
  children?: any[];
}
```

## 路径规范

- **所有组件路径都必须使用`@/`开头的绝对路径**，例如：`@/packages/Form/src/Form.jsx`
- 不要使用相对路径，如`packages/Form/src/Form.jsx`

## 内置组件类型

以下组件类型已内置，可直接使用：

- `container`: 容器组件
- `Form`: 表单组件
- `input`: 输入框组件

## 示例

```typescript
// Form组件示例
export const Form = {
  componentName: "表单",
  type: "Form",
  icon: "icon-dingdan",
  group: "基础组件",
  npm: {
    exportName: "Form",
    component: '@/packages/Form/src/Form.jsx',
    destructuring: true,
  },
  props: {
    // 属性配置...
  },
  children: []
};
```

## 注意事项

1. 确保组件`type`字段与内置组件表匹配，或在`npm.component`中提供正确的组件路径
2. 所有组件路径必须以`@/`开头
3. `componentName`和`group`用于UI展示，应使用友好的中文名称
4. 子组件应遵循同样的规范结构

遵循本规范可以简化渲染引擎的实现，提高组件加载的稳定性。 