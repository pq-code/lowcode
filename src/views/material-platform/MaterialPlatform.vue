<template>
  <div class="material-platform">
    <el-container >
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
              @input="handleSearch"
            />
          </div>
          
          <el-menu 
            class="group-menu"
            :default-active="currentGroup"
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
          <router-view v-if="isRouterViewActive" />
          
          <!-- 默认展示物料卡片列表 -->
          <template v-else>
            <div class="materials-header">
              <h2>{{ getCurrentGroupName() }}</h2>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Plus, Folder, Files, Search, Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useGroups } from './hooks/useGroups';
import { useMaterials } from './hooks/useMaterials';
import type { Material } from './types';
import MaterialCard from './components/MaterialCard.vue';

// 路由
const router = useRouter();
const route = useRoute();

// 使用自定义钩子
const { 
  groups, 
  currentGroup, 
  loadGroups, 
  createGroup: apiCreateGroup 
} = useGroups();

const { 
  materials,
  filteredMaterials,
  loadMaterials,
  searchState,
  removeMaterial
} = useMaterials();

// 搜索关键词
const searchKey = ref('');

// 菜单激活状态
const activeMenu = computed(() => {
  return route.path;
});

const isRouterViewActive = computed(() => {
  // 只有当路径不是/material-platform/和/material-platform时才显示路由视图
  return route.path !== '/material-platform/' && route.path !== '/material-platform';
});

// 获取当前分组名称
const getCurrentGroupName = () => {
  if (currentGroup.value === 'all') {
    return '全部物料';
  }
  const group = groups.value.find(g => g.id === currentGroup.value);
  return group ? group.name : '全部物料';
};

// 监听路由变化，如果是根路径则重定向到materials
watch(() => route.path, (path) => {
  if (path === '/material-platform' || path === '/material-platform/') {
    router.push('/material-platform/materials');
  }
}, { immediate: true });

// 分组对话框
const createGroupDialogVisible = ref(false);
const groupForm = ref({
  name: '',
  description: ''
});

// 处理分组选择
const handleGroupSelect = (groupId: string) => {
  // 设置当前选中的分组
  currentGroup.value = groupId;
  // 加载该分组的物料
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
const createGroup = async () => {
  if (!groupForm.value.name) {
    ElMessage.warning('请输入分组名称');
    return;
  }
  
  const newGroup = await apiCreateGroup({
    name: groupForm.value.name,
    description: groupForm.value.description
  });
  
  if (newGroup) {
    createGroupDialogVisible.value = false;
  }
};

// 预览物料
const previewMaterial = (material: Material) => {
  router.push(`/material-platform/preview/${material.id}`);
};

// 编辑物料
const editMaterial = (material: Material) => {
  router.push(`/material-platform/edit/${material.id}`);
};

// 删除物料
const deleteMaterial = (material: Material) => {
  removeMaterial(material.id);
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

// 处理搜索
const handleSearch = () => {
  searchState.keyword = searchKey.value;
  loadMaterials(currentGroup.value);
};

// 生命周期钩子
onMounted(() => {
  loadGroups();
  loadMaterials('all');
});
</script>

<style scoped lang="less">
.material-platform {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
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
  padding: 0;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  
  .materials-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 20px;
    flex-shrink: 0;
    
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
    padding: 0 20px 20px 20px;
    overflow-y: auto;
  }
}

@media (max-width: 768px) {
  .material-platform {
    height: auto;
    min-height: 100vh;
  }
  
  .header {
    flex-direction: column;
    padding: 10px;
    height: auto !important;
    
    .logo {
      margin-bottom: 10px;
    }
    
    .nav {
      width: 100%;
      margin: 10px 0;
      
      .menu {
        width: 100%;
        justify-content: space-between;
      }
    }
    
    .actions {
      margin-top: 10px;
    }
  }
  
  .main-container {
    flex-direction: column;
    height: auto;
  }
  
  .sidebar {
    width: 100% !important;
    order: 1;
    border-right: none;
    border-bottom: 1px solid #e6e6e6;
  }
  
  .main-content {
    order: 2;
    padding: 15px;
    
    .materials-header {
      flex-direction: column;
      align-items: flex-start;
      
      h2 {
        margin-bottom: 10px;
      }
      
      .materials-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
    
    .materials-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 