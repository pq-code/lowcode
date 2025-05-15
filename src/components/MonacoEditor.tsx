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
      default: '300px'
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
  emits: ['update:modelValue', 'change', 'editorMounted', 'editorWillMount'],
  setup(props, { emit }) {
    const containerRef = ref<HTMLElement | null>(null);
    const editorRef = ref<monaco.editor.IStandaloneCodeEditor | null>(null);
    const valueRef = ref(props.modelValue || '');
    let preventTriggerChangeEvent = false;
    
    // 初始化编辑器
    const initEditor = () => {
      if (!containerRef.value) return;
      
      // 配置编辑器选项
      const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        value: valueRef.value,
        language: props.language,
        theme: props.theme,
        readOnly: props.readOnly,
        automaticLayout: true,
        minimap: { enabled: false }, // 默认禁用小地图以提高性能
        scrollBeyondLastLine: false, // 默认禁用滚动过最后一行以提高性能
        wordWrap: 'on', // 默认启用自动换行
        // 使用有限的代码智能提示以提高性能
        quickSuggestions: false,
        suggestOnTriggerCharacters: false
      };
      
      // 调用 editorWillMount 事件
      emit('editorWillMount', monaco);
      
      try {
        // 清除已有编辑器
        if (editorRef.value) {
          editorRef.value.dispose();
        }
        
        // 创建新编辑器
        const editor = monaco.editor.create(
          containerRef.value,
          {
            ...defaultOptions,
            ...props.options
          }
        );
        
        editorRef.value = editor;
        
        // 内容变更事件
        editor.onDidChangeModelContent((event) => {
          if (preventTriggerChangeEvent) {
            preventTriggerChangeEvent = false;
            return;
          }
          
          const value = editor.getValue();
          valueRef.value = value;
          emit('update:modelValue', value);
          emit('change', value, event);
        });
        
        // 调用 editorMounted 事件
        emit('editorMounted', editor, monaco);
        
        // 自动调整高度
        if (props.autoHeight) {
          const updateEditorHeight = () => {
            const contentHeight = Math.min(
              1000, // 设置最大高度限制
              editor.getContentHeight()
            );
            containerRef.value!.style.height = `${contentHeight}px`;
            editor.layout();
          };
          
          editor.onDidContentSizeChange(updateEditorHeight);
          updateEditorHeight();
        }
      } catch (error) {
        console.error('初始化编辑器失败:', error);
      }
    };
    
    // 销毁编辑器
    const disposeEditor = () => {
      if (editorRef.value) {
        editorRef.value.dispose();
        editorRef.value = null;
      }
    };
    
    // 监听 modelValue 变化
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== valueRef.value) {
          valueRef.value = newValue || '';
          
          if (editorRef.value) {
            preventTriggerChangeEvent = true;
            
            // 使用 setValue 而不是替换整个模型
            const model = editorRef.value.getModel();
            if (model) {
              // 仅当内容实际变化时才更新
              const currentValue = editorRef.value.getValue();
              if (currentValue !== newValue) {
                editorRef.value.setValue(newValue || '');
              }
            }
          }
        }
      }
    );
    
    // 监听 language 变化
    watch(
      () => props.language,
      (newLanguage) => {
        if (editorRef.value) {
          const model = editorRef.value.getModel();
          if (model) {
            monaco.editor.setModelLanguage(model, newLanguage!);
          }
        }
      }
    );
    
    // 监听 theme 变化
    watch(
      () => props.theme,
      (newTheme) => {
        if (editorRef.value) {
          monaco.editor.setTheme(newTheme!);
        }
      }
    );
    
    // 监听 readOnly 变化
    watch(
      () => props.readOnly,
      (newReadOnly) => {
        if (editorRef.value) {
          editorRef.value.updateOptions({ readOnly: newReadOnly });
        }
      }
    );
    
    // 监听 options 变化
    watch(
      () => props.options,
      (newOptions) => {
        if (editorRef.value) {
          editorRef.value.updateOptions(newOptions!);
        }
      },
      { deep: true }
    );
    
    // 监听 height 和 width 变化
    watch(
      [() => props.height, () => props.width],
      () => {
        if (containerRef.value) {
          containerRef.value.style.height = props.height!;
          containerRef.value.style.width = props.width!;
          
          nextTick(() => {
            if (editorRef.value) {
              editorRef.value.layout();
            }
          });
        }
      }
    );
    
    // 组件挂载时初始化编辑器
    onMounted(() => {
      if (containerRef.value) {
        containerRef.value.style.height = props.height!;
        containerRef.value.style.width = props.width!;
        
        // 延迟初始化以避免卡顿
        setTimeout(() => {
          initEditor();
        }, 0);
      }
    });
    
    // 组件卸载前销毁编辑器
    onBeforeUnmount(() => {
      disposeEditor();
    });
    
    return {
      containerRef
    };
  },
  render() {
    return (
      <div ref="containerRef" class="monaco-editor-container" style={{ height: this.height, width: this.width }}></div>
    );
  }
});

export default MonacoEditor; 