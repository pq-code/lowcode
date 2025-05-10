/**
 * 按钮组件物料描述
 */
import type { Material } from '@/core/material/types/MaterialTypes';

/**
 * 按钮组件物料描述
 */
export const material: Material = {
  type: 'button',  // 类型标识，必须唯一
  name: '按钮',    // 组件名称
  description: '用于触发操作的按钮组件', // 组件描述
  group: 'base',   // 分组：基础组件
  version: '1.0.0', // 版本号
  icon: 'el-icon-menu', // 图标
  tags: ['按钮', '交互', '表单'], // 标签
  
  // 属性配置
  props: {
    type: {
      type: 'enum',
      title: '类型',
      description: '按钮类型',
      default: 'primary',
      enum: ['primary', 'success', 'warning', 'danger', 'info', 'text']
    },
    size: {
      type: 'enum',
      title: '尺寸',
      description: '按钮尺寸',
      default: 'default',
      enum: ['large', 'default', 'small']
    },
    text: {
      type: 'string',
      title: '文本',
      description: '按钮文本内容',
      default: '按钮'
    },
    disabled: {
      type: 'boolean',
      title: '禁用',
      description: '是否禁用',
      default: false
    },
    round: {
      type: 'boolean',
      title: '圆角',
      description: '是否为圆角按钮',
      default: false
    },
    plain: {
      type: 'boolean',
      title: '朴素',
      description: '是否为朴素按钮',
      default: false
    }
  },
  
  // 事件配置
  events: [
    {
      name: 'click',
      description: '点击事件'
    }
  ],
  
  // 插槽配置
  slots: [
    {
      name: 'default',
      description: '按钮内容'
    },
    {
      name: 'icon',
      description: '图标内容'
    }
  ],
  
  // 组件来源
  source: {
    type: 'local',
    import: {
      path: '@/materials/base/Button',
      name: 'default'
    }
  },
  
  // 元数据
  createTime: new Date().toISOString(),
  updateTime: new Date().toISOString(),
  creator: 'system'
};

// 默认导出物料描述
export default material; 