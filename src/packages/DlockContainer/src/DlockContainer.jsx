import { defineComponent, computed } from 'vue';
import { useDraggingDraggingStore } from '@/stores/draggingDragging/useDraggingDraggingStore.ts';
import { storeToRefs } from 'pinia';
import style from '../style/index.module.less';
import { VueDraggable } from 'vue-draggable-plus';
import useCodeConfig from '@/views/draggingDragging/hooks/useCodeConfig.ts';

const DlockContainer = defineComponent({
  props: {
    // 兼容直接传入props的情况
    divProps: {
      type: Object,
      default: () => ({})
    },
    className: {
      type: String,
      default: ''
    },
    style: {
      type: String,
      default: ''
    },
    // 兼容通过item传入的情况
    item: {
      type: Object,
      default: () => ({})
    },
    children: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit, slots }) {
    const { collectProps } = useCodeConfig();

    const store = useDraggingDraggingStore();
    const { pageJSON } = storeToRefs(store);
    const whetherYouCanDrag = computed(() => pageJSON.value?.whetherYouCanDrag);

    // 调试信息
    console.log('DlockContainer props:', props);
    console.log('DlockContainer item:', props.item);
    console.log('DlockContainer item.props:', props.item?.props);

    const renderComponent = () => {
      // 优先使用item.props，如果没有则使用直接传入的props
      let propsToUse = {};
      
      // 如果是从物料面板拖过来的，使用item.props
      if (props.item && props.item.props) {
        propsToUse = props.item.props;
      } 
      // 如果是直接传入的props（属性打平的情况）
      else if (props.divProps) {
        propsToUse = {
          divProps: props.divProps,
          className: props.className,
          style: props.style
        };
      }
      
      console.log('DlockContainer propsToUse:', propsToUse);
      const vnodeProps = collectProps(propsToUse);
      console.log('DlockContainer vnodeProps', vnodeProps);

      const Dom = [];

      // 添加标题，如果有的话
      if (vnodeProps.titleProps?.props?.title) {
        const titleDom = (
          <div className={[vnodeProps?.titleProps?.props['className'], style.DivContainerTitle].filter(Boolean).join(' ')} style={vnodeProps.titleProps.style}>
            {vnodeProps.titleProps.props.title}
          </div>
        );
        Dom.unshift(titleDom);
      }
      
      // 处理子组件
      let childrenS = slots.default ? slots.default() : [];
      console.log('DlockContainer slots:', slots);
      console.log('DlockContainer childrenS:', childrenS);
      
      if (vnodeProps.titleProps?.props?.title || (slots.default && childrenS && childrenS.length && childrenS[0]?.children?.length)) {
        Dom.push(slots.default ? slots.default() : []);
      } else {
        Dom.push(
          <div className={style.DivContainerNosolt}>
            <span style={'border: 2px dashed #7bb3fc'}> 拖拽组件放入容器中 </span>
          </div>
        );
      }

      // 兼容多种情况的容器属性
      const containerProps = {
        id: props.item?.key || '',
        className: [
          vnodeProps?.divProps?.props?.['className'] || 
          props.className || 
          'container', 
          style.DivContainer
        ].filter(Boolean).join(' '),
        style: vnodeProps?.divProps?.style || props.style || ''
      };

      console.log('DlockContainer containerProps:', containerProps);

      // 判断是否可拖拽
      const canDrag = whetherYouCanDrag && whetherYouCanDrag.value !== false;
      
      return canDrag ? (
        <VueDraggable
          modelValue={props.item?.children || []}
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
