import { defineComponent, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { importMaterials, fetchMaterialsByGroup } from '../../services/materialService';
import type { Material } from '../../services/materialService';

export default defineComponent({
  name: 'MaterialImport',
  setup() {
    const router = useRouter();
    const importContent = ref('');
    const remoteUrl = ref('');
    const submitting = ref(false);
    const fileList = ref<any[]>([]);
    const importType = ref('json'); // 'json', 'url', 'file'
    const validationErrors = ref<string[]>([]);
    const materialsToImport = ref<Partial<Material>[]>([]);
    const showPreview = ref(false);
    
    // 导入状态
    const importState = reactive({
      total: 0,
      processed: 0,
      success: 0,
      failed: 0,
      inProgress: false
    });
    
    // 解析导入内容
    const parseImportContent = (): Partial<Material>[] => {
      try {
        validationErrors.value = [];
        
        if (!importContent.value.trim()) {
          validationErrors.value.push('导入内容不能为空');
          return [];
        }
        
        const materials = JSON.parse(importContent.value);
        let materialsArr: Partial<Material>[] = [];
        
        if (Array.isArray(materials)) {
          materialsArr = materials;
        } else if (typeof materials === 'object') {
          // 可能是单个物料对象
          materialsArr = [materials];
        }
        
        // 验证必要字段
        materialsArr.forEach((material, index) => {
          if (!material.name) {
            validationErrors.value.push(`物料 ${index + 1}: 缺少名称字段`);
          }
          
          if (!material.type) {
            validationErrors.value.push(`物料 ${index + 1}: 缺少类型字段`);
          }
          
          if (!material.group) {
            validationErrors.value.push(`物料 ${index + 1}: 缺少分组字段`);
          }
        });
        
        return materialsArr;
      } catch (error) {
        console.error('解析导入内容失败:', error);
        validationErrors.value.push('JSON格式无效，请检查');
        return [];
      }
    };
    
    // 从URL获取物料数据
    const fetchFromUrl = async (): Promise<boolean> => {
      if (!remoteUrl.value.trim()) {
        validationErrors.value.push('请输入有效的URL');
        return false;
      }
      
      try {
        submitting.value = true;
        // 在实际环境中会使用真实的fetch请求
        // const response = await fetch(remoteUrl.value);
        // const data = await response.json();
        
        // 模拟从URL获取数据
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = Array(3).fill(null).map((_, i) => ({
          name: `URL导入物料 ${i+1}`,
          type: `url_component_${i}`,
          description: '从URL导入的物料',
          group: 'base',
          version: '1.0.0',
          props: {}
        }));
        
        importContent.value = JSON.stringify(mockData, null, 2);
        materialsToImport.value = mockData;
        
        submitting.value = false;
        return true;
      } catch (error) {
        submitting.value = false;
        console.error('从URL获取数据失败:', error);
        validationErrors.value.push('从URL获取数据失败，请检查URL是否正确');
        return false;
      }
    };
    
    // 验证物料
    const validateMaterials = async () => {
      // 清除原有的验证错误
      validationErrors.value = [];
      
      // 根据导入类型处理
      if (importType.value === 'url') {
        const success = await fetchFromUrl();
        if (success) {
          showPreview.value = true;
        }
      } else {
        const materials = parseImportContent();
        if (materials.length > 0 && validationErrors.value.length === 0) {
          materialsToImport.value = materials;
          showPreview.value = true;
        }
      }
      
      return validationErrors.value.length === 0;
    };
    
    // 检查物料是否已存在
    const checkExistingMaterials = async () => {
      try {
        // 获取现有物料列表
        const existingMaterials = await fetchMaterialsByGroup('all');
        const existingTypes = new Set(existingMaterials.map(m => m.type));
        
        // 检查是否有重复的类型
        const duplicates = materialsToImport.value.filter(m => existingTypes.has(m.type!));
        
        if (duplicates.length > 0) {
          const duplicateTypes = duplicates.map(m => m.type).join(', ');
          
          // 询问用户是覆盖还是跳过
          await ElMessageBox.confirm(
            `发现${duplicates.length}个类型已存在: ${duplicateTypes}。是否覆盖这些物料？`,
            '存在重复物料',
            {
              confirmButtonText: '覆盖',
              cancelButtonText: '跳过重复项',
              type: 'warning'
            }
          ).then(() => {
            // 用户选择覆盖，不需要额外处理
          }).catch(() => {
            // 用户选择跳过，过滤掉重复的物料
            materialsToImport.value = materialsToImport.value.filter(m => !existingTypes.has(m.type!));
          });
        }
        
        return true;
      } catch (error) {
        console.error('检查已存在物料失败:', error);
        ElMessage.error('检查已存在物料失败');
        return false;
      }
    };
    
    // 提交导入
    const submitImport = async () => {
      if (materialsToImport.value.length === 0) {
        const isValid = await validateMaterials();
        if (!isValid) return;
      }
      
      // 检查重复物料
      const canContinue = await checkExistingMaterials();
      if (!canContinue) return;
      
      // 如果没有物料可导入，显示警告
      if (materialsToImport.value.length === 0) {
        ElMessage.warning('没有可导入的物料数据');
        return;
      }
      
      try {
        submitting.value = true;
        importState.inProgress = true;
        importState.total = materialsToImport.value.length;
        importState.processed = 0;
        importState.success = 0;
        importState.failed = 0;
        
        // 模拟批量导入的进度显示
        for (let i = 0; i < materialsToImport.value.length; i++) {
          // 模拟处理时间
          await new Promise(resolve => setTimeout(resolve, 200));
          importState.processed++;
          
          // 模拟成功率
          if (Math.random() > 0.1) {
            importState.success++;
          } else {
            importState.failed++;
          }
        }
        
        // 实际导入
        const result = await importMaterials(materialsToImport.value);
        if (result.success) {
          ElMessage.success(result.message || `成功导入${result.count}个物料`);
          
          // 显示导入结果摘要
          await ElMessageBox.alert(
            `导入完成！\n总数: ${importState.total}\n成功: ${importState.success}\n失败: ${importState.failed}`,
            '导入结果',
            { confirmButtonText: '确定' }
          );
          
          router.push('/material-platform/materials');
        } else {
          ElMessage.error(result.message || '导入失败');
        }
      } catch (error) {
        ElMessage.error('导入物料失败');
        console.error('导入物料失败:', error);
      } finally {
        submitting.value = false;
        importState.inProgress = false;
      }
    };
    
    // 处理文件上传
    const handleFileChange = (file: any) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          importContent.value = e.target?.result as string || '';
          importType.value = 'json';
          // 重置之前的导入状态
          materialsToImport.value = [];
          showPreview.value = false;
        } catch (error) {
          ElMessage.error('读取文件失败');
          console.error('读取文件失败:', error);
        }
      };
      reader.readAsText(file.raw);
      return false; // 不自动上传
    };
    
    // 取消导入
    const cancelImport = () => {
      router.back();
    };
    
    // 重置导入表单
    const resetImport = () => {
      importContent.value = '';
      remoteUrl.value = '';
      fileList.value = [];
      validationErrors.value = [];
      materialsToImport.value = [];
      showPreview.value = false;
    };
    
    return () => (
      <div class="material-import-page">
        <div class="page-header">
          <h2>导入物料</h2>
        </div>
        
        <el-card class="import-card">
          {!showPreview.value ? (
            <>
              <div class="import-tip">
                <p>导入物料支持三种方式：</p>
                <el-radio-group v-model={importType.value}>
                  <el-radio-button label="json">JSON内容</el-radio-button>
                  <el-radio-button label="file">上传文件</el-radio-button>
                  <el-radio-button label="url">远程URL</el-radio-button>
                </el-radio-group>
                
                {importType.value === 'json' && (
                  <div class="json-format-example">
                    <p>物料JSON格式示例：</p>
                    <pre>
{`[
  {
    "name": "按钮组件",
    "type": "Button",
    "description": "基础按钮组件",
    "group": "base",
    "version": "1.0.0",
    "tags": ["按钮", "交互"],
    "props": {
      "type": {
        "type": "enum",
        "title": "类型",
        "default": "primary",
        "enum": ["primary", "success", "warning", "danger", "info"]
      }
    }
  }
]`}
                    </pre>
                  </div>
                )}
              </div>
              
              {importType.value === 'file' && (
                <div class="upload-section">
                  <el-upload
                    action=""
                    accept=".json"
                    auto-upload={false}
                    file-list={fileList.value}
                    on-change={handleFileChange}
                    limit={1}
                    drag
                  >
                    <el-icon class="el-icon-upload"></el-icon>
                    <div class="el-upload__text">拖拽文件到此处，或 <em>点击上传</em></div>
                    <template v-slots={{
                      tip: () => (
                        <div class="el-upload__tip">只能上传JSON文件</div>
                      )
                    }}></template>
                  </el-upload>
                </div>
              )}
              
              {importType.value === 'url' && (
                <div class="url-section">
                  <el-form>
                    <el-form-item label="远程URL">
                      <el-input 
                        v-model={remoteUrl.value} 
                        placeholder="请输入物料JSON的远程URL地址"
                      />
                      <div class="form-tip">URL必须返回符合物料格式的JSON数据</div>
                    </el-form-item>
                  </el-form>
                </div>
              )}
              
              {importType.value === 'json' && (
                <div class="content-section">
                  <div class="section-title">JSON内容：</div>
                  <el-input
                    v-model={importContent.value}
                    type="textarea"
                    rows={10}
                    placeholder="请输入JSON格式的物料数据"
                  />
                </div>
              )}
              
              {validationErrors.value.length > 0 && (
                <div class="validation-errors">
                  <el-alert
                    title="验证失败"
                    type="error"
                    description={
                      <ul>
                        {validationErrors.value.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                    show-icon
                    closable
                  />
                </div>
              )}
              
              <div class="actions">
                <el-button type="primary" onClick={validateMaterials}>验证并预览</el-button>
                <el-button onClick={resetImport}>重置</el-button>
                <el-button onClick={cancelImport}>取消</el-button>
              </div>
            </>
          ) : (
            <div class="preview-section">
              <h3>物料导入预览</h3>
              <p>以下{materialsToImport.value.length}个物料将被导入系统：</p>
              
              <el-table data={materialsToImport.value} border style={{ width: '100%' }}>
                <el-table-column prop="name" label="名称" width="160" />
                <el-table-column prop="type" label="类型" width="120" />
                <el-table-column prop="group" label="分组" width="100" />
                <el-table-column prop="version" label="版本" width="80" />
                <el-table-column prop="description" label="描述" />
                <el-table-column label="标签" width="150">
                  {{
                    default: ({ row }: { row: Partial<Material> }) => (
                      <div>
                        {row.tags?.map(tag => (
                          <el-tag key={tag} size="small" style={{ margin: '2px' }}>{tag}</el-tag>
                        ))}
                      </div>
                    )
                  }}
                </el-table-column>
              </el-table>
              
              {importState.inProgress && (
                <div class="import-progress">
                  <el-progress 
                    percentage={Math.floor((importState.processed / importState.total) * 100)}
                    format={() => `${importState.processed}/${importState.total}`}
                    status={importState.failed > 0 ? 'exception' : 'success'}
                  />
                  <div class="progress-stats">
                    <div>成功: {importState.success}</div>
                    <div>失败: {importState.failed}</div>
                  </div>
                </div>
              )}
              
              <div class="actions" style={{ marginTop: '20px' }}>
                <el-button 
                  type="primary" 
                  loading={submitting.value}
                  onClick={submitImport}
                  disabled={materialsToImport.value.length === 0}
                >
                  确认导入
                </el-button>
                <el-button onClick={() => showPreview.value = false}>返回编辑</el-button>
                <el-button onClick={cancelImport}>取消</el-button>
              </div>
            </div>
          )}
        </el-card>
      </div>
    );
  }
}); 