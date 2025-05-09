import { defineComponent, ref, watch, onMounted } from 'vue';
import componentContainer from './componentContainer'
import { Search } from '@element-plus/icons-vue'
import { componentList } from "@/components/materialArea/materialArea"
import { ElCollapse, ElCollapseItem, ElInput } from 'element-plus';

const draggingDraggingL = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  setup(props, { emit }) {
    const activeNames = ref(['0', '1']);
    const inputValue = ref(props.modelValue);
    const componentItemList = ref([]);
    
    const handleChange = (val) => {
      activeNames.value = val;
    };
    
    const init = () => {
      let map = new Map()
      componentList.forEach(element => {
        if (!map.has(element.group)) {
          element.key = element.type + Math.random().toString(36)
          map.set(element.group,[element])
        } else {
          let rustl = map.get(element.group)
          element.key = element.type + Math.random().toString(36)
          map.set(element.group,[...rustl,element])
        }
      });
      componentItemList.value = Object.fromEntries(map);
    }
    
    onMounted(() => {
      init()
    });

    return () => (
      <div className='draggingDraggingL'>
        <div className='draggingDraggingL-title'> 组件库 </div>
        <div className='draggingDraggingL-main'>
          <ElInput placeholder="搜索组件库" suffix-icon={Search} />
          <div className='draggingDraggingL-container'>
            <ElCollapse 
              modelValue={activeNames.value}
              onUpdate:modelValue={(val) => handleChange(val)}
            >
              {Object.keys(componentItemList.value).map((key, index) => (
                <ElCollapseItem 
                  key={index}
                  title={key} 
                  name={String(index)}
                >
                  <componentContainer componentList={componentItemList.value[key]}></componentContainer>
                </ElCollapseItem>
              ))}
            </ElCollapse>
          </div>
        </div>
      </div>
    );
  },
});

export default draggingDraggingL;
