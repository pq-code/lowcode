import { defineComponent, ref, computed, onMounted } from 'vue';
import './style/index.less'
import { VueDraggable } from 'vue-draggable-plus'

const PageContainer = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
    pageJSON: {
      type: Array,
      default: () => []
    },
    children: {
      type: Object,
      default: () => {}
    }
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  setup(props, { emit }) {
    const componentList = computed(() => {
      return props.pageJSON;
    });

    const handleEnd = (e) => {
      console.log(e)
    }

    onMounted(() => {
    });

    return () => (
      <VueDraggable
        className='PageContainer'
        vModel={componentList.value}
        animation={150}
        group='people'
        sort={true}
        onEnd={handleEnd}
      >
        {props.children}
      </VueDraggable>
    );
  },
});

export default PageContainer;
