export const Input = {
  componentName: "输入框",
  type: "input",
  icon: "icon-bianji",
  group: "输入组件",
  npm: {
    exportName: "ElInput",
    package: "element-plus",
    component: "element-plus/lib/components/inut",
    destructuring: true,
  },
  props: {
    formItemProps: {
      primaryKey: "760",
      label: "表单项",
      size: "medium",
      device: "desktop",
      fullWidth: true,
      placeholder: "请输入"
    },
  },
  fnEvent: {
    onChange: {
      type: "function",
      value: "if(value > 10) {alert(value)}",
      parameter: ["value"],
    },
    onInput: {
      type: "function",
      value: "if(value > 10) {alert(value)}",
      parameter: ["value"],
    },
  }
}
