import { MaterialRegistry } from './material-registry';
import { MaterialFileService } from './material-file-service';
import { MaterialAIService } from './material-ai-service';
import { ComponentUtils } from '../utils/component-utils';
import type {
  MaterialComponent,
  MaterialUploadResponse,
  MaterialAnalysisResult,
  MaterialAIGenerateResult,
  MaterialPreviewOptions
} from '../types';

/**
 * 物料服务
 * 提供物料的管理和操作功能
 */
export class MaterialService {
  private static instance: MaterialService;
  private registry: MaterialRegistry;
  private fileService: MaterialFileService;
  private aiService: MaterialAIService;

  private constructor() {
    this.registry = MaterialRegistry.getInstance();
    this.fileService = new MaterialFileService();
    this.aiService = new MaterialAIService();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): MaterialService {
    if (!MaterialService.instance) {
      MaterialService.instance = new MaterialService();
    }
    return MaterialService.instance;
  }

  /**
   * 注册物料组件
   * @param component 物料组件
   */
  public registerMaterial(component: MaterialComponent): void {
    this.registry.registerComponent(component);
  }

  /**
   * 获取所有物料
   * @returns 所有物料组件
   */
  public getAllMaterials(): MaterialComponent[] {
    return this.registry.getAllComponents();
  }

  /**
   * 根据ID获取物料
   * @param componentId 组件ID
   * @returns 物料组件
   */
  public getMaterialById(componentId: string): MaterialComponent | undefined {
    return this.registry.getComponent(componentId);
  }

  /**
   * 根据类型获取物料
   * @param type 组件类型
   * @returns 物料组件
   */
  public getMaterialByType(type: string): MaterialComponent | undefined {
    return this.registry.getComponentByType(type);
  }

  /**
   * 根据分类获取物料
   * @param category 分类
   * @returns 物料组件列表
   */
  public getMaterialsByCategory(category: string): MaterialComponent[] {
    return this.registry.getComponentsByCategory(category);
  }

