// 定义jsx文件模块
declare module '*.jsx' {
  import { Component } from 'vue';
  const component: Component;
  export default component;
}

// 定义tsx文件模块
declare module '*.tsx' {
  import { Component } from 'vue';
  const component: Component;
  export default component;
} 