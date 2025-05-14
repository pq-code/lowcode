import type { MaterialAnalysisResult, MaterialComponent, MaterialPropertyType } from '../types';

/**
 * 物料AI服务
 * 负责物料的AI分析和智能生成
 */
export class MaterialAIService {
  /**
   * 使用AI分析源码，增强分析结果
   * @param basicAnalysis 基础分析结果
   * @param sourceCode 源代码
   * @returns 增强后的物料组件
   */
  public async enhanceAnalysis(
    basicAnalysis: MaterialAnalysisResult,
    sourceCode: string
  ): Promise<MaterialComponent> {
    try {
      // 注意：实际产品中应连接到AI服务进行分析
      // 这里使用模拟实现

      // 根据组件名称推断分类和标签
      const category = this.inferCategory(basicAnalysis.name);
      const tags = this.inferTags(basicAnalysis);
      
      // 增强描述
      const description = this.generateDescription(basicAnalysis, sourceCode);
      
      // 创建物料组件
      const componentId = `material_${Date.now()}`;
      
      // 转换属性为物料属性
      const properties = Object.keys(basicAnalysis.props || {}).map(propName => {
        const propInfo = basicAnalysis.props![propName];
        return {
          name: propName,
          label: this.formatPropLabel(propName),
          type: this.mapTypeToMaterialType(propInfo.type),
          defaultValue: propInfo.default,
          required: propInfo.required || false,
          description: propInfo.description || this.generatePropDescription(propName, propInfo.type)
        };
      });
      
      // 转换事件
      const events = (basicAnalysis.events || []).map(event => ({
        name: event.name,
        label: this.formatEventLabel(event.name),
        description: event.description || this.generateEventDescription(event.name)
      }));
      
      // 转换插槽
      const slots = (basicAnalysis.slots || []).map(slot => ({
        name: slot.name,
        label: this.formatSlotLabel(slot.name),
        description: slot.description || this.generateSlotDescription(slot.name),
        isDefault: slot.name === 'default'
      }));
      
      return {
        componentId,
        name: basicAnalysis.name,
        type: basicAnalysis.type,
        category,
        title: this.formatTitle(basicAnalysis.name),
        description,
        properties,
        events,
        slots,
        tags,
        version: '1.0.0',
        sourceCode,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        creator: 'ai'
      };
    } catch (error) {
      console.error('AI增强分析失败:', error);
      
      // 出错时使用基础分析结果创建简单物料
      const componentId = `material_${Date.now()}`;
      
      return {
        componentId,
        name: basicAnalysis.name,
        type: basicAnalysis.type,
        category: 'other',
        title: basicAnalysis.name,
        description: '组件描述',
        properties: [],
        version: '1.0.0',
        sourceCode,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        creator: 'system'
      };
    }
  }

  /**
   * 生成组件描述文档
   * @param componentId 组件ID
   * @param sourceCode 源代码
   * @returns 生成的文档
   */
  public async generateDocumentation(
    componentId: string,
    sourceCode: string
  ): Promise<string> {
    // 这里应该调用AI服务生成文档
    // 现在使用模拟实现
    
    // 提取组件名称
    const nameMatch = sourceCode.match(/name\s*:\s*['"]([^'"]+)['"]/);
    const componentName = nameMatch ? nameMatch[1] : 'Component';
    
    return `# ${componentName} 组件文档

## 组件介绍

这是一个基于Vue 3的组件，提供了简单易用的界面元素。

## 使用方法

\`\`\`vue
<template>
  <${componentName} 
    type="primary"
    @click="handleClick"
  />
</template>

<script setup>
const handleClick = () => {
  console.log('Component clicked!');
};
</script>
\`\`\`

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| type  | String | 'default' | 组件类型，可选值：default, primary, success, warning, danger |
| size  | String | 'medium' | 组件大小，可选值：small, medium, large |

## 事件

| 事件名 | 参数 | 说明 |
|-------|------|------|
| click | (value: boolean) | 点击组件时触发 |
| change | (value: any) | 组件值变化时触发 |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 默认插槽，用于定制组件内容 |
| header | 头部插槽，用于定制头部内容 |
| footer | 底部插槽，用于定制底部内容 |
`;
  }

