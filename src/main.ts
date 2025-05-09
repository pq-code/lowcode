import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import './style.css'

const app = createApp(App)

// 注册路由
app.use(router)

// 注册Pinia状态管理
app.use(pinia)

// 挂载应用
app.mount('#app')
