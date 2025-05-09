import { defineComponent, ref, watch, onMounted } from 'vue';
import DlockContainerOperatorPanel from '@/packages/DlockContainer/src/DlockContainerOperatorPanel.jsx'
import FormvOperatorPanel from '@/packages/Form/src/FormOperatorPanel.jsx'
import { ElInput, ElSwitch } from 'element-plus';
import { useDraggingDraggingStore } from '@/stores/draggingDragging/useDraggingDraggingStore.ts'
import { storeToRefs } from 'pinia'
import ControlPanel from '@/packages/ControlPanel/src/ControlPanel'

const draggingDraggingL = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => { }
    },
    // fileListMap: Object
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  setup(props, { emit }) {
    const store = useDraggingDraggingStore();
    const { pageJSON, currentOperatingObject } = storeToRefs(store);
    const draggingDraggingRRef = ref(null)
    const activeIndex = ref(0);
    const activeNames = ref('')
    const handleSelect = (index) => {
      activeIndex.value = index;
    };
    const handleChange = () => {

    }
    const init = () => {

    }
    onMounted(() => {
      init()
    });

    const TypeRender = (item) => {
      return (
        <ControlPanel item={item}></ControlPanel>
      )
    }

    const RenderEngine = (item) => {
      if (!item || JSON.stringify(item) == '{}') {
        return <div style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}> <span style={
          {
            'text-align': 'center',
            'font-size': '23px',
            'font-weight': 600,
            color: 'rgb(51, 51, 51)',
            padding: '0px 5px',
            background: '-webkit-linear-gradient(315deg, rgb(66, 211, 146) 25%, rgb(100, 126, 255)) text',
            '-webkit-text-fill-color': 'transparent'
          }
        }>点击中间画布区域选中要操作的对象</span> </div>
      }

      return (
        <div className="draggingDraggingR">
          <div className="draggingDraggingR-content">
            <div
              ref={draggingDraggingRRef}
              className="draggingDraggingR-content-list"
            >
              <ElCollapse vModel={activeNames.value} onChange={handleChange}>
                {TypeRender(item)}
              </ElCollapse>
            </div>
          </div>
        </div>
      )
    }

    return () => (
      RenderEngine(currentOperatingObject.value)
    );
  },
});

export default draggingDraggingL;
