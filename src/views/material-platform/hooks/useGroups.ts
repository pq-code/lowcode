import { ref, type Ref } from 'vue';
import type { MaterialGroup } from '../types';
import { fetchMaterialGroups, createMaterialGroup, updateMaterialGroup, deleteMaterialGroup } from '../services/materialService';
import { ElMessage } from 'element-plus';

export function useGroups() {
  const groups: Ref<MaterialGroup[]> = ref([]);
  const loading = ref(false);
  const currentGroup = ref<string>('all');
  
  // 缓存机制
  const groupsCache = ref<MaterialGroup[] | null>(null);

  // 加载分组列表
  const loadGroups = async () => {
    try {
      // 如果已有缓存数据，直接使用
      if (groupsCache.value) {
        groups.value = groupsCache.value;
        return;
      }
      
      loading.value = true;
      groups.value = await fetchMaterialGroups();
      
      // 更新缓存
      groupsCache.value = [...groups.value];
    } catch (error) {
      console.error('获取分组数据失败', error);
      ElMessage.error({
        message: '获取分组数据失败，请稍后重试',
        duration: 5000,
        showClose: true
      });
    } finally {
      loading.value = false;
    }
  };

  // 创建分组
  const createGroup = async (group: Partial<MaterialGroup>) => {
    try {
      if (!group.name) {
        ElMessage.warning('请输入分组名称');
        return null;
      }
      
      loading.value = true;
      const newGroup = await createMaterialGroup(group);
      groups.value.push(newGroup);
      
      // 更新缓存
      groupsCache.value = [...groups.value];
      
      ElMessage.success('创建分组成功');
      return newGroup;
    } catch (error) {
      console.error('创建分组失败', error);
      ElMessage.error({
        message: '创建分组失败，请稍后重试',
        duration: 5000,
        showClose: true
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  // 更新分组
  const updateGroup = async (groupId: string, group: Partial<MaterialGroup>) => {
    try {
      loading.value = true;
      const updatedGroup = await updateMaterialGroup(groupId, group);
      const index = groups.value.findIndex(g => g.id === groupId);
      if (index !== -1) {
        groups.value[index] = updatedGroup;
      }
      
      // 更新缓存
      groupsCache.value = [...groups.value];
      
      ElMessage.success('更新分组成功');
      return updatedGroup;
    } catch (error) {
      console.error('更新分组失败', error);
      ElMessage.error({
        message: '更新分组失败，请稍后重试',
        duration: 5000,
        showClose: true
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  // 删除分组
  const deleteGroup = async (groupId: string) => {
    try {
      loading.value = true;
      const result = await deleteMaterialGroup(groupId);
      if (result.success) {
        groups.value = groups.value.filter(g => g.id !== groupId);
        
        // 更新缓存
        groupsCache.value = [...groups.value];
        
        ElMessage.success('删除分组成功');
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除分组失败', error);
      ElMessage.error({
        message: '删除分组失败，请稍后重试',
        duration: 5000,
        showClose: true
      });
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 设置当前选中的分组
  const setCurrentGroup = (groupId: string) => {
    currentGroup.value = groupId;
  };
  
  // 清除缓存
  const clearCache = () => {
    groupsCache.value = null;
  };

  return {
    groups,
    loading,
    currentGroup,
    loadGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    setCurrentGroup,
    clearCache
  };
} 