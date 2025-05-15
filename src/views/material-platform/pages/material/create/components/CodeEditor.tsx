import { defineComponent, ref, watch } from 'vue';
import { ElButton, ElIcon } from 'element-plus';
import { Edit, View, Connection, Refresh } from '@element-plus/icons-vue';
import SimpleCodeEditor from '@/components/SimpleCodeEditor';

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
    const editorLoading = ref(false);
    const editorReady = ref(false);
    
    // 加载编辑器
    const loadEditor = () => {
      editorLoading.value = true;
      editorReady.value = true;
      editorLoading.value = false;
    };
    
    // 格式化代码
    const formatCode = () => {
      emit('format');
    };
    
    // 打开模板
    const openTemplate = () => {
      emit('open-template');
    };
    
    // 监听代码变化
    const handleCodeChange = (code: string) => {
      emit('update:modelValue', code);
    };
    
    // 自动加载编辑器
    if (!editorReady.value) {
      loadEditor();
    }
    
    return {
      editorLoading,
      editorReady,
      loadEditor,
      formatCode,
      openTemplate,
      handleCodeChange
    };
  },
  render() {
    return (
      <div class="code-editor-main">
        <div class="code-editor-header">
          <div class="code-editor-title">
            <ElIcon><Edit /></ElIcon> 组件代码编辑器
            {this.currentFileName && (
              <span class="editor-subtitle">
                当前文件: {this.currentFileName}
              </span>
            )}
          </div>
          
          <div class="code-editor-actions">
            <ElButton 
              type="primary" 
              onClick={this.openTemplate}
              icon={<ElIcon><View /></ElIcon>}
            >
              浏览模板
            </ElButton>
            
            <ElButton 
              onClick={this.formatCode}
              icon={<ElIcon><Connection /></ElIcon>}
            >
              格式化代码
            </ElButton>
          </div>
        </div>
        
        <div class="code-editor-wrapper">
          {this.editorLoading ? (
            <div class="editor-loading-placeholder" style={{ height: '100%', minHeight: 'calc(100vh - 380px)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fff', border: '1px solid #e4e7ed', borderRadius: '4px' }}>
              <div class="loading-content" style={{ textAlign: 'center' }}>
                <ElIcon style={{ fontSize: '24px', marginBottom: '16px', animation: 'rotating 2s linear infinite' }}><Refresh /></ElIcon>
                <div>编辑器加载中，请稍候...</div>
              </div>
            </div>
          ) : this.editorReady ? (
            <SimpleCodeEditor
              modelValue={this.modelValue}
              onUpdate:modelValue={this.handleCodeChange}
              language={this.language}
              theme="light"
              height="100%"
              placeholder="请输入代码..."
              options={{
                formatOnPaste: true,
                formatOnType: false
              }}
            />
          ) : (
            <div class="editor-loading-placeholder" style={{ height: '100%', minHeight: 'calc(100vh - 380px)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fff', border: '1px solid #e4e7ed', borderRadius: '4px' }}>
              <ElButton type="primary" onClick={this.loadEditor}>
                加载编辑器
              </ElButton>
            </div>
          )}
        </div>
      </div>
    );
  }
}); 