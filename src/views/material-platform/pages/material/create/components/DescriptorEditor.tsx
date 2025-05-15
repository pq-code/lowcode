import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElTable, ElTableColumn, ElTag, ElButton, ElEmpty } from 'element-plus';
import JsonEditor from '@/components/JsonEditor';
import type { Material, MaterialGroup } from '../../../../types';

export default defineComponent({
  name: 'DescriptorEditor',
  props: {
    materialForm: {
      type: Object as PropType<Partial<Material>>,
      required: true
    },
    descriptorJson: {
      type: String,
      default: '{}'
    },
    descriptorTabActive: {
      type: String,
      default: 'form'
    },
    groups: {
      type: Array as PropType<MaterialGroup[]>,
      default: () => []
    },
    newTag: {
      type: String,
      default: ''
    }
  },
  emits: [
    'update:materialForm', 
    'update:descriptorJson', 
    'update:descriptorTabActive',
    'update:newTag',
    'add-tag',
    'remove-tag'
  ],
  setup(props, { emit }) {
    const updateDescriptorTabActive = (value: string) => {
      emit('update:descriptorTabActive', value);
    };
    
    const updateNewTag = (value: string) => {
      emit('update:newTag', value);
    };
    
    const updateDescriptorJson = (value: any) => {
      emit('update:descriptorJson', JSON.stringify(value, null, 2));
    };
    
    const addTag = () => {
      if (!props.newTag) return;
      emit('add-tag');
    };
    
    const removeTag = (tag: string) => {
      emit('remove-tag', tag);
    };
    
    const handleTagKeydown = (evt: Event | KeyboardEvent) => {
      if ((evt as KeyboardEvent).key === 'Enter') {
        evt.preventDefault();
        addTag();
      }
    };
    
    const parsedJson = computed(() => {
      try {
        return JSON.parse(props.descriptorJson);
      } catch (error) {
        return {};
      }
    });
    
    const updateMaterialForm = (field: string, value: any) => {
      emit('update:materialForm', { ...props.materialForm, [field]: value });
    };
    
    return {
      updateDescriptorTabActive,
      updateNewTag,
      updateDescriptorJson,
      addTag,
      removeTag,
      handleTagKeydown,
      parsedJson,
      updateMaterialForm
    };
  },
  render() {
    return (
      <div class="descriptor-container">
        <div class="descriptor-tabs">
          <div 
            class={[
              'descriptor-tab', 
              { active: this.descriptorTabActive === 'form' }
            ]}
            onClick={() => this.updateDescriptorTabActive('form')}
          >
            属性预览
          </div>
          <div 
            class={[
              'descriptor-tab', 
              { active: this.descriptorTabActive === 'json' }
            ]}
            onClick={() => this.updateDescriptorTabActive('json')}
          >
            JSON编辑器
          </div>
        </div>
        
        <div class="descriptor-content">
          {this.descriptorTabActive === 'form' ? (
            <div class="form-editor-wrapper">
              <div class="ai-analysis-container">
                <h3 class="analysis-title">AI 分析结果</h3>
                <div class="analysis-content">
                  <p>组件名称: <strong>{this.materialForm.name}</strong></p>
                  <p>组件类型: <strong>{this.materialForm.type}</strong></p>
                  <p>组件描述: <strong>{this.materialForm.description}</strong></p>
                  
                  <h4>识别到的标签:</h4>
                  <div class="tags-container">
                    {this.materialForm.tags?.map(tag => (
                      <ElTag key={tag}>{tag}</ElTag>
                    ))}
                  </div>
                  
                  <h4>识别到的属性:</h4>
                  <div class="props-table">
                    {Object.keys(this.materialForm.props || {}).length > 0 ? (
                      <ElTable
                        data={Object.entries(this.materialForm.props || {}).map(([key, value]) => ({ key, ...value }))}
                        border
                        style={{ width: '100%' }}
                      >
                        <ElTableColumn prop="key" label="属性名" width="180" />
                        <ElTableColumn prop="type" label="类型" width="120" />
                        <ElTableColumn prop="title" label="标题" width="180" />
                        <ElTableColumn prop="default" label="默认值" formatter={(row: Record<string, any>) => JSON.stringify(row.default) || '-'} />
                      </ElTable>
                    ) : (
                      <ElEmpty description="AI未识别出组件属性，请在JSON视图中手动添加" />
                    )}
                  </div>
                  
                  <el-alert
                    title="提示"
                    type="info"
                    description="AI分析结果仅供参考，您可以在JSON视图中进行编辑和完善"
                    show-icon
                    style={{marginTop: '20px'}}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div class="json-editor-wrapper">
              <JsonEditor
                modelValue={this.parsedJson}
                onUpdate:modelValue={this.updateDescriptorJson}
                height="100%"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}); 