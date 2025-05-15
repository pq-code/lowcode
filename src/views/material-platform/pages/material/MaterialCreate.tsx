import { defineComponent, ref, computed, onMounted, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElUpload,
  ElMessage,
  ElMessageBox,
  ElIcon,
  ElSteps,
  ElStep,
  ElTag,
  ElTable,
  ElTableColumn,
  ElDrawer,
  ElSwitch,
  ElEmpty,
  ElTabs,
  ElTabPane,
  ElAlert,
  ElResult,
  ElImage,
  ElCard,
  ElSkeleton,
  ElSkeletonItem,
  ElProgress
} from 'element-plus';
import {
  Document,
  Edit,
  Upload as UploadIcon,
  View,
  Refresh,
  MagicStick,
  Connection,
  Search,
  ArrowLeft,
  ArrowRight,
  Check,
  Close,
  Plus,
  Menu as ComponentIcon,
  Picture as PictureRounded,
  Top as TopRight,
  VideoPlay as CodeIcon
} from '@element-plus/icons-vue';
import { fetchMaterialGroups, createMaterial, updateMaterial, fetchMaterialDetail } from '../../services/materialService';
import type { Material, MaterialGroup } from '../../types';
import SimpleCodeEditor from '@/components/SimpleCodeEditor';
import JsonEditor from '@/components/JsonEditor';
import StepPanel from '@/components/StepPanel';
import './MaterialCreate.css';

// 组件模板定义
interface TemplateItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  code: string;
  thumbnail?: string;
}

// 将原有模板数据保留
const mockTemplates: TemplateItem[] = [
  {
    id: 'basic',
    name: '基础容器组件',
    description: '简单的容器组件，带标题和内容区',
    tags: ['基础', '容器'],
    thumbnail: '',
    code: `<template>
  <div class="component-container">
    <h3>{{ title }}</h3>
    <div class="component-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    default: '组件标题'
  }
});
</script>

<style scoped>
.component-container {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.component-content {
  margin-top: 12px;
}
</style>`
  },
  {
    id: 'form',
    name: '表单组件',
    description: '包含输入框和选择器的表单',
    tags: ['表单', 'UI'],
    thumbnail: '',
    code: `<template>
  <div class="form-component">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="formData.type" placeholder="请选择类型">
          <el-option label="类型1" value="type1" />
          <el-option label="类型2" value="type2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const formData = reactive({
  name: '',
  type: ''
});

const emit = defineEmits(['submit']);

const handleSubmit = () => {
  emit('submit', formData);
};
</script>`
  },
  {
    id: 'table',
    name: '表格组件',
    description: '数据表格，带有操作按钮',
    tags: ['表格', '数据', 'UI'],
    thumbnail: '',
    code: `<template>
  <div class="table-component">
    <div class="table-header">
      <h3>{{ title }}</h3>
      <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

defineProps({
  title: {
    type: String,
    default: '数据表格'
  }
});

const emit = defineEmits(['add', 'edit', 'delete']);

const tableData = ref([
  { id: 1, name: '示例数据1', date: '2023-05-01', status: '已完成' },
  { id: 2, name: '示例数据2', date: '2023-05-02', status: '进行中' }
]);

const handleAdd = () => {
  emit('add');
};

const handleEdit = (row) => {
  emit('edit', row);
};

const handleDelete = (row) => {
  emit('delete', row);
};
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>`
  },
  {
    id: 'card',
    name: '卡片组件',
    description: '展示信息的卡片组件',
    tags: ['卡片', 'UI'],
    thumbnail: '',
    code: `<template>
  <div class="card-component" :class="{ 'is-hoverable': hoverable }">
    <div class="card-header" v-if="title || $slots.header">
      <slot name="header">{{ title }}</slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  },
  hoverable: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.card-component {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
}

.card-component.is-hoverable:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 18px 20px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  font-weight: bold;
}

.card-body {
  padding: 20px;
}

.card-footer {
  padding: 18px 20px;
  border-top: 1px solid #ebeef5;
}
</style>`
  }
];

