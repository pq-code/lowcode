/**
 * 渲染引擎类型定义
 */

/**
 * 渲染模式
 */
export enum RenderMode {
  /** 设计模式，用于设计器，支持拖拽、选择等 */
  DESIGN = 'design',
  /** 预览模式，可以交互但不可以编辑 */
  PREVIEW = 'preview',
  /** 运行模式，适用于发布后的应用 */
  RUNTIME = 'runtime'
}

/**
 * 渲染引擎事件
 */
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

/**
 * 拖放位置
 */
export type DropPosition = 'before' | 'after' | 'inside' | null;

/**
 * 组件拖拽事件
 */
export interface ComponentDragEvent {
  /** 源节点ID */
  sourceNodeId: string;
  /** 源组件类型 */
  sourceComponentType: string;
  /** 目标节点ID */
  targetNodeId: string;
  /** 放置位置 */
  position: DropPosition;
  /** 原生事件对象 */
  event: DragEvent;
  /** 是否来自组件面板 */
  isFromPanel?: boolean;
}

/**
 * 属性变更事件
 */
export interface PropChangeEvent {
  /** 节点ID */
  nodeId: string;
  /** 属性名 */
  propName: string;
  /** 属性值 */
  propValue: any;
}

/**
 * 组件添加事件
 */
export interface ComponentAddEvent {
  /** 源组件类型 */
  sourceComponentType: string;
  /** 目标节点ID */
  targetNodeId: string;
  /** 放置位置 */
  position: DropPosition;
}

/**
 * 组件移动事件
 */
export interface ComponentMoveEvent {
  /** 源节点ID */
  sourceNodeId: string;
  /** 目标节点ID */
  targetNodeId: string;
  /** 放置位置 */
  position: DropPosition;
}

/**
 * 渲染引擎配置项
 */
export interface RenderEngineOptions {
  /** 渲染模式 */
  mode?: RenderMode;
  /** 是否可编辑 */
  editable?: boolean;
  /** 是否显示占位符 */
  showPlaceholder?: boolean;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 是否可选择 */
  selectable?: boolean;
  /** 是否显示轮廓 */
  showOutline?: boolean;
  /** 组件映射表 */
  componentMap?: Record<string, any>;
  /** 属性转换器 */
  propTransformers?: Record<string, (value: any, context?: any) => any>;
  /** 事件处理器 */
  eventHandlers?: Record<string, (event: any, context?: any) => void>;
}

/**
 * 组件包装器配置项
 */
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