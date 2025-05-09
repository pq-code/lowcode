// import "./assets/font/iconfont.css"
// import "./assets/css/base.less"
import RenderEngine from "./src/RenderEngine.jsx"
import type { App } from "vue";

RenderEngine.install = function(Vue:App) {
  Vue.component(RenderEngine.__name || 'RenderEngine', RenderEngine)
}

export default RenderEngine
