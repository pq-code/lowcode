/**
 * 物料平台服务
 * 负责与后端API通信，获取和管理物料数据
 */
import { MaterialService } from '@/core/material/services/material-service';

// 物料分组类型
export interface MaterialGroup {
  id: string;
  name: string;
  description?: string;
  order?: number;
  createTime?: string;
  updateTime?: string;
}

// 物料属性类型
export interface MaterialProperty {
  type: string;
  title: string;
  description?: string;
  default?: any;
  enum?: any[];
  format?: string;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  placeholder?: string;
}

// 物料事件类型
export interface MaterialEvent {
  name: string;
  description?: string;
  parameters?: MaterialProperty[];
}

// 物料插槽类型
export interface MaterialSlot {
  name: string;
  description?: string;
  defaultContent?: string;
}

// 物料导入类型
export interface MaterialImport {
  path: string;
  name?: string;
  destructuring?: boolean;
}

// 物料远程类型
export interface MaterialRemote {
  url: string;
  version?: string;
}

// 物料源类型
export interface MaterialSource {
  type: 'local' | 'remote' | 'npm';
  import?: MaterialImport;
  remote?: MaterialRemote;
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
  props?: Record<string, MaterialProperty>;
  events?: MaterialEvent[];
  slots?: MaterialSlot[];
  isContainer?: boolean;
  source?: MaterialSource;
  createTime?: string;
  updateTime?: string;
  creator?: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
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
    // 获取Material服务实例
    const materialService = MaterialService.getInstance();
    
    // 尝试从核心物料服务获取物料
    const coreMaterials = materialService.getAllMaterials();
    
