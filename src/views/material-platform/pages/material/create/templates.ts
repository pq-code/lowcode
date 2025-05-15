/**
 * 物料模板定义
 * 提供常用的组件模板给用户选择
 */

// 模板接口定义
export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  code: string;
  thumbnail?: string;
  materialInfo?: {
    name?: string;
    description?: string;
    version?: string;
    tags?: string[];
  };
}

// 基础Vue3 组件模板
const basicVue3Template = `<template>
  <div class="component-container">
    <h2>{{ title }}</h2>
    <div class="component-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Props定义
defineProps({
  title: {
    type: String,
    default: '组件标题'
  },
  theme: {
    type: String,
    default: 'light'
  }
});

// Emits定义
const emit = defineEmits(['update', 'change']);

// 响应式数据
const count = ref(0);

// 计算属性
const doubleCount = computed(() => count.value * 2);

// 方法
const increment = () => {
  count.value++;
  emit('update', count.value);
};

// 生命周期钩子
onMounted(() => {
  console.log('组件已挂载');
});
</script>

<style scoped>
.component-container {
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.component-content {
  margin-top: 16px;
}
</style>`;

// 数据表格模板
const dataTableTemplate = `<template>
  <div class="data-table-component">
    <div class="data-table-header">
      <h3>{{ title }}</h3>
      <div class="data-table-actions">
        <el-input 
          v-model="searchQuery" 
          placeholder="搜索..." 
          prefix-icon="el-icon-search"
          clearable
          @input="handleSearch"
        />
        <el-button type="primary" @click="$emit('add')">添加</el-button>
      </div>
    </div>
    
    <el-table
      :data="filteredData"
      border
      stripe
      :height="height"
      v-loading="loading"
    >
      <slot name="columns"></slot>
      
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="$emit('edit', row)">编辑</el-button>
          <el-button type="text" @click="$emit('delete', row)">删除</el-button>
          <slot name="actions" :row="row"></slot>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="data-table-pagination">
      <el-pagination
        v-if="showPagination"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: '数据表格'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  loading: {
    type: Boolean,
    default: false
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  remote: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['search', 'page-change', 'size-change', 'edit', 'delete', 'add']);

const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 根据搜索筛选数据
const filteredData = computed(() => {
  if (!searchQuery.value || props.remote) {
    return props.data;
  }
  
  const query = searchQuery.value.toLowerCase();
  return props.data.filter((item: any) => {
    return Object.values(item).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(query);
    });
  });
});

// 分页或搜索更新时
watch(
  () => filteredData.value,
  (newData) => {
    if (!props.remote) {
      total.value = newData.length;
    }
  },
  { immediate: true }
);

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
  if (props.remote) {
    emit('search', searchQuery.value);
  }
};

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  if (props.remote) {
    emit('page-change', page);
  }
};

// 处理每页数量变化
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  if (props.remote) {
    emit('size-change', size);
  }
};
</script>

<style scoped>
.data-table-component {
  width: 100%;
}

.data-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.data-table-header h3 {
  margin: 0;
}

.data-table-actions {
  display: flex;
  gap: 10px;
}

.data-table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>`;

