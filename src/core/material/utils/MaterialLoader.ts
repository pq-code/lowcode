/**
 * 物料加载器
 * 用于加载和注册物料描述文件
 */
import { collectMaterial } from '../services/MaterialService';
import type { Material } from '../types/MaterialTypes';

/**
 * 加载物料描述
 * @param materialDescriptor 物料描述对象
 */
export function loadMaterial(materialDescriptor: Material): void {
  collectMaterial(materialDescriptor);
}

/**
 * 批量加载物料描述
 * @param materials 物料描述对象数组
 */
export function loadMaterials(materials: Material[]): void {
  materials.forEach(material => loadMaterial(material));
}

/**
 * 自动扫描并加载指定目录下的所有物料描述文件
 * 注意：此功能依赖 Vite 的 import.meta.glob 功能
 */
export async function autoLoadMaterials(): Promise<void> {
  try {
    console.log('[物料加载器] 开始自动加载物料描述文件');
    
    // 使用 Vite 的 import.meta.glob 动态导入所有物料描述文件
    // 匹配所有 *.material.ts 文件作为物料描述
    const materialFiles = import.meta.glob('/src/materials/**/*.material.ts');
    
    let loadedCount = 0;
    for (const path in materialFiles) {
      try {
        const module: any = await materialFiles[path]();
        // 获取默认导出或命名导出
        const material = module.default || module.material;
        
        if (material && typeof material === 'object' && material.type) {
          loadMaterial(material);
          loadedCount++;
        } else {
          console.warn(`[物料加载器] 文件未导出有效物料: ${path}`);
        }
      } catch (err) {
        console.error(`[物料加载器] 加载物料出错: ${path}`, err);
      }
    }
    
    console.log(`[物料加载器] 自动加载完成，共加载 ${loadedCount} 个物料`);
  } catch (err) {
    console.error('[物料加载器] 自动加载物料失败', err);
  }
} 