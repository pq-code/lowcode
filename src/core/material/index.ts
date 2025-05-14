/**
 * 物料平台模块入口文件
 */

// 导出类型定义
export * from './types';
export * from './types/enhanced';

// 导出服务
export { MaterialRegistry } from './services/material-registry';
export { MaterialAssetsService } from './services/material-assets';

// 导出工具函数
export { ComponentUtils } from './utils/component-utils'; 