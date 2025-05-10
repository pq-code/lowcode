<template>
  <div class="material-card">
    <div class="card-header">
      <div class="icon">
        <el-icon>
          <component :is="getIconComponent" />
        </el-icon>
      </div>
      <div class="title-area">
        <h3 class="title">{{ material.name }}</h3>
        <div class="version">v{{ material.version }}</div>
      </div>
      <div class="actions">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button type="text" size="small">
            <el-icon><More /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="preview">预览</el-dropdown-item>
              <el-dropdown-item command="edit">编辑</el-dropdown-item>
              <el-dropdown-item divided command="delete" class="text-danger">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    
    <div class="card-content">
      <p class="description">{{ material.description || '暂无描述' }}</p>
      
      <div class="meta">
        <div class="group">
          <el-tag size="small" effect="plain">{{ getGroupName }}</el-tag>
        </div>
        <div class="tags" v-if="material.tags && material.tags.length">
          <el-tag 
            v-for="tag in material.tags" 
            :key="tag" 
            size="small" 
            effect="light"
            class="tag"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </div>
    
    <div class="card-footer">
      <div class="info">
        <span class="time">{{ formatTime(material.createTime) }}</span>
      </div>
      <div class="buttons">
        <el-button size="small" @click="$emit('preview', material)">预览</el-button>
        <el-button type="primary" size="small" @click="$emit('edit', material)">编辑</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { More, Document, Menu } from '@element-plus/icons-vue';
import type { Material } from '../services/materialService';

const props = defineProps<{
  material: MaterialWithProps;
}>();

const emit = defineEmits<{
  (e: 'preview', material: Material): void;
  (e: 'edit', material: Material): void;
  (e: 'delete', material: Material): void;
}>();

// 获取图标组件
const getIconComponent = computed(() => {
  // 这里可以根据material.icon的值返回不同的图标组件
  // 目前简单实现，后续可以扩展
  return props.material.icon?.includes('menu') ? Menu : Document;
});

// 获取分组名称
const getGroupName = computed(() => {
  const groupMap: Record<string, string> = {
    'base': '基础组件',
    'layout': '布局组件',
    'form': '表单组件',
    'data': '数据组件',
    'feedback': '反馈组件'
  };
  
  return groupMap[props.material.group] || props.material.group;
});

// 格式化时间
const formatTime = (time?: string) => {
  if (!time) return '';
  
  try {
    const date = new Date(time);
    return date.toLocaleDateString();
  } catch (e) {
    return '';
  }
};

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'preview':
      emit('preview', props.material);
      break;
    case 'edit':
      emit('edit', props.material);
      break;
    case 'delete':
      emit('delete', props.material);
      break;
  }
};

// 扩展Material接口，确保包含props属性
interface MaterialWithProps extends Material {
  props?: Record<string, any>;
}
</script>

<style scoped lang="less">
.material-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
  
  .card-header {
    padding: 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    
    .icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: #f2f6fc;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: #409eff;
      font-size: 20px;
    }
    
    .title-area {
      flex: 1;
      overflow: hidden;
      
      .title {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        line-height: 1.4;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .version {
        font-size: 12px;
        color: #909399;
      }
    }
    
    .actions {
      margin-left: 8px;
    }
  }
  
  .card-content {
    padding: 16px;
    flex: 1;
    
    .description {
      margin: 0 0 16px;
      font-size: 14px;
      color: #606266;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      height: 42px;
    }
    
    .meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .group {
        margin-bottom: 8px;
      }
      
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        
        .tag {
          margin-right: 4px;
        }
      }
    }
  }
  
  .card-footer {
    padding: 12px 16px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .info {
      font-size: 12px;
      color: #909399;
    }
    
    .buttons {
      display: flex;
      gap: 8px;
    }
  }
}

.text-danger {
  color: #f56c6c;
}
</style> 