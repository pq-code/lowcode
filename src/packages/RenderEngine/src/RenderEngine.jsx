import { defineComponent, ref, watch, nextTick, computed } from 'vue';
import style from '../style/index.module.less';
import { useDraggingDraggingStore } from '@renderer/stores/draggingDragging/useDraggingDraggingStore.ts';
import { VueDraggable } from 'vue-draggable-plus';
import { TypeRenderEngine } from '../components/TypeRenderEngine';
import { storeToRefs } from 'pinia';
import useCanvasOperation from '@renderer/views/draggingDragging/hooks/useCanvasOperation.ts';
import ComponentMaker from '../components/ComponentMaker.jsx';

const RenderEngine = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    listData: {
      type: Array,
      default: () => [],
    },
  },

  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },

  setup(props, { emit }) {
    const { addHistoryOperatingObject } = useCanvasOperation();

    const store = useDraggingDraggingStore();
    const { pageJSON, currentOperatingObject } = storeToRefs(store); // 页面数据
    const whetherYouCanDrag = computed(() => pageJSON.value.whetherYouCanDrag);
    const componentList = ref(pageJSON.value?.children || []);

    watch(
      () => pageJSON.value,
      ({ children = [] }) => {
        componentList.value = children;
      },
      { deep: true }
    );

    watch(
      [() => componentList.value, () => props.modelValue],
      ([newComponentList, newModelValue]) => {
        if (newComponentList !== pageJSON.value.children) {
          pageJSON.value.children = newComponentList;
        }
        addHistoryOperatingObject(); // 保存历史记录
      },
      { deep: true }
    );
    // 深度遍历
    const renderComponents = (_page) => {
      if (!_page) return null;
      if (Array.isArray(_page)) {
        return _page.map((child) => {
          const children = Array.isArray(child.children) ? renderComponents(child.children) : [];
          return startRender(child, children);
        });
      } else {
        return startRender(_page);
      }
    };
    // 开始渲染
    const startRender = (item, children) => {
      item.key = `${item.type}-${Number(Math.random() * 10000).toFixed(0)}`;
      return whetherYouCanDrag ? (
        <ComponentMaker item={item}>
          {TypeRenderEngine(item, children)}
        </ComponentMaker>
      ) : (
        TypeRenderEngine(item, children)
      );
    };


    // 取消选中
    const clickContainer = (e) => {
      e.stopPropagation();
      currentOperatingObject.value = null;
    };


    const renderRootVnode = computed(() => {
      const renderComponent = renderComponents(componentList.value); // 深度优先遍历
      return whetherYouCanDrag ? (
        <VueDraggable
          className={style.PageContainer}
          vModel={componentList.value}
          group={{ name: 'people', pull: true, put: true }}
          ghostClass="ghost"
          chosenClass="chosen"
          selector="selector"
          animation={200}
          sort={true}
          onClick={clickContainer}
        >
          {renderComponent}
        </VueDraggable>
      ) : (
        <div className={style.PageContainer}>{renderComponent}</div>
      );
    });

    return () => renderRootVnode.value;
  },
});

export default RenderEngine;
