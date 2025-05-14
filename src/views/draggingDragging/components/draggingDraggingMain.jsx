import { defineComponent, ref, computed, onMounted } from 'vue';
import { RenderEngine, RenderMode } from '@/core/render';
import { ComponentUtils } from '@/core/material';
import { storeToRefs } from 'pinia';
import { useDraggingDraggingStore } from '@/stores/draggingDragging/useDraggingDraggingStore';
import '../style/draggingDraggingMain.less';

export default defineComponent({
  name: 'DraggingDraggingMain',
  
  setup() {
    // 从状态管理获取页面数据
    const store = useDraggingDraggingStore();
    const { pageJSON, selectedComponentId } = storeToRefs(store);
    
    // 渲染引擎配置
    const renderOptions = ref({
      mode: RenderMode.DESIGN,
      editable: true,
      showPlaceholder: true,
      draggable: true,
      selectable: true,
      showOutline: true,
      componentMap: {
        // 此处会在注册组件时填充
      }
    });
    
    // 组件映射表，用于动态渲染不同类型的组件
    const componentMap = ref({});
    
    // 选中的组件ID
    const currentSelectedId = computed({
      get: () => selectedComponentId.value,
      set: (val) => {
        store.setSelectedComponentId(val);
      }
    });
    
    // 页面结构
    const pageSchema = computed(() => {
      // 如果没有页面数据，创建默认页面结构
      if (!pageJSON.value || !pageJSON.value.root) {
        return ComponentUtils.createComponentNode('page', {
          title: '新页面',
          description: '这是一个新页面'
        });
      }
      
      return pageJSON.value.root;
    });
    
    // 处理组件选中事件
    const handleComponentSelected = (node) => {
      store.setSelectedComponentId(node.id);
    };
    
    // 处理组件结构变更事件
    const handleSchemaChange = (schema) => {
      store.updatePageRoot(schema);
    };
    
    // 处理组件属性变更事件
    const handlePropChange = ({ nodeId, props }) => {
      store.updateComponentProps(nodeId, props);
    };
    
    // 处理组件添加事件
    const handleComponentAdded = ({ node, parent }) => {
      console.log('组件已添加:', node, parent);
    };
    
    // 处理组件移除事件
    const handleComponentRemoved = ({ nodeId }) => {
      console.log('组件已移除:', nodeId);
    };
    
    // 处理组件移动事件
    const handleComponentMoved = ({ nodeId, targetId, position }) => {
      console.log('组件已移动:', nodeId, targetId, position);
    };
    
    // 登记基础组件
    const registerBaseComponents = () => {
      // 在实际应用中，这些组件会从物料库中动态加载
      // 这里仅作示例
      const components = {
        'page': {
          render() {
            return (
              <div class="page-container">
                {this.$slots.default?.()}
              </div>
            );
          }
        },
        'container': {
          props: ['title'],
          render() {
            return (
              <div class="container-component">
                {this.title && <div class="container-title">{this.title}</div>}
                <div class="container-content">
                  {this.$slots.default?.()}
                </div>
              </div>
            );
          }
        },
        'text': {
          props: ['content', 'color', 'fontSize', 'bold', 'italic', 'alignment'],
          render() {
            const style = {
              color: this.color || '#333',
              fontSize: this.fontSize ? `${this.fontSize}px` : '14px',
              fontWeight: this.bold ? 'bold' : 'normal',
              fontStyle: this.italic ? 'italic' : 'normal',
              textAlign: this.alignment || 'left'
            };
            
            return (
              <div class="text-component" style={style}>
                {this.content || '文本组件'}
              </div>
            );
          }
        },
        'button': {
          props: ['text', 'type', 'size', 'disabled'],
          render() {
            const classList = [
              'button-component',
              `button-${this.type || 'default'}`,
              `button-${this.size || 'medium'}`
            ];
            
            return (
              <button 
                class={classList} 
                disabled={this.disabled}
              >
                {this.text || '按钮'}
              </button>
            );
          }
        },
        'image': {
          props: ['src', 'alt', 'width', 'height'],
          render() {
            const style = {
              width: this.width ? `${this.width}px` : '100%',
              height: this.height ? `${this.height}px` : 'auto'
            };
            
            return (
              <div class="image-component">
                <img 
                  src={this.src || 'https://via.placeholder.com/200x100'} 
                  alt={this.alt || '图片'} 
                  style={style}
                />
              </div>
            );
          }
        }
      };
      
      // 更新组件映射表
      componentMap.value = components;
      renderOptions.value.componentMap = components;
    };
    
    onMounted(() => {
      registerBaseComponents();
    });
    
    return () => (
      <div class="dragging-dragging-main">
        <div class="canvas-container">
          <RenderEngine
            schema={pageSchema.value}
            selectedId={currentSelectedId.value}
            options={renderOptions.value}
            onComponent-selected={handleComponentSelected}
            onSchema-change={handleSchemaChange}
            onProp-change={handlePropChange}
            onComponent-added={handleComponentAdded}
            onComponent-removed={handleComponentRemoved}
            onComponent-moved={handleComponentMoved}
          />
        </div>
      </div>
    );
  }
});
