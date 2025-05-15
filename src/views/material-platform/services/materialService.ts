/**
 * 物料平台服务
 * 负责与后端API通信，获取和管理物料数据
 */
import { MaterialService } from '@/core/material/services/material-service';
import type { 
  Material, 
  MaterialGroup, 
  ApiResponse
} from '../types';

/**
 * 获取所有物料分组
 * @returns 分组列表
 */
export async function fetchMaterialGroups(): Promise<MaterialGroup[]> {
  try {
    // 实际项目中应该从API获取
    // const response = await fetch('/api/material-groups');
    // return await response.json();
    
    // 模拟数据
    return [
      { id: 'base', name: '基础组件', description: '基础UI组件' },
      { id: 'layout', name: '布局组件', description: '页面布局组件' },
      { id: 'form', name: '表单组件', description: '表单输入组件' },
      { id: 'data', name: '数据组件', description: '数据展示组件' },
      { id: 'feedback', name: '反馈组件', description: '用户反馈组件' }
    ];
  } catch (error) {
    console.error('获取物料分组失败:', error);
    throw error;
  }
}

/**
 * 获取指定分组的物料列表
 * @param groupId 分组ID，如果为all则获取所有物料
 * @returns 物料列表
 */
export async function fetchMaterialsByGroup(groupId: string): Promise<Material[]> {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const materials = groupId === 'all' 
        ? Array(10).fill(null).map((_, i) => ({
            id: `material_${i}`,
            type: `component_${i}`,
            name: `示例物料 ${i+1}`,
            description: '这是一个示例物料描述',
            icon: 'el-icon-menu',
            version: '1.0.0',
            createTime: new Date().toISOString(),
            group: Math.random() > 0.5 ? 'base' : 'layout'
          }))
        : Array(5).fill(null).map((_, i) => ({
            id: `material_${groupId}_${i}`,
            type: `component_${i}`,
            name: `${groupId} 物料 ${i+1}`,
            description: `这是一个${groupId}分组的物料`,
            icon: 'el-icon-document',
            version: '1.0.0',
            createTime: new Date().toISOString(),
            group: groupId
          }));
      
      resolve(materials);
    }, 300);
  });
}

/**
 * 获取物料详情
 * @param materialId 物料ID
 * @returns 物料详情
 */
export async function fetchMaterialDetail(materialId: string): Promise<Material | null> {
  try {
    // 获取Material服务实例
    const materialService = MaterialService.getInstance();
    
    // 从ID中提取类型（假设ID的格式是 material_{type}_{index} 或直接是type）
    const typeMatch = materialId.match(/material_([^_]+)/) || materialId.match(/^([^_]+)_/);
    const type = typeMatch ? typeMatch[1] : materialId;
    
    // 首先尝试通过类型从核心物料服务获取
    const coreMaterial = materialService.getMaterialByType(type);
    if (coreMaterial) {
      return convertToMaterial(coreMaterial);
    }
    
    // 如果没有找到，使用模拟数据
    const mockMaterials = generateMockMaterials(20);
    return mockMaterials.find(m => m.id === materialId) || null;
  } catch (error) {
    console.error(`获取物料详情失败:`, error);
    throw error;
  }
}

/**
 * 创建物料分组
 * @param group 分组信息
 * @returns 创建的分组
 */
export async function createMaterialGroup(group: Partial<MaterialGroup>): Promise<MaterialGroup> {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const newGroup: MaterialGroup = {
        id: `group_${Date.now()}`,
        name: group.name || '新建分组',
        description: group.description,
        order: group.order,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      };
      
      resolve(newGroup);
    }, 300);
  });
}

/**
 * 更新物料分组
 * @param groupId 分组ID
 * @param group 分组信息
 * @returns 更新后的分组
 */
export async function updateMaterialGroup(groupId: string, group: Partial<MaterialGroup>): Promise<MaterialGroup> {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedGroup: MaterialGroup = {
        id: groupId,
        name: group.name || '未命名分组',
        description: group.description,
        order: group.order,
        updateTime: new Date().toISOString(),
        createTime: new Date().toISOString()
      };
      
      resolve(updatedGroup);
    }, 300);
  });
}

/**
 * 删除物料分组
 * @param groupId 分组ID
 * @returns 操作结果
 */
export async function deleteMaterialGroup(groupId: string): Promise<ApiResponse<null>> {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '删除分组成功'
      });
    }, 300);
  });
}

/**
 * 将核心物料转换为平台物料格式
 */
