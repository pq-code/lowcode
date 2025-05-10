/**
 * 组件注册器 - 兼容性模块
 * 提供与旧materialRegistry类似的接口，但使用新的物料服务
 */
import type { Material } from '@/core/material/types/MaterialTypes';
import { getAllMaterials, getMaterialByType } from '@/core/material/services/MaterialService';

/**
 * 获取已注册的物料列表
 * @returns 物料列表
 */
export function getRegisteredMaterials(): Material[] {
  return getAllMaterials();
}

/**
 * 获取指定类型的物料
 * @param type 物料类型
 * @returns 物料信息
 */
export function getMaterial(type: string): Material | undefined {
  return getMaterialByType(type);
}

// 为兼容旧代码，提供一个类似的materialRegistry对象
export const materialRegistry = {
  getMaterial,
  getRegisteredMaterials,
}; 