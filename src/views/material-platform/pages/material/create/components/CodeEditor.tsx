import { defineComponent, ref, onMounted, watch } from 'vue';
import type { PropType } from 'vue';
import { ElButton, ElIcon, ElTooltip } from 'element-plus';
import { 
  Tools as Format, 
  FullScreen, 
  Document, 
  Setting,
  Reading
} from '@element-plus/icons-vue';

export default defineComponent({
  name: 'CodeEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'vue'
    },
    currentFileName: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'format', 'open-template'],
  setup(props, { emit }) {
    const editorContainer = ref<HTMLElement | null>(null);
    const isFullscreen = ref(false);
    const editor = ref<any>(null);
    const isEditorInitialized = ref(false);
    
    // 使用简单的代码编辑器 (不使用monaco-editor以减少性能开销)
    const initializeEditor = async () => {
      if (!editorContainer.value) return;
      
      try {
        // 创建简单代码编辑器元素
        const textarea = document.createElement('textarea');
        textarea.value = props.modelValue;
        textarea.className = 'simple-code-editor';
        textarea.spellcheck = false;
        
        // 添加行号支持
        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        
        // 简单的容器，包含行号和文本区域
        const editorWrapper = document.createElement('div');
        editorWrapper.className = 'editor-wrapper';
        editorWrapper.appendChild(lineNumbers);
        editorWrapper.appendChild(textarea);
        
        // 清空容器并添加编辑器
        editorContainer.value.innerHTML = '';
        editorContainer.value.appendChild(editorWrapper);
        
        // 设置编辑器引用
        editor.value = textarea;
        
        // 更新行号
        updateLineNumbers();
        
        // 添加事件监听器
        textarea.addEventListener('input', (e) => {
          const value = (e.target as HTMLTextAreaElement).value;
          emit('update:modelValue', value);
          updateLineNumbers();
        });
        
        textarea.addEventListener('scroll', () => {
          lineNumbers.scrollTop = textarea.scrollTop;
        });
        
        // 设置Tab键行为
        textarea.addEventListener('keydown', handleTabKey);
        
        isEditorInitialized.value = true;
      } catch (error) {
        console.error('初始化编辑器失败:', error);
      }
    };
    
    // 更新行号
    const updateLineNumbers = () => {
      if (!editor.value) return;
      
      const textarea = editor.value;
      const lineNumbers = textarea.previousElementSibling;
      if (!lineNumbers) return;
      
      const lines = textarea.value.split('\n');
      const lineCount = lines.length;
      
      let lineNumbersHTML = '';
      for (let i = 1; i <= lineCount; i++) {
        lineNumbersHTML += `<div class="line-number">${i}</div>`;
      }
      
      lineNumbers.innerHTML = lineNumbersHTML;
    };
    
    // 处理Tab键
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = e.target as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        // 在光标位置插入两个空格
        const newValue = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
        textarea.value = newValue;
        
        // 更新光标位置
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        
        // 触发更新
        emit('update:modelValue', newValue);
        updateLineNumbers();
      }
    };
    
    // 格式化代码
    const formatCode = () => {
      emit('format');
    };
    
    // 全屏切换
    const toggleFullscreen = () => {
      isFullscreen.value = !isFullscreen.value;
      if (isFullscreen.value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };
    
    // 打开模板抽屉
    const openTemplateDrawer = () => {
      emit('open-template');
    };
    
    // 监听modelValue变化
    watch(() => props.modelValue, (newValue) => {
      if (editor.value && editor.value.value !== newValue) {
        editor.value.value = newValue;
        updateLineNumbers();
      }
    });
    
    // 监听currentFileName变化
    watch(() => props.currentFileName, () => {
      if (editor.value) {
        updateLineNumbers();
      }
    });
    
    // 组件挂载时初始化编辑器
    onMounted(() => {
      initializeEditor();
    });
    
    return {
      editorContainer,
      isFullscreen,
      formatCode,
      toggleFullscreen,
      openTemplateDrawer
    };
  },
  render() {
    return (
      <div class={['code-editor-main', { 'fullscreen': this.isFullscreen }]}>
        <div class="code-editor-header">
          <div class="code-editor-title">
            <ElIcon><Document /></ElIcon>
            {this.currentFileName ? (
              <span class="editor-filename">{this.currentFileName}</span>
            ) : (
              <span class="editor-subtitle">代码编辑器</span>
            )}
          </div>
          
          <div class="code-editor-actions">
            <ElTooltip content="使用模板" placement="top">
              <ElButton 
                type="primary" 
                icon={<ElIcon><Reading /></ElIcon>}
                size="small"
                onClick={this.openTemplateDrawer}
              >
                模板
              </ElButton>
            </ElTooltip>
            
            <ElTooltip content="格式化代码" placement="top">
              <ElButton 
                icon={<ElIcon><Format /></ElIcon>}
                size="small"
                onClick={this.formatCode}
              >
                格式化
              </ElButton>
            </ElTooltip>
            
            <ElTooltip content={this.isFullscreen ? '退出全屏' : '全屏编辑'} placement="top">
              <ElButton 
                icon={<ElIcon><FullScreen /></ElIcon>}
                size="small"
                onClick={this.toggleFullscreen}
              >
                {this.isFullscreen ? '退出全屏' : '全屏'}
              </ElButton>
            </ElTooltip>
          </div>
        </div>
        
        <div
          ref="editorContainer"
          class="code-editor-wrapper"
        />
      </div>
    );
  }
}); 