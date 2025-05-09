import { defineComponent, computed } from 'vue';
import { useDraggingDraggingStore } from '@renderer/stores/draggingDragging/useDraggingDraggingStore.ts';
import { storeToRefs } from 'pinia';
import style from '../style/index.module.less';
import { VueDraggable } from 'vue-draggable-plus';
import useCodeConfig from '@renderer/views/draggingDragging/hooks/useCodeConfig.ts';

const DlockContainer = defineComponent({
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
    }
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  setup(props, { emit, slots }) {
    const { collectProps } = useCodeConfig();

    const store = useDraggingDraggingStore();
    const { pageJSON } = storeToRefs(store);
    const whetherYouCanDrag = computed(() => pageJSON.value.whetherYouCanDrag);

    const renderComponent = () => {
      const vnodeProps = collectProps(props.item.props); // 收集组件属性
      console.log('vnodeProps', vnodeProps);

      const Dom = [];

      if (vnodeProps.titleProps?.props?.title) {
        const titleDom = (
          <div className={[vnodeProps?.titleProps?.props['className'], style.DivContainerTitle].filter(Boolean).join(' ')} style={vnodeProps.titleProps.style}>
            {vnodeProps.titleProps.props.title}
          </div>
        );
        Dom.unshift(titleDom);
      }
      let childrenS = slots.default()
      if (vnodeProps.titleProps?.props?.title || (slots && slots.default && childrenS[0].children.length)) {
        Dom.push(slots.default());
      } else {
        Dom.push(
          <div className={style.DivContainerNosolt}>
            <span style={'border: 2px dashed #7bb3fc'}> 拖拽组件放入容器中 </span>
          </div>
        );
      }

      const containerProps = {
        id: props.item.key,
        className: [vnodeProps?.divProps?.props['className'], style.DivContainer].filter(Boolean).join(' '),
        style: vnodeProps?.divProps?.style
      };

      return whetherYouCanDrag.value ? (
        <VueDraggable
          v-model={props.item.children}
          group={{ name: "people", pull: true, put: true }}
          ghostClass="ghost"
          chosenClass="chosen"
          selector="selector"
          animation={200}
          sort={true}
          {...containerProps}
        >
          {Dom}
        </VueDraggable>
      ) : (
        <div {...containerProps}>
          {Dom}
        </div>
      );
    };

    const vnode = computed(() => renderComponent());

    return () => vnode.value;
  },
});

export default DlockContainer;
