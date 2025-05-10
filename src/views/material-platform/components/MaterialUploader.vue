<template>
  <div class="material-uploader">
    <div class="upload-header">
      <h2>上传物料组件</h2>
      <p class="description">
        上传Vue组件文件，系统将自动分析组件结构并生成物料描述，你也可以手动编辑描述信息。
      </p>
    </div>
    
    <el-steps :active="currentStep" finish-status="success" class="steps">
      <el-step title="上传组件" description="选择并上传组件文件" />
      <el-step title="分析组件" description="分析组件结构" />
      <el-step title="编辑描述" description="完善物料描述" />
      <el-step title="提交审核" description="等待审核并发布" />
    </el-steps>
    
    <!-- 步骤1: 上传组件 -->
    <div v-if="currentStep === 1" class="step-container">
      <el-upload
        class="upload-area"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :limit="1"
      >
        <el-icon class="upload-icon"><Upload /></el-icon>
        <div class="upload-text">拖拽文件到此处或 <em>点击上传</em></div>
        <template #tip>
          <div class="upload-tip">支持 .vue, .jsx, .tsx 格式的组件文件，单个文件不超过2MB</div>
        </template>
      </el-upload>
      
      <div v-if="uploadedFile" class="file-info">
        <h4>文件信息</h4>
        <p><strong>文件名:</strong> {{ uploadedFile.name }}</p>
        <p><strong>文件大小:</strong> {{ formatFileSize(uploadedFile.size) }}</p>
        <p><strong>文件类型:</strong> {{ uploadedFile.type || getFileExtension(uploadedFile.name) }}</p>
      </div>
      
      <div class="step-actions">
        <el-button type="primary" @click="nextStep" :disabled="!uploadedFile">下一步</el-button>
      </div>
    </div>
    
    <!-- 步骤2: 分析组件 -->
    <div v-else-if="currentStep === 2" class="step-container">
      <div class="analysis-container">
        <div v-if="analyzing" class="analyzing">
          <el-progress type="dashboard" :percentage="analysisProgress" />
          <div class="analysis-status">正在分析组件结构...</div>
        </div>
        
        <div v-else-if="analysisResult" class="analysis-result">
          <el-result icon="success" title="组件分析完成">
            <template #extra>
              <div class="analysis-summary">
                <h4>分析结果</h4>
                <div class="result-item">
                  <span class="label">识别组件类型:</span>
                  <span class="value">{{ analysisResult.type }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Properties:</span>
                  <span class="value">识别到 {{ Object.keys(analysisResult.props || {}).length }} 个属性</span>
                </div>
                <div class="result-item">
                  <span class="label">Events:</span>
                  <span class="value">识别到 {{ analysisResult.events?.length || 0 }} 个事件</span>
                </div>
                <div class="result-item">
                  <span class="label">Slots:</span>
                  <span class="value">识别到 {{ analysisResult.slots?.length || 0 }} 个插槽</span>
                </div>
              </div>
            </template>
          </el-result>
        </div>
        
        <div v-else class="analysis-error">
          <el-result icon="error" title="组件分析失败">
            <template #subtitle>
              <p>{{ analysisError }}</p>
            </template>
          </el-result>
        </div>
      </div>
      
      <div class="ai-assistant">
        <div class="ai-header">
          <h4>智能助手</h4>
          <el-switch v-model="useAI" active-text="启用AI辅助" />
        </div>
        
        <div v-if="useAI" class="ai-content">
          <p>AI将根据组件代码自动生成更准确的物料描述，并提供以下功能：</p>
          <ul>
            <li>智能识别组件类型和分组</li>
            <li>自动提取prop类型和默认值</li>
            <li>推荐合适的标签和描述</li>
            <li>生成更完善的属性配置</li>
          </ul>
          
          <div class="ai-actions">
            <el-button type="primary" @click="generateWithAI" :loading="aiGenerating" :disabled="!analysisResult">
              使用AI生成描述
            </el-button>
          </div>
        </div>
      </div>
      
      <div class="step-actions">
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="nextStep" :disabled="!analysisResult">下一步</el-button>
      </div>
    </div>
    
    <!-- 步骤3: 编辑描述 -->
    <div v-else-if="currentStep === 3" class="step-container">
      <div class="edit-form">
        <el-form ref="formRef" :model="materialForm" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="物料名称" prop="name" required>
                <el-input v-model="materialForm.name" placeholder="请输入物料名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="物料类型" prop="type" required>
                <el-input v-model="materialForm.type" placeholder="请输入物料类型" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="分组" prop="group" required>
                <el-select v-model="materialForm.group" placeholder="请选择分组">
                  <el-option label="基础组件" value="base" />
                  <el-option label="布局组件" value="layout" />
                  <el-option label="表单组件" value="form" />
                  <el-option label="数据组件" value="data" />
                  <el-option label="反馈组件" value="feedback" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="版本" prop="version">
                <el-input v-model="materialForm.version" placeholder="请输入版本号" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="描述" prop="description">
            <el-input 
              v-model="materialForm.description" 
              type="textarea" 
              :rows="3"
              placeholder="请输入物料描述" 
            />
          </el-form-item>
          
          <el-form-item label="标签" prop="tags">
            <el-tag
              v-for="tag in materialForm.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputTagVisible"
              ref="tagInputRef"
              v-model="inputTagValue"
              class="tag-input"
              size="small"
              @keyup.enter="addTag"
              @blur="addTag"
            />
            <el-button v-else size="small" @click="showTagInput">
              + 添加标签
            </el-button>
          </el-form-item>
          
          <el-divider>属性配置</el-divider>
          
          <div class="props-container">
            <div v-for="(prop, propName) in materialForm.props" :key="propName" class="prop-item">
              <div class="prop-header">
                <h4>{{ propName }}</h4>
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="removeProp(propName)" 
                  :icon="Delete"
                  circle
                />
              </div>
              
              <el-form-item label="类型">
                <el-select v-model="prop.type" placeholder="请选择类型">
                  <el-option label="字符串" value="string" />
                  <el-option label="数字" value="number" />
                  <el-option label="布尔值" value="boolean" />
                  <el-option label="对象" value="object" />
                  <el-option label="数组" value="array" />
                  <el-option label="枚举" value="enum" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="标题">
                <el-input v-model="prop.title" placeholder="属性标题" />
              </el-form-item>
              
              <el-form-item label="默认值">
                <el-input v-model="prop.default" placeholder="默认值" />
              </el-form-item>
              
              <el-form-item label="必填" v-if="prop.type !== 'enum'">
                <el-switch v-model="prop.required" />
              </el-form-item>
              
              <el-form-item label="枚举值" v-if="prop.type === 'enum'">
                <el-tag
                  v-for="(val, index) in prop.enum || []"
                  :key="index"
                  closable
                  @close="removeEnum(propName, val)"
                  class="tag-item"
                >
                  {{ val }}
                </el-tag>
                <el-input
                  v-if="currentEditingEnum === propName"
                  v-model="enumInputValue"
                  class="tag-input"
                  size="small"
                  @keyup.enter="addEnum(propName)"
                  @blur="addEnum(propName)"
                />
                <el-button v-else size="small" @click="showEnumInput(propName)">
                  + 添加选项
                </el-button>
              </el-form-item>
            </div>
            
            <div class="add-prop">
              <el-button type="primary" plain @click="showAddPropDialog">
                添加属性
              </el-button>
            </div>
          </div>
        </el-form>
      </div>
      
      <div class="step-actions">
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </div>
    </div>
    
    <!-- 步骤4: 提交审核 -->
    <div v-else-if="currentStep === 4" class="step-container">
      <div class="submit-container">
        <el-result icon="success" title="准备提交审核">
          <template #extra>
            <div class="material-preview">
              <h4>物料预览</h4>
              <div class="preview-content">
                <pre>{{ formatJson(materialForm) }}</pre>
              </div>
            </div>
            <div class="submit-actions">
              <el-button @click="prevStep">上一步</el-button>
              <el-button type="primary" @click="submitMaterial" :loading="submitting">提交审核</el-button>
            </div>
          </template>
        </el-result>
      </div>
    </div>
    
    <!-- 添加属性对话框 -->
    <el-dialog
      v-model="addPropDialogVisible"
      title="添加属性"
      width="500px"
    >
      <el-form :model="newProp" label-width="80px">
        <el-form-item label="属性名" required>
          <el-input v-model="newProp.name" placeholder="请输入属性名" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="newProp.type" placeholder="请选择类型">
            <el-option label="字符串" value="string" />
            <el-option label="数字" value="number" />
            <el-option label="布尔值" value="boolean" />
            <el-option label="对象" value="object" />
            <el-option label="数组" value="array" />
            <el-option label="枚举" value="enum" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="newProp.title" placeholder="属性标题" />
        </el-form-item>
        <el-form-item label="默认值">
          <el-input v-model="newProp.default" placeholder="默认值" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addPropDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addProp">添加</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Upload, Delete } from '@element-plus/icons-vue';

// 当前步骤
const currentStep = ref(1);

// 上传文件
const uploadedFile = ref<File | null>(null);

// 分析状态
const analyzing = ref(false);
const analysisProgress = ref(0);
const analysisResult = ref<any>(null);
const analysisError = ref('');

// AI辅助
const useAI = ref(true);
const aiGenerating = ref(false);

// 标签输入
const inputTagVisible = ref(false);
const inputTagValue = ref('');
const tagInputRef = ref<HTMLInputElement | null>(null);

// 枚举输入
const currentEditingEnum = ref('');
const enumInputValue = ref('');

// 物料表单
const materialForm = reactive({
  name: '',
  type: '',
  version: '1.0.0',
  group: '',
  description: '',
  tags: [] as string[],
  props: {} as Record<string, any>
});

// 新属性表单
const addPropDialogVisible = ref(false);
const newProp = reactive({
  name: '',
  type: 'string',
  title: '',
  default: ''
});

// 提交状态
const submitting = ref(false);

// 处理文件变更
const handleFileChange = (file: any) => {
  uploadedFile.value = file.raw;
};

// 下一步
const nextStep = () => {
  if (currentStep.value === 1) {
    // 执行文件上传逻辑
    // uploadFile();
    startAnalysis();
  }
  
  if (currentStep.value === 2 && !analysisResult.value) {
    ElMessage.warning('请先完成组件分析');
    return;
  }
  
  if (currentStep.value === 3) {
    // 表单验证
    if (!materialForm.name || !materialForm.type || !materialForm.group) {
      ElMessage.warning('请完善必填信息');
      return;
    }
  }
  
  if (currentStep.value < 4) {
    currentStep.value++;
  }
};

// 上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (size < 1024) {
    return size + ' B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }
};

