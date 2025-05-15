import { defineComponent, ref, computed } from 'vue';
import type { PropType } from 'vue';
import { ElDrawer, ElInput, ElIcon, ElCard, ElButton, ElTag, ElEmpty, ElMessageBox } from 'element-plus';
import { Search, Document } from '@element-plus/icons-vue';

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  code: string;
  thumbnail?: string;
}

export default defineComponent({
  name: 'TemplateDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    templates: {
      type: Array as PropType<TemplateItem[]>,
      default: () => []
    }
  },
  emits: ['update:visible', 'apply', 'preview'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    
    const updateVisible = (value: boolean) => {
      emit('update:visible', value);
    };
    
    const applyTemplate = (templateId: string) => {
      emit('apply', templateId);
    };
    
    const previewTemplate = (templateId: string) => {
      emit('preview', templateId);
    };
    
    const filteredTemplates = computed(() => {
      if (!searchQuery.value) return props.templates;
      
      const query = searchQuery.value.toLowerCase();
      return props.templates.filter(template => 
        template.name.toLowerCase().includes(query) || 
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });
    
    return {
      searchQuery,
      updateVisible,
      applyTemplate,
      previewTemplate,
      filteredTemplates
    };
  },
  render() {
    return (
      <ElDrawer
        modelValue={this.visible}
        title="组件模板库"
        size="60%"
        direction="rtl"
        appendToBody
        onUpdate:modelValue={this.updateVisible}
        onClose={() => this.updateVisible(false)}
      >
        <div class="template-drawer-content">
          <div class="template-search">
            <ElInput
              modelValue={this.searchQuery}
              placeholder="搜索模板"
              onUpdate:modelValue={(val: string) => this.searchQuery = val}
              prefixIcon={<ElIcon><Search /></ElIcon>}
              clearable
            />
          </div>
          
          <div class="template-grid">
            {this.filteredTemplates.map(template => (
              <ElCard 
                key={template.id}
                class="template-card"
                shadow="hover"
                bodyStyle={{ padding: '0' }}
              >
                <div class="template-card-header">
                  {template.thumbnail ? (
                    <img src={template.thumbnail} class="template-thumbnail" />
                  ) : (
                    <div class="template-thumbnail-placeholder">
                      <ElIcon style={{ fontSize: '28px', color: '#909399' }}><Document /></ElIcon>
                      <div style={{ marginTop: '8px', fontSize: '14px', color: '#606266' }}>{template.name}</div>
                    </div>
                  )}
                </div>
                
                <div class="template-card-body">
                  <h4 class="template-name">{template.name}</h4>
                  <p class="template-description">{template.description}</p>
                  
                  <div class="template-tags">
                    {template.tags.map(tag => (
                      <ElTag key={tag} size="small" effect="plain" class="template-tag">
                        {tag}
                      </ElTag>
                    ))}
                  </div>
                  
                  <div class="template-actions">
                    <ElButton 
                      size="small" 
                      onClick={() => this.previewTemplate(template.id)}
                    >
                      预览
                    </ElButton>
                    <ElButton 
                      type="primary" 
                      size="small"
                      onClick={() => this.applyTemplate(template.id)}
                    >
                      使用
                    </ElButton>
                  </div>
                </div>
              </ElCard>
            ))}
            
            {this.filteredTemplates.length === 0 && (
              <div class="no-templates">
                <ElEmpty description="没有找到匹配的模板" />
              </div>
            )}
          </div>
        </div>
      </ElDrawer>
    );
  }
}); 