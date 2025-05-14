/**
 * 核心模块入口文件
 */

// 导出物料平台服务
export { MaterialRegistry } from './material/services/material-registry';
export { MaterialAssetsService } from './material/services/material-assets';

// 导出渲染引擎
export { default as RenderEngine } from './render/render-engine';
export { default as ComponentWrapper } from './render/component-wrapper';

// 导出类型定义
export * from './material/types';
export * from './material/types/enhanced';
export * from './render/types';

// 导入样式
import './render/styles/component-wrapper.css';
import './render/styles/render-engine.css';

/**
 * 初始化核心模块
 * @returns 初始化Promise
 */
export async function initCore(): Promise<void> {
  console.log('[系统初始化] 初始化核心模块');
  
  // 执行核心模块初始化逻辑
  try {
    // 注册全局组件
    // 加载基础配置
    // 其他初始化工作...
    
    console.log('[系统初始化] 核心模块初始化完成');
  } catch (error) {
    console.error('[系统初始化] 核心模块初始化失败', error);
    throw error;
  }
}
