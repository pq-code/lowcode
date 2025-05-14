import { defineComponent, ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDraggingDraggingStore } from '@/stores/draggingDragging/useDraggingDraggingStore';
import { MaterialRegistry } from '@/core/material';
import { ComponentUtils } from '@/core/material';
import '../style/draggingDraggingR.less';

export default defineComponent({
  name: 'DraggingDraggingR',
  
  setup() {
    // 从状态管理获取页面数据和选中组件
    const store = useDraggingDraggingStore();
    const { pageJSON, selectedComponentId } = storeToRefs(store);
    
    // 当前编辑的组件节点
    const currentNode = computed(() => {
      if (!selectedComponentId.value || !pageJSON.value || !pageJSON.value.root) {
        return null;
      }
      return ComponentUtils.findNodeById(pageJSON.value.root, selectedComponentId.value);
    });
    
    // 当前组件的物料描述
    const materialComponent = computed(() => {
      if (!currentNode.value) return null;
      
      return MaterialRegistry.getInstance().getComponentByType(currentNode.value.componentType);
    });
    
    // 属性分组
    const propertiesGroups = computed(() => {
      if (!materialComponent.value || !materialComponent.value.properties) {
        return {};
      }
      
      const groups = {};
      
      materialComponent.value.properties.forEach(prop => {
        const groupName = prop.group || '基础属性';
        if (!groups[groupName]) {
          groups[groupName] = [];
        }
        groups[groupName].push(prop);
      });
      
      return groups;
    });
    
    // 更新组件属性
    const updateComponentProp = (propName, value) => {
      if (!currentNode.value || !selectedComponentId.value) return;
      
      store.updateComponentProps(selectedComponentId.value, {
        [propName]: value
      });
    };
    
    // 渲染不同类型的属性编辑器
    const renderPropertyEditor = (prop) => {
      const currentValue = currentNode.value?.props[prop.name] ?? prop.defaultValue;
      
      switch (prop.type) {
        case 'string':
          return (
            <div class="property-editor property-editor-string">
              <input
                type="text"
                value={currentValue}
                onInput={(e) => updateComponentProp(prop.name, e.target.value)}
              />
            </div>
          );
          
        case 'number':
          return (
            <div class="property-editor property-editor-number">
              <input
                type="number"
                value={currentValue}
                onInput={(e) => updateComponentProp(prop.name, Number(e.target.value))}
              />
            </div>
          );
          
        case 'boolean':
          return (
            <div class="property-editor property-editor-boolean">
              <input
                type="checkbox"
                checked={currentValue}
                onChange={(e) => updateComponentProp(prop.name, e.target.checked)}
              />
            </div>
          );
          
        case 'select':
          return (
            <div class="property-editor property-editor-select">
              <select
                value={currentValue}
                onChange={(e) => updateComponentProp(prop.name, e.target.value)}
              >
                {prop.options && prop.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
          
        case 'color':
          return (
            <div class="property-editor property-editor-color">
              <input
                type="color"
                value={currentValue}
                onChange={(e) => updateComponentProp(prop.name, e.target.value)}
              />
            </div>
          );
          
        default:
          return (
            <div class="property-editor property-editor-unknown">
              不支持的属性类型: {prop.type}
            </div>
          );
      }
    };
    
    // 删除当前组件
    const deleteCurrentComponent = () => {
      if (!selectedComponentId.value || !pageJSON.value || !pageJSON.value.root) {
        return;
      }
      
      // 不能删除根组件
      if (pageJSON.value.root.id === selectedComponentId.value) {
        alert('不能删除根组件');
        return;
      }
      
      store.removeComponent(selectedComponentId.value);
    };
    
    return () => (
      <div class="dragging-dragging-r">
        <div class="property-panel">
          <div class="property-panel-header">
            <h3>属性面板</h3>
          </div>
          
          {!currentNode.value ? (
            <div class="property-empty">
              <p>请选择一个组件</p>
            </div>
          ) : (
            <div class="property-content">
              <div class="component-info">
                <div class="component-type">
                  <span class="label">组件类型:</span>
                  <span class="value">{materialComponent.value?.title || currentNode.value.componentType}</span>
                </div>
                
                <div class="component-id">
                  <span class="label">组件ID:</span>
                  <span class="value">{currentNode.value.id}</span>
                </div>
                
                {materialComponent.value?.description && (
                  <div class="component-description">
                    {materialComponent.value.description}
                  </div>
                )}
                
                <div class="component-actions">
                  <button 
                    class="action-button delete-button"
                    onClick={deleteCurrentComponent}
                  >
                    删除组件
                  </button>
                </div>
              </div>
              
              <div class="property-groups">
                {Object.entries(propertiesGroups.value).map(([groupName, properties]) => (
                  <div key={groupName} class="property-group">
                    <div class="group-header">{groupName}</div>
                    <div class="group-content">
                      {properties.map(prop => (
                        <div key={prop.name} class="property-item">
                          <div class="property-label">
                            {prop.label}
                            {prop.required && <span class="required-mark">*</span>}
                          </div>
                          <div class="property-control">
                            {renderPropertyEditor(prop)}
                          </div>
                          {prop.description && (
                            <div class="property-description">
                              {prop.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
});
