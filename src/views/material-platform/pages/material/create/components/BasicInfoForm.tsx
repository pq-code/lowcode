import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElTag, ElButton } from 'element-plus';
import type { Material, MaterialGroup } from '../../../../types';

export default defineComponent({
  name: 'BasicInfoForm',
  props: {
    materialForm: {
      type: Object as PropType<Partial<Material>>,
      required: true
    },
    groups: {
      type: Array as PropType<MaterialGroup[]>,
      default: () => []
    }
  },
  emits: ['update:materialForm', 'add-tag', 'remove-tag'],
  setup(props, { emit }) {
    const newTag = ref('');
    
    const updateMaterialForm = (key: string, value: any) => {
      emit('update:materialForm', { ...props.materialForm, [key]: value });
    };
    
    const addTag = () => {
      if (!newTag.value) return;
      
      const tags = [...(props.materialForm.tags || [])];
      if (!tags.includes(newTag.value)) {
        tags.push(newTag.value);
        updateMaterialForm('tags', tags);
        emit('add-tag', newTag.value);
      }
      newTag.value = '';
    };
    
    const removeTag = (tag: string) => {
      const tags = [...(props.materialForm.tags || [])];
      const index = tags.indexOf(tag);
      if (index !== -1) {
        tags.splice(index, 1);
        updateMaterialForm('tags', tags);
        emit('remove-tag', tag);
      }
    };
    
    const handleTagKeydown = (evt: Event) => {
      if ((evt as KeyboardEvent).key === 'Enter') {
        evt.preventDefault();
        addTag();
      }
    };
    
    return {
      newTag,
      updateMaterialForm,
      addTag,
      removeTag,
      handleTagKeydown
    };
  },
  render() {
    return (
      <div class="basic-info-form">
        <ElForm model={this.materialForm} label-width="100px" label-position="right">
          <div class="form-section">
            <h3 class="form-section-title">基本信息</h3>
            
            <ElFormItem label="名称" required>
              <ElInput 
                modelValue={this.materialForm.name} 
                placeholder="请输入物料名称" 
                onUpdate:modelValue={(val: string) => this.updateMaterialForm('name', val)}
              />
            </ElFormItem>
            
            <ElFormItem label="类型" required>
              <ElSelect 
                modelValue={this.materialForm.type} 
                style={{width: '100%'}} 
                placeholder="请选择物料类型"
                onUpdate:modelValue={(val: string) => this.updateMaterialForm('type', val)}
              >
                {this.groups.map(group => (
                  <ElOption key={group.id} label={group.name} value={group.id} />
                ))}
              </ElSelect>
            </ElFormItem>
            
            <ElFormItem label="描述">
              <ElInput 
                modelValue={this.materialForm.description} 
                type="textarea" 
                rows={3}
                placeholder="请输入物料描述"
                onUpdate:modelValue={(val: string) => this.updateMaterialForm('description', val)}
              />
            </ElFormItem>
            
            <ElFormItem label="版本">
              <ElInput 
                modelValue={this.materialForm.version} 
                placeholder="请输入版本号，如1.0.0" 
                onUpdate:modelValue={(val: string) => this.updateMaterialForm('version', val)}
              />
            </ElFormItem>
            
            <ElFormItem label="标签">
              <div class="tags-input">
                <ElInput 
                  modelValue={this.newTag} 
                  placeholder="输入标签后回车" 
                  onKeydown={this.handleTagKeydown}
                  onUpdate:modelValue={(val: string) => this.newTag = val}
                />
                <ElButton type="primary" onClick={this.addTag}>添加</ElButton>
              </div>
              
              <div class="tags-container">
                {this.materialForm.tags?.map(tag => (
                  <ElTag 
                    key={tag} 
                    closable 
                    onClose={() => this.removeTag(tag)}
                    style={{ marginRight: '8px', marginBottom: '8px' }}
                  >
                    {tag}
                  </ElTag>
                ))}
              </div>
            </ElFormItem>
          </div>
        </ElForm>
      </div>
    );
  }
}); 