function convertToMaterial(coreMaterial: any): Material {
  return {
    id: coreMaterial.id || `material_${coreMaterial.type}`,
    type: coreMaterial.type,
    name: coreMaterial.name,
    description: coreMaterial.description,
    icon: coreMaterial.icon || 'el-icon-document',
    version: coreMaterial.version || '1.0.0',
    group: coreMaterial.group || 'base',
    tags: coreMaterial.tags || [],
    props: coreMaterial.props,
    events: coreMaterial.events,
    slots: coreMaterial.slots,
    isContainer: coreMaterial.isContainer,
    source: coreMaterial.source,
    createTime: coreMaterial.createTime || new Date().toISOString(),
    updateTime: coreMaterial.updateTime || new Date().toISOString(),
    creator: coreMaterial.creator
  };
}

/**
 * 生成模拟物料数据
 */
function generateMockMaterials(count: number, groupId?: string): Material[] {
  const groups = ['base', 'layout', 'form', 'data', 'feedback'];
  
  return Array(count).fill(null).map((_, i) => ({
    id: `material_${i}`,
    type: `component_${i}`,
    name: `示例物料 ${i+1}`,
    description: '这是一个示例物料描述',
    icon: Math.random() > 0.5 ? 'el-icon-menu' : 'el-icon-document',
    version: '1.0.0',
    group: groupId || groups[Math.floor(Math.random() * groups.length)],
    tags: Math.random() > 0.5 ? ['常用', '推荐'] : ['基础'],
    props: {},
    events: [],
    slots: [],
    isContainer: Math.random() > 0.7,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    creator: '系统'
  }));
}

/**
 * 创建物料
 * @param material 物料信息
 * @returns 创建的物料
 */
export async function createMaterial(material: Partial<Material>): Promise<Material> {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMaterial: Material = {
        id: `material_${Date.now()}`,
        type: material.type || `component_${Date.now()}`,
        name: material.name || '新建物料',
        description: material.description || '',
        icon: material.icon || 'el-icon-document',
        version: material.version || '1.0.0',
        group: material.group || 'base',
        tags: material.tags || [],
        props: material.props || {},
        events: material.events || [],
        slots: material.slots || [],
        isContainer: material.isContainer || false,
        source: material.source,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        creator: material.creator || '当前用户'
      };
      
      resolve(newMaterial);
    }, 500);
  });
}

/**
 * 更新物料
 * @param materialId 物料ID
 * @param material 物料信息
 * @returns 更新后的物料
 */
export async function updateMaterial(materialId: string, material: Partial<Material>): Promise<Material> {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedMaterial: Material = {
        id: materialId,
        type: material.type || `component_${Date.now()}`,
        name: material.name || '未命名物料',
        description: material.description || '',
        icon: material.icon || 'el-icon-document',
        version: material.version || '1.0.0',
        group: material.group || 'base',
        tags: material.tags || [],
        props: material.props || {},
        events: material.events || [],
        slots: material.slots || [],
        isContainer: material.isContainer || false,
        source: material.source,
        createTime: material.createTime || new Date().toISOString(),
        updateTime: new Date().toISOString(),
        creator: material.creator || '当前用户'
      };
      
      resolve(updatedMaterial);
    }, 500);
  });
}

/**
 * 删除物料
 * @param materialId 物料ID
 * @returns 操作结果
 */
export async function deleteMaterial(materialId: string): Promise<ApiResponse<null>> {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '删除物料成功'
      });
    }, 300);
  });
}

/**
 * 搜索物料
 * @param keyword 关键词
 * @param filters 过滤条件
 * @returns 物料列表
 */
export async function searchMaterials(keyword: string, filters?: {
  groups?: string[];
  tags?: string[];
  creator?: string;
  isContainer?: boolean;
}): Promise<Material[]> {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成模拟数据
      let materials = generateMockMaterials(20);
      
      // 关键词过滤
      if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        materials = materials.filter(m => 
          m.name.toLowerCase().includes(lowerKeyword) || 
          m.description?.toLowerCase().includes(lowerKeyword) ||
          m.type.toLowerCase().includes(lowerKeyword)
        );
      }
      
      // 分组过滤
      if (filters?.groups && filters.groups.length) {
        materials = materials.filter(m => filters.groups?.includes(m.group));
      }
      
      // 标签过滤
      if (filters?.tags && filters.tags.length) {
        materials = materials.filter(m => 
          m.tags && m.tags.some(tag => filters.tags?.includes(tag))
        );
      }
      
      // 创建者过滤
      if (filters?.creator) {
        materials = materials.filter(m => m.creator === filters.creator);
      }
      
      // 容器类型过滤
      if (filters?.isContainer !== undefined) {
        materials = materials.filter(m => m.isContainer === filters.isContainer);
      }
      
      resolve(materials);
    }, 500);
  });
}

/**
 * 批量删除物料
 * @param materialIds 物料ID数组
 * @returns 操作结果
 */
export async function batchDeleteMaterials(materialIds: string[]): Promise<ApiResponse<null>> {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `成功删除 ${materialIds.length} 个物料`
      });
    }, 500);
  });
} 