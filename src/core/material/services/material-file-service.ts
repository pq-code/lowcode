import type { MaterialFileOperationResult } from '../types';

/**
 * 物料文件服务
 * 负责物料文件的读写操作
 */
export class MaterialFileService {
  /**
   * 读取文件内容
   * @param file 文件对象
   * @returns 文件内容
   */
  public async readFile(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          resolve(event.target.result);
        } else {
          reject(new Error('读取文件失败'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('读取文件发生错误'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * 保存文件内容
   * @param fileName 文件名
   * @param content 文件内容
   */
  public saveFile(fileName: string, content: string): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * 编辑文件内容
   * @param content 原内容
   * @param changes 修改内容
   * @returns 操作结果
   */
  public async editFile(content: string, changes: {
    line: number;
    text: string;
  }[]): Promise<MaterialFileOperationResult> {
    try {
      const lines = content.split('\n');
      
      // 应用修改
      changes.forEach(change => {
        if (change.line >= 0 && change.line < lines.length) {
          lines[change.line] = change.text;
        }
      });
      
      const newContent = lines.join('\n');
      
      return {
        success: true,
        content: newContent
      };
    } catch (error) {
      console.error('编辑文件失败:', error);
      return {
        success: false,
        error: `编辑文件失败: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * 创建新文件
   * @param template 模板类型
   * @param name 组件名称
   * @returns 文件内容
   */
  public createNewFile(template: 'component' | 'container', name: string): string {
    if (template === 'component') {
      return this.createComponentTemplate(name);
    } else {
      return this.createContainerTemplate(name);
    }
  }

  /**
   * 创建组件模板
   * @param name 组件名称
   */
  private createComponentTemplate(name: string): string {
    // 生成PascalCase组件名
    const componentName = name.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    return `<template>
  <div class="${name}">
    <!-- 组件内容 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: '${componentName}'
});

// Props定义
const props = defineProps({
  /**
   * 组件类型
   */
  type: {
    type: String,
    default: 'default'
  },
  /**
   * 组件大小
   */
  size: {
    type: String,
    default: 'medium'
  }
});

// Emits定义
const emit = defineEmits(['change', 'click']);

// 状态
const isActive = ref(false);

// 方法
const handleClick = () => {
  isActive.value = !isActive.value;
  emit('click', isActive.value);
};
</script>

<style scoped>
.${name} {
  /* 组件样式 */
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>`;
  }

  /**
   * 创建容器组件模板
   * @param name 组件名称
   */
  private createContainerTemplate(name: string): string {
    // 生成PascalCase组件名
    const componentName = name.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    return `<template>
  <div class="${name}">
    <div class="${name}-header">
      <slot name="header">
        <h3>{{ title }}</h3>
      </slot>
    </div>
    
    <div class="${name}-content">
      <slot></slot>
    </div>
    
    <div class="${name}-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: '${componentName}'
});

// Props定义
const props = defineProps({
  /**
   * 容器标题
   */
  title: {
    type: String,
    default: '容器标题'
  },
  /**
   * 容器主题
   */
  theme: {
    type: String,
    default: 'light'
  }
});

// Emits定义
const emit = defineEmits(['expand', 'collapse']);

// 状态
const isExpanded = ref(true);

// 方法
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  emit(isExpanded.value ? 'expand' : 'collapse');
};
</script>

<style scoped>
.${name} {
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.${name}-header {
  padding: 10px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #eee;
}

.${name}-content {
  padding: 15px;
}

.${name}-footer {
  padding: 10px;
  background-color: #f7f7f7;
  border-top: 1px solid #eee;
}
</style>`;
  }
} 