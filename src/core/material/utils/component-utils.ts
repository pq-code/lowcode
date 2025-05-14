import type { MaterialComponent, MaterialProperty, ComponentNode } from '../types';
import type { EnhancedMaterialComponent } from '../types/enhanced';

/**
 * 组件工具类
 * 提供组件处理的工具函数
 */
export class ComponentUtils {
  /**
   * 生成组件节点
   * @param componentType 组件类型
   * @param props 组件属性
   * @param id 组件ID，不提供则自动生成
   * @returns 组件节点
   */
  static createComponentNode(
    componentType: string,
    props: Record<string, any> = {},
    id?: string
  ): ComponentNode {
    return {
      id: id || ComponentUtils.generateId(),
      componentType,
      props,
      children: []
    };
  }

  /**
   * 生成唯一ID
   * @returns 唯一ID
   */
  static generateId(): string {
    return 'node_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  /**
   * 获取组件默认属性
   * @param component 组件描述
   * @returns 组件默认属性对象
   */
  static getDefaultProps(component: MaterialComponent | EnhancedMaterialComponent): Record<string, any> {
    const props: Record<string, any> = {};
    
    if (!component.properties) {
      return props;
    }

    component.properties.forEach(prop => {
      if (prop.defaultValue !== undefined) {
        props[prop.name] = prop.defaultValue;
      }
    });

    return props;
  }

  /**
   * 克隆组件节点
   * @param node 要克隆的节点
   * @param generateNewIds 是否为克隆的节点生成新的ID
   * @returns 克隆后的节点
   */
  static cloneComponentNode(node: ComponentNode, generateNewIds = true): ComponentNode {
    const cloned: ComponentNode = {
      id: generateNewIds ? ComponentUtils.generateId() : node.id,
      componentType: node.componentType,
      props: { ...node.props },
      children: []
    };

    // 克隆子节点
    if (node.children && node.children.length > 0) {
      cloned.children = node.children.map(child => ComponentUtils.cloneComponentNode(child, generateNewIds));
    }

    // 克隆插槽内容
    if (node.slots) {
      cloned.slots = {};
      Object.keys(node.slots).forEach(slotName => {
        cloned.slots![slotName] = node.slots![slotName].map(slotNode => 
          ComponentUtils.cloneComponentNode(slotNode, generateNewIds)
        );
      });
    }

    // 克隆事件处理器
    if (node.events) {
      cloned.events = { ...node.events };
    }

    return cloned;
  }

  /**
   * 查找节点
   * @param root 根节点
   * @param nodeId 要查找的节点ID
   * @returns 找到的节点，未找到则返回null
   */
  static findNodeById(root: ComponentNode, nodeId: string): ComponentNode | null {
    if (root.id === nodeId) {
      return root;
    }

    // 在子节点中查找
    if (root.children && root.children.length > 0) {
      for (const child of root.children) {
        const found = ComponentUtils.findNodeById(child, nodeId);
        if (found) {
          return found;
        }
      }
    }

    // 在插槽内容中查找
    if (root.slots) {
      for (const slotNodes of Object.values(root.slots)) {
        for (const slotNode of slotNodes) {
          const found = ComponentUtils.findNodeById(slotNode, nodeId);
          if (found) {
            return found;
          }
        }
      }
    }

    return null;
  }

  /**
   * 移除节点
   * @param root 根节点
   * @param nodeId 要移除的节点ID
   * @returns 是否成功移除
   */
  static removeNodeById(root: ComponentNode, nodeId: string): boolean {
    // 直接子节点
    if (root.children && root.children.length > 0) {
      const index = root.children.findIndex(child => child.id === nodeId);
      if (index !== -1) {
        root.children.splice(index, 1);
        return true;
      }

      // 递归查找子节点中
      for (const child of root.children) {
        if (ComponentUtils.removeNodeById(child, nodeId)) {
          return true;
        }
      }
    }

    // 插槽内容
    if (root.slots) {
      for (const slotName in root.slots) {
        const slotNodes = root.slots[slotName];
        const index = slotNodes.findIndex(node => node.id === nodeId);
        if (index !== -1) {
          slotNodes.splice(index, 1);
          return true;
        }

        // 递归查找插槽节点中
        for (const slotNode of slotNodes) {
          if (ComponentUtils.removeNodeById(slotNode, nodeId)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * 验证组件属性值
   * @param value 属性值
   * @param property 属性定义
   * @returns 是否有效
   */
  static validatePropertyValue(value: any, property: MaterialProperty): boolean {
    // 如果值是undefined，检查是否必填
    if (value === undefined) {
      return !property.required;
    }

    // 根据类型验证
    switch (property.type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null;
      case 'array':
        return Array.isArray(value);
      case 'function':
        return typeof value === 'function' || typeof value === 'string'; // 可以是函数或函数字符串
      case 'select':
        // 对于select类型，值必须在选项中
        return property.options ? property.options.some(opt => opt.value === value) : true;
      case 'color':
        // 简单验证颜色格式
        return typeof value === 'string' && (
          /^#[0-9A-Fa-f]{3,8}$/.test(value) || // Hex
          /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(value) || // RGB
          /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(value) // RGBA
        );
      default:
        return true;
    }
  }
} 