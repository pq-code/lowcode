// import "./assets/font/iconfont.css"
import "./style/index.less"

import CreateCode from "./src/CreateCode.jsx"
import type { App } from "vue";

CreateCode.install = function(Vue:App) {
  Vue.component(CreateCode.__name || 'PageContainer', CreateCode)
}

export default CreateCode
