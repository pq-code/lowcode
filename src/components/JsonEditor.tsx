import { defineComponent, ref, watch } from 'vue';
import MonacoEditor from './MonacoEditor';
import { ElMessage } from 'element-plus';

export interface JsonEditorProps {
  modelValue?: any;
  height?: string;
  width?: string;
  readOnly?: boolean;
}

const JsonEditor = defineComponent({
  name: 'JsonEditor',
  props: {
    modelValue: {
      type: [Object, Array, String],
      default: () => ({})
    },
    height: {
      type: String,
      default: '400px'
    },
    width: {
      type: String,
      default: '100%'
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change', 'error'],
  setup(props, { emit }) {
    // 将JSON对象转换为格式化的字符串
    const jsonToString = (json: any): string => {
      try {
        return JSON.stringify(json, null, 2);
      } catch (e) {
        console.error('JSON序列化失败:', e);
        return '';
      }
    };

    // 将字符串转换为JSON对象
    const stringToJson = (str: string): any => {
      try {
        return JSON.parse(str);
      } catch (e) {
        console.error('JSON解析失败:', e);
        emit('error', e);
        return null;
      }
    };

    // 编辑器内容
    const editorContent = ref(jsonToString(props.modelValue));

    // 监听modelValue变化
    watch(() => props.modelValue, (newValue) => {
      // 避免循环更新
      const newJsonStr = jsonToString(newValue);
      if (newJsonStr !== editorContent.value) {
        editorContent.value = newJsonStr;
      }
    });

    // 编辑器内容变化处理
    const handleChange = (value: string) => {
      try {
        const json = stringToJson(value);
        if (json !== null) {
          emit('update:modelValue', json);
          emit('change', json);
        }
      } catch (e) {
        // 仅在失去焦点或提交时验证JSON
      }
    };

    // 格式化JSON
    const formatJson = () => {
      try {
        const json = stringToJson(editorContent.value);
        if (json) {
          editorContent.value = jsonToString(json);
          ElMessage.success('JSON格式化成功');
        }
      } catch (e) {
        ElMessage.error('JSON格式化失败，请检查JSON语法');
      }
    };

    // 验证JSON
    const validateJson = (): boolean => {
      try {
        stringToJson(editorContent.value);
        return true;
      } catch (e) {
        ElMessage.error('JSON格式无效，请检查语法');
        return false;
      }
    };

    return {
      editorContent,
      handleChange,
      formatJson,
      validateJson
    };
  },
  render() {
    return (
      <div class="json-editor-container">
        <MonacoEditor
          modelValue={this.editorContent}
          onUpdate:modelValue={(v: string) => this.editorContent = v}
          onChange={this.handleChange}
          language="json"
          theme="vs"
          height={this.height}
          width={this.width}
          readOnly={this.readOnly}
          options={{
            formatOnPaste: true,
            formatOnType: true
          }}
        />
      </div>
    );
  }
});

export default JsonEditor; 