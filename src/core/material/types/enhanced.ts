/**
 * 物料平台增强型协议定义
 */

import type {
  MaterialComponent,
  MaterialProperty,
  MaterialEvent,
  MaterialSlot,
  ComponentNode,
  PageSchema,
  MaterialAnalysisResult,
  MaterialAIGenerateResult
} from './index';

/**
 * 物料协议版本
 */
export interface MaterialProtocolVersion {
  /** 主版本号 */
  major: number;
  /** 次版本号 */
  minor: number;
  /** 补丁版本号 */
  patch: number;
}

/**
 * 获取协议版本字符串
 */
export function getProtocolVersionString(version: MaterialProtocolVersion): string {
  return `${version.major}.${version.minor}.${version.patch}`;
}

/**
 * 资产包
 */
export interface MaterialPackage {
  /** 包名称 */
  package: string;
  /** 包标题 */
  title?: string;
  /** 包版本 */
  version: string;
  /** 全局变量名 */
  library: string;
  /** 渲染态资源路径 */
  urls: string[];
  /** 编辑态资源路径 */
  editUrls?: string[];
}

/**
 * 资产包描述
 */
export interface MaterialAssets {
  /** 资产包协议版本 */
  version: string;
  /** 资产包列表 */
  packages: MaterialPackage[];
  /** 组件描述列表 */
  components: EnhancedMaterialComponent[];
  /** 组件分类 */
  sort: {
    /** 组件分组列表，用于组件面板的tab展示 */
    groupList: string[];
    /** 分类列表，组件面板中同一个tab下的不同区间 */
    categoryList: string[];
  };
}

/**
 * 扩展物料组件描述
 */
export interface EnhancedMaterialComponent extends MaterialComponent {
  /** NPM包信息 */
  npm?: {
    /** 包名 */
    package: string;
    /** 版本 */
    version: string;
    /** 导出名称 */
    exportName: string;
    /** 是否解构 */
    destructuring?: boolean;
    /** 主入口 */
    main?: string;
    /** 子组件名称 */
    subName?: string;
  };
  /** 组件代码片段，用于拖拽生成 */
  snippets?: Array<{
    /** 片段标题 */
    title: string;
    /** 片段截图 */
    screenshot?: string;
    /** 片段标签 */
    label?: string;
    /** 片段schema */
    schema: ComponentNode;
  }>;
  /** 组件在面板中的分组 */
  group?: string;
  /** 组件在面板中的排序权重 */
  priority?: number;
  /** 组件文档链接 */
  docUrl?: string;
  /** 组件截图 */
  screenshot?: string;
  /** 组件编辑配置 */
  configure?: MaterialComponentConfigure;
}

/**
 * 组件编辑配置
 */
export interface MaterialComponentConfigure {
  /** 属性面板配置 */
  props?: MaterialConfigureProp[];
  /** 组件能力配置 */
  component?: {
    /** 是否容器组件 */
    isContainer?: boolean;
    /** 组件是否带浮层 */
    isModal?: boolean;
    /** 组件树描述信息 */
    descriptor?: string;
    /** 嵌套规则 */
    nestingRule?: {
      /** 子节点类型白名单 */
      childWhitelist?: string[] | ((currentNode: any) => string[]);
      /** 父节点类型白名单 */
      parentWhitelist?: string[] | ((currentNode: any) => string[]);
      /** 后裔节点类型黑名单 */
      descendantBlacklist?: string[] | ((currentNode: any) => string[]);
      /** 祖先节点类型白名单 */
      ancestorWhitelist?: string[] | ((currentNode: any) => string[]);
    };
    /** 是否是最小渲染单元 */
    isMinimalRenderUnit?: boolean;
    /** 组件选中框的cssSelector */
    rootSelector?: string;
    /** 禁用操作项 */
    disableBehaviors?: string[];
  };
  /** 通用扩展配置能力支持性 */
  supports?: {
    /** 支持的事件列表 */
    events?: string[];
    /** 支持循环设置 */
    loop?: boolean;
    /** 支持条件设置 */
    condition?: boolean;
    /** 支持样式设置 */
    style?: boolean;
    /** 支持i18n配置 */
    i18n?: boolean;
  };
  /** 高级特性配置 */
  advanced?: {
    /** 配置callbacks可捕获引擎抛出的事件 */
    callbacks?: Record<string, Function>;
    /** 拖入容器时，自动带入children列表 */
    initialChildren?: ComponentNode[] | ((target: any) => ComponentNode[]);
    /** 用于配置设计器中组件resize操作工具的样式和内容 */
    getResizingHandlers?: (currentNode: any) => any[];
  };
}

