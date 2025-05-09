// import { createPinia } from 'pinia'
// //导入持久化插件
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// const pinia = createPinia()
// pinia.use(piniaPluginPersistedstate)


import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()

store.use(piniaPluginPersistedstate)

export const setupStore = (app: App<Element>) => {
  app.use(store)
}

export { store }
export default store;