// 获取文件扩展名
const getFileExtension = (filename: string) => {
  return filename.split('.').pop();
};

// 开始分析组件
const startAnalysis = () => {
  analyzing.value = true;
  analysisProgress.value = 0;
  
  // 模拟分析进度
  const timer = setInterval(() => {
    analysisProgress.value += 10;
    
    if (analysisProgress.value >= 100) {
      clearInterval(timer);
      analyzing.value = false;
      analysisResult.value = {
        type: 'button',
        props: {
          type: {
            type: 'string',
            default: 'primary'
          },
          size: {
            type: 'string',
            default: 'medium'
          },
          text: {
            type: 'string',
            default: '按钮'
          },
          disabled: {
            type: 'boolean',
            default: false
          }
        },
        events: [
          { name: 'click', description: '点击事件' }
        ],
        slots: [
          { name: 'default', description: '按钮内容' }
        ]
      };
      
      // 更新表单数据
      materialForm.name = '按钮';
      materialForm.type = 'button';
      materialForm.group = 'base';
      materialForm.description = '用于触发操作的按钮组件';
      materialForm.tags = ['button', 'action'];
      materialForm.props = analysisResult.value.props;
    }
  }, 300);
};

// AI生成物料描述
const generateWithAI = () => {
  aiGenerating.value = true;
  
  // 模拟AI生成过程
  setTimeout(() => {
    materialForm.description = 'AI生成的按钮组件描述：基于Element Plus的按钮组件，支持多种类型、尺寸和状态，用于触发页面操作。';
    materialForm.tags = ['button', 'action', 'click', 'element-plus'];
    
    // 增强props的描述
    Object.keys(materialForm.props).forEach(key => {
      if (key === 'type') {
        materialForm.props[key].title = '按钮类型';
        materialForm.props[key].description = '设置按钮的样式类型';
        materialForm.props[key].type = 'enum';
        materialForm.props[key].enum = ['primary', 'success', 'warning', 'danger', 'info', 'text'];
      } else if (key === 'size') {
        materialForm.props[key].title = '按钮尺寸';
        materialForm.props[key].description = '设置按钮的大小';
        materialForm.props[key].type = 'enum';
        materialForm.props[key].enum = ['large', 'medium', 'small'];
      } else if (key === 'text') {
        materialForm.props[key].title = '按钮文本';
        materialForm.props[key].description = '按钮显示的文字内容';
      } else if (key === 'disabled') {
        materialForm.props[key].title = '是否禁用';
        materialForm.props[key].description = '设置按钮是否为禁用状态';
      }
    });
    
    aiGenerating.value = false;
    ElMessage.success('AI生成物料描述成功');
  }, 2000);
};