  /**
   * 根据组件名称推断分类
   * @param name 组件名称
   */
  private inferCategory(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('button') || lowerName.includes('btn')) {
      return 'basic';
    } else if (lowerName.includes('form') || lowerName.includes('input') || 
              lowerName.includes('select') || lowerName.includes('checkbox') || 
              lowerName.includes('radio')) {
      return 'form';
    } else if (lowerName.includes('table') || lowerName.includes('list') || 
              lowerName.includes('tree') || lowerName.includes('grid')) {
      return 'data';
    } else if (lowerName.includes('container') || lowerName.includes('layout') || 
              lowerName.includes('row') || lowerName.includes('col')) {
      return 'layout';
    } else if (lowerName.includes('alert') || lowerName.includes('message') || 
              lowerName.includes('notification') || lowerName.includes('modal') || 
              lowerName.includes('dialog')) {
      return 'feedback';
    } else if (lowerName.includes('menu') || lowerName.includes('navigation') || 
              lowerName.includes('nav') || lowerName.includes('tabs')) {
      return 'navigation';
    } else {
      return 'other';
    }
  }

  /**
   * 根据分析结果推断标签
   * @param analysis 分析结果
   */
  private inferTags(analysis: MaterialAnalysisResult): string[] {
    const tags: string[] = [];
    const lowerName = analysis.name.toLowerCase();
    
    // 根据名称推断
    if (lowerName.includes('button')) tags.push('button');
    if (lowerName.includes('input')) tags.push('input');
    if (lowerName.includes('form')) tags.push('form');
    if (lowerName.includes('layout')) tags.push('layout');
    if (lowerName.includes('table')) tags.push('table');
    
    // 根据属性推断
    if (analysis.props) {
      if ('type' in analysis.props) tags.push('configurable');
      if ('size' in analysis.props) tags.push('sizeable');
      if ('disabled' in analysis.props) tags.push('disable-support');
    }
    
    // 根据事件推断
    if (analysis.events) {
      if (analysis.events.some(e => e.name === 'click')) tags.push('clickable');
      if (analysis.events.some(e => e.name === 'change')) tags.push('value-control');
    }
    
    // 确保有至少一个标签
    if (tags.length === 0) {
      tags.push('component');
      tags.push('vue3');
    }
    
    return tags;
  }

  /**
   * 生成物料描述
   */
  private generateDescription(analysis: MaterialAnalysisResult, sourceCode: string): string {
    const name = analysis.name;
    const category = this.inferCategory(name);
    
    let description = '';
    
    switch (category) {
      case 'basic':
        description = `${name}是一个基础UI组件，用于用户交互和页面展示。`;
        break;
      case 'form':
        description = `${name}是一个表单控件，用于收集用户输入的数据。`;
        break;
      case 'data':
        description = `${name}是一个数据展示组件，用于展示和操作结构化数据。`;
        break;
      case 'layout':
        description = `${name}是一个布局容器组件，用于组织页面结构和内容排列。`;
        break;
      case 'feedback':
        description = `${name}是一个反馈组件，用于向用户展示操作结果或提供消息通知。`;
        break;
      case 'navigation':
        description = `${name}是一个导航组件，用于页面导航和内容切换。`;
        break;
      default:
        description = `${name}是一个自定义Vue组件，提供了特定的功能和交互。`;
    }
    
    // 添加属性和事件信息
    const propsCount = Object.keys(analysis.props || {}).length;
    const eventsCount = (analysis.events || []).length;
    
    if (propsCount > 0) {
      description += ` 组件提供了${propsCount}个可配置属性，`;
    }
    
    if (eventsCount > 0) {
      description += `支持${eventsCount}种交互事件，`;
    }
    
    description += '可以根据实际需求进行灵活配置。';
    
    return description;
  }

  /**
   * 格式化属性标签
   */
  private formatPropLabel(propName: string): string {
    return propName
      .split(/([A-Z])|[-_]/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * 格式化事件标签
   */
  private formatEventLabel(eventName: string): string {
    const eventMap: Record<string, string> = {
      'click': '点击',
      'change': '值变化',
      'input': '输入',
      'focus': '获取焦点',
      'blur': '失去焦点',
      'submit': '提交'
    };
    
    return eventMap[eventName] || eventName;
  }

  /**
   * 格式化插槽标签
   */
  private formatSlotLabel(slotName: string): string {
    const slotMap: Record<string, string> = {
      'default': '默认',
      'header': '头部',
      'footer': '底部',
      'content': '内容'
    };
    
    return slotMap[slotName] || slotName;
  }

  /**
   * 格式化标题
   */
  private formatTitle(name: string): string {
    return name
      .split(/([A-Z])|[-_]/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * 生成属性描述
   */
  private generatePropDescription(propName: string, propType: string): string {
    const propDescMap: Record<string, string> = {
      'type': '组件类型，影响组件的外观和行为',
      'size': '组件大小，影响组件的尺寸',
      'disabled': '是否禁用组件',
      'loading': '是否显示加载状态',
      'title': '组件标题文本',
      'visible': '是否可见',
      'value': '组件值',
      'defaultValue': '组件默认值',
      'placeholder': '占位文本',
      'name': '组件名称',
      'label': '组件标签文本',
      'icon': '组件图标',
      'data': '组件数据源'
    };
    
    return propDescMap[propName] || `${this.formatPropLabel(propName)}属性`;
  }

  /**
   * 生成事件描述
   */
  private generateEventDescription(eventName: string): string {
    const eventDescMap: Record<string, string> = {
      'click': '点击组件时触发',
      'change': '组件值变化时触发',
      'input': '输入内容时触发',
      'focus': '组件获取焦点时触发',
      'blur': '组件失去焦点时触发',
      'submit': '提交表单时触发',
      'select': '选择选项时触发',
      'toggle': '切换状态时触发',
      'expand': '展开时触发',
      'collapse': '收起时触发'
    };
    
    return eventDescMap[eventName] || `${eventName}事件`;
  }

  /**
   * 生成插槽描述
   */
  private generateSlotDescription(slotName: string): string {
    const slotDescMap: Record<string, string> = {
      'default': '默认插槽，用于定制组件内容',
      'header': '头部插槽，用于定制头部内容',
      'footer': '底部插槽，用于定制底部内容',
      'icon': '图标插槽，用于定制图标',
      'title': '标题插槽，用于定制标题',
      'content': '内容插槽，用于定制主要内容'
    };
    
    return slotDescMap[slotName] || `${slotName}插槽`;
  }

  /**
   * 属性类型映射
   */
  private mapTypeToMaterialType(propType: string): MaterialPropertyType {
    const typeMap: Record<string, MaterialPropertyType> = {
      'String': 'string',
      'Number': 'number',
      'Boolean': 'boolean',
      'Object': 'object',
      'Array': 'array',
      'Function': 'function'
    };
    
    return typeMap[propType] || 'string';
  }
} 