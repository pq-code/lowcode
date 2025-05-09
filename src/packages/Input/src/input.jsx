import { defineComponent, onMounted } from 'vue';

const Input = defineComponent({
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

    onMounted(() => {
    });

    return () => (
      <ElInput
        className='PageContainer'
        vModel={componentList.value}
        animation={150}
        group='people'
        sort={true}
        onEnd={handleEnd}
      >
        {props.children}
      </ElInput>
    );
  },
});

export default Input;
