/** 单个物料约定 */
export interface DefinitionComponent {
  /** 组件名 */
  componentName: string;

  /** 组件中文名称 */
  title: string;

  /** 缩略图 */
  icon?: string;

  /** 分类：比如基础组件、容器组件、自定义组件 */
  group?: string;

  /** 包地址 */
  npm: NpmInfo;

  /** 组件入参或者说是可配置参数 */
  props?: ComponentProps;

  /** 组件子级内容 */
  children: Array<object>;

  /** 其他扩展协议 */
  [key: string]: any;
}

/** 包地址信息 */
interface NpmInfo {
  /** 源码组件名称 */
  componentName?: string;

  /** 源码组件库名 */
  package: string;

  /** 源码组件版本号 */
  version?: string;
}

/** 组件入参或可配置参数 */
interface ComponentProps {
  /** 标题 */
  title: string;

  /** 布局 */
  layout: string;

  /** 描述 */
  description: string;

  /** 默认值 */
  defaultValue: any;

  /** 组件class名字 */
  className: string;
}
