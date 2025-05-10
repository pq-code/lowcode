<template>
  <div class="material-platform">
    <el-container>
      <!-- 头部导航 -->
      <el-header height="60px" class="header">
        <div class="logo">
          <h2>物料平台</h2>
        </div>
        <div class="nav">
          <el-menu 
            mode="horizontal" 
            :ellipsis="false"
            class="menu" 
            :router="true"
            :default-active="activeMenu"
          >
            <el-menu-item index="/material-platform/materials">物料管理</el-menu-item>
            <el-menu-item index="/material-platform/upload">组件上传</el-menu-item>
            <el-menu-item index="/material-platform/preview">组件预览</el-menu-item>
            <el-menu-item index="/material-platform/groups">分组管理</el-menu-item>
          </el-menu>
        </div>
        <div class="actions">
          <el-button @click="backToHome">返回首页</el-button>
        </div>
      </el-header>
      
      <!-- 主体内容 -->
      <el-container class="main-container">
        <!-- 左侧分组边栏 -->
        <el-aside width="240px" class="sidebar">
          <div class="sidebar-header">
            <h3>物料分组</h3>
            <el-button type="primary" size="small" @click="showCreateGroupDialog">
              <el-icon><Plus /></el-icon>
              新建分组
            </el-button>
          </div>
          
          <div class="search-box">
            <el-input 
              v-model="searchKey" 
              placeholder="搜索物料" 
              prefix-icon="Search"
              clearable
            />
          </div>
          
          <el-menu 
            class="group-menu"
            :default-active="activeGroup"
            @select="handleGroupSelect"
          >
            <el-menu-item index="all">
              <el-icon><Files /></el-icon>
              <span>全部物料</span>
            </el-menu-item>
            
            <el-menu-item v-for="group in groups" :key="group.id" :index="group.id">
              <el-icon><Folder /></el-icon>
              <span>{{ group.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        
        <!-- 右侧内容区 -->
        <el-main class="main-content">
          <router-view v-if="isRouterViewActive"></router-view>
          
          <!-- 默认展示物料卡片列表 -->
          <template v-else>
            <div class="materials-header">
              <h2>{{ currentGroupName || '全部物料' }}</h2>
              <div class="materials-actions">
                <el-button type="primary" @click="createMaterial">
                  <el-icon><Plus /></el-icon>
                  新建物料
                </el-button>
                <el-button type="success" @click="importMaterials">
                  <el-icon><Upload /></el-icon>
                  导入物料
                </el-button>
              </div>
            </div>
            
            <el-empty v-if="filteredMaterials.length === 0" description="暂无物料数据" />
            
            <!-- 物料卡片列表 -->
            <div v-else class="materials-grid">
              <material-card 
                v-for="material in filteredMaterials" 
                :key="material.id"
                :material="material"
                @preview="previewMaterial"
                @edit="editMaterial"
                @delete="deleteMaterial"
              />
            </div>
          </template>
        </el-main>
      </el-container>
    </el-container>
    
    <!-- 创建分组对话框 -->
    <el-dialog
      v-model="createGroupDialogVisible"
      title="创建分组"
      width="500px"
    >
      <el-form :model="groupForm" label-width="80px">
        <el-form-item label="分组名称" required>
          <el-input v-model="groupForm.name" placeholder="请输入分组名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="groupForm.description" 
            type="textarea" 
            placeholder="请输入分组描述" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createGroupDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="createGroup">创建</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Plus, Folder, Files, Search, Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import MaterialCard from './components/MaterialCard.vue';
import { fetchMaterialGroups, fetchMaterialsByGroup } from './services/materialService';

// 路由
const router = useRouter();
const route = useRoute();

// 分组和物料数据
const groups = ref<any[]>([]);
const materials = ref<any[]>([]);
const searchKey = ref('');
const activeGroup = ref('all');
const currentGroupName = ref('');
const isRouterViewActive = computed(() => route.path !== '/material-platform');

// 分组对话框
const createGroupDialogVisible = ref(false);
const groupForm = ref({
  name: '',
  description: ''
});

// 菜单激活状态
const activeMenu = computed(() => {
  return route.path;
});

// 获取分组数据
const loadGroups = async () => {
  try {
    // 这里将来会从API获取，现在使用模拟数据
    // const response = await fetchMaterialGroups();
    groups.value = [
      { id: 'base', name: '基础组件' },
      { id: 'layout', name: '布局组件' },
      { id: 'form', name: '表单组件' },
      { id: 'data', name: '数据组件' },
      { id: 'feedback', name: '反馈组件' }
    ];
  } catch (error) {
    console.error('获取分组数据失败', error);
    ElMessage.error('获取分组数据失败');
  }
};

// 获取物料数据
const loadMaterials = async (groupId: string = 'all') => {
  try {
    // 这里将来会从API获取，现在使用模拟数据
    // const response = await fetchMaterialsByGroup(groupId);
    materials.value = groupId === 'all' 
      ? Array(10).fill(null).map((_, i) => ({
          id: `material_${i}`,
          type: `component_${i}`,
          name: `示例物料 ${i+1}`,
          description: '这是一个示例物料描述',
          icon: 'el-icon-menu',
          version: '1.0.0',
          createTime: new Date().toISOString(),
          group: Math.random() > 0.5 ? 'base' : 'layout'
        }))
      : Array(5).fill(null).map((_, i) => ({
          id: `material_${groupId}_${i}`,
          type: `component_${i}`,
          name: `${groupId} 物料 ${i+1}`,
          description: `这是一个${groupId}分组的物料`,
          icon: 'el-icon-document',
          version: '1.0.0',
          createTime: new Date().toISOString(),
          group: groupId
        }));
      
    if (groupId !== 'all') {
      const currentGroup = groups.value.find(g => g.id === groupId);
      currentGroupName.value = currentGroup ? currentGroup.name : '';
    } else {
      currentGroupName.value = '';
    }
  } catch (error) {
    console.error('获取物料数据失败', error);
    ElMessage.error('获取物料数据失败');
  }
};

// 过滤物料
const filteredMaterials = computed(() => {
  if (!searchKey.value) return materials.value;
  
  return materials.value.filter(material => 
    material.name.toLowerCase().includes(searchKey.value.toLowerCase()) ||
    material.description.toLowerCase().includes(searchKey.value.toLowerCase())
  );
});

// 处理分组选择
const handleGroupSelect = (groupId: string) => {
  activeGroup.value = groupId;
  loadMaterials(groupId);
};

// 显示创建分组对话框
const showCreateGroupDialog = () => {
  groupForm.value = {
    name: '',
    description: ''
  };
  createGroupDialogVisible.value = true;
};

// 创建分组
const createGroup = () => {
  if (!groupForm.value.name) {
    ElMessage.warning('请输入分组名称');
    return;
  }
  
  // 模拟创建成功
  const newGroup = {
    id: `group_${Date.now()}`,
    name: groupForm.value.name,
    description: groupForm.value.description
  };
  
  groups.value.push(newGroup);
  createGroupDialogVisible.value = false;
  ElMessage.success('创建分组成功');
};

// 预览物料
const previewMaterial = (material: any) => {
  router.push(`/material-platform/preview/${material.id}`);
};

// 编辑物料
const editMaterial = (material: any) => {
  router.push(`/material-platform/edit/${material.id}`);
};

// 删除物料
const deleteMaterial = (material: any) => {
  ElMessage.success(`删除成功: ${material.name}`);
  materials.value = materials.value.filter(item => item.id !== material.id);
};

// 创建物料
const createMaterial = () => {
  router.push('/material-platform/create');
};

// 导入物料
const importMaterials = () => {
  router.push('/material-platform/import');
};

// 返回首页
const backToHome = () => {
  router.push('/');
};

// 生命周期钩子
onMounted(() => {
  loadGroups();
  loadMaterials();
});
</script>

<style scoped lang="less">
.material-platform {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  
  .logo {
    h2 {
      margin: 0;
      color: #409eff;
    }
  }
  
  .nav {
    flex: 1;
    display: flex;
    justify-content: center;
    
    .menu {
      border-bottom: none;
    }
  }
}

.main-container {
  flex: 1;
  height: calc(100vh - 60px);
}

.sidebar {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  padding: 0;
  
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e6e6e6;
    
    h3 {
      margin: 0;
      font-size: 16px;
    }
  }
  
  .search-box {
    padding: 16px;
  }
  
  .group-menu {
    border-right: none;
  }
}

.main-content {
  padding: 20px;
  background-color: #f5f7fa;
  
  .materials-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
    }
    
    .materials-actions {
      display: flex;
      gap: 10px;
    }
  }
  
  .materials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100% !important;
  }
  
  .main-container {
    flex-direction: column;
  }
}
</style> 