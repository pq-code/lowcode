/** 单个物料约定 */
export interface definitionComponent {
  /** 组件名 */
  componentName: string;
  /** 组件中文名称 */
  title: string;
  /** 缩略图 */
  icon?: string;
  /** 包地址 */
  npm: {
    /** 源码组件名称 */
    componentName?: string;
    /** 源码组件库名 */
    package: string;
    /** 源码组件版本号 */
    version?: string;
  };
  /** 分类：比如基础组件、容器组件、自定义组件 */
  group?: string;
  /** 组件入参或者说是可配置参数 */
  props?: {
    name: string,
    propType: string,
    description: string,
    defaultValue: any,
  }[];
  /** 其他扩展协议 */
  [key: string]: any;
}
