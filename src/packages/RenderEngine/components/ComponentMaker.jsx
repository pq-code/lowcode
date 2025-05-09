import style from '../style/ComponentMaker.module.less';
import { useDraggingDraggingStore } from '@renderer/stores/draggingDragging/useDraggingDraggingStore.ts';
import { VueDraggable } from 'vue-draggable-plus';
import { ref, computed } from 'vue';

const ComponentMaker = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },

  setup(props, { emit, slots }) {
    const store = useDraggingDraggingStore();
    const { pageJSON, currentOperatingObject } = storeToRefs(store);

    const deleteObject = () => {
      if (!currentOperatingObject.value) {
        console.error("当前操作对象为空，无法删除");
        return;
      }

      removeItem(pageJSON.value.children, currentOperatingObject.value.key);
      currentOperatingObject.value = null;
    };

    const removeItem = (items, key) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i]?.key === key) {
          items.splice(i, 1);
          break;
        }
        if (items[i]?.children) {
          removeItem(items[i].children, key);
        }
      }
    };

    const clickContainer = (e) => {
      e.stopPropagation();
      currentOperatingObject.value = props.item;
    };

    const handleMouseEnter = (e) => {
      e.stopPropagation();
      if (!e.currentTarget?.classList.contains(style.SelectedHighlighted)) {
        e.currentTarget?.classList.add(style.HoverHighlighted);
      }
    };

    const handleMouseLeave = (e) => {
      e.stopPropagation();
      e.currentTarget?.classList.remove(style.HoverHighlighted);
    };

    const isCurrentOperatingObject = computed(() => currentOperatingObject.value?.key === props.item?.key);

    const renderComponentTag = () => {
      if (isCurrentOperatingObject.value) {
        return (
          <div className={style.ComponentTag} style={{ 'z-index': 100 }}>
            <i class="iconfont icon-lajitong5" onClick={deleteObject}></i>
          </div>
        );
      } else {
        return <span className={style.ComponentTag}>{props.item?.componentName}</span>;
      }
    };

    const renderRootVnode = () => {
      return (
        <VueDraggable
          vModel={props.item}
          group={{ name: "people", pull: true, put: true }}
          ghostClass="ghost"
          chosenClass="chosen"
          selector="selector"
          animation={200}
          sort={true}
        >
          <ElTooltip
            class="box-item"
            effect="light"
            content={props.item?.componentName}
            placement="right"
          >
            {{
              reference: () => renderComponentTag(),
              default: () => <div
                className={[
                  style.Container,
                  isCurrentOperatingObject.value ? style.SelectedHighlighted : ''
                ].filter(Boolean).join(' ')}
                onClick={clickContainer}
                onMouseenter={handleMouseEnter}
                onMouseleave={handleMouseLeave}
              >
                {slots.default ? slots.default() : null}
              </div>
            }}
          </ElTooltip>
        </VueDraggable>
      );
    };

    const renderResult = computed(() => renderRootVnode());

    return () => renderResult.value;
  },
});

export default ComponentMaker;
