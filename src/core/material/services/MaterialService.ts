/**
 * 物料服务
 * 负责收集和管理物料描述信息，但不负责组件的注册
 */

import { reactive } from 'vue';
import type { Material } from '../types/MaterialTypes';

// 存储物料描述的容器
const materialsStore = reactive<Map<string, Material>>(new Map());

/**
 * 收集物料描述
 * @param material 物料描述对象
 */
export function collectMaterial(material: Material): void {
  if (!material.type) {
    console.warn('物料必须有type属性', material);
    return;
  }
  
  // 保存物料描述
  materialsStore.set(material.type, material);
  console.log(`[物料服务] 收集物料: ${material.name || material.type}`);
}

/**
 * 获取所有物料描述
 * @returns 所有物料描述的数组
 */
export function getAllMaterials(): Material[] {
  return Array.from(materialsStore.values());
}

/**
 * 通过类型获取物料描述
 * @param type 物料类型
 * @returns 指定类型的物料描述
 */
export function getMaterialByType(type: string): Material | undefined {
  return materialsStore.get(type);
}

/**
 * 按分组获取物料
 * @param group 分组名称
 * @returns 指定分组的物料数组
 */
export function getMaterialsByGroup(group: string): Material[] {
  return Array.from(materialsStore.values())
    .filter(material => material.group === group);
}

/**
 * 通过标签获取物料
 * @param tag 标签名
 * @returns 包含指定标签的物料数组
 */
export function getMaterialsByTag(tag: string): Material[] {
  return Array.from(materialsStore.values())
    .filter(material => material.tags?.includes(tag));
} 