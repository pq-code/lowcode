# 物料平台

物料平台是一个用于管理、预览和使用组件物料的系统。它提供了物料分组管理、物料上传、预览和使用等功能。

## 相关文档

- [代码结构说明](./docs/code-structure.md)
- [Monaco编辑器迁移指南](./docs/monaco-migration.md)

## 目录结构

```
src/views/material-platform/
├── index.ts                   # 导出主组件
├── MaterialPlatform.vue       # 主布局组件
├── README.md                  # 本文档
├── components/                # 共享组件
│   ├── MaterialCard.vue       # 物料卡片组件
│   ├── MaterialPreview.vue    # 物料预览组件
│   ├── MaterialUploader.vue   # 物料上传组件
│   └── GroupManagement.vue    # 分组管理组件
├── pages/                     # 页面组件
│   ├── material/              # 物料相关页面
│   │   ├── list/              # 物料列表页面
│   │   │   ├── index.tsx      # 物料列表组件
│   │   │   └── index.css      # 物料列表样式
│   │   ├── create/            # 物料创建/编辑页面
│   │   │   ├── index.tsx      # 入口文件
│   │   │   ├── components/    # 拆分的UI组件
│   │   │   ├── hooks/         # 业务逻辑钩子
│   │   │   └── templates.ts   # 模板数据
│   │   ├── MaterialDetail.tsx # 物料详情页面
│   │   └── MaterialImport.tsx # 物料导入页面
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
└── types/                     # 类型定义
    └── index.ts               # 类型定义
```

## 设计原则

1. **组件化设计**：将UI和功能拆分为可复用的组件
2. **关注点分离**：使用hooks分离业务逻辑和UI展示
3. **类型安全**：使用TypeScript确保类型安全
4. **响应式设计**：适配不同屏幕尺寸
5. **性能优化**：使用轻量级替代方案提高性能

## 最近改进

1. **优化文件夹结构**：
   - 统一目录组织，按功能模块划分
   - 减少冗余和重复文件

2. **添加快速操作按钮**：
   - 在物料列表页面添加了"新建物料"和"导入物料"按钮
   - 优化用户操作流程

3. **替换重型代码编辑器**：
   - 用轻量级的SimpleCodeEditor替代MonacoEditor
   - 显著降低内存使用和页面卡顿
   - 保留基本代码编辑功能 (行号、格式化、全屏编辑)

## 核心功能模块

### 1. 物料管理

物料是平台的核心资源，包括组件、区块、模板等。每个物料包含以下信息：

- 基本信息：名称、描述、版本、图标等
- 分类信息：所属分组、标签等
- 技术信息：属性、事件、插槽等
- 源码信息：源代码、依赖等

物料管理功能包括：
- 物料列表浏览与搜索
- 物料分组与筛选
- 物料详情查看
- 物料创建和编辑
- 物料批量导入
- 物料删除和批量删除

最新更新：
- 新增"新建物料"和"导入物料"快速操作按钮
- 优化了物料列表页面的操作交互
- 改进了代码编辑器性能

### 2. 分组管理

分组用于对物料进行分类管理，每个分组包含：

- 基本信息：名称、描述、排序等
- 包含的物料列表

### 3. 物料预览

提供物料的预览功能，包括：

- 组件渲染
- 属性编辑
- 代码查看
- 文档展示

### 4. 物料上传

支持多种方式上传和创建物料：

- 本地上传组件
- 远程导入组件
- 在线创建组件

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **UI组件库**：Element Plus
- **状态管理**：Vue的响应式系统 + 自定义hooks
- **路由管理**：Vue Router
- **构建工具**：Vite

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问物料平台：
```
http://localhost:3000/material-platform
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 数据流

```
API服务 <-> Hooks <-> 组件
```

- **API服务**：负责与后端通信，获取和管理数据
- **Hooks**：封装业务逻辑，提供响应式数据和方法
- **组件**：负责UI渲染和用户交互

## 代码规范

1. 使用TypeScript进行类型检查
2. 使用ESLint进行代码规范检查
3. 使用Prettier进行代码格式化
4. 使用Vue 3的Composition API进行开发
5. 使用JSX/TSX或Vue SFC根据场景选择合适的方式 