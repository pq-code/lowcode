<template>
  <div class="group-management">
    <div class="header">
      <h2>物料分组管理</h2>
      <p class="description">管理物料分组，可以创建、编辑和删除分组，以便更好地组织物料。</p>
    </div>
    
    <div class="actions">
      <el-button type="primary" @click="showCreateDialog">
        <el-icon><Plus /></el-icon>
        创建分组
      </el-button>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索分组"
        clearable
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div v-if="loading" class="loading">
      <el-skeleton :rows="5" animated />
    </div>
    
    <el-empty v-else-if="filteredGroups.length === 0" description="暂无分组数据" />
    
    <el-table
      v-else
      :data="filteredGroups"
      border
      style="width: 100%"
      :default-sort="{ prop: 'createTime', order: 'descending' }"
    >
      <el-table-column prop="id" label="分组ID" width="180" />
      <el-table-column prop="name" label="分组名称" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column label="包含物料数量" align="center" width="120">
        <template #default="scope">
          <el-tag type="info">{{ scope.row.materialCount || 0 }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable width="180">
        <template #default="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="editGroup(scope.row)">编辑</el-button>
          <el-popconfirm
            title="确定删除此分组吗？"
            @confirm="deleteGroup(scope.row)"
          >
            <template #reference>
              <el-button 
                size="small" 
                type="danger" 
                :disabled="scope.row.materialCount > 0"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 创建/编辑分组对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分组' : '创建分组'"
      width="500px"
    >
      <el-form :model="groupForm" label-width="80px" ref="formRef">
        <el-form-item label="分组名称" prop="name" required>
          <el-input v-model="groupForm.name" placeholder="请输入分组名称" />
        </el-form-item>
        <el-form-item label="分组ID" prop="id" v-if="!isEdit">
          <el-input 
            v-model="groupForm.id" 
            placeholder="留空将自动生成" 
          />
          <div class="form-tip">分组ID只能包含字母、数字和连字符，且不能修改</div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="groupForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入分组描述" 
          />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="groupForm.order" :min="0" />
          <div class="form-tip">数字越小排序越靠前</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveGroup">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import { fetchMaterialGroups } from '../services/materialService';
import type { MaterialGroup } from '../services/materialService';

// 状态
const groups = ref<MaterialGroup[]>([]);
const loading = ref(true);
const searchKeyword = ref('');

// 对话框
const dialogVisible = ref(false);
const isEdit = ref(false);
const groupForm = ref({
  id: '',
  name: '',
  description: '',
  order: 0
});
const formRef = ref();

// 过滤分组
const filteredGroups = computed(() => {
  if (!searchKeyword.value) return groups.value;
  
  const keyword = searchKeyword.value.toLowerCase();
  return groups.value.filter(group => 
    group.name.toLowerCase().includes(keyword) || 
    (group.description && group.description.toLowerCase().includes(keyword))
  );
});

// 加载分组数据
const loadGroups = async () => {
  try {
    loading.value = true;
    const result = await fetchMaterialGroups();
    
    // 模拟添加物料数量
    groups.value = result.map(group => ({
      ...group,
      materialCount: Math.floor(Math.random() * 10)
    }));
    
    loading.value = false;
  } catch (error) {
    loading.value = false;
    ElMessage.error('加载分组数据失败');
    console.error('加载分组数据失败:', error);
  }
};

// 显示创建对话框
const showCreateDialog = () => {
  isEdit.value = false;
  groupForm.value = {
    id: '',
    name: '',
    description: '',
    order: 0
  };
  dialogVisible.value = true;
};

// 编辑分组
const editGroup = (group: MaterialGroup) => {
  isEdit.value = true;
  groupForm.value = { ...group };
  dialogVisible.value = true;
};

// 保存分组
const saveGroup = () => {
  if (!groupForm.value.name) {
    ElMessage.warning('请输入分组名称');
    return;
  }
  
  if (isEdit.value) {
    // 模拟更新分组
    const index = groups.value.findIndex(g => g.id === groupForm.value.id);
    if (index !== -1) {
      groups.value[index] = {
        ...groups.value[index],
        ...groupForm.value,
        updateTime: new Date().toISOString()
      };
      ElMessage.success('更新分组成功');
    }
  } else {
    // 模拟创建分组
    const newGroup = {
      ...groupForm.value,
      id: groupForm.value.id || `group_${Date.now()}`,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      materialCount: 0
    };
    
    groups.value.push(newGroup);
    ElMessage.success('创建分组成功');
  }
  
  dialogVisible.value = false;
};

// 删除分组
const deleteGroup = (group: MaterialGroup) => {
  // 模拟删除分组
  groups.value = groups.value.filter(g => g.id !== group.id);
  ElMessage.success('删除分组成功');
};

// 格式化时间
const formatTime = (time?: string) => {
  if (!time) return '';
  
  try {
    const date = new Date(time);
    return date.toLocaleString();
  } catch (e) {
    return '';
  }
};

// 生命周期钩子
onMounted(() => {
  loadGroups();
});
</script>

<style scoped lang="less">
.group-management {
  padding: 20px;
  
  .header {
    margin-bottom: 30px;
    
    h2 {
      margin: 0 0 10px;
    }
    
    .description {
      color: #606266;
      margin: 0;
    }
  }
  
  .actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    
    .search-input {
      width: 250px;
    }
  }
  
  .loading {
    padding: 40px 0;
  }
  
  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
  }
}
</style> 