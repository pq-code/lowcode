import { defineComponent, ref, watch, onMounted, defineAsyncComponent, Suspense } from "vue";
import "../style/index.module.less";
import {
  ElCollapseItem,
} from "element-plus";

import PropsItem from "../components/PropsItem.jsx";

const DlockContainerOperatorPanel = defineComponent({
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
    const draggingDraggingRRef = ref()
    const activeIndex = ref() // teabel
    const activeNames = ref()
    const handleSelect = () => {
    }


    const component = (url) => {
      return defineAsyncComponent({
        loader: () => import(/* @vite-ignore */'../../../' + url),
        delay: 200,
      })
    }
    const modulePanel = (item) => {
      let itemProps = item?.props || {}
      let propsChildren = []
      Object.keys(itemProps).map((key) => {
        if (key.includes('Props')) {
          let AsyncComp = itemProps[key].component ? component(itemProps[key].component) : null
          propsChildren.push(
            <ElCollapseItem title={itemProps[key].title}>
              {itemProps[key].children ? <PropsItem item={itemProps[key].children}></PropsItem> : null}
              {itemProps[key].component ?
                <Suspense>
                  <AsyncComp item={props.item} ></AsyncComp>
                </Suspense>
                : null}
            </ElCollapseItem>
          )
        }
      })
      return (
        <div>
          {[propsChildren].filter(Boolean)}
        </div>
      )
    }
    const stylePanel = () => {
    }
    const handleChange = () => {
    }
    const seniorPanel = () => {
    }
    const TypeRender = (i) => {
      return modulePanel(props.item)
    }

    return () => (
      <div className="controlPanel" ref={draggingDraggingRRef.value}>
        <ElTabs
          vModel={activeIndex.value}
          mode="horizontal"
          onSelect={handleSelect}
        >
          {
            ['组件', '样式', '高级'].map((item, i) => {
              return (
                <ElTabPane label={item}>
                  {() => TypeRender(i)}
                </ElTabPane>
              )
            })
          }
        </ElTabs>
        <Suspense>
          <AsyncComp></AsyncComp>
        </Suspense>
      </div>
    );
  },
});

export default DlockContainerOperatorPanel;
