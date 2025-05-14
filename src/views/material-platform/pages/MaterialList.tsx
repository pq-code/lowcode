import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import MaterialCard from '../components/MaterialCard.vue';
import { fetchMaterialsByGroup, deleteMaterial, searchMaterials, batchDeleteMaterials, fetchMaterialGroups } from '../services/materialService';
import type { Material, MaterialGroup } from '../services/materialService';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { Search, Refresh, Delete, Upload, Plus } from '@element-plus/icons-vue';
import './MaterialList.css';

export default defineComponent({
  name: 'MaterialList',
  setup() {
    const router = useRouter();
    const materials = ref<Material[]>([]);
    const loading = ref(true);
    const currentGroup = ref('all');
    const viewMode = ref<'grid' | 'table'>('grid');
    const selectedMaterials = ref<string[]>([]);
    
    // 分组数据
    const groups = ref<MaterialGroup[]>([]);
    
    // 搜索和筛选条件
    const searchState = reactive({
      keyword: '',
      tags: [] as string[],
      groups: [] as string[],
      creator: '',
      isContainer: undefined as boolean | undefined,
      showFilter: false
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
    
    // 分组信息映射
    const groupNameMap = computed(() => {
      const map: Record<string, string> = {};
      groups.value.forEach(group => {
        map[group.id] = group.name;
      });
      return map;
    });
    
    // 加载分组数据
    const loadGroups = async () => {
      try {
        groups.value = await fetchMaterialGroups();
      } catch (error) {
        console.error('加载分组数据失败:', error);
        ElMessage.error('加载分组数据失败');
      }
    };
    
    // 加载物料列表
    const loadMaterials = async (groupId: string = 'all') => {
      try {
        loading.value = true;
        currentGroup.value = groupId;
        
        // 根据搜索条件决定使用哪个API
        if (searchState.keyword || searchState.tags.length) {
          // 使用搜索API
          materials.value = await searchMaterials(
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
        
        loading.value = false;
      } catch (error) {
        loading.value = false;
        ElMessage.error('加载物料数据失败');
        console.error('加载物料数据失败:', error);
      }
    };
    
    // 搜索物料
    const handleSearch = () => {
      loadMaterials(currentGroup.value);
    };
    
    // 重置搜索条件
    const resetSearch = () => {
      searchState.keyword = '';
      searchState.tags = [];
      searchState.groups = [];
      searchState.creator = '';
      searchState.isContainer = undefined;
      
      // 重新加载数据
      loadMaterials(currentGroup.value);
    };
    
    // 切换视图模式
    const toggleViewMode = () => {
      viewMode.value = viewMode.value === 'grid' ? 'table' : 'grid';
    };
    
    // 监听选中项变化
    watch(selectedMaterials, (newVal) => {
      console.log('选中的物料:', newVal);
    });
    
    // 选择所有物料
    const selectAllMaterials = () => {
      if (selectedMaterials.value.length === filteredMaterials.value.length) {
        // 全部取消选中
        selectedMaterials.value = [];
      } else {
        // 全部选中
        selectedMaterials.value = filteredMaterials.value.map(material => material.id);
      }
    };
    
    // 切换物料选中状态
    const toggleMaterialSelection = (materialId: string) => {
      const index = selectedMaterials.value.indexOf(materialId);
      if (index === -1) {
        selectedMaterials.value.push(materialId);
      } else {
        selectedMaterials.value.splice(index, 1);
      }
    };
    
    // 预览物料
    const previewMaterial = (material: Material) => {
      router.push(`/material-platform/detail/${material.id}`);
    };
    
    // 编辑物料
    const editMaterial = (material: Material) => {
      router.push(`/material-platform/edit/${material.id}`);
    };
    
    // 删除物料
    const deleteMaterialHandler = async (material: Material) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除物料 ${material.name} 吗？此操作不可恢复。`,
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );
        
        const result = await deleteMaterial(material.id);
        if (result.success) {
          ElMessage.success(result.message || '删除成功');
          // 重新加载列表
          await loadMaterials(currentGroup.value);
        } else {
          ElMessage.error(result.message || '删除失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除物料失败');
          console.error('删除物料失败:', error);
        }
      }
    };
    
    // 批量删除物料
    const batchDelete = async () => {
      if (selectedMaterials.value.length === 0) {
        ElMessage.warning('请先选择要删除的物料');
        return;
      }
      
      try {
        await ElMessageBox.confirm(
          `确定要删除已选中的 ${selectedMaterials.value.length} 个物料吗？此操作不可恢复。`,
          '批量删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );
        
        const loadingInstance = ElLoading.service({
          text: '正在删除...',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        
        try {
          const result = await batchDeleteMaterials(selectedMaterials.value);
          if (result.success) {
            ElMessage.success(result.message || `成功删除${result.count}个物料`);
            // 清空选中
            selectedMaterials.value = [];
            // 重新加载列表
            await loadMaterials(currentGroup.value);
          } else {
            ElMessage.error(result.message || '批量删除失败');
          }
        } finally {
          loadingInstance.close();
        }
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('批量删除失败');
          console.error('批量删除失败:', error);
        }
      }
    };
    
    // 新建物料
    const createMaterial = () => {
      router.push('/material-platform/create');
    };
    
    // 导入物料
    const importMaterials = () => {
      router.push('/material-platform/import');
    };
    
    // 根据分组筛选物料
    const filterByGroup = (groupId: string) => {
      currentGroup.value = groupId;
      loadMaterials(groupId);
    };
    
    onMounted(async () => {
      await loadGroups();
      await loadMaterials();
    });
    
    return () => (
      <div class="material-list-container">
        <div class="material-list-header">
          <div class="header-left">
            <h2 class="page-title">全部物料</h2>
          </div>
          <div class="header-right">
            <el-button type="primary" onClick={createMaterial}>
              <el-icon><Plus /></el-icon>
              新建物料
            </el-button>
            <el-button onClick={importMaterials}>
              <el-icon><Upload /></el-icon>
              导入物料
            </el-button>
          </div>
        </div>
        
        <div class="material-list-content">
          <div class="material-sidebar">
            <div class="material-categories">
              <div class="category-title">物料分组</div>
              <div class="category-list">
                <div 
                  class={['category-item', { active: currentGroup.value === 'all' }]}
                  onClick={() => filterByGroup('all')}
                >
                  <el-icon class="category-icon"><i class="el-icon-folder" /></el-icon>
                  <span class="category-name">全部物料</span>
                </div>
                {groups.value.map(group => (
                  <div 
                    key={group.id}
                    class={['category-item', { active: currentGroup.value === group.id }]}
                    onClick={() => filterByGroup(group.id)}
                  >
                    <el-icon class="category-icon"><i class="el-icon-folder" /></el-icon>
                    <span class="category-name">{group.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div class="material-main">
            <div class="material-toolbar">
              <div class="search-bar">
                <el-input
                  v-model={searchState.keyword}
                  placeholder="搜索物料名称、描述或类型"
                  clearable
                  class="search-input"
                  onKeyup={(e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                >
                  {{
                    prefix: () => <el-icon><Search /></el-icon>,
                    append: () => (
                      <el-button icon={Search} onClick={handleSearch}>
                        搜索
                      </el-button>
                    )
                  }}
                </el-input>
                
                <div class="filter-actions">
                  <el-button 
                    type={searchState.showFilter ? 'primary' : 'default'} 
                    onClick={() => searchState.showFilter = !searchState.showFilter}
                  >
                    高级筛选
                  </el-button>
                  <el-button icon={Refresh} onClick={resetSearch}>重置</el-button>
                  <el-button onClick={toggleViewMode}>
                    {viewMode.value === 'grid' ? '表格视图' : '网格视图'}
                  </el-button>
                </div>
              </div>
              
              {searchState.showFilter && (
                <div class="filter-panel">
                  <el-row gutter={20}>
                    <el-col span={8}>
                      <el-form-item label="标签">
                        <el-select 
                          v-model={searchState.tags} 
                          multiple 
                          placeholder="选择标签" 
                          style={{ width: '100%' }}
                        >
                          {availableTags.value.map(tag => (
                            <el-option key={tag} label={tag} value={tag} />
                          ))}
                        </el-select>
                      </el-form-item>
                    </el-col>
                    
                    <el-col span={8}>
                      <el-form-item label="分组">
                        <el-select 
                          v-model={searchState.groups} 
                          multiple 
                          placeholder="选择分组" 
                          style={{ width: '100%' }}
                        >
                          {groups.value.map(group => (
                            <el-option key={group.id} label={group.name} value={group.id} />
                          ))}
                        </el-select>
                      </el-form-item>
                    </el-col>
                    
                    <el-col span={8}>
                      <el-form-item label="创建者">
                        <el-input v-model={searchState.creator} placeholder="输入创建者" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  
                  <div class="filter-buttons">
                    <el-button type="primary" onClick={handleSearch}>应用筛选</el-button>
                    <el-button onClick={resetSearch}>重置</el-button>
                  </div>
                </div>
              )}
            </div>
            
            {selectedMaterials.value.length > 0 && (
              <div class="batch-actions">
                <el-alert
                  title="批量操作"
                  type="info"
                  show-icon
                  closable={false}
                >
                  <div class="batch-buttons">
                    <span>已选择 {selectedMaterials.value.length} 项</span>
                    <el-button type="danger" size="small" onClick={batchDelete}>
                      <el-icon><Delete /></el-icon>
                      批量删除
                    </el-button>
                    <el-button size="small" onClick={() => selectedMaterials.value = []}>
                      取消选择
                    </el-button>
                  </div>
                </el-alert>
              </div>
            )}
            
            {loading.value ? (
              <div class="loading-container">
                <el-skeleton loading={loading.value} animated rows={5} />
              </div>
            ) : filteredMaterials.value.length === 0 ? (
              <el-empty description="暂无物料数据" />
            ) : viewMode.value === 'grid' ? (
              <div class="materials-grid">
                {filteredMaterials.value.map(material => (
                  <div class="material-card-wrapper" key={material.id}>
                    <div class="material-selection">
                      <el-checkbox 
                        checked={selectedMaterials.value.includes(material.id)}
                        onChange={() => toggleMaterialSelection(material.id)}
                      />
                    </div>
                    <MaterialCard 
                      material={material}
                      onPreview={previewMaterial}
                      onEdit={editMaterial}
                      onDelete={deleteMaterialHandler}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div class="materials-table">
                <el-table
                  data={filteredMaterials.value}
                  border
                  style={{ width: '100%' }}
                  onSelectionChange={(selection: Material[]) => {
                    selectedMaterials.value = selection.map(item => item.id);
                  }}
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="name" label="名称" width="180" />
                  <el-table-column prop="type" label="类型" width="120" />
                  <el-table-column label="分组" width="120">
                    {{
                      default: ({ row }: { row: Material }) => (
                        <el-tag size="small" effect="plain">
                          {groupNameMap.value[row.group] || row.group}
                        </el-tag>
                      )
                    }}
                  </el-table-column>
                  <el-table-column prop="description" label="描述" show-overflow-tooltip />
                  <el-table-column label="标签" width="150">
                    {{
                      default: ({ row }: { row: Material }) => (
                        <div>
                          {row.tags?.map(tag => (
                            <el-tag key={tag} size="small" style={{ margin: '2px' }}>{tag}</el-tag>
                          ))}
                        </div>
                      )
                    }}
                  </el-table-column>
                  <el-table-column prop="version" label="版本" width="80" />
                  <el-table-column label="操作" width="200">
                    {{
                      default: ({ row }: { row: Material }) => (
                        <div>
                          <el-button 
                            size="small" 
                            onClick={() => previewMaterial(row)}
                          >
                            预览
                          </el-button>
                          <el-button 
                            type="primary" 
                            size="small" 
                            onClick={() => editMaterial(row)}
                          >
                            编辑
                          </el-button>
                          <el-button 
                            type="danger" 
                            size="small" 
                            onClick={() => deleteMaterialHandler(row)}
                          >
                            删除
                          </el-button>
                        </div>
                      )
                    }}
                  </el-table-column>
                </el-table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}); 