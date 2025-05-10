/**
 * 物料区域兼容层
 * 提供与旧系统兼容的API，但使用新的物料服务
 */
import { getAllMaterials } from '@/core/material/services/MaterialService';
import type { Material } from '@/core/material/types/MaterialTypes';

/**
 * 获取所有物料
 * @returns Material[] 物料列表
 */
export function getMaterials(): Material[] {
  return getAllMaterials();
}

/**
 * 物料分组
 * @param materials 物料列表
 * @returns 分组后的物料
 */
export function groupMaterials(materials: Material[]) {
  const groups: Record<string, Material[]> = {};
  
  materials.forEach(item => {
    const group = item.group || 'default';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
  });
  
  return groups;
}

export default {
  getMaterials,
  groupMaterials
};