  /**
   * 上传组件
   * @param file 组件文件
   * @returns 上传响应
   */
  public async uploadMaterial(file: File): Promise<MaterialUploadResponse> {
    try {
      // 上传文件
      const content = await this.fileService.readFile(file);
      if (!content) {
        return { 
          success: false, 
          error: '读取文件失败' 
        };
      }

      // 分析组件
      const analysisResult = await this.analyzeMaterial(content);
      
      // 生成组件ID
      const componentId = `material_${Date.now()}`;
      
      // 创建物料组件
      const material: MaterialComponent = {
        componentId,
        name: analysisResult.name || file.name.split('.')[0],
        type: analysisResult.type || file.name.split('.')[0].toLowerCase(),
        category: 'custom',
        title: analysisResult.name || file.name.split('.')[0],
        description: analysisResult.description || '',
        properties: [],
        version: '1.0.0',
        sourceCode: content
      };

      // 添加属性
      if (analysisResult.props) {
        Object.keys(analysisResult.props).forEach(propName => {
          const propInfo = analysisResult.props![propName];
          material.properties.push({
            name: propName,
            label: propName,
            type: this.mapPropTypeToMaterialType(propInfo.type),
            defaultValue: propInfo.default,
            required: propInfo.required || false,
            description: propInfo.description || ''
          });
        });
      }

      // 添加事件
      if (analysisResult.events && analysisResult.events.length > 0) {
        material.events = analysisResult.events.map(event => ({
          name: event.name,
          label: event.name,
          description: event.description || ''
        }));
      }

      // 添加插槽
      if (analysisResult.slots && analysisResult.slots.length > 0) {
        material.slots = analysisResult.slots.map(slot => ({
          name: slot.name,
          label: slot.name,
          description: slot.description || '',
          isDefault: slot.name === 'default'
        }));
      }

      // 保存物料
      this.registerMaterial(material);

      return {
        success: true,
        componentId
      };
    } catch (error) {
      console.error('上传物料失败:', error);
      return {
        success: false,
        error: `上传失败: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * 分析物料
   * @param sourceCode 组件源码
   * @returns 分析结果
   */
  public async analyzeMaterial(sourceCode: string): Promise<MaterialAnalysisResult> {
    // 使用组件工具分析组件
    const parsedComponent = ComponentUtils.parseVueComponent(sourceCode);
    
    return {
      type: parsedComponent.name.toLowerCase(),
      name: parsedComponent.name,
      props: parsedComponent.props,
      events: parsedComponent.events,
      slots: parsedComponent.slots
    };
  }

  /**
   * 使用AI分析物料
   * @param sourceCode 组件源码
   * @returns AI分析结果
   */
  public async analyzeWithAI(sourceCode: string): Promise<MaterialAIGenerateResult> {
    try {
      // 基础分析
      const basicAnalysis = await this.analyzeMaterial(sourceCode);
      
      // 使用AI服务增强分析结果
      const enhancedResult = await this.aiService.enhanceAnalysis(basicAnalysis, sourceCode);
      
      return {
        success: true,
        component: enhancedResult
      };
    } catch (error) {
      console.error('AI分析失败:', error);
      return {
        success: false,
        error: `AI分析失败: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * 更新物料
   * @param componentId 组件ID
   * @param updates 更新内容
   * @returns 是否成功
   */
  public updateMaterial(componentId: string, updates: Partial<MaterialComponent>): boolean {
    const material = this.getMaterialById(componentId);
    if (!material) {
      return false;
    }

    // 更新物料
    const updatedMaterial: MaterialComponent = {
      ...material,
      ...updates,
      updateTime: new Date().toISOString()
    };

    // 重新注册更新后的物料
    this.registry.removeComponent(componentId);
    this.registry.registerComponent(updatedMaterial);

    return true;
  }

  /**
   * 删除物料
   * @param componentId 组件ID
   * @returns 是否成功
   */
  public removeMaterial(componentId: string): boolean {
    const exists = this.getMaterialById(componentId);
    if (!exists) {
      return false;
    }

    this.registry.removeComponent(componentId);
    return true;
  }

  /**
   * 编辑物料源码
   * @param componentId 组件ID
   * @param sourceCode 新的源码
   * @returns 是否成功
   */
  public async editSourceCode(componentId: string, sourceCode: string): Promise<boolean> {
    const material = this.getMaterialById(componentId);
    if (!material) {
      return false;
    }

    try {
      // 重新分析组件
      const analysisResult = await this.analyzeMaterial(sourceCode);
      
      // 更新物料
      const updates: Partial<MaterialComponent> = {
        sourceCode,
        properties: [],
        updateTime: new Date().toISOString()
      };

      // 更新属性
      if (analysisResult.props) {
        Object.keys(analysisResult.props).forEach(propName => {
          const propInfo = analysisResult.props![propName];
          updates.properties!.push({
            name: propName,
            label: propName,
            type: this.mapPropTypeToMaterialType(propInfo.type),
            defaultValue: propInfo.default,
            required: propInfo.required || false,
            description: propInfo.description || ''
          });
        });
      }

      // 更新事件
      if (analysisResult.events && analysisResult.events.length > 0) {
        updates.events = analysisResult.events.map(event => ({
          name: event.name,
          label: event.name,
          description: event.description || ''
        }));
      }

      // 更新插槽
      if (analysisResult.slots && analysisResult.slots.length > 0) {
        updates.slots = analysisResult.slots.map(slot => ({
          name: slot.name,
          label: slot.name,
          description: slot.description || '',
          isDefault: slot.name === 'default'
        }));
      }

      return this.updateMaterial(componentId, updates);
    } catch (error) {
      console.error('编辑源码失败:', error);
      return false;
    }
  }

  /**
   * 生成物料预览代码
   * @param options 预览选项
   * @returns 预览HTML
   */
  public generatePreviewCode(options: MaterialPreviewOptions): string {
    const { componentId, props = {}, style = {}, darkMode = false } = options;
    
    const material = this.getMaterialById(componentId);
    if (!material) {
      return '<div>物料不存在</div>';
    }

    // 生成属性字符串
    const propsString = Object.entries(props)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        } else if (typeof value === 'boolean') {
          return value ? key : '';
        } else {
          return `:${key}="${JSON.stringify(value)}"`;
        }
      })
      .filter(Boolean)
      .join(' ');

    // 生成样式字符串
    const styleString = Object.entries(style)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');

    // 生成预览HTML
    return `
<!DOCTYPE html>
<html lang="en" class="${darkMode ? 'dark' : ''}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${material.name} 预览</title>
  <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/element-plus"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      padding: 0;
      background-color: ${darkMode ? '#1a1a1a' : '#f5f7fa'};
      color: ${darkMode ? '#ffffff' : '#333333'};
    }
    .preview-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
      border: 1px dashed #ccc;
      border-radius: 4px;
      padding: 20px;
      background-color: ${darkMode ? '#2a2a2a' : '#ffffff'};
    }
    
    /* 暗黑模式 */
    .dark {
      color-scheme: dark;
    }
  </style>
</head>
<body>
  <div id="app">
    <div class="preview-container">
      <component-preview ${propsString} style="${styleString}"></component-preview>
    </div>
  </div>

  <script>
    ${material.sourceCode || ''}
    
    const app = Vue.createApp({
      components: {
        'component-preview': ${material.name}
      }
    });
    
    app.use(ElementPlus);
    app.mount('#app');
  </script>
</body>
</html>
    `;
  }

  /**
   * 映射Props类型到物料属性类型
   * @param propType Props类型
   * @returns 物料属性类型
   */
  private mapPropTypeToMaterialType(propType: string): any {
    const typeMap: Record<string, any> = {
      String: 'string',
      Number: 'number',
      Boolean: 'boolean',
      Object: 'object',
      Array: 'array',
      Function: 'function',
      Symbol: 'string',
      Date: 'object'
    };

    return typeMap[propType] || 'string';
  }
} 