import { defineComponent, ref, onMounted, watch } from 'vue';
import { ElButton } from 'element-plus';

const QuillCodeEditor = defineComponent({
  name: 'QuillCodeEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'javascript'
    },
    height: {
      type: String,
      default: '300px'
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const editorRef = ref(null);
    const codeValue = ref(props.modelValue);
    
    // 监听输入值变化
    watch(() => props.modelValue, (newVal) => {
      if (newVal !== codeValue.value) {
        codeValue.value = newVal;
      }
    });
    
    // 处理编辑器内容变化
    const handleChange = (value) => {
      codeValue.value = value;
      emit('update:modelValue', value);
      emit('change', value);
    };
    
    // 模拟编辑器，实际项目中可以使用真实的代码编辑器组件
    // 比如monaco-editor或codemirror等
    const handleInput = (e) => {
      handleChange(e.target.value);
    };

    return () => (
      <div class="quill-code-editor" style={{ height: props.height }}>
        <textarea
          ref={editorRef}
          value={codeValue.value}
          onInput={handleInput}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #dcdfe6',
            borderRadius: '4px',
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            resize: 'none'
          }}
          readOnly={props.readOnly}
        ></textarea>
        <div class="editor-footer" style={{ marginTop: '10px', textAlign: 'right' }}>
          <ElButton type="primary" size="small" onClick={() => emit('change', codeValue.value)}>
            应用
          </ElButton>
        </div>
      </div>
    );
  }
});

export default QuillCodeEditor;
