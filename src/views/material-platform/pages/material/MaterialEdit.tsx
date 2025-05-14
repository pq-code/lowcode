import { defineComponent, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchMaterialDetail, updateMaterial, fetchMaterialGroups } from '../../services/materialService';
import type { Material, MaterialGroup } from '../../services/materialService';

export default defineComponent({
  name: 'MaterialEdit',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(true);
    const submitting = ref(false);
    const groups = ref<MaterialGroup[]>([]);
    
    // 物料表单数据
    const materialForm = ref<Partial<Material>>({
      name: '',
      description: '',
      type: '',
      group: '',
      version: '',
      tags: [],
      icon: '',
      props: {}
    });
    
    // 获取物料详情
    const loadMaterialDetail = async () => {
      try {
        loading.value = true;
        const materialId = route.params.id as string;
        if (!materialId) {
          ElMessage.error('物料ID不能为空');
          return;
        }
        
        const detail = await fetchMaterialDetail(materialId);
        if (detail) {
          materialForm.value = { ...detail };
        } else {
          ElMessage.error('未找到物料数据');
          router.push('/material-platform/materials');
        }
      } catch (error) {
        ElMessage.error('获取物料详情失败');
        console.error('获取物料详情失败:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // 新标签输入
    const newTag = ref('');
    
    // 初始化分组数据
    const loadGroups = async () => {
      try {
        groups.value = await fetchMaterialGroups();
      } catch (error) {
        ElMessage.error('加载分组数据失败');
        console.error('加载分组数据失败:', error);
      }
    };
    
    // 添加标签
    const addTag = () => {
      if (!newTag.value) return;
      if (!materialForm.value.tags) {
        materialForm.value.tags = [];
      }
      if (!materialForm.value.tags.includes(newTag.value)) {
        materialForm.value.tags.push(newTag.value);
      }
      newTag.value = '';
    };
    
    // 移除标签
    const removeTag = (tag: string) => {
      if (materialForm.value.tags) {
        materialForm.value.tags = materialForm.value.tags.filter(t => t !== tag);
      }
    };
    
    // 提交表单
    const submitForm = async () => {
      // 表单验证
      if (!materialForm.value.name) {
        ElMessage.warning('请输入物料名称');
        return;
      }
      
      if (!materialForm.value.type) {
        ElMessage.warning('请输入物料类型');
        return;
      }
      
      const materialId = route.params.id as string;
      if (!materialId) {
        ElMessage.error('物料ID不能为空');
        return;
      }
      
      try {
        submitting.value = true;
        const result = await updateMaterial(materialId, materialForm.value);
        ElMessage.success(`更新物料 ${result.name} 成功`);
        router.push('/material-platform/materials');
      } catch (error) {
        ElMessage.error('更新物料失败');
        console.error('更新物料失败:', error);
      } finally {
        submitting.value = false;
      }
    };
    
    // 取消编辑
    const cancelEdit = () => {
      router.back();
    };
    
    onMounted(async () => {
      await Promise.all([loadGroups(), loadMaterialDetail()]);
    });
    
    return () => (
      <div class="material-edit-page">
        <div class="page-header">
          <h2>编辑物料</h2>
        </div>
        
        {loading.value ? (
          <div class="loading-container">
            <el-skeleton loading={loading.value} animated rows={10} />
          </div>
        ) : (
          <el-card class="form-card">
            <el-form 
              model={materialForm.value} 
              label-width="100px"
              label-position="right"
            >
              <el-form-item label="名称" required>
                <el-input v-model={materialForm.value.name} placeholder="请输入物料名称" />
              </el-form-item>
              
              <el-form-item label="类型" required>
                <el-input v-model={materialForm.value.type} placeholder="请输入物料类型，如Button" disabled />
                <div class="form-tip">物料类型作为组件的唯一标识，不可修改</div>
              </el-form-item>
              
              <el-form-item label="描述">
                <el-input 
                  v-model={materialForm.value.description} 
                  type="textarea" 
                  rows={3}
                  placeholder="请输入物料描述" 
                />
              </el-form-item>
              
              <el-form-item label="分组">
                <el-select v-model={materialForm.value.group} placeholder="请选择分组">
                  {groups.value.map(group => (
                    <el-option key={group.id} label={group.name} value={group.id} />
                  ))}
                </el-select>
              </el-form-item>
              
              <el-form-item label="版本">
                <el-input v-model={materialForm.value.version} placeholder="请输入版本号" />
              </el-form-item>
              
              <el-form-item label="标签">
                <div class="tags-input">
                  <el-input 
                    v-model={newTag.value} 
                    placeholder="输入标签后回车" 
                    onKeyup={(e: KeyboardEvent) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <el-button type="primary" onClick={addTag}>添加</el-button>
                </div>
                
                <div class="tags-container">
                  {materialForm.value.tags?.map(tag => (
                    <el-tag 
                      key={tag} 
                      closable 
                      onClose={() => removeTag(tag)}
                      style={{ marginRight: '8px', marginBottom: '8px' }}
                    >
                      {tag}
                    </el-tag>
                  ))}
                </div>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" loading={submitting.value} onClick={submitForm}>保存修改</el-button>
                <el-button onClick={cancelEdit}>取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        )}
      </div>
    );
  }
}); 