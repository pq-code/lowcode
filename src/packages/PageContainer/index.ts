// import "./assets/font/iconfont.css"
// import "./assets/css/base.less"
import PageContainer from "./src/PageContainer.jsx"
import type { App } from "vue";

PageContainer.install = function(Vue:App) {
  Vue.component(PageContainer.__name || 'PageContainer', PageContainer)
}

export default PageContainer