/**
 * 属性面板配置项
 */
export interface MaterialConfigureProp {
  /** 配置类型 */
  type?: 'field' | 'group';
  /** 配置标题 */
  title?: string;
  /** 属性名称 */
  name?: string;
  /** 属性面板展示方式 */
  display?: 'accordion' | 'inline' | 'block' | 'plain' | 'popup' | 'entry';
  /** 分组下的属性列表 */
  items?: MaterialConfigureProp[];
  /** 属性默认值 */
  defaultValue?: any;
  /** 是否支持变量配置 */
  supportVariable?: boolean;
  /** 配置控件 */
  setter?: string | object | Function;
  /** 其他配置属性 */
  extraProps?: {
    /** setter渲染时被调用，根据返回值设置setter当前值 */
    getValue?: (target: any, value: any) => any;
    /** setter内容修改时调用，可修改节点schema */
    setValue?: (target: any, value: any) => void;
  };
}

/**
 * AI组件分析请求
 */
export interface MaterialAIAnalysisRequest {
  /** 组件源代码 */
  sourceCode: string;
  /** 组件类型 */
  componentType?: string;
  /** 分析级别 */
  analysisLevel?: 'basic' | 'detailed' | 'comprehensive';
}

/**
 * AI组件生成请求
 */
export interface MaterialAIGenerateRequest {
  /** 组件描述 */
  description: string;
  /** 组件名称 */
  name?: string;
  /** 组件类型 */
  type?: string;
  /** 组件分类 */
  category?: string;
  /** 是否包含样式 */
  includeStyles?: boolean;
  /** 是否包含交互逻辑 */
  includeInteractions?: boolean;
  /** 参考示例 */
  references?: string[];
}

/**
 * 物料组件渲染配置
 */
export interface MaterialComponentRenderConfig {
  /** 组件ID */
  componentId: string;
  /** 组件渲染使用的实际组件引用 */
  component: any;
  /** 属性映射转换器 */
  propMappers?: Record<string, (value: any, context: any) => any>;
  /** 事件处理器 */
  eventHandlers?: Record<string, (event: any, context: any) => void>;
  /** 插槽渲染配置 */
  slotRenderers?: Record<string, (props: any, children: any[]) => any>;
  /** 自定义渲染函数 */
  customRender?: (props: any, context: any) => any;
}

/**
 * 物料组件注册信息
 */
export interface MaterialComponentRegistry {
  /** 组件描述 */
  componentMeta: MaterialComponent | EnhancedMaterialComponent;
  /** 渲染配置 */
  renderConfig: MaterialComponentRenderConfig;
}

/**
 * 物料平台与渲染引擎接口
 */
export interface MaterialRenderBridge {
  /** 注册物料组件 */
  registerComponent(info: MaterialComponentRegistry): void;
  /** 注册多个物料组件 */
  registerComponents(infoList: MaterialComponentRegistry[]): void;
  /** 获取已注册的组件 */
  getComponent(componentId: string): MaterialComponentRegistry | null;
  /** 获取所有已注册的组件 */
  getAllComponents(): MaterialComponentRegistry[];
  /** 移除组件注册 */
  unregisterComponent(componentId: string): void;
} 