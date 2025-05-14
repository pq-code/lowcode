import { defineComponent, h, reactive, ref, computed, provide, watch, nextTick } from 'vue';
import type { PropType } from 'vue';
import type { ComponentNode, PageSchema } from '../material/types';
import type {
  MaterialComponentRegistry,
  EnhancedMaterialComponent,
  MaterialComponentRenderConfig
} from '../material/types/enhanced';
import type { RenderEngineOptions, ComponentDragEvent, DropPosition } from './types';
import { RenderEngineEvent, RenderMode } from './types';
import './styles/render-engine.css';

// 渲染引擎组件上下文键名
const RENDER_ENGINE_KEY = Symbol('render-engine');

/**
 * 渲染上下文
 */
export interface RenderContext {
  /** 渲染模式 */
  mode: RenderMode;
  /** 当前选中的组件ID */
  selectedId: string | null;
  /** 设置选中组件 */
  selectComponent: (id: string | null) => void;
  /** 渲染配置项 */
  options: RenderEngineOptions;
  /** 获取组件配置 */
  getComponent: (componentType: string) => MaterialComponentRegistry | null;
  /** 处理组件拖拽 */
  handleDragEvent: (event: ComponentDragEvent) => void;
}

/**
 * 渲染引擎实现
 */
export default defineComponent({
  name: 'RenderEngine',
  props: {
    /**
     * 页面架构数据
     */
    schema: {
      type: Object as PropType<PageSchema>,
      required: true,
    },
    /**
     * 渲染引擎配置
     */
    options: {
      type: Object as PropType<RenderEngineOptions>,
      default: () => ({}),
    },
    /**
     * 是否自动注册提供的组件
     */
    autoRegister: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    RenderEngineEvent.COMPONENT_SELECTED,
    RenderEngineEvent.DRAG_START,
    RenderEngineEvent.DRAG_OVER,
    RenderEngineEvent.DRAG_END,
    RenderEngineEvent.PROP_CHANGE,
    RenderEngineEvent.SCHEMA_CHANGE,
    RenderEngineEvent.COMPONENT_ADDED,
    RenderEngineEvent.COMPONENT_REMOVED,
    RenderEngineEvent.COMPONENT_MOVED,
  ],
  setup(props, { emit, slots, expose }) {
    // 组件注册表
    const componentRegistry = reactive<Record<string, MaterialComponentRegistry>>({});
    
    // 已加载的组件列表
    const loadedComponents = ref<string[]>([]);
    
    // 组件加载状态
    const loadingComponents = ref<Record<string, boolean>>({});
    
    // 组件加载错误
    const loadErrors = ref<Record<string, Error>>({});
    
    // 当前选中的组件ID
    const selectedComponentId = ref<string | null>(null);
    
    // 规范化配置
    const normalizedOptions = computed(() => {
      const mode = props.options.mode && Object.values(RenderMode).includes(props.options.mode as RenderMode) 
        ? props.options.mode as RenderMode 
        : RenderMode.PREVIEW;

      return {
        mode,
        editable: props.options.editable ?? false,
        showPlaceholder: props.options.showPlaceholder ?? true,
        draggable: props.options.draggable ?? false,
        selectable: props.options.selectable ?? true,
        showOutline: props.options.showOutline ?? true,
        componentMap: props.options.componentMap || {},
        propTransformers: props.options.propTransformers || {},
        eventHandlers: props.options.eventHandlers || {},
      } as RenderEngineOptions;
    });
    
    // 渲染上下文
    const renderContext = computed(() => {
      return {
        mode: normalizedOptions.value.mode,
        selectedId: selectedComponentId.value,
        selectComponent: (id: string | null) => {
          selectedComponentId.value = id;
          emit(RenderEngineEvent.COMPONENT_SELECTED, id);
        },
        options: normalizedOptions.value,
        getComponent: (componentType: string) => getComponent(componentType),
        handleDragEvent: (event: ComponentDragEvent) => handleDragEvent(event),
      } as RenderContext;
    });
    
    // 提供渲染上下文给子组件
    provide(RENDER_ENGINE_KEY, renderContext);
    
    /**
     * 注册组件
     * @param registry 组件注册信息
     */
    const registerComponent = (registry: MaterialComponentRegistry) => {
      if (!registry.componentMeta.componentId) {
        console.error('[RenderEngine] 组件注册失败：缺少组件ID');
        return;
      }
      
      componentRegistry[registry.componentMeta.componentId] = registry;
      
      // 如果有componentType也注册一份
      if (registry.componentMeta.type) {
        componentRegistry[registry.componentMeta.type] = registry;
      }
      
      console.log(`[RenderEngine] 组件注册成功: ${registry.componentMeta.name} (${registry.componentMeta.componentId})`);
    };
    
    /**
     * 批量注册组件
     * @param registries 组件注册信息列表
     */
    const registerComponents = (registries: MaterialComponentRegistry[]) => {
      registries.forEach(registry => registerComponent(registry));
    };
    
    /**
     * 移除组件注册
     * @param componentId 组件ID
     */
    const unregisterComponent = (componentId: string) => {
      if (componentRegistry[componentId]) {
        delete componentRegistry[componentId];
      }
    };
    
    /**
     * 获取组件注册信息
     * @param id 组件ID或类型
     */
    const getComponent = (id: string): MaterialComponentRegistry | null => {
      return componentRegistry[id] || null;
    };
    
    /**
     * 处理组件拖拽事件
     * @param event 拖拽事件
     */
    const handleDragEvent = (event: ComponentDragEvent) => {
      const { sourceNodeId, targetNodeId, position, isFromPanel, event: nativeEvent } = event;
      
      if (event.event.type === 'dragstart') {
        emit(RenderEngineEvent.DRAG_START, event);
      } else if (event.event.type === 'dragover') {
        emit(RenderEngineEvent.DRAG_OVER, event);
      } else if (event.event.type === 'dragend' || event.event.type === 'drop') {
        emit(RenderEngineEvent.DRAG_END, event);
        
        // 移动组件处理
        if (position && sourceNodeId && targetNodeId && !isFromPanel) {
          emit(RenderEngineEvent.COMPONENT_MOVED, {
            sourceNodeId,
            targetNodeId,
            position
          });
        }
        
        // 添加组件处理
        if (position && sourceNodeId && targetNodeId && isFromPanel) {
          emit(RenderEngineEvent.COMPONENT_ADDED, {
            sourceComponentType: event.sourceComponentType,
            targetNodeId,
            position
          });
        }
      }
    };
    
    /**
     * 处理属性变更
     * @param nodeId 节点ID
     * @param propName 属性名
     * @param propValue 属性值
     */
    const handlePropChange = (nodeId: string, propName: string, propValue: any) => {
      emit(RenderEngineEvent.PROP_CHANGE, {
        nodeId,
        propName,
        propValue
      });
    };
    
    /**
     * 检查并按需加载组件
     */
    const checkAndLoadComponents = () => {
      if (!props.schema || !props.schema.root) return;
      
      // 收集所有需要的组件类型
      const requiredComponentTypes = new Set<string>();
      const collectComponentTypes = (node: ComponentNode) => {
        requiredComponentTypes.add(node.componentType);
        // 处理子节点
        if (node.children && node.children.length > 0) {
          node.children.forEach(collectComponentTypes);
        }
        // 处理插槽内容
        if (node.slots) {
          Object.values(node.slots).forEach(slotNodes => {
            slotNodes.forEach(collectComponentTypes);
          });
        }
      };
      
      collectComponentTypes(props.schema.root);
      
      // 检查已注册的组件是否满足需求
      requiredComponentTypes.forEach(type => {
        // 如果类型在组件映射表中，但是还没有注册
        const componentMap = normalizedOptions.value.componentMap || {};
        if (
          componentMap[type] && 
          !componentRegistry[type] && 
          !loadingComponents.value[type]
        ) {
          // 标记为正在加载
          loadingComponents.value[type] = true;
          // 尝试加载组件
          try {
            const component = componentMap[type];
            if (component) {
              // 注册组件
              registerComponent({
                componentMeta: {
                  componentId: type,
                  name: type,
                  type: type,
                  category: 'basic',
                  title: type,
                  properties: []
                },
                renderConfig: {
                  componentId: type,
                  component: component
                }
              });
              // 标记为已加载
              loadedComponents.value.push(type);
            }
          } catch (error) {
            console.error(`[RenderEngine] 组件加载失败: ${type}`, error);
            loadErrors.value[type] = error as Error;
          } finally {
            loadingComponents.value[type] = false;
          }
        }
      });
    };
    
    // 观察并自动加载组件
    watch(
      () => [props.schema, props.options.componentMap],
      () => {
        if (props.autoRegister) {
          nextTick(() => {
            checkAndLoadComponents();
          });
        }
      },
      { immediate: true, deep: true }
    );
    
    // 暴露方法给父组件
    expose({
      registerComponent,
      registerComponents,
      unregisterComponent,
      getComponent,
      handlePropChange,
      selectComponent: (id: string | null) => renderContext.value.selectComponent(id)
    });
    
    return () => {
      if (!props.schema || !props.schema.root) {
        return slots.empty ? slots.empty() : h('div', { class: 'render-engine-empty' }, '没有可渲染的内容');
      }
      
      // 渲染根节点
      return h('div', { class: 'render-engine' }, [
        slots.before ? slots.before() : null,
        // 在这里渲染根组件
        // 这里只是一个框架，具体的渲染逻辑需要在ComponentWrapper中实现
        h('div', { class: 'render-engine-content' }, [
          // 这里应该调用renderNode方法渲染根节点
          props.schema.root.componentType && componentRegistry[props.schema.root.componentType]
            ? h('div', { class: 'render-node-container' }, [
                slots.default ? slots.default() : '渲染器已加载，请实现ComponentWrapper组件'
              ])
            : h('div', { class: 'render-engine-error' }, `无法找到组件: ${props.schema.root.componentType}`)
        ]),
        slots.after ? slots.after() : null
      ]);
    };
  }
}); 