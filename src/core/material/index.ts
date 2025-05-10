/**
 * 物料模块入口文件
 * 导出所有物料相关的API
 */

// 导出物料服务
export * from './services/MaterialService';

// 导出物料加载器
export * from './utils/MaterialLoader';

// 导出物料类型
export * from './types/MaterialTypes';

// 初始化函数
import { autoLoadMaterials } from './utils/MaterialLoader';

/**
 * 初始化物料模块
 * 自动加载物料描述
 */
export async function initMaterial(): Promise<void> {
  console.log('[物料模块] 开始初始化');
  
  // 自动加载物料描述文件
  await autoLoadMaterials();
  
  console.log('[物料模块] 初始化完成');
} 