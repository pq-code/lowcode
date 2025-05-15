import { ref, reactive, computed, type Ref } from 'vue';
import type { Material } from '../types';
import { 
  fetchMaterialsByGroup, 
  fetchMaterialDetail,
  deleteMaterial, 
  createMaterial as apiCreateMaterial,
  updateMaterial as apiUpdateMaterial,
  searchMaterials as apiSearchMaterials
} from '../services/materialService';
import { ElMessage } from 'element-plus';

export function useMaterials() {
  const materials: Ref<Material[]> = ref([]);
  const currentMaterial: Ref<Material | null> = ref(null);
  const loading = ref(false);
  
  // 缓存机制
  const materialCache = new Map<string, Material[]>();
  
  // 搜索和筛选条件
  const searchState = reactive({
    keyword: '',
    tags: [] as string[],
    groups: [] as string[],
    creator: '',
    isContainer: undefined as boolean | undefined,
  });
  
  // 可用的标签列表
  const availableTags = computed(() => {
    const tagSet = new Set<string>();
    materials.value.forEach(material => {
      if (material.tags) {
        material.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  });
  
  // 过滤后的物料
  const filteredMaterials = computed(() => {
    if (!searchState.keyword && !searchState.tags.length && !searchState.groups.length) {
      return materials.value;
    }
    
    return materials.value.filter(material => {
      // 关键词过滤
      const keywordMatch = !searchState.keyword || 
        material.name.toLowerCase().includes(searchState.keyword.toLowerCase()) || 
        material.description?.toLowerCase().includes(searchState.keyword.toLowerCase()) ||
        material.type.toLowerCase().includes(searchState.keyword.toLowerCase());
      
      // 标签过滤
      const tagMatch = !searchState.tags.length || 
        (material.tags && material.tags.some(tag => searchState.tags.includes(tag)));
      
      // 分组过滤
      const groupMatch = !searchState.groups.length || 
        searchState.groups.includes(material.group);
        
      return keywordMatch && tagMatch && groupMatch;
    });
  });
  
  // 加载物料列表
  const loadMaterials = async (groupId: string = 'all') => {
    try {
      loading.value = true;
      
      // 构建缓存键
      const cacheKey = `group_${groupId}_${searchState.keyword}_${searchState.tags.join(',')}_${searchState.groups.join(',')}`;
      
      // 检查缓存
      if (materialCache.has(cacheKey)) {
        materials.value = materialCache.get(cacheKey)!;
        loading.value = false;
        return;
      }
      
      // 根据搜索条件决定使用哪个API
      if (searchState.keyword || searchState.tags.length) {
        // 使用搜索API
        materials.value = await apiSearchMaterials(
          searchState.keyword,
          {
            groups: groupId === 'all' ? undefined : [groupId],
            tags: searchState.tags.length ? searchState.tags : undefined,
            creator: searchState.creator || undefined,
            isContainer: searchState.isContainer
          }
        );
      } else {
        // 直接获取分组物料
        materials.value = await fetchMaterialsByGroup(groupId);
      }
      
      // 更新缓存
      materialCache.set(cacheKey, materials.value);
      
    } catch (error) {
      console.error('加载物料数据失败:', error);
      ElMessage.error({
        message: '加载物料数据失败，请稍后重试',
        duration: 5000,
        showClose: true
      });
    } finally {
      loading.value = false;
    }
  };
  
  // 获取物料详情
  const getMaterialDetail = async (materialId: string) => {
    try {
      loading.value = true;
      const detail = await fetchMaterialDetail(materialId);
      currentMaterial.value = detail;
      return detail;
    } catch (error) {
      console.error('获取物料详情失败:', error);
      ElMessage.error({
        message: '获取物料详情失败，请稍后重试',
        duration: 5000,
        showClose: true
      });
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  // 创建物料
  const createMaterial = async (material: Partial<Material>) => {
    try {
      loading.value = true;
      const newMaterial = await apiCreateMaterial(material);
      materials.value.unshift(newMaterial);
      
      // 清除缓存，因为数据已更新
      materialCache.clear();
      
      ElMessage.success('创建物料成功');
      return newMaterial;
    } catch (error) {
      console.error('创建物料失败:', error);
      ElMessage.error({
        message: '创建物料失败，请稍后重试',
        duration: 5000,
        showClose: true
      });
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  // 更新物料
  const updateMaterial = async (materialId: string, material: Partial<Material>) => {
    try {
      loading.value = true;
      const updatedMaterial = await apiUpdateMaterial(materialId, material);
      const index = materials.value.findIndex(m => m.id === materialId);
      if (index !== -1) {
        materials.value[index] = updatedMaterial;
      }
      
      // 清除缓存，因为数据已更新
      materialCache.clear();
      
      ElMessage.success('更新物料成功');
      return updatedMaterial;
    } catch (error) {
      console.error('更新物料失败:', error);
      ElMessage.error({
        message: '更新物料失败，请稍后重试',
        duration: 5000,
        showClose: true
      });
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  // 删除物料
  const removeMaterial = async (materialId: string) => {
    try {
      loading.value = true;
      const result = await deleteMaterial(materialId);
      if (result.success) {
        materials.value = materials.value.filter(m => m.id !== materialId);
        
        // 清除缓存，因为数据已更新
        materialCache.clear();
        
        ElMessage.success(result.message || '删除成功');
        return true;
      } else {
        ElMessage.error(result.message || '删除失败');
        return false;
      }
    } catch (error) {
      console.error('删除物料失败:', error);
      ElMessage.error({
        message: '删除物料失败，请稍后重试',
        duration: 5000,
        showClose: true
      });
      return false;
    } finally {
      loading.value = false;
    }
  };
  
  // 搜索物料
  const searchMaterials = (groupId: string = 'all') => {
    loadMaterials(groupId);
  };
  
  // 重置搜索条件
  const resetSearch = () => {
    searchState.keyword = '';
    searchState.tags = [];
    searchState.groups = [];
    searchState.creator = '';
    searchState.isContainer = undefined;
    
    // 清除缓存
    materialCache.clear();
  };
  
  // 清除缓存
  const clearCache = () => {
    materialCache.clear();
  };
  
  return {
    materials,
    currentMaterial,
    loading,
    searchState,
    availableTags,
    filteredMaterials,
    loadMaterials,
    getMaterialDetail,
    createMaterial,
    updateMaterial,
    removeMaterial,
    searchMaterials,
    resetSearch,
    clearCache
  };
} 