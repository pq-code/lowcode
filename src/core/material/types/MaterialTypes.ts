/**
 * 物料类型定义
 */

/**
 * 物料描述接口
 */
export interface Material {
  // 基本信息
  type: string;             // 物料类型，必须唯一
  name: string;             // 物料名称
  description?: string;     // 物料描述
  group: string;            // 所属分组
  version?: string;         // 版本号
  icon?: string;            // 图标
  tags?: string[];          // 标签

  // 属性配置
  props?: Record<string, PropConfig>;  // 属性配置
  events?: EventConfig[];              // 事件配置
  slots?: SlotConfig[];                // 插槽配置

  // 来源信息
  source?: {
    type: 'local' | 'remote';          // 本地或远程组件
    import?: {                         // 导入配置
      path: string;                    // 导入路径
      name?: string;                   // 导入名称
      destructuring?: boolean;         // 是否解构导入
    };
    remote?: {                         // 远程组件配置
      url: string;                     // 远程URL
      version?: string;                // 远程版本
    };
  };
  
  // 元数据
  createTime?: string;      // 创建时间
  updateTime?: string;      // 更新时间
  creator?: string;         // 创建者
}

/**
 * 属性配置
 */
export interface PropConfig {
  type: string;             // 属性类型 (string, number, boolean, object, array, enum)
  title?: string;           // 属性标题
  description?: string;     // 属性描述
  default?: any;            // 默认值
  required?: boolean;       // 是否必填
  enum?: any[];             // 枚举值列表（当type为enum时使用）
  min?: number;             // 最小值（当type为number时使用）
  max?: number;             // 最大值（当type为number时使用）
  step?: number;            // 步长（当type为number时使用）
  format?: string;          // 格式（当type为string时可用，如：date, email等）
}

/**
 * 事件配置
 */
export interface EventConfig {
  name: string;             // 事件名称
  description?: string;     // 事件描述
  params?: {                // 事件参数
    name: string;           // 参数名
    type: string;           // 参数类型
    description?: string;   // 参数描述
  }[];
}

/**
 * 插槽配置
 */
export interface SlotConfig {
  name: string;             // 插槽名称
  description?: string;     // 插槽描述
} 