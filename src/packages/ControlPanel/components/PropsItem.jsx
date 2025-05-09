import { defineComponent, ref, watch, onMounted } from "vue";

// 引入CSS模块
import style from '../style/index.module.less';

import {
  ElInput,
} from "element-plus";


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
    const propsItemRef = ref(null);
    const TypeRender = (item) => {
      switch (item.type) {
        case "input":
          return (<ElInput size="small" vModel={item.value}
            v-slots={{
              append: item.rightText && (
                <span>{item.rightText}</span>
              )
            }}/>)
        case "segmented":
          return (<ElSegmented size="small" vModel={item.value} options={item.options} ></ElSegmented>)
        default:
          return <div>暂无该类型</div>;
      }
    }
    return () => (
      <div className={style.propsItem} ref={propsItemRef.value}>
        {props.item.map(e => <div className={e.label.length > 10 ? style.longPropsItemItem : e.longInput ? style.longPropsItemItem : style.shortPropsItemItem}>
          <span className={style.propsItemItemTitle}>{e.label}</span>
          {TypeRender(e)}
        </div>)}
      </div>
    );
  },
});

export default DlockContainerOperatorPanel;
