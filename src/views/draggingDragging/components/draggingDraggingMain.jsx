import { defineComponent, ref, computed, onMounted } from 'vue';
import RenderEngine from '@/packages/RenderEngine/src/RenderEngine.jsx';
import { buildUUID } from "@/utils";
import { ElButton, ElDialog, ElTooltip } from 'element-plus';
import { useDraggingDraggingStore } from '@/stores/draggingDragging/useDraggingDraggingStore.ts';
import { storeToRefs } from 'pinia';
import QuillCodeEditor from "@/components/QuillCodeEditor/QuillCodeEditor.jsx"

const draggingDraggingMain = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    listData: {
      type: Array,
      default: () => []
    }
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  setup(props, { emit }) {
    const store = useDraggingDraggingStore();
    const { pageJSON, currentOperatingObject } = storeToRefs(store); // 页面数据

    const rootJSON = ref(props.modelValue);
    const dialogVisible = ref(false);

    // 计算属性，用于格式化 JSON 字符串
    const nodeJSON = computed(() => JSON.stringify(pageJSON.value, null, 2));

    // 渲染根节点 vnode
    const renderRootVnode = computed(() => (
      <RenderEngine key={rootJSON.value.id || buildUUID()} {...rootJSON.value} />
    ));

    onMounted(() => {
      // 初始化操作
    });

    const handleOpenDialog = () => {
      dialogVisible.value = true;
    };

     // 取消选中
     const clickContainer = (e) => {
      e.stopPropagation();
      currentOperatingObject.value = null;
     };

    return () => (
      <div className='draggingDraggingMain' onClick={clickContainer}>
        <div className='connections'>
          <dvi className="connectionsItem">
            <ElTooltip
              class="box-item"
              effect="dark"
              content="页面JSON结构"
              placement="top-start"
            >
              <ElButton text='primary' onClick={handleOpenDialog}>
                <i style={{ color: 'rgb(0 0 0)',fontSize: '23px' }} className='iconfont icon-shezhi4'></i>
              </ElButton>
            </ElTooltip>
          </dvi>

          <dvi className="connectionsItem">
            <ElTooltip
              class="box-item"
              effect="dark"
              content="页面大纲结构"
              placement="top-start"
            >
              <ElButton text='primary' onClick={handleOpenDialog}>
                <i style={{ color: 'rgb(0 0 0)',fontSize: '23px' }} className='iconfont icon-connections'></i>
              </ElButton>
            </ElTooltip>
          </dvi>
        </div>
        {renderRootVnode.value}
        <ElDialog
          vModel={dialogVisible.value}
          title="页面JSON结构"
          width="800"
          height="700"
        >
          <div style={{ height: '700px', overflow: 'auto',padding: '10px' }}>
            <QuillCodeEditor vModel={nodeJSON.value}></QuillCodeEditor>
          </div>
        </ElDialog>
      </div>
    );
  },
});

export default draggingDraggingMain;
