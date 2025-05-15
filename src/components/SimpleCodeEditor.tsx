import { defineComponent, ref, watch, computed, onMounted } from 'vue';
import { ElButton, ElTooltip } from 'element-plus';
import { Document, Expand, RefreshRight } from '@element-plus/icons-vue';

export interface SimpleCodeEditorProps {
  modelValue?: string;
  language?: string;
  theme?: string;
  readOnly?: boolean;
  height?: string;
  width?: string;
  placeholder?: string;
  options?: Record<string, any>;
}

const SimpleCodeEditor = defineComponent({
  name: 'SimpleCodeEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'javascript'
    },
    theme: {
      type: String,
      default: 'light'
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '300px'
    },
    width: {
      type: String,
      default: '100%'
    },
    placeholder: {
      type: String,
      default: '请输入代码...'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'change', 'editorMounted'],
  setup(props, { emit }) {
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    const editorValue = ref(props.modelValue || '');
    const lineNumbers = ref<string[]>([]);
    const lineCount = ref(1);
    const isFullscreen = ref(false);
    
    // 计算编辑器样式
    const editorStyle = computed(() => {
      return {
        height: isFullscreen.value ? '100vh' : props.height,
        width: isFullscreen.value ? '100vw' : props.width,
      };
    });
    
    // 计算主题样式
    const themeClass = computed(() => {
      return `editor-theme-${props.theme}`;
    });
    
    // 更新行号
    const updateLineNumbers = () => {
      const count = (editorValue.value.match(/\n/g) || []).length + 1;
      lineCount.value = count;
      lineNumbers.value = Array.from({ length: count }, (_, i) => String(i + 1));
    };
    
    // 格式化代码（简单实现，实际项目中可以使用prettier等库）
    const formatCode = () => {
      try {
        // 如果是JSON，使用JSON格式化
        if (props.language === 'json') {
          const json = JSON.parse(editorValue.value);
          editorValue.value = JSON.stringify(json, null, 2);
          emit('update:modelValue', editorValue.value);
          emit('change', editorValue.value);
        } else {
          // 其他语言暂时不支持格式化
          return;
        }
      } catch (error) {
        console.error('格式化代码失败:', error);
      }
    };
    
    // 切换全屏模式
    const toggleFullscreen = () => {
      isFullscreen.value = !isFullscreen.value;
      if (textareaRef.value) {
        setTimeout(() => {
          textareaRef.value?.focus();
        }, 100);
      }
    };
    
    // 处理内容变更
    const handleChange = (event: Event) => {
      const target = event.target as HTMLTextAreaElement;
      editorValue.value = target.value;
      updateLineNumbers();
      emit('update:modelValue', editorValue.value);
      emit('change', editorValue.value);
    };
    
    // Tab键处理，在光标位置插入空格而不是切换焦点
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        
        const textarea = event.target as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        // 插入两个空格作为缩进
        const newValue = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
        textarea.value = newValue;
        
        // 更新光标位置
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        
        // 触发变更事件
        handleChange(event);
      }
    };
    
    // 监听模型值变化
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== editorValue.value) {
        editorValue.value = newValue || '';
        updateLineNumbers();
      }
    });
    
    // 组件挂载时初始化
    onMounted(() => {
      updateLineNumbers();
      emit('editorMounted', textareaRef.value);
    });
    
    return {
      textareaRef,
      editorValue,
      lineNumbers,
      lineCount,
      isFullscreen,
      editorStyle,
      themeClass,
      handleChange,
      handleKeyDown,
      formatCode,
      toggleFullscreen
    };
  },
  render() {
    return (
      <div 
        class={[
          'simple-code-editor',
          this.themeClass,
          { 'fullscreen': this.isFullscreen }
        ]}
        style={this.editorStyle}
      >
        <div class="editor-toolbar">
          <div class="editor-info">
            <span class="language-badge">{this.language}</span>
            <span class="line-count">{this.lineCount} 行</span>
          </div>
          <div class="editor-actions">
            <ElTooltip content="格式化代码" placement="top">
              <ElButton 
                type="text" 
                icon={RefreshRight} 
                onClick={this.formatCode}
                disabled={this.readOnly}
              />
            </ElTooltip>
            <ElTooltip content={this.isFullscreen ? '退出全屏' : '全屏编辑'} placement="top">
              <ElButton 
                type="text" 
                icon={Expand} 
                onClick={this.toggleFullscreen}
              />
            </ElTooltip>
          </div>
        </div>
        
        <div class="editor-content">
          <div class="line-numbers">
            {this.lineNumbers.map(num => (
              <div key={num} class="line-number">{num}</div>
            ))}
          </div>
          <textarea
            ref="textareaRef"
            class="code-textarea"
            value={this.editorValue}
            onChange={this.handleChange}
            onKeydown={this.handleKeyDown}
            placeholder={this.placeholder}
            disabled={this.readOnly}
            spellcheck="false"
            wrap="off"
          ></textarea>
        </div>
      </div>
    );
  }
});

export default SimpleCodeEditor; 