// 标签操作
const showTagInput = () => {
  inputTagVisible.value = true;
  nextTick(() => {
    tagInputRef.value?.focus();
  });
};

const addTag = () => {
  if (inputTagValue.value) {
    if (!materialForm.tags.includes(inputTagValue.value)) {
      materialForm.tags.push(inputTagValue.value);
    }
    inputTagVisible.value = false;
    inputTagValue.value = '';
  }
};

const removeTag = (tag: string) => {
  materialForm.tags = materialForm.tags.filter(t => t !== tag);
};

// 属性操作
const showAddPropDialog = () => {
  newProp.name = '';
  newProp.type = 'string';
  newProp.title = '';
  newProp.default = '';
  addPropDialogVisible.value = true;
};

const addProp = () => {
  if (!newProp.name) {
    ElMessage.warning('请输入属性名');
    return;
  }
  
  if (materialForm.props[newProp.name]) {
    ElMessage.warning('属性名已存在');
    return;
  }
  
  materialForm.props[newProp.name] = {
    type: newProp.type,
    title: newProp.title,
    default: newProp.default,
    required: false
  };
  
  addPropDialogVisible.value = false;
};

const removeProp = (propName: string) => {
  delete materialForm.props[propName];
};

// 枚举值操作
const showEnumInput = (propName: string) => {
  currentEditingEnum.value = propName;
  enumInputValue.value = '';
  nextTick(() => {
    (document.querySelector('.tag-input input') as HTMLInputElement)?.focus();
  });
};

