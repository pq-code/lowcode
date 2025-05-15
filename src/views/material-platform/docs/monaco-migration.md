# MonacoEditor 迁移指南

## 背景

MonacoEditor 组件虽然功能强大，但会导致页面卡顿和性能问题。为了提高应用性能，我们创建了一个轻量级的替代方案 SimpleCodeEditor，它基于简单的 textarea 元素，并添加了基本的代码编辑功能和样式。

## 已完成工作

1. 创建了 `SimpleCodeEditor` 组件：
   - 位置：`src/components/SimpleCodeEditor.tsx`
   - 功能：支持基本代码编辑、行号显示、代码格式化和全屏编辑
   - 样式：`src/assets/simple-code-editor.css`

2. 更新了 `JsonEditor` 组件：
   - 将内部的 MonacoEditor 替换为 SimpleCodeEditor
   - 保持了相同的 API 和功能

3. 重构了物料创建/编辑页面：
   - 将大型的 `MaterialCreate.tsx` 文件拆分为更小的模块化组件
   - 重构后的文件位于 `src/views/material-platform/pages/material/create/` 目录下
   - 将业务逻辑与UI展示分离，提高代码可维护性和复用性
   - 所有组件都已经使用 SimpleCodeEditor 替代 MonacoEditor

## 待完成工作

以下是需要完成的剩余迁移工作：

### 1. 性能测试

- 在完成迁移后，测试应用的性能表现
- 比较迁移前后的内存使用和页面响应速度
- 特别关注大文件编辑和长时间运行场景

### 2. 功能验证

- 确保所有代码编辑相关功能仍然正常工作
- 验证 JSON 编辑和验证功能
- 测试各种编辑操作（复制、粘贴、撤销等）

## 使用指南

要在项目中使用 SimpleCodeEditor 替代 MonacoEditor，请按照以下步骤操作：

1. 更新导入语句：

```tsx
// 旧的导入
import MonacoEditor from '@/components/MonacoEditor';

// 新的导入
import SimpleCodeEditor from '@/components/SimpleCodeEditor';
```

2. 替换组件用法：

```tsx
// 旧的用法
<MonacoEditor
  modelValue={code}
  onUpdate:modelValue={(v) => code = v}
  language="javascript"
  theme="vs"
  height="300px"
  options={{
    automaticLayout: true,
    minimap: { enabled: false },
    // ...其他选项
  }}
/>

// 新的用法
<SimpleCodeEditor
  modelValue={code}
  onUpdate:modelValue={(v) => code = v}
  language="javascript"
  theme="light" // 支持 'light' 或 'dark'
  height="300px"
  placeholder="请输入代码..."
  options={{
    formatOnPaste: true,
    formatOnType: false
  }}
/>
```

3. 主要API差异：

| MonacoEditor 属性 | SimpleCodeEditor 属性 | 说明 |
|------------------|---------------------|------|
| theme: "vs" | theme: "light" | 主题名称不同 |
| 复杂的options | 简化的options | 减少了大部分复杂配置 |
| 不支持 | placeholder | 新增了占位符文本 |

## 后续改进方向

1. 增强 SimpleCodeEditor 功能：
   - 添加语法高亮（可考虑使用轻量级库如 highlight.js）
   - 改进自动缩进和格式化功能
   - 添加简单的自动完成功能

2. 进一步优化性能：
   - 延迟加载和渲染大文件
   - 虚拟滚动渲染超长文件

3. 增强易用性：
   - 添加更多快捷键支持
   - 改进搜索和替换功能 