// 格式化压缩的代码
function formatCode(code: string): string {
  // 简单实现，实际项目中可以使用如prettier等库
  return code;
}

// 使用setup语法糖的组件
const MaterialCreate = defineComponent({
  name: 'MaterialCreate',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const submitting = ref(false);
    const analyzingComponent = ref(false);
    const groups = ref<MaterialGroup[]>([]);
    const componentContent = ref('');
    const fileList = ref<any[]>([]);
    const searchQuery = ref('');
    const selectedTemplateId = ref<string>('');
    const showTemplateDrawer = ref(false);
    const descriptorTabActive = ref('form');
    
    // 步骤控制
    const currentStep = ref(0); // 0: 基本信息, 1: 编辑组件代码, 2: AI分析和描述编辑
    const isAnalyzed = ref(false); // 是否已经进行AI分析
    
    // 组件编辑器内容
    const componentCode = ref('');
    
    // 编辑器加载状态
    const editorLoading = ref(false);
    const editorReady = ref(false);
    
    // 物料表单数据
    const materialForm = ref<Partial<Material>>({
      name: '',
      description: '',
      type: '',
      group: 'base',
      version: '1.0.0',
      tags: [],
      icon: 'el-icon-document',
      props: {}
    });
    
    // 物料描述符JSON内容
    const descriptorJson = ref('');
    
    // Vue3基础模板代码
    const defaultVue3Template = `<template>
  <div class="component-container">
    <h2>{{ title }}</h2>
    <div class="component-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Props定义
defineProps({
  title: {
    type: String,
    default: '组件标题'
  },
  theme: {
    type: String,
    default: 'light'
  }
});

// Emits定义
const emit = defineEmits(['update', 'change']);

// 响应式数据
const count = ref(0);

// 计算属性
const doubleCount = computed(() => count.value * 2);

// 方法
const increment = () => {
  count.value++;
  emit('update', count.value);
};

// 生命周期钩子
onMounted(() => {
  console.log('组件已挂载');
});
</script>

<style scoped>
.component-container {
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.component-content {
  margin-top: 16px;
}
</style>`;
    
    // 监听表单变化，更新描述符JSON
    watch(materialForm, (newForm) => {
      try {
        descriptorJson.value = JSON.stringify(newForm, null, 2);
      } catch (error) {
        console.error('生成描述符JSON失败', error);
      }
    }, { deep: true });
    
    // 从描述符JSON更新表单
    const updateFormFromJson = () => {
      try {
        const parsedJson = JSON.parse(descriptorJson.value);
        
        // 验证基本字段
        if (!parsedJson.name || !parsedJson.type) {
          ElMessage.warning('描述符必须包含name和type字段');
          return false;
        }
        
        materialForm.value = parsedJson;
        return true;
      } catch (error) {
        ElMessage.error('JSON格式无效，请检查');
        console.error('解析描述符JSON失败', error);
        return false;
      }
    };
    
    // 新标签输入
    const newTag = ref('');
    
    // 初始化分组数据
    const loadGroups = async () => {
      try {
        loading.value = true;
        groups.value = await fetchMaterialGroups();
        // 设置默认分组，但不自动设置类型
        if (groups.value.length > 0) {
          materialForm.value.group = groups.value[0].id;
          // 只有在类型未设置时才设置默认类型
          if (!materialForm.value.type) {
            materialForm.value.type = groups.value[0].id;
          }
        }
        loading.value = false;
      } catch (error) {
        loading.value = false;
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
    
    // 处理组件文件上传
    const handleFileChange = (file: any) => {
      // 文件大小限制（5MB）
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        ElMessage.error(`文件大小不能超过5MB，当前文件大小为${(file.size / 1024 / 1024).toFixed(2)}MB`);
        return false;
      }
      
      // 文件类型验证
      const validFileTypes = ['.vue', '.jsx', '.tsx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!validFileTypes.includes(fileExtension)) {
        ElMessage.error(`只支持上传${validFileTypes.join('、')}格式的文件`);
        return false;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // 使用读取到的文件内容更新代码编辑器
          const content = e.target?.result as string || '';
          
          // 限制文件内容大小，避免大文件导致页面卡顿
          const maxContentSize = 300000; // 300KB
          if (content.length > maxContentSize) {
            ElMessage.warning(`文件内容过大，将只加载前${Math.floor(maxContentSize/1024)}KB的内容`);
            componentCode.value = content.substring(0, maxContentSize);
          } else {
            componentCode.value = content;
          }
          
          ElMessage.success('文件加载成功');
        } catch (error) {
          ElMessage.error('读取文件失败');
          console.error('读取文件失败:', error);
        }
      };
      
      // 处理文件读取错误
      reader.onerror = () => {
        ElMessage.error('文件读取出错');
      };
      
      // 使用延迟处理大文件，避免UI阻塞
      // 确保文件存在且能被读取
      if (file.raw) {
        reader.readAsText(file.raw);
      } else {
        ElMessage.error('文件无效');
      }
      
      return false; // 不自动上传
    };
    
    // 打开模板抽屉
    const openTemplateDrawer = () => {
      showTemplateDrawer.value = true;
    };
    
    // 关闭模板抽屉
    const closeTemplateDrawer = () => {
      showTemplateDrawer.value = false;
    };
    
    // 应用模板
    const applyTemplate = (templateId: string) => {
      const template = mockTemplates.find(t => t.id === templateId);
      if (!template) return;
      
      if (componentCode.value && componentCode.value.trim() !== '') {
        ElMessageBox.confirm('应用模板将覆盖当前代码，是否继续？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          componentCode.value = formatCode(template.code);
          selectedTemplateId.value = templateId;
          closeTemplateDrawer();
        }).catch(() => {
          // 用户取消，不做操作
        });
      } else {
        componentCode.value = formatCode(template.code);
        selectedTemplateId.value = templateId;
        closeTemplateDrawer();
      }
    };
    
    // 预览模板
    const previewTemplate = (templateId: string) => {
      const template = mockTemplates.find(t => t.id === templateId);
      if (template) {
        ElMessageBox.alert(template.code, '模板预览', {
          customClass: 'code-preview-dialog'
        });
      }
    };
    
    // 格式化代码
    const formatCurrentCode = () => {
      if (componentCode.value) {
        componentCode.value = formatCode(componentCode.value);
        ElMessage.success('代码格式化成功');
      }
    };
    
    // 分析组件
    const analyzeComponent = async () => {
      
    };
    
    // 提交表单
    const submitForm = async () => {
      // 无需检查编辑模式，直接使用表单数据
      
      // 表单验证
      if (!materialForm.value.name) {
        ElMessage.warning('请输入物料名称');
        return;
      }
      
      if (!materialForm.value.type) {
        ElMessage.warning('请输入物料类型');
        return;
      }
      
      try {
        submitting.value = true;
        const result = await createMaterial(materialForm.value);
        ElMessage.success(`创建物料 ${result.name} 成功`);
        router.push('/material-platform/materials');
      } catch (error) {
        ElMessage.error('创建物料失败');
        console.error('创建物料失败:', error);
      } finally {
        submitting.value = false;
      }
    };
    
    // 取消创建
    const cancelCreate = () => {
      ElMessageBox.confirm('确定要取消创建吗？已填写的信息将丢失。', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        router.back();
      }).catch(() => {
        // 用户取消，不做操作
      });
    };
    
    // 步骤定义
    const steps = [
      { title: '基本信息', description: '填写物料基本信息' },
      { title: '组件代码', description: '编辑或上传组件代码' },
      { title: '组件分析', description: 'AI分析与描述编辑' }
    ];
    
    // 步骤变化处理
    const handleStepChange = (step: number) => {
      // 如果切换到代码编辑步骤，延迟初始化编辑器
      if (step === 1 && !editorReady.value) {
        editorLoading.value = true;
        editorReady.value = true;
        editorLoading.value = false;
      }
      currentStep.value = step;
    };
    
    // 下一步
    const handleNextStep = () => {
      if (currentStep.value < steps.length - 1) {
        // 如果当前是第二步（编辑组件代码），则进行AI分析
        if (currentStep.value === 1) {
          analyzeComponent();
        } else {
          currentStep.value += 1;
          // 如果切换到代码编辑步骤，延迟初始化编辑器
          if (currentStep.value === 1 && !editorReady.value) {
            editorLoading.value = true;
            // 延迟加载编辑器，避免UI阻塞
            editorReady.value = true;
            editorLoading.value = false;
          }
        }
      }
    };
    
    // 上一步
    const handlePrevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value -= 1;
      }
    };
    
    // 完成创建
    const handleFinish = () => {
      submitForm();
    };
    
    // 改变分组时不再自动更新类型
    const handleGroupChange = (groupId: string) => {
      materialForm.value.group = groupId;
      // 移除自动设置类型的逻辑，让用户可以独立选择类型
    };
    
    // 过滤模板
    const filteredTemplates = () => {
      if (!searchQuery.value) return mockTemplates;
      
      const query = searchQuery.value.toLowerCase();
      return mockTemplates.filter(template => 
        template.name.toLowerCase().includes(query) || 
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    };
    
    // 初始化
    onMounted(() => {
      loadGroups();
      // 设置默认代码模板
      componentCode.value = defaultVue3Template;
    });
    
    return {
      // 状态
      loading,
      submitting,
      analyzingComponent,
      currentStep,
      isAnalyzed,
      descriptorTabActive,
      showTemplateDrawer,
      selectedTemplateId,
      searchQuery,
      editorLoading,
      editorReady,
      
      // 数据
      groups,
      fileList,
      componentCode,
      materialForm,
      descriptorJson,
      newTag,
      steps,
      
      // 方法
      formatCurrentCode,
      analyzeComponent,
      handleFileChange,
      openTemplateDrawer,
      closeTemplateDrawer,
      applyTemplate,
      previewTemplate,
      addTag,
      removeTag,
      updateFormFromJson,
      filteredTemplates,
      handleStepChange,
      handleNextStep,
      handlePrevStep,
      handleFinish,
      submitForm,
      cancelCreate,
      handleGroupChange
    };
  },
  render() {
    return (
      <div class="material-create-container" role="region" aria-label="创建物料">
        {/* <h1 class="page-title">创建物料</h1> */}
        
        <StepPanel
          steps={this.steps}
          currentStep={this.currentStep}
          onUpdate:currentStep={this.handleStepChange}
          onPrev={this.handlePrevStep}
          onNext={this.handleNextStep}
          onFinish={this.handleFinish}
          loading={this.currentStep === 1 ? this.analyzingComponent : this.submitting}
          canNext={this.currentStep === 1 ? !!this.componentCode.trim() : true}
          canFinish={this.currentStep === 2}
          nextButtonText={this.currentStep === 1 ? 'AI分析组件' : '下一步'}
          finishButtonText="提交物料"
        >
          {/* 步骤1：基本信息 */}
          {{
            'step-0': () => (
              <div class="basic-info-form">
                <ElForm model={this.materialForm} label-width="100px" label-position="right">
                  <div class="form-section">
                    <h3 class="form-section-title">基本信息</h3>
                    
                    <ElFormItem label="名称" required>
                      <ElInput v-model={this.materialForm.name} placeholder="请输入物料名称" />
                    </ElFormItem>
                    
                    <ElFormItem label="类型" required>
                      <ElSelect 
                        v-model={this.materialForm.type} 
                        style={{width: '100%'}} 
                        placeholder="请选择物料类型"
                      >
                        {this.groups.map(group => (
                          <ElOption key={group.id} label={group.name} value={group.id} />
                        ))}
                      </ElSelect>
                    </ElFormItem>
                    
                    <ElFormItem label="描述">
                      <ElInput 
                        v-model={this.materialForm.description} 
                        type="textarea" 
                        rows={3}
                        placeholder="请输入物料描述"
                      />
                    </ElFormItem>
                    
                    <ElFormItem label="版本">
                      <ElInput v-model={this.materialForm.version} placeholder="请输入版本号，如1.0.0" />
                    </ElFormItem>
                    
                    <ElFormItem label="标签">
                      <div class="tags-input">
                        <ElInput 
                          v-model={this.newTag} 
                          placeholder="输入标签后回车" 
                          onKeydown={(evt: Event | KeyboardEvent) => {
                            if ((evt as KeyboardEvent).key === 'Enter') {
                              evt.preventDefault();
                              this.addTag();
                            }
                          }}
                        />
                        <ElButton type="primary" onClick={this.addTag}>添加</ElButton>
                      </div>
                      
                      <div class="tags-container">
                        {this.materialForm.tags?.map(tag => (
                          <ElTag 
                            key={tag} 
                            closable 
                            onClose={() => this.removeTag(tag)}
                            style={{ marginRight: '8px', marginBottom: '8px' }}
                          >
                            {tag}
                          </ElTag>
                        ))}
                      </div>
                    </ElFormItem>
                  </div>
                </ElForm>
              </div>
            ),
            
            /* 步骤2：组件代码 */
            'step-1': () => (
              <div class="code-editor-container">
                <div class="file-upload-container">
                  <ElUpload
                    action=""
                    accept=".vue,.jsx,.tsx"
                    autoUpload={false}
                    fileList={this.fileList}
                    onChange={(uploadFile) => {
                      // 确保使用最新上传的文件
                      const file = uploadFile.raw || uploadFile;
                      this.handleFileChange(file);
                    }}
                    limit={1}
                    drag
                    multiple={false}
                    beforeUpload={(file) => {
                      // 文件大小和类型验证在handleFileChange中已处理
                      return false; // 阻止自动上传
                    }}
                  >
                    <div class="upload-content">
                      <ElIcon class="upload-icon"><UploadIcon /></ElIcon>
                      <div class="upload-text">拖拽文件到此处或点击上传</div>
                      <div class="upload-tip">支持 .vue、.jsx、.tsx 和文件夹，文件</div>
                    </div>
                  </ElUpload>
                </div>
                <div class="code-editor-main">
                <div class="code-editor-header">
                  <div class="code-editor-title">
                    <ElIcon><Edit /></ElIcon> 组件代码编辑器
                    {this.selectedTemplateId && (
                      <span class="editor-subtitle">
                        使用模板: {mockTemplates.find(t => t.id === this.selectedTemplateId)?.name}
                      </span>
                    )}
                  </div>
                  
                  <div class="code-editor-actions">
                    <ElButton 
                      type="primary" 
                      onClick={this.openTemplateDrawer}
                      icon={<ElIcon><View /></ElIcon>}
                    >
                      浏览模板
                    </ElButton>
                    
                    <ElButton 
                      onClick={this.formatCurrentCode}
                      icon={<ElIcon><Connection /></ElIcon>}
                    >
                      格式化代码
                    </ElButton>
                  </div>
                </div>
                
                <div class="code-editor-wrapper">
                  {this.editorLoading ? (
                    <div class="editor-loading-placeholder" style={{ height: '100%', minHeight: 'calc(100vh - 380px)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f7fa', border: '1px solid #e4e7ed', borderRadius: '4px' }}>
                      <div class="loading-content" style={{ textAlign: 'center' }}>
                        <ElIcon style={{ fontSize: '24px', marginBottom: '16px', animation: 'rotating 2s linear infinite' }}><Refresh /></ElIcon>
                        <div>编辑器加载中，请稍候...</div>
                      </div>
                    </div>
                  ) : this.editorReady ? (
                    <SimpleCodeEditor
                      modelValue={this.componentCode}
                      onUpdate:modelValue={(v: string) => this.componentCode = v}
                      language="vue"
                      theme="light"
                      height="100%"
                      placeholder="请输入Vue组件代码..."
                      options={{
                        formatOnPaste: true,
                        formatOnType: false
                      }}
                    />
                  ) : (
                    <div class="editor-loading-placeholder" style={{ height: '100%', minHeight: 'calc(100vh - 380px)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f7fa', border: '1px solid #e4e7ed', borderRadius: '4px' }}>
                      <ElButton type="primary" onClick={() => { this.editorLoading = true; this.editorReady = true; this.editorLoading = false; }}>
                        加载编辑器
                      </ElButton>
                    </div>
                  )}
                </div>
                </div>
              </div>
            ),
            
            /* 步骤3：AI分析与描述编辑 */
            'step-2': () => (
              <div class="descriptor-container">
                <div class="descriptor-tabs">
                  <div 
                    class={[
                      'descriptor-tab', 
                      { active: this.descriptorTabActive === 'form' }
                    ]}
                    onClick={() => this.descriptorTabActive = 'form'}
                  >
                    表单视图
                  </div>
                  <div 
                    class={[
                      'descriptor-tab', 
                      { active: this.descriptorTabActive === 'json' }
                    ]}
                    onClick={() => this.descriptorTabActive = 'json'}
                  >
                    JSON视图
                  </div>
                </div>
                
                <div class="descriptor-content">
                  {this.descriptorTabActive === 'form' ? (
                    <div class="form-editor-wrapper">
                      <ElForm model={this.materialForm} label-width="100px" label-position="right" class="material-form">
                        <div class="form-section">
                          <h3 class="form-section-title">基本信息</h3>
                          
                          <ElFormItem label="名称" required>
                            <ElInput v-model={this.materialForm.name} />
                          </ElFormItem>
                          
                          <ElFormItem label="类型" required>
                            <ElSelect 
                              v-model={this.materialForm.type} 
                              style={{width: '100%'}}
                            >
                              {this.groups.map(group => (
                                <ElOption key={group.id} label={group.name} value={group.id} />
                              ))}
                            </ElSelect>
                          </ElFormItem>
                          
                          <ElFormItem label="描述">
                            <ElInput 
                              v-model={this.materialForm.description} 
                              type="textarea" 
                              rows={3}
                            />
                          </ElFormItem>
                          
                          <ElFormItem label="分组">
                            <ElSelect 
                              v-model={this.materialForm.group} 
                              style={{width: '100%'}}
                            >
                              {this.groups.map(group => (
                                <ElOption key={group.id} label={group.name} value={group.id} />
                              ))}
                            </ElSelect>
                          </ElFormItem>
                          
                          <ElFormItem label="版本">
                            <ElInput v-model={this.materialForm.version} />
                          </ElFormItem>
                        </div>
                        
                        <div class="form-section">
                          <h3 class="form-section-title">标签</h3>
                          
                          <ElFormItem>
                            <div class="tags-input">
                              <ElInput 
                                v-model={this.newTag} 
                                placeholder="输入标签后回车" 
                                onKeydown={(evt: Event | KeyboardEvent) => {
                                  if ((evt as KeyboardEvent).key === 'Enter') {
                                    evt.preventDefault();
                                    this.addTag();
                                  }
                                }}
                              />
                              <ElButton type="primary" onClick={this.addTag}>添加</ElButton>
                            </div>
                            
                            <div class="tags-container">
                              {this.materialForm.tags?.map(tag => (
                                <ElTag 
                                  key={tag} 
                                  closable 
                                  onClose={() => this.removeTag(tag)}
                                  style={{ marginRight: '8px', marginBottom: '8px' }}
                                >
                                  {tag}
                                </ElTag>
                              ))}
                            </div>
                          </ElFormItem>
                        </div>
                        
                        <div class="form-section">
                          <h3 class="form-section-title">属性配置</h3>
                          
                          <ElFormItem>
                            <div class="props-table">
                              {Object.keys(this.materialForm.props || {}).length > 0 ? (
                                <ElTable
                                  data={Object.entries(this.materialForm.props || {}).map(([key, value]) => ({ key, ...value }))}
                                  border
                                  style={{ width: '100%' }}
                                >
                                  <ElTableColumn prop="key" label="属性名" width="180" />
                                  <ElTableColumn prop="type" label="类型" width="120" />
                                  <ElTableColumn prop="title" label="标题" width="180" />
                                  <ElTableColumn prop="default" label="默认值" formatter={(row: Record<string, any>) => JSON.stringify(row.default) || '-'} />
                                </ElTable>
                              ) : (
                                <ElEmpty description="暂无属性配置，请切换到JSON视图查看更多" />
                              )}
                            </div>
                          </ElFormItem>
                        </div>
                      </ElForm>
                    </div>
                  ) : (
                    <div class="json-editor-wrapper">
                      <JsonEditor
                        modelValue={JSON.parse(this.descriptorJson)}
                        onUpdate:modelValue={(v: any) => this.descriptorJson = JSON.stringify(v, null, 2)}
                        height="100%"
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          }}
        </StepPanel>
        
        {/* 模板抽屉 */}
        <ElDrawer
          v-model={this.showTemplateDrawer}
          title="组件模板库"
          size="60%"
          direction="rtl"
          appendToBody
        >
          <div class="template-drawer-content">
            <div class="template-search">
              <ElInput
                v-model={this.searchQuery}
                placeholder="搜索模板"
                prefixIcon={<ElIcon><Search /></ElIcon>}
                clearable
              />
            </div>
            
            <div class="template-grid">
              {this.filteredTemplates().map(template => (
                <ElCard 
                  key={template.id}
                  class="template-card"
                  shadow="hover"
                  bodyStyle={{ padding: '0' }}
                >
                  <div class="template-card-header">
                    {template.thumbnail ? (
                      <img src={template.thumbnail} class="template-thumbnail" />
                    ) : (
                      <div class="template-thumbnail-placeholder">
                        <ElIcon style={{ fontSize: '28px', color: '#909399' }}><Document /></ElIcon>
                        <div style={{ marginTop: '8px', fontSize: '14px', color: '#606266' }}>{template.name}</div>
                      </div>
                    )}
                  </div>
                  
                  <div class="template-card-body">
                    <h4 class="template-name">{template.name}</h4>
                    <p class="template-description">{template.description}</p>
                    
                    <div class="template-tags">
                      {template.tags.map(tag => (
                        <ElTag key={tag} size="small" effect="plain" class="template-tag">
                          {tag}
                        </ElTag>
                      ))}
                    </div>
                    
                    <div class="template-actions">
                      <ElButton 
                        size="small" 
                        onClick={() => this.previewTemplate(template.id)}
                      >
                        预览
                      </ElButton>
                      <ElButton 
                        type="primary" 
                        size="small"
                        onClick={() => this.applyTemplate(template.id)}
                      >
                        使用
                      </ElButton>
                    </div>
                  </div>
                </ElCard>
              ))}
              
              {this.filteredTemplates().length === 0 && (
                <div class="no-templates">
                  <ElEmpty description="没有找到匹配的模板" />
                </div>
              )}
            </div>
          </div>
        </ElDrawer>
      </div>
    );
  }
});

export default MaterialCreate; 