// 表单组件模板
const formTemplate = `<template>
  <div class="dynamic-form">
    <h3 v-if="title" class="form-title">{{ title }}</h3>
    
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-width="labelWidth"
      :label-position="labelPosition"
    >
      <template v-for="(field, index) in fields" :key="index">
        <el-form-item
          :label="field.label"
          :prop="field.prop"
          :required="field.required"
        >
          <!-- 输入框 -->
          <el-input
            v-if="field.type === 'input'"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :clearable="field.clearable"
            :type="field.inputType || 'text'"
          />
          
          <!-- 选择器 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :clearable="field.clearable"
            :multiple="field.multiple"
          >
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="formData[field.prop]"
            :type="field.dateType || 'date'"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :clearable="field.clearable"
          />
          
          <!-- 单选框组 -->
          <el-radio-group
            v-else-if="field.type === 'radio'"
            v-model="formData[field.prop]"
            :disabled="field.disabled"
          >
            <el-radio
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
          
          <!-- 多选框组 -->
          <el-checkbox-group
            v-else-if="field.type === 'checkbox'"
            v-model="formData[field.prop]"
            :disabled="field.disabled"
          >
            <el-checkbox
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>
          
          <!-- 开关 -->
          <el-switch
            v-else-if="field.type === 'switch'"
            v-model="formData[field.prop]"
            :disabled="field.disabled"
          />
          
          <!-- 滑块 -->
          <el-slider
            v-else-if="field.type === 'slider'"
            v-model="formData[field.prop]"
            :disabled="field.disabled"
            :min="field.min"
            :max="field.max"
            :step="field.step"
          />
          
          <!-- 自定义组件插槽 -->
          <slot
            v-else-if="field.type === 'custom'"
            :name="'field-' + field.prop"
            :field="field"
            :value="formData[field.prop]"
            @update:value="val => formData[field.prop] = val"
          ></slot>
        </el-form-item>
      </template>
      
      <el-form-item v-if="showActions" class="form-actions">
        <slot name="actions">
          <el-button
            @click="handleReset"
            :disabled="submitting"
          >
            重置
          </el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
            :loading="submitting"
          >
            提交
          </el-button>
        </slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, toRefs, onMounted, defineExpose } from 'vue';
import type { FormInstance } from 'element-plus';

interface FormField {
  type: 'input' | 'select' | 'date' | 'radio' | 'checkbox' | 'switch' | 'slider' | 'custom';
  label: string;
  prop: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  options?: { label: string; value: any }[];
  inputType?: string;
  dateType?: string;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  rule?: Record<string, any>;
}

const props = defineProps({
  fields: {
    type: Array as () => FormField[],
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  labelWidth: {
    type: String,
    default: '100px'
  },
  labelPosition: {
    type: String,
    default: 'right'
  },
  title: {
    type: String,
    default: ''
  },
  submitting: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['submit', 'reset', 'update:modelValue']);

// 表单引用
const formRef = ref<FormInstance | null>(null);

// 表单数据
const formData = reactive({ ...props.modelValue });

// 监听外部modelValue变化
watch(() => props.modelValue, (newVal) => {
  Object.assign(formData, newVal);
}, { deep: true });

// 将内部formData变化同步到外部
watch(formData, (val) => {
  emit('update:modelValue', { ...val });
}, { deep: true });

// 表单提交
const handleSubmit = () => {
  if (!formRef.value) return;
  
  formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', { ...formData });
    }
  });
};

// 表单重置
const handleReset = () => {
  if (!formRef.value) return;
  
  formRef.value.resetFields();
  emit('reset');
};

// 表单校验
const validate = () => {
  if (!formRef.value) return Promise.reject('表单实例不存在');
  return formRef.value.validate();
};

// 暴露方法给父组件
defineExpose({
  validate,
  resetFields: () => formRef.value?.resetFields(),
  scrollToField: (prop: string) => formRef.value?.scrollToField(prop)
});
</script>

<style scoped>
.dynamic-form {
  width: 100%;
}

.form-title {
  margin-bottom: 24px;
  font-size: 18px;
  color: #303133;
}

.form-actions {
  margin-top: 24px;
  text-align: right;
}
</style>`;

// 模板列表
export const mockTemplates: TemplateItem[] = [
  {
    id: 'basic-component',
    name: '基础组件',
    description: '包含基本结构的Vue3组件模板，使用setup语法糖',
    tags: ['基础', 'Vue3', 'Setup'],
    code: basicVue3Template,
    materialInfo: {
      name: 'BasicComponent',
      description: '基础组件模板',
      version: '1.0.0',
      tags: ['基础', 'Vue3']
    }
  },
  {
    id: 'data-table',
    name: '数据表格',
    description: '用于展示数据列表的表格组件，支持搜索、分页、排序等功能',
    tags: ['表格', '数据', 'CRUD'],
    code: dataTableTemplate,
    materialInfo: {
      name: 'DataTable',
      description: '高级数据表格组件',
      version: '1.0.0',
      tags: ['数据', '表格', 'UI']
    }
  },
  {
    id: 'dynamic-form',
    name: '动态表单',
    description: '根据配置动态生成表单的组件，支持多种表单控件和验证',
    tags: ['表单', '动态', '配置化'],
    code: formTemplate,
    materialInfo: {
      name: 'DynamicForm',
      description: '动态生成表单的组件',
      version: '1.0.0',
      tags: ['表单', '配置']
    }
  }
]; 