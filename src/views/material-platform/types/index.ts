/**
 * 物料平台类型定义
 */

// 物料分组类型
export interface MaterialGroup {
  id: string;
  name: string;
  description?: string;
  order?: number;
  createTime?: string;
  updateTime?: string;
}

// 物料属性类型
export interface MaterialProperty {
  type: string;
  title: string;
  description?: string;
  default?: any;
  enum?: any[];
  format?: string;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  placeholder?: string;
}

// 物料事件类型
export interface MaterialEvent {
  name: string;
  description?: string;
  parameters?: MaterialProperty[];
}

// 物料插槽类型
export interface MaterialSlot {
  name: string;
  description?: string;
  defaultContent?: string;
}

// 物料导入类型
export interface MaterialImport {
  path: string;
  name?: string;
  destructuring?: boolean;
}

// 物料远程类型
export interface MaterialRemote {
  url: string;
  version?: string;
}

// 物料源类型
export interface MaterialSource {
  type: 'local' | 'remote' | 'npm';
  import?: MaterialImport;
  remote?: MaterialRemote;
}

// 组件文件结构节点类型
export interface ComponentFileNode {
  id: string;
  fileName: string;
  isFolder: boolean;
  content?: string;
  children?: ComponentFileNode[];
  path?: string;
  parentId?: string | null;
  lastModified?: number;
  language?: string;
  size?: number;
  isMain?: boolean; // 标记是否为主文件
}

// 组件文件结构类型
export interface ComponentFileStructure {
  rootFolder: ComponentFileNode;
  files: Record<string, string>; // id -> 文件内容
  mainFileId?: string; // 主文件ID
}

// 物料描述类型
export interface Material {
  id: string;
  type: string;
  name: string;
  description?: string;
  icon?: string;
  version: string;
  group: string;
  tags?: string[];
  props?: Record<string, MaterialProperty>;
  events?: MaterialEvent[];
  slots?: MaterialSlot[];
  isContainer?: boolean;
  source?: MaterialSource;
  files?: ComponentFileStructure; // 添加文件结构字段
  createTime?: string;
  updateTime?: string;
  creator?: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
} 