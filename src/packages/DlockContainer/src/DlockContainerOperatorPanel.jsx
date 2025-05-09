import { defineComponent, ref, watch, onMounted } from "vue";
import CodeHighlight from "@renderer/packages/CodeHighlight/src/CodeHighlight.jsx";
import { humpToUnderline } from '@renderer/utils/index'
import {
  ElMenu,
  ElMenuItem,
  ElCollapse,
  ElCollapseItem,
  ElInput,
  ElSwitch,
  ElButton,
  ElSegmented,
  ElOption,
  ElSelect,
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
    const styleOptions = ref({
      // backgroundColor: '', // 背景颜色
      // borderColor: '',
      // borderStyle: ''
    });// 样式
    const CodeHighlightRef = ref();
    const draggingDraggingRRef = ref();

    const activeIndex = ref("1");
    const activeNames = ref(["1", "2", "3", "4", "5"]);

    const predefineColors = ref([
      "#ff4500",
      "#ff8c00",
      "#ffd700",
      "#90ee90",
      "#00ced1",
      "#1e90ff",
      "#c71585",
      "rgba(255, 69, 0, 0.68)",
      "rgb(255, 120, 0)",
      "hsv(51, 100, 98)",
      "hsva(120, 40, 94, 0.5)",
      "hsl(181, 100%, 37%)",
      "hsla(209, 100%, 56%, 0.73)",
      "#c7158577",
    ]);

    const cssCode = ref([
      // "position: absolute;",
      // "left: 209px;",
      // "top: 154px;",
      // "width: 161px;",
      // "height: 146px;",
      // "transform: rotate(0deg);",
      // "border-radius: 18px;",
      // "opacity: 1;",
      // "background: #D8D8D8;",
    ]);

    const handleChange = () => { };
    const handleSelect = (e) => {
      console.log(e);
      activeIndex.value = e;
    };

    const RenderEngine = () => { };
    const init = () => { };

    onMounted(() => {
      // 开启鼠标移动监听
      console.log(draggingDraggingRRef.value, CodeHighlightRef.value);
      draggingDraggingRRef.value.addEventListener("mouseleave", function () {
        CodeHighlightRef.value.uncheck();
      });
    });

    /**
     * 样式面板变化事件处理函数
     *
     * @returns 无返回值
     */
    const stylePanelChange = (key, e) => {
      let cssArray = []
      Object.keys(styleOptions.value).forEach(key => {
        if (styleOptions.value[key]) {
          cssArray.push(`${humpToUnderline(key)}: ${styleOptions.value[key]}`)
        }
      })
      cssCode.value = cssArray
    }

    const borderStyleList = ref([
      {
        borderDirection: 'all',
        borderStyle: '',
        borderWidth: '',
        borderColor: '',
      }
    ])

    const addBorder = () => {
      borderStyleList.value.push({
        borderDirection: '',
        borderStyle: '',
        borderWidth: '',
        borderColor: '',
      })
    }

    /**
     * 边框样式面板变化时触发的方法
     *
     * @returns 无返回值
     */
    const borderStylePanelChange = () => {
      let all = borderStyleList.value.find(item => item.borderDirection === 'all')
      if (all) {
        let border = `${all.borderStype} ${all.borderWidth} ${all.borderColor}`
        if (border.length > 10) {
          styleOptions.value.border = `${all.borderStype} ${all.borderWidth}px ${all.borderColor}`
        }
      } else {
        borderStyleList.value.forEach(item => {
          let border = `${item.borderStype} ${item.borderWidth} ${item.borderColor}`
          if (border.length > 10) {
            styleOptions.value[`border-${item.borderDirection}`] = `${item.borderStype} ${item.borderWidth}px ${item.borderColor}`
          }
        })
      }
      stylePanelChange()
    }
    // 组件面板
    const modulePanel = () => {
      return (
        <div>
          <ElCollapseItem title="布局">
            <div className="layout">
              <div className="layoutItem">
                <span className="layoutItem-title">水平</span>
                <ElSegmented
                  vModel={props.item.props.levelLayout}
                  size="small"
                  options={["左", "中", "右", "两端"]}
                />
              </div>
              <div className="layoutItem">
                <span className="layoutItem-title">垂直</span>
                <ElSegmented
                  vModel={props.item.props.verticalLayout}
                  size="small"
                  options={["左", "中", "右", "两端"]}
                />
              </div>
              <div className="layoutItem">
                <span className="layoutItem-title">内间距</span>
                <ElInput
                  vModel={props.item.props.style["padding"]}
                  size="small"
                />
              </div>
            </div>
          </ElCollapseItem>

          <ElCollapseItem title="宽高">
            <div className="layout">
              <div className="layoutItem">
                <span className="layoutItem-title">宽度</span>
                <div style={{ display: "flex" }}>
                  <ElInput
                    disabled
                    vModel={props.item.props.width}
                    size="small"
                  />
                  <ElSegmented
                    style={{ "margin-left": "10px" }}
                    vModel={props.item.props.width}
                    size="small"
                    options={["自适应"]}
                  />
                </div>
              </div>
              <div className="layoutItem">
                <span className="layoutItem-title">高度</span>
                <div style={{ display: "flex" }}>
                  <ElInput vModel={props.item.props.height} size="small" />
                  <ElSegmented
                    style={{ "margin-left": "10px" }}
                    vModel={props.item.props.height}
                    size="small"
                    options={["自适应"]}
                  />
                </div>
              </div>
            </div>
          </ElCollapseItem>

          <ElCollapseItem title="样式">
            <div className="layout">
              <div
                className="layoutItem"
                style={{
                  display: "flex",
                  "align-items": "flex-start",
                  "flex-direction": "column",
                }}
              >
                <span className="layoutItem-title">标题</span>
                <div
                  style={{
                    width: "100%",
                    display: "grid",
                    "grid-template-columns": "1fr",
                    "grid-row-gap": "10px",
                  }}
                >
                  <ElInput vModel={props.item.props.title} size="small" />
                  <span className="layoutItem-title">标题位置</span>
                  <ElSelect
                    vModel={props.item.props.spacing}
                    placeholder="请选择"
                    size="small"
                  >
                     {[{
                        value: 'left',
                        label: '靠左'
                      }, {
                        value: 'center',
                        label: '居中'
                      }, {
                        value: 'right',
                        label: '靠右'
                      }].map(option => (
                        <ElOption
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                  </ElSelect>
                  <div
                    style={{
                      display: "grid",
                      "grid-template-columns": "1fr 1fr",
                      "grid-column-gap": "10px",
                      "grid-row-gap": "10px",
                    }}
                  >
                     <span className="layoutItem-title">标题大小</span>
                    <ElInput vModel={props.item.props.titleSize} size="small" />
                    <span className="layoutItem-title">标题粗细</span>
                    <ElInput vModel={props.item.props.titleWeight} size="small" />
                  </div>
                </div>
              </div>
            </div>
          </ElCollapseItem>
        </div>
      );
    };
    // 样式面板
    const stylePanel = () => {
      return (
        <div>
          <ElCollapseItem title="样式">
            <div className="layout">
              <div
                className="layoutItem"
                style={{
                  display: "flex",
                  "align-items": "flex-start",
                  "flex-direction": "column",
                }}
              >
                <span className="layoutItem-title">填充</span>
                <ElInput
                  vModel={styleOptions.value.backgroundColor}
                  class="w-50 m-2"
                  placeholder=""
                  size="small"
                  disabled
                  v-slots={{
                    prepend: () => (
                      <ElColorPicker
                        vModel={styleOptions.value.backgroundColor}
                        onChange={stylePanelChange}
                        size="small"
                        show-alpha
                        predefine={predefineColors.value}
                      />
                    ),
                  }}
                />

              </div>

              <div
                className="layoutItem"
                style={{
                  display: "flex",
                  "align-items": "flex-start",
                  "flex-direction": "column",
                }}
              >
                <span className="layoutItem-title">图片填充</span>
                <ElInput
                  vModel={styleOptions.value.backgroundImage}
                  class="w-50 m-2"
                  placeholder=""
                  size="small"
                  onChange={stylePanelChange}
                  v-slots={{
                    prepend: () => (
                      <span style={{ margin: '0 5px' }}>url</span>
                    )
                  }}
                />
              </div>

              <div
                className="layoutItem"
                style={{
                  display: "flex",
                  "align-items": "flex-start",
                  "flex-direction": "column",
                }}
              >
                <div className="layoutItem-title">
                  <span>描边</span>
                  <ElButton text='primary' size="small">
                    <i className="iconfont icon-tianjia" onClick={addBorder}></i>
                  </ElButton>
                </div>
                {
                  borderStyleList.value.map(item => {
                    return (
                      <div className="layoutItem-row">
                        <ElSelect
                          style={{ width: "70px" }}
                          vModel={item.borderDirection}
                          placeholder="方向"
                          size="small"
                          onChange={borderStylePanelChange}
                        >
                          {[{
                            value: 'all',
                            label: '四边'
                          }, {
                            value: 'top',
                            label: '上边'
                          }, {
                            value: 'right',
                            label: '右边'
                          }, {
                            value: 'bottom',
                            label: '下边'
                          }, {
                            value: 'left',
                            label: '左边'
                          }].map(option => (
                            <ElOption
                              key={option.value}
                              label={option.label}
                              value={option.value}
                            />
                          ))}
                        </ElSelect>
                        <ElSelect
                          style={{ width: "60px" }}
                          vModel={item.borderStype}
                          placeholder="类型"
                          size="small"
                          onChange={borderStylePanelChange}
                        >
                          {[{
                            value: 'dotted',
                            label: '点线'
                          }, {
                            value: 'dashed',
                            label: '虚线'
                          }, {
                            value: 'solid',
                            label: '实线'
                          }, {
                            value: 'double',
                            label: '双实线'
                          }].map(option => (
                            <ElOption
                              key={option.value}
                              label={option.label}
                              value={option.value}
                            />
                          ))}
                        </ElSelect>
                        <ElInput style={{ width: "50px" }}
                          class="w-50 m-2"
                          placeholder="线宽"
                          size="small" vModel={item.borderWidth} ></ElInput>
                        <ElColorPicker
                          vModel={item.borderColor}
                          onChange={borderStylePanelChange}
                          size="small"
                          show-alpha
                          predefine={predefineColors.value}
                        />
                        <i className="iconfont icon-lajitong"></i>
                      </div>
                    )
                  })
                }
              </div>

              <div
                className="layoutItem"
                style={{
                  display: "flex",
                  "align-items": "flex-start",
                  "flex-direction": "column",
                }}
              >
                <span className="layoutItem-title">代码</span>
                <CodeHighlight
                  ref={CodeHighlightRef}
                  language="javascript"
                  code={cssCode.value}
                ></CodeHighlight>
              </div>
            </div>
          </ElCollapseItem>
        </div>
      );
    };
    // 高级面板
    const seniorPanel = () => {

    }

    return () => (
      <div className="draggingDraggingR">
        <ElMenu
          default-active={activeIndex.value}
          mode="horizontal"
          onSelect={handleSelect}
        >
          <ElMenuItem index="1" style={{ width: "33.3%" }}>
            组件
          </ElMenuItem>
          <ElMenuItem index="2" style={{ width: "33.3%" }}>
            样式
          </ElMenuItem>
          <ElMenuItem index="3" style={{ width: "33.3%" }}>
            高级
          </ElMenuItem>
        </ElMenu>
        <div className="draggingDraggingR-content">
          <div
            ref={draggingDraggingRRef}
            className="draggingDraggingR-content-list"
          >
            <ElCollapse vModel={activeNames.value} onChange={handleChange}>
              {activeIndex.value == "1" ? modulePanel() : activeIndex.value == "2" ? stylePanel() : seniorPanel()}
            </ElCollapse>
          </div>
        </div>
      </div>
    );
  },
});

export default DlockContainerOperatorPanel;
