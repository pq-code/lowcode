import { defineComponent, h, inject, computed, ref, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { ComponentNode } from '../material/types';
import type { ComponentWrapperOptions, DropPosition } from './types';
import type { RenderContext } from './render-engine';
import './styles/component-wrapper.css';

// 渲染引擎组件上下文键名
const RENDER_ENGINE_KEY = Symbol('render-engine');

export default defineComponent({
  name: 'ComponentWrapper',
  props: {
    /**
     * 组件节点数据
     */
    node: {
      type: Object as PropType<ComponentNode>,
      required: true
    },
    /**
     * 包装器配置
     */
    wrapperOptions: {
      type: Object as PropType<ComponentWrapperOptions>,
      default: () => ({})
    }
  },
  setup(props, { slots }) {
    // 获取渲染上下文
    const renderContext = inject<RenderContext>(RENDER_ENGINE_KEY);
    
    if (!renderContext) {
      console.error('ComponentWrapper 必须在 RenderEngine 内部使用');
      return () => h('div', { class: 'component-wrapper-error' }, '渲染上下文不存在');
    }
    
    // 组件包装器DOM引用
    const wrapperRef = ref<HTMLElement | null>(null);
    
    // 组件是否被选中
    const isSelected = computed(() => 
      props.wrapperOptions.selected || renderContext.selectedId === props.node.id
    );
    
    // 组件是否可选择
    const isSelectable = computed(() => 
      props.wrapperOptions.selectable !== undefined 
        ? props.wrapperOptions.selectable 
        : renderContext.options.selectable
    );
    
    // 是否显示占位符
    const showPlaceholder = computed(() => 
      props.wrapperOptions.showPlaceholder !== undefined
        ? props.wrapperOptions.showPlaceholder
        : renderContext.options.showPlaceholder
    );
    
    // 是否可拖拽
    const isDraggable = computed(() => 
      props.wrapperOptions.draggable !== undefined
        ? props.wrapperOptions.draggable
        : renderContext.options.draggable
    );
    
    // 是否可编辑
    const isEditable = computed(() => 
      props.wrapperOptions.editable !== undefined
        ? props.wrapperOptions.editable
        : renderContext.options.editable
    );
    
    // 是否显示轮廓
    const showOutline = computed(() => 
      props.wrapperOptions.showOutline !== undefined
        ? props.wrapperOptions.showOutline
        : renderContext.options.showOutline
    );
    
    // 组件层级
    const level = computed(() => props.wrapperOptions.level || 0);
    
    // 获取组件渲染配置
    const componentConfig = computed(() => {
      const config = renderContext.getComponent(props.node.componentType);
      return config;
    });
    
    // 包装器样式类
    const wrapperClasses = computed(() => {
      return {
        'component-wrapper': true,
        'component-wrapper--selected': isSelected.value,
        'component-wrapper--draggable': isDraggable.value,
        'component-wrapper--editable': isEditable.value,
        'component-wrapper--show-outline': showOutline.value,
        'component-wrapper--container': componentConfig.value?.componentMeta.isContainer,
        [`component-wrapper--level-${level.value}`]: true,
      };
    });
    
    // 拖拽处理
    const handleDragStart = (event: DragEvent) => {
      if (!isDraggable.value) return;
      
      // 设置拖拽数据
      event.dataTransfer?.setData('text/plain', JSON.stringify({
        nodeId: props.node.id,
        componentType: props.node.componentType
      }));
      
      // 触发拖拽开始事件
      renderContext.handleDragEvent({
        sourceNodeId: props.node.id,
        sourceComponentType: props.node.componentType,
        targetNodeId: '',
        position: null,
        event
      });
    };
    
    // 处理点击事件
    const handleClick = (event: MouseEvent) => {
      if (!isSelectable.value) return;
      
      // 阻止事件冒泡，防止多个嵌套组件同时被选中
      event.stopPropagation();
      
      // 选中当前组件
      renderContext.selectComponent(props.node.id);
    };
    
    // 处理拖拽进入
    const handleDragOver = (event: DragEvent) => {
      if (!componentConfig.value?.componentMeta.isContainer) return;
      
      // 阻止默认行为，允许放置
      event.preventDefault();
      
      // 计算拖拽位置
      const { top, height } = wrapperRef.value?.getBoundingClientRect() || { top: 0, height: 0 };
      const mouseY = event.clientY;
      const relativeY = mouseY - top;
      
      // 转换为DropPosition枚举
      let position: DropPosition | null;
      if (relativeY < height / 3) {
        position = 'before' as DropPosition;
      } else if (relativeY > (height * 2 / 3)) {
        position = 'after' as DropPosition;
      } else {
        position = 'inside' as DropPosition;
      }
      
      // 获取拖拽源
      const dragData = event.dataTransfer?.getData('text/plain');
      if (dragData) {
        try {
          const { nodeId, componentType } = JSON.parse(dragData);
          
          // 触发拖拽中事件
          renderContext.handleDragEvent({
            sourceNodeId: nodeId,
            sourceComponentType: componentType,
            targetNodeId: props.node.id,
            position,
            event
          });
        } catch (e) {
          console.error('拖拽数据解析失败', e);
        }
      }
    };
    
    // 处理拖拽放置
    const handleDrop = (event: DragEvent) => {
      if (!componentConfig.value?.componentMeta.isContainer) return;
      
      event.preventDefault();
      
      // 计算拖拽位置
      const { top, height } = wrapperRef.value?.getBoundingClientRect() || { top: 0, height: 0 };
      const mouseY = event.clientY;
      const relativeY = mouseY - top;
      
      // 转换为DropPosition枚举
      let position: DropPosition | null;
      if (relativeY < height / 3) {
        position = 'before' as DropPosition;
      } else if (relativeY > (height * 2 / 3)) {
        position = 'after' as DropPosition;
      } else {
        position = 'inside' as DropPosition;
      }
      
      // 获取拖拽源
      const dragData = event.dataTransfer?.getData('text/plain');
      if (dragData) {
        try {
          const { nodeId, componentType } = JSON.parse(dragData);
          
          // 触发放置事件
          renderContext.handleDragEvent({
            sourceNodeId: nodeId,
            sourceComponentType: componentType,
            targetNodeId: props.node.id,
            position,
            event,
            isFromPanel: !nodeId // 如果没有nodeId，说明是从面板拖拽过来的新组件
          });
        } catch (e) {
          console.error('拖拽数据解析失败', e);
        }
      }
    };
    
    // 处理拖拽结束
    const handleDragEnd = (event: DragEvent) => {
      if (!isDraggable.value) return;
      
      // 触发拖拽结束事件
      renderContext.handleDragEvent({
        sourceNodeId: props.node.id,
        sourceComponentType: props.node.componentType,
        targetNodeId: '',
        position: null,
        event
      });
    };
    
    onMounted(() => {
      // 组件初始化后的逻辑
    });
    
    // 渲染函数
    return () => {
      // 如果没有找到组件配置，显示错误信息
      if (!componentConfig.value) {
        return (
          <div class="component-wrapper component-wrapper--error">
            组件类型不存在: {props.node.componentType}
          </div>
        );
      }
      
      // 获取实际组件
      const Component = componentConfig.value.renderConfig.component;
      
      // 处理组件属性
      const componentProps = { ...props.node.props };
      
      // 处理事件处理器
      const eventHandlers: Record<string, (event: any) => void> = {};
      if (props.node.events) {
        Object.entries(props.node.events).forEach(([eventName, handlerCode]) => {
          const eventKey = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
          eventHandlers[eventKey] = (event: any) => {
            // 这里通常会执行代码或者调用全局函数
            console.log(`执行事件 ${eventName} 的处理器: ${handlerCode}`, event);
          };
        });
      }
      
      // 处理子组件
      const children = [];
      
      // 声明一个函数组件以便递归调用自身
      const SelfWrapper = defineComponent({
        name: 'SelfWrapper',
        props: {
          node: { type: Object as PropType<ComponentNode>, required: true },
          wrapperLevel: { type: Number, default: 0 }
        },
        setup(props) {
          return () => h(defineComponent as any, {
            name: 'ComponentWrapper',
            props: {
              node: props.node,
              wrapperOptions: {
                level: props.wrapperLevel
              }
            }
          });
        }
      });
      
      // 添加默认插槽内容
      if (props.node.children && props.node.children.length > 0) {
        children.push(
          ...props.node.children.map(child => h(SelfWrapper, {
            key: child.id,
            node: child,
            wrapperLevel: (level.value || 0) + 1
          }))
        );
      }
      
      // 添加命名插槽内容
      if (props.node.slots) {
        Object.entries(props.node.slots).forEach(([slotName, slotNodes]) => {
          if (slotNodes && slotNodes.length > 0) {
            const slotContent = slotNodes.map(slotNode => h(SelfWrapper, {
              key: slotNode.id,
              node: slotNode,
              wrapperLevel: (level.value || 0) + 1
            }));
            
            // 使用v-slots方式传递插槽内容
            if (slotName === 'default') {
              children.push(...slotContent);
            } else {
              // 将命名插槽添加到组件属性中
              componentProps.slots = componentProps.slots || {};
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              componentProps.slots[slotName] = slotContent;
            }
          }
        });
      }
      
      // 渲染实际组件
      const componentElement = h(
        Component,
        { ...componentProps, ...eventHandlers },
        children.length > 0 ? children : slots.default?.()
      );
      
      // 包装组件
      return h(
        'div',
        {
          ref: wrapperRef,
          class: wrapperClasses.value,
          onClick: handleClick,
          draggable: isDraggable.value,
          onDragstart: handleDragStart,
          onDragover: handleDragOver,
          onDrop: handleDrop,
          onDragend: handleDragEnd,
          'data-component-id': props.node.id,
          'data-component-type': props.node.componentType
        },
        [
          // 选中指示器
          isSelected.value && h('div', { class: 'component-wrapper__selected-indicator' }),
          
          // 占位符
          showPlaceholder.value && !children.length && !slots.default && 
            h('div', { class: 'component-wrapper__placeholder' }, 
              componentConfig.value.componentMeta.title || props.node.componentType
            ),
          
          // 实际组件
          h('div', { class: 'component-wrapper__content' }, [componentElement]),
          
          // 编辑工具栏
          isEditable.value && isSelected.value && h('div', { class: 'component-wrapper__toolbar' }, [
            h('button', { class: 'component-wrapper__toolbar-btn', title: '删除' }, '×'),
            h('button', { class: 'component-wrapper__toolbar-btn', title: '复制' }, '⎘'),
            h('button', { class: 'component-wrapper__toolbar-btn', title: '上移' }, '↑'),
            h('button', { class: 'component-wrapper__toolbar-btn', title: '下移' }, '↓')
          ])
        ].filter(Boolean)
      );
    };
  }
}); 