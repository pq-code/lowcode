# Vue3 低代码开发系统

这是一个基于Vue3+TypeScript+Composition API开发的低代码平台，采用了模块化设计，支持组件拖拽、属性配置、代码生成等功能。系统由三个主要模块组成：物料平台、渲染引擎和低代码开发平台。

## 系统架构

整个系统采用了模块化、解耦合的设计理念，由三大核心部分组成：

![系统架构图](./docs/images/architecture.png)

### 1. 物料平台

物料平台负责组件物料的管理，提供了组件上传、AI辅助配置、组件预览和物料发布功能。物料平台的关键特性：

- **组件物料管理**：集中管理系统所有可用组件，支持分组和标签管理
- **物料描述协议**：使用标准的物料描述格式，支持组件的属性、事件和插槽定义
- **上传与配置**：支持上传组件文件，自动分析组件结构生成物料描述
- **AI辅助配置**：利用AI技术辅助生成更完善的物料描述
- **分组管理**：支持自定义组件分组，方便组织和查找

### 2. 渲染引擎

渲染引擎负责组件的渲染和交互，是低代码平台的核心部分。渲染引擎功能包括：

- **组件注册与加载**：按需加载和注册组件
- **拖拽交互**：实现组件拖拽、放置、调整尺寸等交互功能
- **属性面板**：根据物料描述动态生成组件属性配置面板
- **事件绑定**：支持组件事件的绑定和逻辑配置
- **数据流管理**：处理组件间的数据流和状态管理

### 3. 低代码开发平台

低代码开发平台是面向用户的可视化开发环境，集成了物料平台和渲染引擎。主要功能包括：

- **可视化开发**：通过拖拽方式构建页面
- **组件配置**：通过属性面板配置组件
- **页面预览**：实时预览页面效果
- **代码生成**：将可视化配置转换为Vue组件代码
- **项目管理**：支持项目的创建、保存和发布

## 目录结构

```
/
├── src/                      # 源代码
│   ├── views/                # 页面组件
│   │   ├── home/             # 首页
│   │   ├── dashboard/        # 仪表盘
│   │   ├── material-platform/# 物料平台
│   │   └── draggingDragging/ # 低代码编辑器
│   │
│   ├── components/           # 通用组件
│   │   └── materialArea/     # 物料区域组件(兼容旧版)
│   │
│   ├── materials/            # 物料系统
│   │   ├── base/             # 基础组件
│   │   ├── layout/           # 布局组件
│   │   └── ...               # 其他分类组件
│   │
│   ├── materialCenter/       # 物料中心
│   │   ├── services/         # 物料服务
│   │   ├── type/             # 类型定义
│   │   └── ...               # 其他物料中心文件
│   │
│   ├── packages/             # 组件库
│   │   ├── RenderEngine/     # 渲染引擎
│   │   ├── Form/             # 表单组件
│   │   └── ...               # 其他组件
│   │
│   ├── router/               # 路由配置
│   ├── stores/               # 状态管理
│   └── assets/               # 静态资源
│
├── public/                   # 公共资源
├── docs/                     # 文档
└── ...                       # 其他配置文件
```

## 物料协议

物料平台采用标准化的物料描述协议，用于描述组件的属性、事件和显示信息。物料描述示例：

```typescript
{
  id: "button_001",
  type: "button",
  name: "按钮",
  description: "用于触发操作的按钮组件",
  version: "1.0.0",
  group: "base",
  tags: ["button", "action"],
  props: {
    type: {
      type: "enum",
      title: "按钮类型",
      default: "primary",
      enum: ["primary", "success", "warning", "danger", "info", "text"]
    },
    size: {
      type: "enum",
      title: "按钮尺寸",
      default: "medium",
      enum: ["large", "medium", "small"]
    },
    // 更多属性...
  },
  events: [
    { name: "click", description: "点击事件" }
  ],
  slots: [
    { name: "default", description: "按钮内容" }
  ]
}
```

## 开发指南

### 环境要求

- Node.js >= 14.x
- npm >= 6.x 或 yarn >= 1.22.x

### 安装依赖

```bash
npm install
# 或
yarn
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

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