const addEnum = (propName: string) => {
  if (enumInputValue.value) {
    if (!materialForm.props[propName].enum) {
      materialForm.props[propName].enum = [];
    }
    
    if (!materialForm.props[propName].enum.includes(enumInputValue.value)) {
      materialForm.props[propName].enum.push(enumInputValue.value);
    }
    
    currentEditingEnum.value = '';
    enumInputValue.value = '';
  }
};

const removeEnum = (propName: string, value: string) => {
  materialForm.props[propName].enum = materialForm.props[propName].enum.filter((v: string) => v !== value);
};

// 提交物料
const submitMaterial = () => {
  submitting.value = true;
  
  // 模拟提交过程
  setTimeout(() => {
    submitting.value = false;
    ElMessage.success('物料提交成功，等待审核');
    // 重置表单
    resetForm();
  }, 1500);
};

// 重置表单
const resetForm = () => {
  uploadedFile.value = null;
  analysisResult.value = null;
  analysisError.value = '';
  currentStep.value = 1;
  materialForm.name = '';
  materialForm.type = '';
  materialForm.version = '1.0.0';
  materialForm.group = '';
  materialForm.description = '';
  materialForm.tags = [];
  materialForm.props = {};
};

// 格式化JSON
const formatJson = (data: any) => {
  return JSON.stringify(data, null, 2);
};
</script>

