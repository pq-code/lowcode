import { reactive, ref } from 'vue';
import type { MaterialComponent } from '../types';
import type { EnhancedMaterialComponent, MaterialComponentRegistry, MaterialRenderBridge } from '../types/enhanced';

/**
 * 物料注册服务
 * 实现了MaterialRenderBridge接口，用于组件的注册、获取和管理
 */
export class MaterialRegistry implements MaterialRenderBridge {
  /** 组件注册表 */
  private componentRegistry: Record<string, MaterialComponentRegistry> = {};

  /**
   * 注册物料组件
   * @param info 组件注册信息
   */
  registerComponent(info: MaterialComponentRegistry): void {
    if (!info.componentMeta.componentId) {
      console.error('[MaterialRegistry] 组件注册失败: 缺少componentId');
      return;
    }

    this.componentRegistry[info.componentMeta.componentId] = info;
    
    // 如果有componentType也注册一份，方便查询
    if (info.componentMeta.type) {
      this.componentRegistry[info.componentMeta.type] = info;
    }
    
    console.log(`[MaterialRegistry] 组件注册成功: ${info.componentMeta.name} (${info.componentMeta.componentId})`);
  }

  /**
   * 批量注册物料组件
   * @param infoList 组件注册信息列表
   */
  registerComponents(infoList: MaterialComponentRegistry[]): void {
    infoList.forEach(info => this.registerComponent(info));
  }

  /**
   * 获取已注册的组件
   * @param componentId 组件ID或类型
   * @returns 组件注册信息或null
   */
  getComponent(componentId: string): MaterialComponentRegistry | null {
    return this.componentRegistry[componentId] || null;
  }

  /**
   * 根据分组获取组件
   * @param group 分组名称
   * @returns 该分组下的组件列表
   */
  getComponentsByGroup(group: string): MaterialComponentRegistry[] {
    return Object.values(this.componentRegistry).filter(
      info => 'group' in info.componentMeta && info.componentMeta.group === group
    );
  }

  /**
   * 根据分类获取组件
   * @param category 分类名称
   * @returns 该分类下的组件列表
   */
  getComponentsByCategory(category: string): MaterialComponentRegistry[] {
    return Object.values(this.componentRegistry).filter(
      info => info.componentMeta.category === category
    );
  }

  /**
   * 获取所有已注册的组件
   * @returns 所有已注册的组件列表
   */
  getAllComponents(): MaterialComponentRegistry[] {
    // 去重处理，确保componentId和type不重复返回组件
    const componentsMap = new Map<string, MaterialComponentRegistry>();
    
    Object.values(this.componentRegistry).forEach(info => {
      if (!componentsMap.has(info.componentMeta.componentId)) {
        componentsMap.set(info.componentMeta.componentId, info);
      }
    });
    
    return Array.from(componentsMap.values());
  }

  /**
   * 移除组件注册
   * @param componentId 组件ID
   */
  unregisterComponent(componentId: string): void {
    if (this.componentRegistry[componentId]) {
      const component = this.componentRegistry[componentId];
      
      // 同时移除type注册
      if (component.componentMeta.type && this.componentRegistry[component.componentMeta.type]) {
        delete this.componentRegistry[component.componentMeta.type];
      }
      
      delete this.componentRegistry[componentId];
      console.log(`[MaterialRegistry] 组件注销成功: ${componentId}`);
    }
  }

  /**
   * 清空所有组件注册
   */
  clear(): void {
    this.componentRegistry = {};
    console.log('[MaterialRegistry] 清空所有组件注册');
  }
} 