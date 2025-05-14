/**
 * 物料描述协议类型定义
 */

/**
 * 物料属性类型
 */
export type MaterialPropertyType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'function'
  | 'slot'
  | 'node'
  | 'select'
  | 'color';

/**
 * 物料属性定义
 */
export interface MaterialProperty {
  /** 属性名称 */
  name: string;
  /** 属性展示名称 */
  label: string;
  /** 属性类型 */
  type: MaterialPropertyType;
  /** 默认值 */
  defaultValue?: any;
  /** 描述信息 */
  description?: string;
  /** 是否必填 */
  required?: boolean;
  /** 针对select类型的选项 */
  options?: Array<{
    label: string;
    value: any;
  }>;
  /** 属性分组 */
  group?: string;
  /** 是否在属性面板中可见 */
  visible?: boolean;
}

/**
 * 物料事件定义
 */
export interface MaterialEvent {
  /** 事件名称 */
  name: string;
  /** 事件展示名称 */
  label: string;
  /** 描述信息 */
  description?: string;
  /** 事件参数描述 */
  params?: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
}

/**
 * 物料插槽定义
 */
export interface MaterialSlot {
  /** 插槽名称 */
  name: string;
  /** 插槽展示名称 */
  label: string;
  /** 描述信息 */
  description?: string;
  /** 是否默认插槽 */
  isDefault?: boolean;
  /** 是否可拖入组件 */
  allowComponents?: boolean;
  /** 允许拖入的组件类型列表，为空则表示不限制 */
  allowComponentTypes?: string[];
}

/**
 * 物料组件描述
 */
export interface MaterialComponent {
  /** 组件唯一标识 */
  componentId: string;
  /** 组件名称 */
  name: string;
  /** 组件类型 */
  type: string;
  /** 组件分类 */
  category: string;
  /** 组件标题 */
  title: string;
  /** 组件描述 */
  description?: string;
  /** 组件图标 */
  icon?: string;
  /** 组件属性列表 */
  properties: MaterialProperty[];
  /** 组件事件列表 */
  events?: MaterialEvent[];
  /** 组件插槽列表 */
  slots?: MaterialSlot[];
  /** 组件初始化配置 */
  initialConfig?: Record<string, any>;
  /** 是否容器组件，可以包含子组件 */
  isContainer?: boolean;
  /** 是否根组件 */
  isRoot?: boolean;
  /** 组件实现的引用路径 */
  componentPath?: string;
  /** 组件缩略图 */
  thumbnail?: string;
  /** 组件版本 */
  version?: string;
  /** 组件源代码 */
  sourceCode?: string;
  /** 组件标签 */
  tags?: string[];
  /** 组件创建时间 */
  createTime?: string;
  /** 组件更新时间 */
  updateTime?: string;
  /** 组件创建者 */
  creator?: string;
}

/**
 * 物料库描述
 */
export interface MaterialLibrary {
  /** 物料库唯一标识 */
  id: string;
  /** 物料库名称 */
  name: string;
  /** 物料库描述 */
  description?: string;
  /** 物料库版本 */
  version: string;
  /** 包含的组件列表 */
  components: MaterialComponent[];
}

/**
 * 页面组件节点描述
 */
export interface ComponentNode {
  /** 节点ID */
  id: string;
  /** 组件类型 */
  componentType: string;
  /** 组件属性配置 */
  props: Record<string, any>;
  /** 事件配置 */
  events?: Record<string, string>;
  /** 插槽内容 */
  slots?: Record<string, ComponentNode[]>;
  /** 子节点列表 (用于容器组件) */
  children?: ComponentNode[];
  /** 父节点ID */
  parentId?: string;
  /** 在父节点中的索引 */
  index?: number;
  /** 是否是插槽中的内容 */
  isSlotContent?: boolean;
  /** 如果是插槽内容，对应的插槽名称 */
  slotName?: string;
}

/**
 * 页面结构描述
 */
export interface PageSchema {
  /** 页面ID */
  id: string;
  /** 页面名称 */
  name: string;
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description?: string;
  /** 页面根组件 */
  root: ComponentNode;
  /** 页面样式配置 */
  styles?: Record<string, any>;
  /** 页面配置 */
  config?: Record<string, any>;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
}

/**
 * 组件上传响应
 */
export interface MaterialUploadResponse {
  /** 是否成功 */
  success: boolean;
  /** 物料组件ID */
  componentId?: string;
  /** 错误信息 */
  error?: string;
}

/**
 * 组件分析结果
 */
export interface MaterialAnalysisResult {
  /** 组件类型 */
  type: string;
  /** 组件名称 */
  name: string;
  /** 识别的属性 */
  props?: Record<string, {
    type: string;
    required?: boolean;
    default?: any;
    description?: string;
  }>;
  /** 识别的事件 */
  events?: Array<{
    name: string;
    description?: string;
  }>;
  /** 识别的插槽 */
  slots?: Array<{
    name: string;
    description?: string;
  }>;
  /** 组件描述 */
  description?: string;
  /** 推荐的分类 */
  category?: string;
  /** 推荐的标签 */
  tags?: string[];
}

/**
 * AI生成结果
 */
export interface MaterialAIGenerateResult {
  /** 是否成功 */
  success: boolean;
  /** 生成的物料组件描述 */
  component?: MaterialComponent;
  /** 错误信息 */
  error?: string;
}

/**
 * 组件预览参数
 */
export interface MaterialPreviewOptions {
  /** 组件ID */
  componentId: string;
  /** 预览属性值 */
  props?: Record<string, any>;
  /** 预览样式 */
  style?: Record<string, any>;
  /** 是否使用暗色主题 */
  darkMode?: boolean;
}

/**
 * 组件文件操作结果
 */
export interface MaterialFileOperationResult {
  /** 是否成功 */
  success: boolean;
  /** 操作后的文件内容 */
  content?: string;
  /** 错误信息 */
  error?: string;
} 