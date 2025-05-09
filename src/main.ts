import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './assets/iconfont/iconfont.css'
import './style.css'

const app = createApp(App)

// 注册路由
app.use(router)
// 注册Pinia状态管理
app.use(pinia)

app.use(ElementPlus, { locale: zhCn });
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }


// 挂载应用
app.mount('#app')
