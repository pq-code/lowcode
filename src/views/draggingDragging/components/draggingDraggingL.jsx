import { defineComponent } from 'vue';
import MaterialPanel from '@/views/material-platform/components/MaterialPanel';

/**
 * 低代码编辑器左侧物料面板
 */
const draggingDraggingL = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
  },
  setup() {
    return () => (
      <div className='draggingDraggingL'>
        <MaterialPanel />
      </div>
    );
  },
});

export default draggingDraggingL;
