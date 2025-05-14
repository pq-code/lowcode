import { defineComponent, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchMaterialGroups, createMaterialGroup } from '../services/materialService';
import type { MaterialGroup } from '../services/materialService';

export default defineComponent({
  name: 'MaterialGroups',
  setup() {
    const groups = ref<MaterialGroup[]>([]);
    const loading = ref(true);
    const dialogVisible = ref(false);
    
    const groupForm = ref({
      name: '',
      description: ''
    });
    
    // 加载分组列表
    const loadGroups = async () => {
      try {
        loading.value = true;
        groups.value = await fetchMaterialGroups();
        loading.value = false;
      } catch (error) {
        loading.value = false;
        ElMessage.error('加载分组数据失败');
        console.error('加载分组数据失败:', error);
      }
    };
    
    // 显示创建分组对话框
    const showCreateDialog = () => {
      groupForm.value = {
        name: '',
        description: ''
      };
      dialogVisible.value = true;
    };
    
    // 创建分组
    const handleCreateGroup = async () => {
      if (!groupForm.value.name) {
        ElMessage.warning('请输入分组名称');
        return;
      }
      
      try {
        const result = await createMaterialGroup(groupForm.value);
        if (result) {
          ElMessage.success('创建分组成功');
          dialogVisible.value = false;
          loadGroups(); // 重新加载分组列表
        }
      } catch (error) {
        ElMessage.error('创建分组失败');
        console.error('创建分组失败:', error);
      }
    };
    
    // 编辑分组
    const handleEditGroup = (group: MaterialGroup) => {
      ElMessage.info(`编辑分组: ${group.name}`);
      // 后续实现编辑逻辑
    };
    
    // 删除分组
    const handleDeleteGroup = (group: MaterialGroup) => {
      ElMessage.warning(`删除分组: ${group.name}`);
      // 后续实现删除逻辑
    };
    
    onMounted(() => {
      loadGroups();
    });
    
    return () => (
      <div class="material-groups-page">
        <div class="page-header">
          <h2>分组管理</h2>
          <div class="actions">
            <el-button type="primary" onClick={showCreateDialog}>
              <el-icon><i class="el-icon-plus"></i></el-icon>
              添加分组
            </el-button>
          </div>
        </div>
        
        {loading.value ? (
          <div class="loading-container">
            <el-skeleton loading={loading.value} animated rows={3} />
          </div>
        ) : groups.value.length === 0 ? (
          <el-empty description="暂无分组数据" />
        ) : (
          <el-table data={groups.value} border stripe>
            <el-table-column label="分组名称" prop="name" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="创建时间" width="180">
              {{
                default: ({ row }: { row: MaterialGroup }) => (
                  <span>{row.createTime ? new Date(row.createTime).toLocaleString() : '-'}</span>
                )
              }}
            </el-table-column>
            <el-table-column label="操作" width="180">
              {{
                default: ({ row }: { row: MaterialGroup }) => (
                  <div class="table-actions">
                    <el-button size="small" onClick={() => handleEditGroup(row)}>编辑</el-button>
                    <el-button size="small" type="danger" onClick={() => handleDeleteGroup(row)}>删除</el-button>
                  </div>
                )
              }}
            </el-table-column>
          </el-table>
        )}
        
        {/* 创建分组对话框 */}
        <el-dialog 
          v-model={dialogVisible.value}
          title="创建分组"
          width="500px"
        >
          <el-form model={groupForm.value} label-width="80px">
            <el-form-item label="分组名称" required>
              <el-input v-model={groupForm.value.name} placeholder="请输入分组名称" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input 
                v-model={groupForm.value.description} 
                type="textarea" 
                placeholder="请输入分组描述" 
              />
            </el-form-item>
          </el-form>
          <template v-slots={{
            footer: () => (
              <span class="dialog-footer">
                <el-button onClick={() => dialogVisible.value = false}>取消</el-button>
                <el-button type="primary" onClick={handleCreateGroup}>创建</el-button>
              </span>
            )
          }}></template>
        </el-dialog>
      </div>
    );
  }
}); 