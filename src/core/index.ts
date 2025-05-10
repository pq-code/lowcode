/**
 * 系统核心模块入口
 * 统一导出物料和渲染引擎等核心功能
 */

// 导出物料模块
export * from './material';

/**
 * 初始化核心模块
 */
export async function initCore(): Promise<void> {
  console.log('[核心模块] 开始初始化');
  
  // 导入物料模块初始化函数
  const { initMaterial } = await import('./material');
  
  // 初始化物料模块
  await initMaterial();
  
  // 这里可以初始化其他核心模块，如渲染引擎等
  
  console.log('[核心模块] 初始化完成');
} 