    // 如果有核心物料数据，按分组筛选并返回
    if (coreMaterials && coreMaterials.length > 0) {
      if (groupId === 'all') {
        // 转换为平台物料格式
        return coreMaterials.map(convertToMaterial);
      } else {
        // 按分组筛选
        return coreMaterials
          .filter(material => material.category === groupId)
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
 * 更新物料分组
 * @param groupId 分组ID
 * @param group 分组信息
 * @returns 更新后的分组
 */
export async function updateMaterialGroup(groupId: string, group: Partial<MaterialGroup>): Promise<MaterialGroup> {
  try {
    // 实际项目中应该调用API
    // const response = await fetch(`/api/material-groups/${groupId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(group)
    // });
    // return await response.json();
    
    // 模拟返回
    return {
      id: groupId,
      name: group.name || 'Updated Group',
      description: group.description,
      updateTime: new Date().toISOString(),
      createTime: new Date(Date.now() - 86400000).toISOString()
    };
  } catch (error) {
    console.error('更新物料分组失败:', error);
    throw error;
  }
}

/**
 * 删除物料分组
 * @param groupId 分组ID
 * @returns 删除结果
 */
export async function deleteMaterialGroup(groupId: string): Promise<ApiResponse<null>> {
  try {
    // 实际项目中应该调用API
    // const response = await fetch(`/api/material-groups/${groupId}`, {
    //   method: 'DELETE'
    // });
    // return await response.json();
    
    // 模拟返回
    return {
      success: true,
      message: '删除分组成功'
    };
  } catch (error) {
    console.error('删除物料分组失败:', error);
    return {
      success: false,
      message: '删除物料分组失败'
    };
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
    group: coreMaterial.category || coreMaterial.group || 'base',
    tags: coreMaterial.tags,
    props: coreMaterial.properties?.reduce((props: Record<string, MaterialProperty>, prop: any) => {
      props[prop.name] = {
        type: prop.type,
        title: prop.label || prop.name,
        description: prop.description,
        default: prop.defaultValue,
        enum: prop.enum || prop.options,
        required: prop.required
      };
      return props;
    }, {}),
    events: coreMaterial.events,
    slots: coreMaterial.slots,
    isContainer: coreMaterial.isContainer,
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

/**
 * 创建物料
 * @param material 物料信息
 * @returns 创建的物料
 */
export async function createMaterial(material: Partial<Material>): Promise<Material> {
  try {
    // 实际项目中应该调用API
    // const response = await fetch('/api/materials', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(material)
    // });
    // return await response.json();
    
    // 模拟返回
    return {
      id: `material_${Date.now()}`,
      type: material.type || `component_${Date.now()}`,
      name: material.name || 'New Material',
      description: material.description || '',
      icon: material.icon || 'el-icon-menu',
      version: material.version || '1.0.0',
      group: material.group || 'base',
      tags: material.tags || ['component'],
      props: material.props || {},
      events: material.events || [],
      slots: material.slots || [],
      isContainer: material.isContainer || false,
      source: material.source || {
        type: 'local',
        import: {
          path: '@/components/Example.vue',
          name: 'default'
        }
      },
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      creator: 'admin'
    };
  } catch (error) {
    console.error('创建物料失败:', error);
    throw error;
  }
}

/**
 * 导入物料
 * @param materials 物料列表 
 * @returns 导入结果
 */
export async function importMaterials(materials: Partial<Material>[]): Promise<{ 
  success: boolean; 
  count: number; 
  message?: string;
}> {
  try {
    // 实际项目中应该调用API
    // const response = await fetch('/api/materials/import', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ materials })
    // });
    // return await response.json();
    
    // 模拟返回
    return {
      success: true,
      count: materials.length,
      message: `成功导入${materials.length}个物料`
    };
  } catch (error) {
    console.error('导入物料失败:', error);
    throw error;
  }
}

/**
 * 删除物料
 * @param materialId 物料ID
 * @returns 删除结果
 */
export async function deleteMaterial(materialId: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    // 实际项目中应该调用API
    // const response = await fetch(`/api/materials/${materialId}`, {
    //   method: 'DELETE'
    // });
    // return await response.json();
    
    // 模拟返回
    return {
      success: true,
      message: '删除成功'
    };
  } catch (error) {
    console.error('删除物料失败:', error);
    throw error;
  }
}

/**
 * 更新物料信息
 * @param materialId 物料ID
 * @param material 物料信息
 * @returns 更新的物料
 */
export async function updateMaterial(materialId: string, material: Partial<Material>): Promise<Material> {
  try {
    // 实际项目中应该调用API
    // const response = await fetch(`/api/materials/${materialId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(material)
    // });
    // return await response.json();
    
    // 模拟返回
    return {
      ...material,
      id: materialId,
      updateTime: new Date().toISOString()
    } as Material;
  } catch (error) {
    console.error('更新物料失败:', error);
    throw error;
  }
}

/**
 * 批量删除物料
 * @param materialIds 物料ID数组
 * @returns 删除结果
 */
export async function batchDeleteMaterials(materialIds: string[]): Promise<{
  success: boolean;
  count: number;
  message?: string;
}> {
  try {
    // 实际项目中应该调用API
    // const response = await fetch('/api/materials/batch-delete', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ids: materialIds })
    // });
    // return await response.json();
    
    // 模拟返回
    return {
      success: true,
      count: materialIds.length,
      message: `成功删除${materialIds.length}个物料`
    };
  } catch (error) {
    console.error('批量删除物料失败:', error);
    return {
      success: false,
      count: 0,
      message: '批量删除物料失败'
    };
  }
}

/**
 * 批量更新物料
 * @param materials 物料对象数组，每个对象包含id和要更新的字段
 * @returns 更新结果
 */
export async function batchUpdateMaterials(materials: { id: string; [key: string]: any }[]): Promise<{
  success: boolean;
  count: number;
  message?: string;
}> {
  try {
    // 实际项目中应该调用API
    // const response = await fetch('/api/materials/batch-update', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ materials })
    // });
    // return await response.json();
    
    // 模拟返回
    return {
      success: true,
      count: materials.length,
      message: `成功更新${materials.length}个物料`
    };
  } catch (error) {
    console.error('批量更新物料失败:', error);
    return {
      success: false,
      count: 0,
      message: '批量更新物料失败'
    };
  }
}

/**
 * AI解析组件文件，生成物料描述
 * @param fileContent 组件文件内容
 * @returns 物料描述
 */
export async function parseComponentWithAI(fileContent: string): Promise<{
  success: boolean;
  material?: Partial<Material>;
  message?: string;
}> {
  try {
    // 实际项目中应该调用AI接口
    // const response = await fetch('/api/materials/parse-with-ai', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ fileContent })
    // });
    // return await response.json();
    
    // 优化AI解析过程，减少处理时间
    let componentName = '';
    const propsMatch = fileContent.match(/props\s*:\s*{([^}]*)}/);
    const nameMatch = fileContent.match(/name\s*:\s*['"](.*?)['"]/);
    
    if (nameMatch && nameMatch[1]) {
      componentName = nameMatch[1];
    } else {
      // 尝试从文件名或类名获取
      const classMatch = fileContent.match(/class\s+(\w+)/);
      const defineMatch = fileContent.match(/defineComponent\s*\(\s*['"](\w+)['"]/);
      
      if (defineMatch && defineMatch[1]) {
        componentName = defineMatch[1];
      } else if (classMatch && classMatch[1]) {
        componentName = classMatch[1];
      } else {
        componentName = `Component_${Date.now()}`;
      }
    }
    
    // 解析props - 简化处理逻辑
    const props: Record<string, MaterialProperty> = {};
    if (propsMatch && propsMatch[1]) {
      const propsContent = propsMatch[1];
      const propMatches = propsContent.match(/(\w+)\s*:/g) || [];
      
      // 限制处理的属性数量，避免过度处理
      const maxProps = 10;
      propMatches.slice(0, maxProps).forEach(propName => {
        const name = propName.replace(':', '').trim();
        props[name] = {
          type: 'string',
          title: name.charAt(0).toUpperCase() + name.slice(1),
          default: ''
        };
      });
    }
    
    // 解析事件 - 简化处理逻辑
    const events: MaterialEvent[] = [];
    const emitsMatch = fileContent.match(/emits\s*:\s*\[(.*?)\]/);
    if (emitsMatch && emitsMatch[1]) {
      const emitsContent = emitsMatch[1];
      const emitMatches = emitsContent.match(/['"](\w+)['"]/g) || [];
      
      // 限制处理的事件数量
      const maxEvents = 5;
      emitMatches.slice(0, maxEvents).forEach(emitName => {
        const name = emitName.replace(/['"]/g, '');
        events.push({
          name,
          description: `${name}事件`
        });
      });
    }
    
    // 解析插槽 - 简化处理逻辑
    const slots: MaterialSlot[] = [];
    const slotMatches = (fileContent.match(/<slot.*?>/g) || []).slice(0, 5);
    if (slotMatches.length > 0) {
      slotMatches.forEach(slotMatch => {
        const nameMatch = slotMatch.match(/name\s*=\s*["'](\w+)["']/);
        if (nameMatch) {
          slots.push({
            name: nameMatch[1],
            description: `${nameMatch[1]}插槽`
          });
        } else if (!slots.some(s => s.name === 'default')) {
          slots.push({
            name: 'default',
            description: '默认插槽'
          });
        }
      });
    }
    
    // 使用更短的延迟时间
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      material: {
        name: componentName,
        type: componentName.toLowerCase(),
        description: `这是AI自动解析生成的${componentName}组件描述`,
        version: '1.0.0',
        group: 'base',
        tags: ['AI生成'],
        props,
        events,
        slots,
        icon: 'el-icon-cpu',
      }
    };
  } catch (error) {
    console.error('AI解析组件失败:', error);
    return {
      success: false,
      message: '解析组件失败，请检查组件文件格式'
    };
  }
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
  try {
    // 实际项目中应该调用API
    // const params = new URLSearchParams();
    // params.append('keyword', keyword);
    // if (filters?.groups) params.append('groups', filters.groups.join(','));
    // if (filters?.tags) params.append('tags', filters.tags.join(','));
    // if (filters?.creator) params.append('creator', filters.creator);
    // if (filters?.isContainer !== undefined) params.append('isContainer', String(filters.isContainer));
    // const response = await fetch(`/api/materials/search?${params.toString()}`);
    // return await response.json();
    
    // 模拟搜索结果
    const allMaterials = generateMockMaterials(20);
    
    return allMaterials.filter(material => {
      // 关键词匹配
      const keywordMatch = !keyword || 
        material.name.toLowerCase().includes(keyword.toLowerCase()) ||
        material.description?.toLowerCase().includes(keyword.toLowerCase()) ||
        material.type.toLowerCase().includes(keyword.toLowerCase());
      
      // 分组过滤
      const groupMatch = !filters?.groups?.length || 
        filters.groups.includes(material.group);
      
      // 标签过滤
      const tagMatch = !filters?.tags?.length || 
        material.tags?.some(tag => filters.tags?.includes(tag));
      
      // 创建者过滤
      const creatorMatch = !filters?.creator ||
        material.creator === filters.creator;
      
      // 容器类型过滤
      const containerMatch = filters?.isContainer === undefined ||
        material.isContainer === filters.isContainer;
      
      return keywordMatch && groupMatch && tagMatch && creatorMatch && containerMatch;
    });
  } catch (error) {
    console.error('搜索物料失败:', error);
    throw error;
  }
} 