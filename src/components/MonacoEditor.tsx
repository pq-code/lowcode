import { defineComponent, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as monaco from 'monaco-editor';

export interface MonacoEditorProps {
  modelValue?: string;
  language?: string;
  theme?: string;
  readOnly?: boolean;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  height?: string;
  width?: string;
  autoHeight?: boolean;
}

const MonacoEditor = defineComponent({
  name: 'MonacoEditor',
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
      default: 'vs'
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    },
    autoHeight: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change', 'editor-mounted'],
  setup(props, { emit }) {
    const editorContainer = ref<HTMLElement | null>(null);
    const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null);
    const isEditorReady = ref(false);
    const internalValue = ref(props.modelValue || '');
    const isContentChanged = ref(false);
    const debounceTimer = ref<number | null>(null);

    // 检测文件类型并设置正确的语言
    const detectLanguage = (content: string): string => {
      if (!content || content.length === 0) {
        return props.language;
      }
      
      // 限制检查的内容长度，避免处理过大的文件导致性能问题
      const sampleContent = content.slice(0, 1000);
      
      if (sampleContent.includes('<template>') && sampleContent.includes('<script')) {
        return 'vue';
      } else if (sampleContent.includes('import') && sampleContent.includes('from') && (sampleContent.includes('React') || sampleContent.includes('jsx'))) {
        return 'typescript';
      } else if (sampleContent.includes('class') && sampleContent.includes('extends') && sampleContent.includes('React')) {
        return 'typescript';
      } else if (sampleContent.includes('<html') || sampleContent.includes('<!DOCTYPE')) {
        return 'html';
      } else if (sampleContent.includes('@import') || sampleContent.includes('{') && sampleContent.includes('}') && sampleContent.includes(':')) {
        return 'css';
      }
      return props.language;
    };

    // 创建编辑器实例
    const createEditor = () => {
      if (!editorContainer.value) return;

      // 注册Vue语言支持
      monaco.languages.register({ id: 'vue' });
      
      // 配置编辑器选项
      const options: monaco.editor.IStandaloneEditorConstructionOptions = {
        value: internalValue.value,
        language: detectLanguage(internalValue.value),
        theme: props.theme,
        readOnly: props.readOnly,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
          alwaysConsumeMouseWheel: false
        },
        lineNumbersMinChars: 3,
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'on',
        // 优化性能的选项
        folding: false,
        glyphMargin: false,
        contextmenu: false,
        // 合并用户提供的选项
        ...props.options
      };

      editor.value = monaco.editor.create(editorContainer.value, options);

      // 使用防抖处理内容变化，避免频繁更新
      const debouncedUpdate = (value: string) => {
        if (debounceTimer.value !== null) {
          clearTimeout(debounceTimer.value);
        }
        
        debounceTimer.value = window.setTimeout(() => {
          internalValue.value = value;
          emit('update:modelValue', value);
          emit('change', value);
          isContentChanged.value = false;
          debounceTimer.value = null;
        }, 300);
      };

      // 监听内容变化
      editor.value.onDidChangeModelContent(() => {
        if (editor.value) {
          const value = editor.value.getValue();
          isContentChanged.value = true;
          debouncedUpdate(value);
        }
      });

      // 调整高度
      if (props.autoHeight) {
        updateEditorHeight();
      }

      isEditorReady.value = true;
      emit('editor-mounted', editor.value);
    };

    // 更新编辑器高度
    const updateEditorHeight = () => {
      if (!editor.value || !props.autoHeight) return;
      
      const lineHeight = editor.value.getOption(monaco.editor.EditorOption.lineHeight);
      const lineCount = editor.value.getModel()?.getLineCount() || 1;
      
      // 限制最大高度和最大行数
      const maxLines = 30;
      const actualLineCount = Math.min(lineCount, maxLines);
      const height = Math.min(800, lineHeight * actualLineCount + 30); // 最大高度800px
      
      editor.value.layout({ width: editor.value.getLayoutInfo().width, height });
      if (editorContainer.value) {
        editorContainer.value.style.height = `${height}px`;
      }
    };

    // 监听值变化
    watch(() => props.modelValue, (newValue) => {
      // 只有当内部值与外部值不同且不是由内部编辑引起的变化时才更新
      if (newValue !== internalValue.value && !isContentChanged.value && editor.value) {
        internalValue.value = newValue || '';
        editor.value.setValue(internalValue.value);
        
        if (props.autoHeight) {
          nextTick(() => {
            updateEditorHeight();
          });
        }
      }
    });

    // 监听语言变化
    watch(() => props.language, (newLanguage) => {
      if (editor.value && monaco.editor.getModels()[0]) {
        monaco.editor.setModelLanguage(monaco.editor.getModels()[0], newLanguage);
      }
    });

    // 监听只读状态变化
    watch(() => props.readOnly, (newValue) => {
      if (editor.value) {
        editor.value.updateOptions({ readOnly: newValue });
      }
    });

    // 监听主题变化
    watch(() => props.theme, (newTheme) => {
      if (editor.value) {
        monaco.editor.setTheme(newTheme);
      }
    });

    // 组件挂载时创建编辑器
    onMounted(() => {
      // 延迟创建编辑器，避免阻塞UI渲染
      nextTick(() => {
        createEditor();
      });
    });

    // 组件卸载前销毁编辑器
    onBeforeUnmount(() => {
      // 清除防抖定时器
      if (debounceTimer.value !== null) {
        clearTimeout(debounceTimer.value);
      }
      
      if (editor.value) {
        editor.value.dispose();
      }
    });

    // 格式化代码
    const formatCode = () => {
      if (editor.value) {
        editor.value.getAction('editor.action.formatDocument')?.run();
      }
    };

    return {
      editorContainer,
      editor,
      isEditorReady,
      formatCode
    };
  },
  render() {
    return (
      <div 
        class="monaco-editor-container" 
        style={{ 
          width: this.width, 
          height: this.autoHeight ? 'auto' : this.height,
          minHeight: '200px'
        }}
      >
        <div 
          ref="editorContainer" 
          class="monaco-editor-instance"
          style={{ width: '100%', height: '100%' }}
        ></div>
      </div>
    );
  }
});

export default MonacoEditor; 