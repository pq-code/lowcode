import Form from "@/packages/Form";
import { ElInput } from "element-plus";
import DlockContainer from '@/packages/DlockContainer/src/DlockContainer.jsx';
import { defineAsyncComponent, ref, h } from 'vue';

/**
 * 简化版组件加载器 - 基于组件描述对象规范化后的实现
 * @param {string} url 组件路径
 * @returns {Component} 异步组件
 */
const createComponentLoader = (url) => {
  // 移除可能的@/前缀，统一使用相对路径
  const relativePath = url.replace('@/', '../../../');
  
  return defineAsyncComponent({
    loader: async () => {
      try {
        console.log('加载组件:', relativePath);
        return await import(/* @vite-ignore */relativePath);
      } catch (error) {
        console.error(`组件加载失败: ${url}`, error);
        return {
          default: () => h('div', { 
            style: { 
              padding: '10px', 
              color: 'red', 
              border: '1px dashed red',
              background: '#fff1f0'
            } 
          }, `组件加载失败: ${error.message}`)
        };
      }
    },
    // 显示加载状态的占位组件
    loadingComponent: () => h('div', { 
      style: { padding: '10px', color: '#999', textAlign: 'center' } 
    }, '加载中...'),
    delay: 200,
    timeout: 10000,
    onError: (error) => {
      console.error('组件加载错误:', error);
    }
  });
};

// 内置组件映射表 - 减少动态导入带来的复杂性
const builtInComponents = {
  container: DlockContainer,
  Form: Form,
  input: ElInput
};

/**
 * 简化版组件渲染引擎
 * @param {Object} item 组件描述对象 
 * @param {Array} children 子组件
 * @returns {VNode} 渲染结果
 */
export const TypeRenderEngine = (item, children) => {
  if (!item) {
    return null;
  }

  // 返回结果组件
  let Component = null;

  // 1. 优先使用内置组件映射表
  if (item.type && builtInComponents[item.type]) {
    Component = builtInComponents[item.type];
    return (
      <Component key={item.key} item={item}>
        {children || null}
      </Component>
    );
  }
  
  // 2. 如果有npm.component配置，则使用动态导入
  if (item.npm?.component) {
    const AsyncComponent = createComponentLoader(item.npm.component);
    return (
      <AsyncComponent key={item.key} item={item}>
        {children || null}
      </AsyncComponent>
    );
  }
  
  // 3. 如果都没有匹配，返回一个占位组件
  return (
    <div style={{ 
      padding: '10px', 
      color: '#999',
      border: '1px dashed #ccc',
      borderRadius: '4px'
    }}>
      未找到组件: {item.componentName || item.type}
    </div>
  );
};
