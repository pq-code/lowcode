import { ElButton,ElPageHeader,ElBreadcrumbItem,ElAvatar,ElTag ,ElDrawer, ElTooltip} from 'element-plus';
import { defineComponent, ref, watch, onMounted } from 'vue';
import useCanvasOperation from '../hooks/useCanvasOperation';
import CreateCode from '@/packages/CreateCode';
import router from '@/router/index'
import { storeToRefs } from 'pinia';
import { useDraggingDraggingStore } from '@/stores/draggingDragging/useDraggingDraggingStore';
import { RenderMode } from '@/core/render';
import '../style/draggingDraggingHead.less';

const draggingDraggingHead = defineComponent({
  name: 'DraggingDraggingHead',
  props: {
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  setup(props, { emit }) {
    const drawer = ref()
    const {
      upHistoryOperatingObject,
      clearHistoryOperatingObject,
      backHistoryOperatingObject
    } = useCanvasOperation()

    // 从状态管理获取数据
    const store = useDraggingDraggingStore();
    const { pageJSON } = storeToRefs(store);
    
    // 渲染模式
    const renderMode = ref(RenderMode.DESIGN);
    
    const onBack = () => {
      router.push({name:'dashboard'})
    }

    const foundCode = () =>{
      console.log('代码生成')
      drawer.value = true
    }

    onMounted(() => {
    });

    // 保存页面
    const handleSave = () => {
      // 实际应用中，这里会调用API保存页面数据
      console.log('保存页面数据:', pageJSON.value);
      alert('页面保存成功');
    };
    
    // 预览页面
    const handlePreview = () => {
      if (renderMode.value === RenderMode.DESIGN) {
        renderMode.value = RenderMode.PREVIEW;
      } else {
        renderMode.value = RenderMode.DESIGN;
      }
      
      store.setRenderMode(renderMode.value);
    };
    
    // 导出代码
    const handleExportCode = () => {
      // 实际应用中，这里会调用代码生成服务
      console.log('导出代码:', pageJSON.value);
      alert('代码导出成功');
    };
    
    // 清空页面
    const handleClear = () => {
      if (confirm('确定要清空页面吗？此操作不可恢复。')) {
        store.resetPage();
      }
    };

    const vnode = () => {
      return (
        <div class="dragging-dragging-head">
          <div class="logo">
            <span>Vue3 低代码平台</span>
          </div>
          
          <div class="toolbar">
            <div class="toolbar-group">
              <button 
                class={['toolbar-button', { active: renderMode.value === RenderMode.PREVIEW }]}
                onClick={handlePreview}
              >
                {renderMode.value === RenderMode.DESIGN ? '预览' : '编辑'}
              </button>
              
              <button 
                class="toolbar-button"
                onClick={handleSave}
              >
                保存
              </button>
              
              <button 
                class="toolbar-button"
                onClick={handleExportCode}
              >
                导出代码
              </button>
              
              <button 
                class="toolbar-button danger"
                onClick={handleClear}
              >
                清空
              </button>
            </div>
          </div>
          
          <div class="user-info">
            <span>当前编辑: {pageJSON.value?.name || '新页面'}</span>
          </div>
        </div>
      )
    }
    return () => (
      vnode()
    );
  },
});

export default draggingDraggingHead;
