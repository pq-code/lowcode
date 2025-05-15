// 组件模板定义
export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  code: string;
  thumbnail?: string;
}

// 将原有模板数据保留
export const mockTemplates: TemplateItem[] = [
  {
    id: 'basic',
    name: '基础容器组件',
    description: '简单的容器组件，带标题和内容区',
    tags: ['基础', '容器'],
    thumbnail: '',
    code: `<template>
  <div class="component-container">
    <h3>{{ title }}</h3>
    <div class="component-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    default: '组件标题'
  }
});
</script>

<style scoped>
.component-container {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.component-content {
  margin-top: 12px;
}
</style>`
  },
  {
    id: 'form',
    name: '表单组件',
    description: '包含输入框和选择器的表单',
    tags: ['表单', 'UI'],
    thumbnail: '',
    code: `<template>
  <div class="form-component">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="formData.type" placeholder="请选择类型">
          <el-option label="类型1" value="type1" />
          <el-option label="类型2" value="type2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const formData = reactive({
  name: '',
  type: ''
});

const emit = defineEmits(['submit']);

const handleSubmit = () => {
  emit('submit', formData);
};
</script>`
  },
  {
    id: 'table',
    name: '表格组件',
    description: '数据表格，带有操作按钮',
    tags: ['表格', '数据', 'UI'],
    thumbnail: '',
    code: `<template>
  <div class="table-component">
    <div class="table-header">
      <h3>{{ title }}</h3>
      <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

defineProps({
  title: {
    type: String,
    default: '数据表格'
  }
});

const emit = defineEmits(['add', 'edit', 'delete']);

const tableData = ref([
  { id: 1, name: '示例数据1', date: '2023-05-01', status: '已完成' },
  { id: 2, name: '示例数据2', date: '2023-05-02', status: '进行中' }
]);

const handleAdd = () => {
  emit('add');
};

const handleEdit = (row) => {
  emit('edit', row);
};

const handleDelete = (row) => {
  emit('delete', row);
};
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>`
  },
  {
    id: 'card',
    name: '卡片组件',
    description: '展示信息的卡片组件',
    tags: ['卡片', 'UI'],
    thumbnail: '',
    code: `<template>
  <div class="card-component" :class="{ 'is-hoverable': hoverable }">
    <div class="card-header" v-if="title || $slots.header">
      <slot name="header">{{ title }}</slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  },
  hoverable: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.card-component {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
}

.card-component.is-hoverable:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 18px 20px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  font-weight: bold;
}

.card-body {
  padding: 20px;
}

.card-footer {
  padding: 18px 20px;
  border-top: 1px solid #ebeef5;
}
</style>`
  }
]; 