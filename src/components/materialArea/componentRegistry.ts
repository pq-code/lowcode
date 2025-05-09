import type { Component } from 'vue';
import { defineAsyncComponent } from 'vue';
import Form from '@/packages/Form';
import { ElInput } from 'element-plus';
import DlockContainer from '@/packages/DlockContainer/src/DlockContainer.jsx';

// 组件描述类型定义
export interface ComponentDescriptor {
  // 组件在UI中显示的名称
  componentName: string;
  
  // 组件类型标识，用于渲染引擎匹配
  type: string;
  
  // 组件图标，用于组件面板显示
  icon?: string;
  
  // 组件分组
  group: string;
  
  // 组件npm包信息
  npm?: {
    exportName: string;
    package?: string;
    component?: string;
    destructuring?: boolean;
  };
  
  // 组件属性定义
  props: Record<string, any>;
  
  // 子组件
  children?: any[];

  // 其他元数据
  [key: string]: any;
}

// 组件注册信息类型
interface ComponentRegistration {
  descriptor: ComponentDescriptor;
  component?: Component | null;
  asyncImport?: () => Promise<Component>;
}

/**
 * 组件注册中心类
 */
class ComponentRegistry {
  // 已注册的组件映射表
  private registeredComponents: Map<string, ComponentRegistration> = new Map();
  
  // 内置组件映射
  private builtInComponents: Map<string, Component> = new Map();

  constructor() {
    // 初始化内置组件
    this.initBuiltInComponents();
  }

  /**
   * 初始化内置组件
   */
  private initBuiltInComponents(): void {
    // 注册基础组件
    this.builtInComponents.set('container', DlockContainer);
    this.builtInComponents.set('Form', Form);
    this.builtInComponents.set('input', ElInput);
    
    // 可以添加更多内置组件...
  }

  /**
   * 注册组件
   * @param descriptor 组件描述对象
   */
  register(descriptor: ComponentDescriptor): void {
    const { type } = descriptor;
    
    // 验证组件描述是否符合规范
    this.validateDescriptor(descriptor);
    
    // 检查是否已经存在同类型组件
    if (this.registeredComponents.has(type)) {
      console.warn(`组件类型 "${type}" 已存在，将被覆盖`);
    }
    
    // 创建组件注册信息
    const registration: ComponentRegistration = {
      descriptor,
    };
    
    // 如果是内置组件，直接关联组件实现
    if (this.builtInComponents.has(type)) {
      registration.component = this.builtInComponents.get(type) || null;
    } 
    // 否则创建异步导入函数
    else if (descriptor.npm?.component) {
      registration.asyncImport = () => this.createAsyncImport(descriptor.npm!.component!);
    }
    
    // 注册到映射表
    this.registeredComponents.set(type, registration);
  }

  /**
   * 批量注册组件
   * @param descriptors 组件描述对象数组
   */
  registerMany(descriptors: ComponentDescriptor[]): void {
    descriptors.forEach(descriptor => this.register(descriptor));
  }

  /**
   * 获取已注册的组件
   * @param type 组件类型
   */
  getComponent(type: string): ComponentRegistration | undefined {
    return this.registeredComponents.get(type);
  }

  /**
   * 获取所有已注册的组件描述
   */
  getAllDescriptors(): ComponentDescriptor[] {
    return Array.from(this.registeredComponents.values()).map(reg => reg.descriptor);
  }

  /**
   * 检查是否为内置组件
   * @param type 组件类型
   */
  isBuiltInComponent(type: string): boolean {
    return this.builtInComponents.has(type);
  }

  /**
   * 获取内置组件
   * @param type 组件类型
   */
  getBuiltInComponent(type: string): Component | null {
    return this.builtInComponents.get(type) || null;
  }

  /**
   * 验证组件描述是否符合规范
   * @param descriptor 组件描述对象
   */
  private validateDescriptor(descriptor: ComponentDescriptor): void {
    const { componentName, type, group } = descriptor;
    
    if (!componentName || !type || !group) {
      throw new Error(`组件注册失败: 组件 "${type || '未知'}" 缺少必要字段 (componentName, type, group)`);
    }
    
    // 验证npm路径格式
    if (descriptor.npm?.component && !descriptor.npm.component.startsWith('@/')) {
      console.warn(`组件 "${type}" 的路径不符合规范，应使用 @/ 开头的绝对路径`);
      // 自动修正路径
      descriptor.npm.component = descriptor.npm.component.startsWith('packages/')
        ? `@/${descriptor.npm.component}`
        : descriptor.npm.component;
    }
  }

  /**
   * 创建异步导入函数
   * @param path 组件路径
   */
  private createAsyncImport(path: string): Promise<Component> {
    const relativePath = path.replace('@/', '../../../');
    
    try {
      return import(/* @vite-ignore */ relativePath).then(module => module.default);
    } catch (error) {
      console.error(`组件导入失败: ${path}`, error);
      throw error;
    }
  }

  /**
   * 获取组件分组信息
   * 将组件按分组划分，便于组件面板显示
   */
  getComponentGroups(): Record<string, ComponentDescriptor[]> {
    const groups: Record<string, ComponentDescriptor[]> = {};
    
    this.getAllDescriptors().forEach(descriptor => {
      const { group } = descriptor;
      
      if (!groups[group]) {
        groups[group] = [];
      }
      
      groups[group].push(descriptor);
    });
    
    return groups;
  }

  /**
   * 导出组件配置
   * 格式化为可读的JSON配置
   */
  exportComponentConfig(): string {
    const config = this.getAllDescriptors().map(descriptor => {
      // 提取关键信息
      const { componentName, type, group, npm } = descriptor;
      return {
        componentName,
        type,
        group,
        npm: npm ? {
          ...npm,
          component: npm.component || undefined
        } : undefined,
        // 其他可能需要的属性
      };
    });
    
    return JSON.stringify(config, null, 2);
  }
}

// 创建全局组件注册中心实例
export const componentRegistry = new ComponentRegistry();

// 导出组件注册中心实例
export default componentRegistry; 