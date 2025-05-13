/**
 * 物料平台服务
 * 负责与后端API通信，获取和管理物料数据
 */
import { getMaterialByType, getAllMaterials as getCoreAllMaterials } from '@/core/material/services/MaterialService';

// 物料分组类型
export interface MaterialGroup {
  id: string;
  name: string;
  description?: string;
  order?: number;
  createTime?: string;
  updateTime?: string;
}

// 物料描述类型
export interface Material {
  id: string;
  type: string;
  name: string;
  description?: string;
  icon?: string;
  version: string;
  group: string;
  tags?: string[];
  props?: Record<string, any>;  // 属性配置
  source?: {
    type: string;
    import?: {
      path: string;
      name?: string;
      destructuring?: boolean;
    };
    remote?: {
      url: string;
      version?: string;
    };
  };
  createTime?: string;
  updateTime?: string;
  creator?: string;
}

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
 * 获取指定分组的物料
 * @param groupId 分组ID，为'all'时获取所有分组
 * @returns 物料列表
 */
export async function fetchMaterialsByGroup(groupId: string): Promise<Material[]> {
  try {
    // 尝试从核心物料服务获取物料
    const coreMaterials = getCoreAllMaterials();
    
    // 如果有核心物料数据，按分组筛选并返回
    if (coreMaterials && coreMaterials.length > 0) {
      if (groupId === 'all') {
        // 转换为平台物料格式
        return coreMaterials.map(convertToMaterial);
      } else {
        // 按分组筛选
        return coreMaterials
          .filter(m => m.group === groupId)
          .map(convertToMaterial);
      }
    }
    
    // 如果没有核心物料或为空，使用模拟数据
    if (groupId === 'all') {
      return generateMockMaterials(10);
    } else {
      return generateMockMaterials(5, groupId);
    }
  } catch (error) {
    console.error(`获取${groupId}分组物料失败:`, error);
    throw error;
  }
}

/**
 * 获取物料详情
 * @param materialId 物料ID
 * @returns 物料详情
 */
export async function fetchMaterialDetail(materialId: string): Promise<Material | null> {
  try {
    // 尝试从核心物料服务获取物料
    const coreMaterials = getCoreAllMaterials();
    
    // 从ID中提取类型（假设ID的格式是 material_{type}_{index} 或直接是type）
    const typeMatch = materialId.match(/material_([^_]+)/) || materialId.match(/^([^_]+)_/);
    const type = typeMatch ? typeMatch[1] : materialId;
    
    // 首先尝试通过类型从核心物料服务获取
    const coreMaterial = getMaterialByType(type);
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
  try {
    // 实际项目中应该调用API
    // const response = await fetch('/api/material-groups', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(group)
    // });
    // return await response.json();
    
    // 模拟返回
    return {
      id: `group_${Date.now()}`,
      name: group.name || 'New Group',
      description: group.description,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
  } catch (error) {
    console.error('创建物料分组失败:', error);
    throw error;
  }
}

/**
 * 转换核心物料到平台物料格式
 */
function convertToMaterial(coreMaterial: any): Material {
  return {
    id: `material_${coreMaterial.type}`,
    type: coreMaterial.type,
    name: coreMaterial.name,
    description: coreMaterial.description,
    icon: coreMaterial.icon,
    version: coreMaterial.version || '1.0.0',
    group: coreMaterial.group,
    tags: coreMaterial.tags,
    props: coreMaterial.props,
    source: coreMaterial.source,
    createTime: coreMaterial.createTime || new Date().toISOString(),
    updateTime: coreMaterial.updateTime || new Date().toISOString(),
    creator: coreMaterial.creator || 'system'
  };
}

// 生成模拟物料数据
function generateMockMaterials(count: number, groupId?: string): Material[] {
  const groups = ['base', 'layout', 'form', 'data', 'feedback'];
  
  return Array(count).fill(null).map((_, i) => ({
    id: `material_${groupId || 'all'}_${i}`,
    type: `component_${i}`,
    name: groupId ? `${groupId} 物料 ${i+1}` : `示例物料 ${i+1}`,
    description: groupId ? `这是一个${groupId}分组的物料` : '这是一个示例物料描述',
    icon: 'el-icon-' + (Math.random() > 0.5 ? 'menu' : 'document'),
    version: '1.0.0',
    group: groupId || groups[Math.floor(Math.random() * groups.length)],
    tags: ['component', groupId || 'common'],
    props: {
      type: { 
        type: 'enum', 
        title: '类型',
        default: 'primary',
        enum: ['primary', 'success', 'warning', 'danger', 'info']
      },
      size: {
        type: 'enum',
        title: '尺寸',
        default: 'default',
        enum: ['large', 'default', 'small']
      },
      text: {
        type: 'string',
        title: '文本',
        default: '示例按钮'
      }
    },
    source: {
      type: 'local',
      import: {
        path: '@/components/Example.vue',
        name: 'default'
      }
    },
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    creator: 'admin'
  }));
} 