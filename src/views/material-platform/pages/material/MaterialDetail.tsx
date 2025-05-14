import { defineComponent, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { fetchMaterialDetail, deleteMaterial } from '../../services/materialService';
import type { Material } from '../../services/materialService';

export default defineComponent({
  name: 'MaterialDetail',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(true);
    const materialDetail = ref<Material | null>(null);
    
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
        materialDetail.value = detail;
        
        if (!detail) {
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
    
    // 编辑物料
    const handleEdit = () => {
      if (materialDetail.value) {
        router.push(`/material-platform/edit/${materialDetail.value.id}`);
      }
    };
    
    // 删除物料
    const handleDelete = async () => {
      if (!materialDetail.value) return;
      
      try {
        await ElMessageBox.confirm(
          `确定要删除物料 ${materialDetail.value.name} 吗？此操作不可恢复。`,
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );
        
        const result = await deleteMaterial(materialDetail.value.id);
        if (result.success) {
          ElMessage.success(result.message || '删除成功');
          router.push('/material-platform/materials');
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
    
    // 返回列表
    const goBack = () => {
      router.push('/material-platform/materials');
    };
    
    onMounted(() => {
      loadMaterialDetail();
    });
    
    return () => (
      <div class="material-detail-page">
        <div class="page-header">
          <h2>物料详情</h2>
          <div class="actions">
            <el-button onClick={goBack}>返回列表</el-button>
            <el-button type="primary" onClick={handleEdit}>编辑</el-button>
            <el-button type="danger" onClick={handleDelete}>删除</el-button>
          </div>
        </div>
        
        {loading.value ? (
          <div class="loading-container">
            <el-skeleton loading={loading.value} animated rows={10} />
          </div>
        ) : materialDetail.value ? (
          <el-card class="detail-card">
            <div class="detail-header">
              <div class="icon">
                <el-icon>
                  <i class={materialDetail.value.icon}></i>
                </el-icon>
              </div>
              <div class="title-area">
                <h2 class="title">{materialDetail.value.name}</h2>
                <div class="version">版本: {materialDetail.value.version}</div>
              </div>
            </div>
            
            <el-divider />
            
            <div class="detail-content">
              <el-descriptions border column={2}>
                <el-descriptions-item label="物料ID" span={2}>
                  {materialDetail.value.id}
                </el-descriptions-item>
                <el-descriptions-item label="物料类型">
                  {materialDetail.value.type}
                </el-descriptions-item>
                <el-descriptions-item label="分组">
                  <el-tag size="small" effect="plain">{materialDetail.value.group}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">
                  {materialDetail.value.createTime ? new Date(materialDetail.value.createTime).toLocaleString() : '-'}
                </el-descriptions-item>
                <el-descriptions-item label="更新时间">
                  {materialDetail.value.updateTime ? new Date(materialDetail.value.updateTime).toLocaleString() : '-'}
                </el-descriptions-item>
                <el-descriptions-item label="创建者">
                  {materialDetail.value.creator || '-'}
                </el-descriptions-item>
                <el-descriptions-item label="标签" span={2}>
                  <div class="tags-container">
                    {materialDetail.value.tags && materialDetail.value.tags.length > 0 ? (
                      materialDetail.value.tags.map(tag => (
                        <el-tag key={tag} size="small" class="tag">{tag}</el-tag>
                      ))
                    ) : (
                      <span class="no-data">暂无标签</span>
                    )}
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="描述" span={2}>
                  {materialDetail.value.description || '暂无描述'}
                </el-descriptions-item>
              </el-descriptions>
              
              <div class="props-section">
                <h3>属性定义</h3>
                {materialDetail.value.props && Object.keys(materialDetail.value.props).length > 0 ? (
                  <el-table data={Object.entries(materialDetail.value.props).map(([key, value]) => ({ key, ...value }))}>
                    <el-table-column prop="key" label="属性名" width="150" />
                    <el-table-column prop="title" label="标题" width="150" />
                    <el-table-column prop="type" label="类型" width="100" />
                    <el-table-column prop="default" label="默认值" width="100" formatter={(row: Record<string, any>) => JSON.stringify(row.default) || '-'} />
                    <el-table-column label="可选值" formatter={(row: Record<string, any>) => row.enum ? JSON.stringify(row.enum) : '-'} />
                  </el-table>
                ) : (
                  <el-empty description="暂无属性定义" />
                )}
              </div>
              
              {materialDetail.value.source && (
                <div class="source-section">
                  <h3>源码信息</h3>
                  <el-descriptions border>
                    <el-descriptions-item label="类型">
                      {materialDetail.value.source.type}
                    </el-descriptions-item>
                    {materialDetail.value.source.import && (
                      <>
                        <el-descriptions-item label="导入路径">
                          {materialDetail.value.source.import.path}
                        </el-descriptions-item>
                        <el-descriptions-item label="导入名称">
                          {materialDetail.value.source.import.name || 'default'}
                        </el-descriptions-item>
                      </>
                    )}
                    {materialDetail.value.source.remote && (
                      <>
                        <el-descriptions-item label="远程URL">
                          {materialDetail.value.source.remote.url}
                        </el-descriptions-item>
                        <el-descriptions-item label="远程版本">
                          {materialDetail.value.source.remote.version || '-'}
                        </el-descriptions-item>
                      </>
                    )}
                  </el-descriptions>
                </div>
              )}
            </div>
          </el-card>
        ) : (
          <el-empty description="未找到物料数据" />
        )}
      </div>
    );
  }
}); 