<style scoped lang="less">
.material-uploader {
  padding: 20px;
  
  .upload-header {
    margin-bottom: 30px;
    
    h2 {
      margin: 0 0 10px;
    }
    
    .description {
      color: #606266;
      margin: 0;
    }
  }
  
  .steps {
    margin-bottom: 40px;
  }
  
  .step-container {
    padding: 20px 0;
  }
  
  .upload-area {
    width: 100%;
  }
  
  .upload-icon {
    font-size: 48px;
    color: #c0c4cc;
  }
  
  .upload-text {
    margin: 15px 0;
    color: #606266;
    
    em {
      color: #409eff;
      font-style: normal;
    }
  }
  
  .upload-tip {
    color: #909399;
    font-size: 12px;
  }
  
  .file-info {
    margin-top: 20px;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;
    
    h4 {
      margin: 0 0 10px;
    }
    
    p {
      margin: 5px 0;
    }
  }
  
  .analysis-container {
    margin-bottom: 30px;
  }
  
  .analyzing {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
    
    .analysis-status {
      margin-top: 20px;
      color: #606266;
    }
  }
  
  .analysis-result {
    .analysis-summary {
      text-align: left;
      background-color: #f5f7fa;
      padding: 15px;
      border-radius: 4px;
      
      h4 {
        margin: 0 0 15px;
      }
      
      .result-item {
        margin-bottom: 8px;
        display: flex;
        
        .label {
          font-weight: bold;
          width: 150px;
        }
      }
    }
  }
  
  .ai-assistant {
    margin-bottom: 30px;
    padding: 15px;
    background-color: #f0f9eb;
    border-radius: 4px;
    
    .ai-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      h4 {
        margin: 0;
      }
    }
    
    .ai-content {
      ul {
        padding-left: 20px;
      }
      
      .ai-actions {
        margin-top: 15px;
      }
    }
  }
  
  .edit-form {
    margin-bottom: 30px;
    
    .tag-item {
      margin-right: 5px;
      margin-bottom: 5px;
    }
    
    .tag-input {
      width: 100px;
      margin-right: 10px;
      vertical-align: top;
    }
    
    .props-container {
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 20px;
      
      .prop-item {
        margin-bottom: 20px;
        padding: 15px;
        border: 1px dashed #dcdfe6;
        border-radius: 4px;
        
        .prop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          
          h4 {
            margin: 0;
          }
        }
      }
      
      .add-prop {
        display: flex;
        justify-content: center;
        padding: 20px 0;
      }
    }
  }
  
  .material-preview {
    text-align: left;
    margin-bottom: 30px;
    
    h4 {
      margin: 0 0 10px;
    }
    
    .preview-content {
      background-color: #f5f7fa;
      padding: 15px;
      border-radius: 4px;
      max-height: 400px;
      overflow-y: auto;
      
      pre {
        margin: 0;
        white-space: pre-wrap;
        font-family: monospace;
      }
    }
  }
  
  .step-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
    gap: 10px;
  }
}
</style> 