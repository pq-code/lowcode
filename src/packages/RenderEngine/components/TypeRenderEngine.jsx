import { defineAsyncComponent, ref, h } from 'vue';
import { componentRegistry } from '@/components/materialArea/componentRegistry';

/**
 * 简化版组件渲染引擎 - 使用组件注册中心
 * @param {Object} item 组件描述对象 
 * @param {Array} children 子组件
 * @returns {VNode} 渲染结果
 */
export const TypeRenderEngine = (item, children) => {
  if (!item) {
    return null;
  }

  const { type } = item;
  
  // 从组件注册中心获取组件信息
  const registration = componentRegistry.getComponent(type);
  
  // 如果组件未注册，显示错误提示
  if (!registration) {
    console.warn(`未注册的组件类型: ${type}`);
    return (
      <div style={{ 
        padding: '10px', 
        color: '#999',
        border: '1px dashed #ccc',
        borderRadius: '4px'
      }}>
        未找到组件: {item.componentName || type}
      </div>
    );
  }
  
  // 1. 如果是内置组件，直接使用
  if (registration.component) {
    const Component = registration.component;
    return (
      <Component key={item.key} item={item}>
        {children || null}
      </Component>
    );
  }
  
  // 2. 如果有异步导入函数，创建异步组件
  if (registration.asyncImport) {
    const AsyncComponent = defineAsyncComponent({
      loader: registration.asyncImport,
      loadingComponent: () => (
        <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
          加载中...
        </div>
      ),
      errorComponent: (error) => (
        <div style={{ 
          padding: '10px', 
          color: 'red', 
          border: '1px dashed red',
          background: '#fff1f0' 
        }}>
          组件加载失败: {error?.message || '未知错误'}
        </div>
      ),
      delay: 200,
      timeout: 10000,
    });
    
    return (
      <AsyncComponent key={item.key} item={item}>
        {children || null}
      </AsyncComponent>
    );
  }
  
  // 如果既不是内置组件，又没有异步导入函数，显示警告
  console.warn(`组件 ${type} 配置不完整，缺少组件实现`);
  return (
    <div style={{ 
      padding: '10px', 
      color: 'orange',
      border: '1px dashed orange',
      borderRadius: '4px',
      background: '#fffbe6'
    }}>
      组件 {item.componentName || type} 配置不完整
    </div>
  );
};
