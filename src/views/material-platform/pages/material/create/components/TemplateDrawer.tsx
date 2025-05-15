import { defineComponent, ref, computed } from 'vue';
import type { PropType } from 'vue';
import { ElDrawer, ElInput, ElIcon, ElEmpty, ElButton } from 'element-plus';
import { Search, Picture } from '@element-plus/icons-vue';

// 模板接口
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
    
    // 根据搜索筛选模板
    const filteredTemplates = computed(() => {
      if (!searchQuery.value) return props.templates;
      
      const query = searchQuery.value.toLowerCase();
      return props.templates.filter(template => {
        return (
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
    });
    
    // 关闭抽屉
    const closeDrawer = () => {
      emit('update:visible', false);
    };
    
    // 应用模板
    const applyTemplate = (templateId: string) => {
      emit('apply', templateId);
    };
    
    // 预览模板
    const previewTemplate = (templateId: string) => {
      emit('preview', templateId);
    };
    
    return {
      searchQuery,
      filteredTemplates,
      closeDrawer,
      applyTemplate,
      previewTemplate
    };
  },
  render() {
    return (
      <ElDrawer
        modelValue={this.visible}
        title="选择组件模板"
        size="60%"
        direction="rtl"
        appendToBody
        destroyOnClose
        onUpdate:modelValue={this.closeDrawer}
      >
        <div class="template-drawer-content">
          <div class="template-search">
            <ElInput
              modelValue={this.searchQuery}
              placeholder="搜索模板..."
              clearable
              prefixIcon={<ElIcon><Search /></ElIcon>}
              onUpdate:modelValue={(val: string) => this.searchQuery = val}
            />
          </div>
          
          {this.filteredTemplates.length > 0 ? (
            <div class="template-grid">
              {this.filteredTemplates.map(template => (
                <div class="template-card" key={template.id}>
                  <div class="template-card-header">
                    {template.thumbnail ? (
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        class="template-thumbnail"
                      />
                    ) : (
                      <div class="template-thumbnail-placeholder">
                        <ElIcon style={{ fontSize: '40px', color: '#909399' }}>
                          <Picture />
                        </ElIcon>
                        <span style={{ marginTop: '8px', color: '#909399' }}>无预览图</span>
                      </div>
                    )}
                  </div>
                  
                  <div class="template-card-body">
                    <h4 class="template-name">{template.name}</h4>
                    <p class="template-description">{template.description}</p>
                    
                    <div class="template-tags">
                      {template.tags.map(tag => (
                        <ElButton key={tag} size="small" class="template-tag">
                          {tag}
                        </ElButton>
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
                        size="small"
                        type="primary"
                        onClick={() => this.applyTemplate(template.id)}
                      >
                        使用
                      </ElButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ElEmpty
              description="没有找到匹配的模板"
              class="no-templates"
            />
          )}
        </div>
      </ElDrawer>
    );
  }
}); 