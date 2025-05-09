import { defineComponent, ref, watch, onMounted } from "vue";

const FormOperatorPanel = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => { },
    },
    item: {
      type: Object,
      default: () => { },
    },
  },
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  setup(props, { emit }) {

    return () => (
      <div className="draggingDraggingR">
      </div>
    );
  },
});

export default FormOperatorPanel;
