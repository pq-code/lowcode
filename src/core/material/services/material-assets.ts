import { ref } from 'vue';
import type { MaterialComponent } from '../types';
import type { 
  MaterialAssets, 
  MaterialProtocolVersion, 
  EnhancedMaterialComponent,
  MaterialPackage
} from '../types/enhanced';
import { getProtocolVersionString } from '../types/enhanced';

/**
 * 物料资产服务
 * 管理物料资产包，包括组件的导入、导出、添加和移除
 */
export class MaterialAssetsService {
  /** 当前资产包 */
  private assets: MaterialAssets = {
    version: '1.0.0',
    packages: [],
    components: [],
    sort: {
      groupList: [],
      categoryList: []
    }
  };

  /**
   * 构造函数
   */
  constructor() {
    console.log('[MaterialAssetsService] 物料资产服务已初始化');
  }

  /**
   * 添加组件到资产包
   * @param component 组件描述信息
   */
  addComponent(component: EnhancedMaterialComponent): void {
    // 检查是否已存在该组件
    const existingIndex = this.assets.components.findIndex(
      c => c.componentId === component.componentId
    );

    if (existingIndex !== -1) {
      // 替换已存在的组件
      this.assets.components[existingIndex] = component;
      console.log(`[MaterialAssetsService] 更新组件: ${component.name} (${component.componentId})`);
    } else {
      // 添加新组件
      this.assets.components.push(component);
      console.log(`[MaterialAssetsService] 添加组件: ${component.name} (${component.componentId})`);
    }

    // 更新分组和分类列表
    this.updateSortInfo();
  }

  /**
   * 添加多个组件到资产包
   * @param components 组件列表
   */
  addComponents(components: EnhancedMaterialComponent[]): void {
    components.forEach(component => this.addComponent(component));
  }

  /**
   * 添加包信息到资产包
   * @param pkg 包信息
   */
  addPackage(pkg: MaterialPackage): void {
    // 检查是否已存在该包
    const existingIndex = this.assets.packages.findIndex(
      p => p.package === pkg.package && p.version === pkg.version
    );

    if (existingIndex !== -1) {
      // 替换已存在的包
      this.assets.packages[existingIndex] = pkg;
      console.log(`[MaterialAssetsService] 更新包: ${pkg.package} (${pkg.version})`);
    } else {
      // 添加新包
      this.assets.packages.push(pkg);
      console.log(`[MaterialAssetsService] 添加包: ${pkg.package} (${pkg.version})`);
    }
  }

  /**
   * 移除组件
   * @param componentId 组件ID
   */
  removeComponent(componentId: string): void {
    const initialLength = this.assets.components.length;
    this.assets.components = this.assets.components.filter(
      c => c.componentId !== componentId
    );

    if (initialLength !== this.assets.components.length) {
      console.log(`[MaterialAssetsService] 已移除组件: ${componentId}`);
      // 更新分组和分类列表
      this.updateSortInfo();
    } else {
      console.log(`[MaterialAssetsService] 未找到要移除的组件: ${componentId}`);
    }
  }

  /**
   * 获取资产包
   * @returns 完整的资产包信息
   */
  getAssets(): MaterialAssets {
    return { ...this.assets };
  }

  /**
   * 获取组件列表
   * @returns 所有组件描述信息
   */
  getComponents(): EnhancedMaterialComponent[] {
    return [...this.assets.components];
  }

  /**
   * 获取组件
   * @param componentId 组件ID
   * @returns 组件描述信息或undefined
   */
  getComponent(componentId: string): EnhancedMaterialComponent | undefined {
    return this.assets.components.find(c => c.componentId === componentId);
  }

  /**
   * 根据分组获取组件
   * @param group 分组名称
   * @returns 该分组下的组件列表
   */
  getComponentsByGroup(group: string): EnhancedMaterialComponent[] {
    return this.assets.components.filter(c => c.group === group);
  }

  /**
   * 根据分类获取组件
   * @param category 分类名称
   * @returns 该分类下的组件列表
   */
  getComponentsByCategory(category: string): EnhancedMaterialComponent[] {
    return this.assets.components.filter(c => c.category === category);
  }

  /**
   * 导出资产包为JSON字符串
   * @returns 资产包的JSON字符串
   */
  exportToJSON(): string {
    return JSON.stringify(this.assets, null, 2);
  }

  /**
   * 从JSON字符串导入资产包
   * @param json 资产包的JSON字符串
   * @returns 是否导入成功
   */
  importFromJSON(json: string): boolean {
    try {
      const assets = JSON.parse(json) as MaterialAssets;
      
      // 基本验证
      if (!assets.version || !Array.isArray(assets.components) || !Array.isArray(assets.packages)) {
        console.error('[MaterialAssetsService] 导入失败: 无效的资产包格式');
        return false;
      }
      
      this.assets = assets;
      console.log(`[MaterialAssetsService] 导入资产包成功: ${assets.components.length} 个组件, ${assets.packages.length} 个包`);
      return true;
    } catch (error) {
      console.error('[MaterialAssetsService] 导入失败:', error);
      return false;
    }
  }

  /**
   * 清空资产包
   */
  clear(): void {
    this.assets = {
      version: '1.0.0',
      packages: [],
      components: [],
      sort: {
        groupList: [],
        categoryList: []
      }
    };
    console.log('[MaterialAssetsService] 已清空资产包');
  }

  /**
   * 更新分组和分类信息
   * @private
   */
  private updateSortInfo(): void {
    // 获取所有唯一的分组
    const groups = new Set<string>();
    // 获取所有唯一的分类
    const categories = new Set<string>();

    this.assets.components.forEach(component => {
      if (component.group) {
        groups.add(component.group);
      }
      if (component.category) {
        categories.add(component.category);
      }
    });

    this.assets.sort.groupList = Array.from(groups);
    this.assets.sort.categoryList = Array.from(categories);
  }

  /**
   * 根据物料组件生成增强组件描述
   * @param component 基础物料组件
   * @param group 组件分组
   * @returns 增强的组件描述
   */
  enhanceComponent(component: MaterialComponent, group?: string): EnhancedMaterialComponent {
    return {
      ...component,
      group: group || component.category,
      priority: 0,
      configure: {
        props: component.properties.map(prop => ({
          type: 'field',
          title: prop.label,
          name: prop.name,
          display: 'inline',
          defaultValue: prop.defaultValue,
          setter: this.getSetterByPropertyType(prop.type)
        })),
        component: {
          isContainer: component.isContainer || false,
          isModal: false,
          descriptor: component.title
        },
        supports: {
          style: true,
          events: component.events?.map(event => event.name) || [],
          loop: false,
          condition: true
        }
      }
    };
  }

  /**
   * 根据属性类型获取对应的setter类型
   * @param type 属性类型
   * @returns setter类型
   * @private
   */
  private getSetterByPropertyType(type: string): string {
    switch (type) {
      case 'string':
        return 'StringSetter';
      case 'number':
        return 'NumberSetter';
      case 'boolean':
        return 'BooleanSetter';
      case 'object':
        return 'JsonSetter';
      case 'array':
        return 'ArraySetter';
      case 'function':
        return 'FunctionSetter';
      case 'color':
        return 'ColorSetter';
      case 'select':
        return 'SelectSetter';
      case 'slot':
        return 'SlotSetter';
      case 'node':
        return 'NodeSetter';
      default:
        return 'StringSetter';
    }
  }
} 