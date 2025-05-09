
import type { App } from "vue";

// 导入组件
// import TypeRenderer from './TypeRenderer'
// import PageContainer from './PageContainer'
import Form from './Form'

// 存储组件列表
const components = [
    // TypeRenderer,
    // PageContainer,
    Form
]

const install = function (Vue: App) {
    // 遍历注册全局组件
    components.forEach((component: any)=> {
        Vue.component(component.__name || component.name, component);
    })
}

let windowObj = window as any

if (typeof windowObj !== 'undefined' && windowObj.Vue) {
    const vm = windowObj.Vue.createApp({})
    install(vm)
}

export default install

export {
    // TypeRenderer,
    // PageContainer,
    Form
}
