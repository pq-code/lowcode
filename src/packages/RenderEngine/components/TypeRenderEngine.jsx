import { defineAsyncComponent, h } from 'vue';
import { getMaterialByType } from '@/core/material/services/MaterialService';

/**
 * 组件渲染引擎 - 使用核心物料服务
 * @param {Object} item 组件描述对象 
 * @param {Array} children 子组件
 * @returns {VNode} 渲染结果
 */
export const TypeRenderEngine = (item, children) => {
  if (!item) {
    console.warn('TypeRenderEngine: 组件项为空');
    return null;
  }

  // 调试信息
  console.log('TypeRenderEngine item:', item);

  const { type } = item;
  
  if (!type) {
    console.warn('TypeRenderEngine: 组件类型未定义', item);
    return null;
  }
  
  // 从物料服务获取组件描述
  const material = getMaterialByType(type);
  
  // 如果组件未注册，显示错误提示
  if (!material) {
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
  
  // 处理子组件
  let childrenToRender = null;
  if (children && Array.isArray(children) && children.length > 0) {
    childrenToRender = children;
  } else if (item.children && Array.isArray(item.children) && item.children.length > 0) {
    // 如果有嵌套的子组件，递归渲染
    childrenToRender = item.children.map(child => 
      TypeRenderEngine(child, child.children)
    );
  }
  
  // 确保每个组件都有唯一的key
  if (!item.key) {
    item.key = `${type}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  // 如果没有props，从物料描述中获取默认props
  if (!item.props && material.props) {
    console.log('TypeRenderEngine: 使用默认props', material.props);
    
    // 创建默认props对象
    const defaultProps = {};
    Object.entries(material.props).forEach(([key, prop]) => {
      if (prop.default !== undefined) {
        defaultProps[key] = prop.default;
      }
    });
    
    item.props = defaultProps;
  }
  
  // 尝试动态导入组件
  try {
    // 1. 检查组件来源配置
    if (material.source) {
      // 本地组件导入
      if (material.source.type === 'local' && material.source.import) {
        const { path, name = 'default' } = material.source.import;
        
        // 创建异步组件
        const AsyncComponent = defineAsyncComponent({
          loader: () => {
            return import(/* @vite-ignore */ path).then(module => {
              // 根据导入配置获取组件
              return name === 'default' ? module.default : module[name];
            });
          },
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
        
        console.log('TypeRenderEngine: 渲染异步组件', type, item.props);
        
        return (
          <AsyncComponent 
            key={item.key} 
            {...item.props} 
            item={item}
          >
            {childrenToRender}
          </AsyncComponent>
        );
      }
      
      // 远程组件加载(未实现)
      if (material.source.type === 'remote' && material.source.remote) {
        return (
          <div style={{ 
            padding: '10px', 
            color: 'blue',
            border: '1px dashed blue',
            borderRadius: '4px'
          }}>
            远程组件暂不支持: {item.componentName || type}
          </div>
        );
      }
    }
    
    // 如果没有正确的组件配置，显示警告
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
  } catch (error) {
    console.error(`组件 ${type} 加载失败:`, error);
    return (
      <div style={{ 
        padding: '10px', 
        color: 'red',
        border: '1px dashed red',
        borderRadius: '4px',
        background: '#fff1f0'
      }}>
        组件 {item.componentName || type} 加载失败: {error.message}
      </div>
    );
  }
};
