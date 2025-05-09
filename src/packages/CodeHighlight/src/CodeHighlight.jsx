import { defineComponent, ref, watch, nextTick, defineExpose } from 'vue';
import "../style/index.less";

const CodeHighlight = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
    language: {
      type: String,
      default: () => ''
    },
    code: {
      type: Array,
      default: () => []
    }
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },

  setup(props, { emit }) {
    const id = 'code' + Number(Math.random() * 10000).toFixed(0);

    const selectedCodeIndex = ref()

    const selectedCode = (index) => {
      selectedCodeIndex.value = index
      navigator.clipboard.writeText(props.code[index])
          .then(() => {
          // 复制成功的逻辑
            ElMessage({ message: '复制成功', type: 'success' })
          })
          .catch((error) => {
          // 复制失败的逻辑
          console.error('复制失败：', error);
      });
    }
    // 取消选中
    const uncheck = () => {
      selectedCodeIndex.value = null
    }

    defineExpose({
      uncheck
    });

    return () => (
      <div className="codePiece">
        <highlightjs
          id={id}
          language={props.language}
          code={props.code.join("\n")}
        ></highlightjs>
        <div className='codeMaskLayer'>
          {
            props.code.map((e, index) => {
              return (
                <div
                  data-content={e}
                  className = {
                   ` codePiece-item ${index === selectedCodeIndex.value ? 'selected' : ''}`
                  }
                  key={index}
                  onClick={() => {
                    selectedCode(index)
                  }}
                >
                </div>
              );
            })
          }
        </div>
      </div>
    );
  },
});

export default CodeHighlight;
