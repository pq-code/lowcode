# Vue 3 低代码平台

基于 Vue 3、TypeScript、Vite 构建的现代化低代码平台，提供拖拽式组件编辑、可视化配置和代码生成能力。

## 技术栈

- Vue 3 + TypeScript + JSX
- Vite 构建工具
- Element Plus UI组件库
- Pinia 状态管理
- Vue Router 路由管理
- Less 样式预处理

## 项目特点

- 基于 Vue 3 Composition API 和 TypeScript 开发
- 组件化拖拽设计，支持组件嵌套和属性配置
- 使用JSX实现更灵活的组件渲染
- 可视化编辑界面，所见即所得
- 支持组件属性面板配置和预览
- 可导出Vue组件代码

## 目录结构

- `src/components/materialArea`: 组件物料区，定义可用组件
- `src/packages`: 核心功能包和组件实现
  - `RenderEngine`: 组件渲染引擎
  - `Form`, `Table`等: 内置组件实现
- `src/views`: 页面视图
  - `dashboard`: 仪表盘页面
  - `draggingDragging`: 低代码编辑器主界面

## 组件系统

低代码平台的核心是组件系统，包括：

1. **组件描述文件**: 定义在`src/components/materialArea/components/`目录下
2. **渲染引擎**: 实现在`src/packages/RenderEngine/components/TypeRenderEngine.jsx`
3. **组件实现**: 位于`src/packages/`各子目录中

详细的组件描述规范请参考: [组件描述规范](./src/components/materialArea/README.md)

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 贡献指南

1. 开发新组件时，请遵循组件描述规范
2. 确保组件路径使用`@/`开头的绝对路径
3. 添加新组件后，更新`src/components/materialArea/materialArea.ts`
