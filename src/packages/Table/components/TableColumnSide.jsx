import { defineComponent, ref, defineExpose } from 'vue';

const TableColumnSide = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    item: {
      type: Object,
      default: () => ({})
    },
    children: {
      type: Array,
      default: () => []
    },
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  setup(props, { emit }) {
    const drawerValue = ref(false);
    const openDrawer = () => {
      drawerValue.value = true;
    };
    const handleClose = () => {
      drawerValue.value = false;
    };
    defineExpose({ openDrawer });
    return () => (
      <el-drawer
        vModel= {drawerValue.value}
        title="I am the title"
        direction="rtl"
        before-close={handleClose}
      >
        <span>Hi, there!</span>
      </el-drawer>
    );
  },
});

export default TableColumnSide;
