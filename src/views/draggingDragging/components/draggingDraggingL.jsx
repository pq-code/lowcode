import { defineComponent, ref, onMounted } from 'vue';
import { MaterialRegistry } from '@/core/material';
import '../style/draggingDraggingL.less';

/**
 * 低代码编辑器左侧物料面板
 */
const draggingDraggingL = defineComponent({
  name: 'DraggingDraggingL',
  
  setup() {
    // 物料分类
    const categories = ref([
      { id: 'layout', name: '布局组件' },
      { id: 'basic', name: '基础组件' },
      { id: 'form', name: '表单组件' },
      { id: 'data', name: '数据组件' },
      { id: 'custom', name: '自定义组件' }
    ]);
    
    // 当前选中的分类
    const currentCategory = ref('basic');
    
    // 组件列表
    const componentList = ref([]);
    
    // 基础组件描述
    const basicComponents = [
      {
        componentId: 'text',
        name: 'Text',
        type: 'text',
        category: 'basic',
        title: '文本',
        description: '用于显示文本内容',
        icon: 'icon-text',
        properties: [
          {
            name: 'content',
            label: '文本内容',
            type: 'string',
            defaultValue: '文本内容'
          },
          {
            name: 'color',
            label: '颜色',
            type: 'color',
            defaultValue: '#333333'
          },
          {
            name: 'fontSize',
            label: '字体大小',
            type: 'number',
            defaultValue: 14
          },
          {
            name: 'bold',
            label: '粗体',
            type: 'boolean',
            defaultValue: false
          },
          {
            name: 'italic',
            label: '斜体',
            type: 'boolean',
            defaultValue: false
          },
          {
            name: 'alignment',
            label: '对齐方式',
            type: 'select',
            defaultValue: 'left',
            options: [
              { label: '左对齐', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '右对齐', value: 'right' }
            ]
          }
        ]
      },
      {
        componentId: 'button',
        name: 'Button',
        type: 'button',
        category: 'basic',
        title: '按钮',
        description: '交互按钮',
        icon: 'icon-button',
        properties: [
          {
            name: 'text',
            label: '按钮文本',
            type: 'string',
            defaultValue: '按钮'
          },
          {
            name: 'type',
            label: '类型',
            type: 'select',
            defaultValue: 'default',
            options: [
              { label: '默认', value: 'default' },
              { label: '主要', value: 'primary' },
              { label: '成功', value: 'success' },
              { label: '警告', value: 'warning' },
              { label: '危险', value: 'danger' }
            ]
          },
          {
            name: 'size',
            label: '尺寸',
            type: 'select',
            defaultValue: 'medium',
            options: [
              { label: '大', value: 'large' },
              { label: '中', value: 'medium' },
              { label: '小', value: 'small' }
            ]
          },
          {
            name: 'disabled',
            label: '禁用',
            type: 'boolean',
            defaultValue: false
          }
        ]
      },
      {
        componentId: 'image',
        name: 'Image',
        type: 'image',
        category: 'basic',
        title: '图片',
        description: '显示图片',
        icon: 'icon-image',
        properties: [
          {
            name: 'src',
            label: '图片地址',
            type: 'string',
            defaultValue: 'https://via.placeholder.com/200x100'
          },
          {
            name: 'alt',
            label: '替代文本',
            type: 'string',
            defaultValue: '图片'
          },
          {
            name: 'width',
            label: '宽度',
            type: 'number',
            defaultValue: 200
          },
          {
            name: 'height',
            label: '高度',
            type: 'number',
            defaultValue: 100
          }
        ]
      }
    ];
    
    // 布局组件描述
    const layoutComponents = [
      {
        componentId: 'container',
        name: 'Container',
        type: 'container',
        category: 'layout',
        title: '容器',
        description: '容器组件，可以包含其他组件',
        icon: 'icon-container',
        isContainer: true,
        properties: [
          {
            name: 'title',
            label: '标题',
            type: 'string',
            defaultValue: '容器标题'
          }
        ]
      },
      {
        componentId: 'page',
        name: 'Page',
        type: 'page',
        category: 'layout',
        title: '页面',
        description: '页面根组件',
        icon: 'icon-page',
        isContainer: true,
        isRoot: true,
        properties: [
          {
            name: 'title',
            label: '页面标题',
            type: 'string',
            defaultValue: '新页面'
          },
          {
            name: 'description',
            label: '页面描述',
            type: 'string',
            defaultValue: '这是一个新页面'
          }
        ]
      }
    ];
    
    // 注册物料组件
    const registerMaterialComponents = () => {
      const registry = MaterialRegistry.getInstance();
      
      // 注册基础组件
      basicComponents.forEach(component => {
        registry.registerComponent(component);
      });
      
      // 注册布局组件
      layoutComponents.forEach(component => {
        registry.registerComponent(component);
      });
      
      updateComponentList();
    };
    
    // 更新组件列表
    const updateComponentList = () => {
      const registry = MaterialRegistry.getInstance();
      
      if (currentCategory.value === 'all') {
        componentList.value = registry.getAllComponents();
      } else {
        componentList.value = registry.getComponentsByCategory(currentCategory.value);
      }
    };
    
    // 切换分类
    const switchCategory = (categoryId) => {
      currentCategory.value = categoryId;
      updateComponentList();
    };
    
    // 处理组件拖拽开始事件
    const handleDragStart = (component, e) => {
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('application/json', JSON.stringify({
        type: component.type,
        componentId: component.componentId
      }));
    };
    
    onMounted(() => {
      registerMaterialComponents();
    });
    
    return () => (
      <div class="dragging-dragging-l">
        <div class="material-header">
          <h3>组件库</h3>
        </div>
        
        <div class="material-categories">
          {categories.value.map(category => (
            <div 
              key={category.id}
              class={['category-item', { active: currentCategory.value === category.id }]}
              onClick={() => switchCategory(category.id)}
            >
              {category.name}
            </div>
          ))}
        </div>
        
        <div class="material-components">
          {componentList.value.map(component => (
            <div 
              key={component.componentId}
              class="component-item"
              draggable
              onDragstart={(e) => handleDragStart(component, e)}
            >
              <div class="component-icon">
                <i class={component.icon || 'icon-default'}></i>
              </div>
              <div class="component-info">
                <div class="component-title">{component.title}</div>
                <div class="component-desc">{component.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
});

export default draggingDraggingL;
