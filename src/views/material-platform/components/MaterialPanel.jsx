import { defineComponent, ref, onMounted } from 'vue';
import { ElTabs, ElTabPane, ElCard } from 'element-plus';
import { getAllMaterials, getMaterialsByGroup } from '@/core/material/services/MaterialService';

/**
 * 物料面板组件
 * 展示不同分组的物料，支持拖拽
 */
const MaterialPanel = defineComponent({
  name: 'MaterialPanel',
  
  setup() {
    const activeTab = ref('base');
    const materials = ref([]);
    const groupedMaterials = ref({
      base: [],
      layout: [],
      form: [],
      data: [],
      feedback: []
    });
    
    // 加载物料数据
    const loadMaterials = () => {
      // 获取所有物料
      const allMaterials = getAllMaterials();
      materials.value = allMaterials;
      
      // 按分组整理物料
      Object.keys(groupedMaterials.value).forEach(group => {
        groupedMaterials.value[group] = getMaterialsByGroup(group);
      });
    };
    
    // 处理拖拽开始事件
    const handleDragStart = (event, material) => {
      // 设置拖拽数据
      event.dataTransfer.setData('material', JSON.stringify(material));
      event.dataTransfer.effectAllowed = 'copy';
    };
    
    onMounted(() => {
      loadMaterials();
    });
    
    return () => (
      <div class="material-panel">
        <ElTabs v-model={activeTab.value} class="material-tabs">
          <ElTabPane label="基础组件" name="base">
            <div class="material-list">
              {groupedMaterials.value.base.map(material => (
                <ElCard 
                  key={material.type}
                  class="material-item"
                  shadow="hover"
                  draggable={true}
                  onDragstart={e => handleDragStart(e, material)}
                >
                  <div class="material-item-content">
                    <div class="material-icon">
                      <i class={material.icon || 'el-icon-menu'}></i>
                    </div>
                    <div class="material-name">{material.name}</div>
                  </div>
                </ElCard>
              ))}
              {groupedMaterials.value.base.length === 0 && (
                <div class="empty-tip">暂无物料</div>
              )}
            </div>
          </ElTabPane>
          
          <ElTabPane label="布局组件" name="layout">
            <div class="material-list">
              {groupedMaterials.value.layout.map(material => (
                <ElCard 
                  key={material.type}
                  class="material-item"
                  shadow="hover"
                  draggable={true}
                  onDragstart={e => handleDragStart(e, material)}
                >
                  <div class="material-item-content">
                    <div class="material-icon">
                      <i class={material.icon || 'el-icon-menu'}></i>
                    </div>
                    <div class="material-name">{material.name}</div>
                  </div>
                </ElCard>
              ))}
              {groupedMaterials.value.layout.length === 0 && (
                <div class="empty-tip">暂无物料</div>
              )}
            </div>
          </ElTabPane>
          
          <ElTabPane label="表单组件" name="form">
            <div class="material-list">
              {groupedMaterials.value.form.map(material => (
                <ElCard 
                  key={material.type}
                  class="material-item"
                  shadow="hover"
                  draggable={true}
                  onDragstart={e => handleDragStart(e, material)}
                >
                  <div class="material-item-content">
                    <div class="material-icon">
                      <i class={material.icon || 'el-icon-menu'}></i>
                    </div>
                    <div class="material-name">{material.name}</div>
                  </div>
                </ElCard>
              ))}
              {groupedMaterials.value.form.length === 0 && (
                <div class="empty-tip">暂无物料</div>
              )}
            </div>
          </ElTabPane>
        </ElTabs>
        
        <style jsx>{`
          .material-panel {
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          
          .material-tabs {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          
          .material-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            padding: 12px;
            overflow-y: auto;
            max-height: calc(100vh - 120px);
          }
          
          .material-item {
            cursor: move;
            transition: all 0.2s;
          }
          
          .material-item:hover {
            transform: translateY(-3px);
          }
          
          .material-item-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 8px;
          }
          
          .material-icon {
            font-size: 24px;
            margin-bottom: 8px;
            color: #409EFF;
          }
          
          .material-name {
            font-size: 12px;
            color: #606266;
          }
          
          .empty-tip {
            grid-column: span 2;
            text-align: center;
            color: #909399;
            padding: 24px 0;
          }
        `}</style>
      </div>
    );
  }
});

export default MaterialPanel; 