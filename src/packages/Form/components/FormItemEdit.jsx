import { defineComponent, ref, defineExpose } from 'vue';
import { ElDrawer, ElFormItem, ElForm } from 'element-plus';

const From = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    pageJSON: {
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
    const drawer = ref(false); // 侧边栏开关

    const handleClose = () => {
      drawer.value = false;
    };

    const openDrawer = () => {
      drawer.value = true;
    };

    return () => (
      <ElDrawer
        v-model={drawer.value}
        title="表单项目编辑"
        direction="rtl"
        before-close={handleClose}
      >
        <div>
          <ElForm>
            <ElFormItem label="表单项">
              <span>12312312</span>
            </ElFormItem>
          </ElForm>
        </div>
      </ElDrawer>
    );
  },
});

export default From;
