import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { fetchMaterialGroups, createMaterial } from '../../../services/materialService';
import type { Material, MaterialGroup, ComponentFileNode } from '../../../types';
import type { UploadUserFile } from 'element-plus';
import StepPanel from '@/components/StepPanel';

// 导入样式
import './index.css';

// 导入拆分的组件（使用索引文件）
import {
  BasicInfoForm,
  CodeEditor,
  FileTree,
  FileUploader,
  FileOperationDialogs,
  TemplateDrawer,
  DescriptorEditor
} from './components';

// 导入拆分的钩子
import useFileOperations from './hooks/useFileOperations';

// 导入模板
import { mockTemplates } from './templates';

// 接口定义
interface TemplateItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  code: string;
  thumbnail?: string;
  materialInfo?: {
    name?: string;
    description?: string;
    version?: string;
    tags?: string[];
  };
}

// 格式化压缩的代码
function formatCode(code: string): string {
  // 简单实现，实际项目中可以使用如prettier等库
  return code;
}

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

// 步骤定义
const steps = [
  {
    title: '基本信息',
    description: '填写物料的基本信息'
  },
  {
    title: '组件代码',
    description: '上传或编辑组件代码'
  },
  {
    title: 'AI分析及描述编辑',
    description: 'AI分析组件结构并编辑物料描述'
  }
];

// 使用setup语法糖的组件
export default defineComponent({
  name: 'MaterialCreate',
  components: {
    StepPanel,
    BasicInfoForm,
    CodeEditor,
    FileTree,
    FileUploader,
    FileOperationDialogs,
    TemplateDrawer,
    DescriptorEditor
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const submitting = ref(false);
    const analyzingComponent = ref(false);
    const groups = ref<MaterialGroup[]>([]);
    const fileList = ref<UploadUserFile[]>([]);
    const showTemplateDrawer = ref(false);
    const descriptorTabActive = ref('form');
    
    // 文件树相关状态
    const fileTree = ref<ComponentFileNode[]>([]);
    const componentFiles = ref<{[key: string]: string}>({});
    
    // 步骤控制
    const currentStep = ref(0); // 0: 基本信息, 1: 编辑组件代码, 2: AI分析和描述编辑
    const isAnalyzed = ref(false); // 是否已经进行AI分析
    
    // 组件编辑器内容
    const componentCode = ref('');
    
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
    
    // 使用文件操作相关钩子
    const fileOperations = useFileOperations({
      fileTree,
      componentFiles,
      materialName: computed(() => materialForm.value.name || '')
    });
    
    // 监听表单变化，更新描述符JSON
    watch(materialForm, (newForm) => {
      try {
        descriptorJson.value = JSON.stringify(newForm, null, 2);
      } catch (error) {
        console.error('生成描述符JSON失败', error);
      }
    }, { deep: true });
    
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
        return;
      }
      
      // 文件类型验证
      const validFileTypes = ['.vue', '.jsx', '.tsx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!validFileTypes.includes(fileExtension)) {
        ElMessage.error(`只支持上传${validFileTypes.join('、')}格式的文件`);
        return;
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
          
          // 添加到文件树中
          const newContent = fileOperations.addFileToTree(file.name, content);
          if (newContent) {
            componentCode.value = newContent;
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
      
      reader.readAsText(file);
    };
    
    // 处理文件夹上传
    const handleFolderUpload = (file: any, fileList: any[]) => {
      // 这里通常需要处理WebkitRelativePath或相对路径，获取文件的文件夹结构
      // 由于浏览器安全限制，需要用户选择文件夹进行上传
      const filePath = file.webkitRelativePath || file.name;
      const paths = filePath.split('/');
      
      // 文件大小限制和类型验证
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        ElMessage.error(`文件大小不能超过5MB: ${filePath}`);
        return;
      }
      
      // 检查文件类型
      const validFileTypes = ['.vue', '.jsx', '.tsx', '.js', '.ts', '.css', '.scss', '.less'];
      const fileExtension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
      if (!validFileTypes.includes(fileExtension)) {
        ElMessage.warning(`跳过不支持的文件类型: ${filePath}`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string || '';
          
          // 限制文件内容大小
          const maxContentSize = 300000; // 300KB
          const processedContent = content.length > maxContentSize ? 
            content.substring(0, maxContentSize) : content;
          
          // 将文件添加到树结构中
          fileOperations.addFileWithPathToTree(paths, processedContent);
          
        } catch (error) {
          console.error('读取文件失败:', error);
        }
      };
      
      reader.readAsText(file);
    };
    
    // 处理文件选择
    const handleSelectFile = (node: ComponentFileNode) => {
      if (!node.isFolder && node.id) {
        componentCode.value = componentFiles.value[node.id] || '';
      }
    };
    
    // 格式化当前代码
    const formatCurrentCode = () => {
      componentCode.value = formatCode(componentCode.value);
    };
    
    // 处理代码变更
    const handleCodeChange = (code: string) => {
      componentCode.value = code;
    };
    
    // 根据JSON更新表单
    const updateFormFromJson = () => {
      try {
        const parsedJson = JSON.parse(descriptorJson.value);
        materialForm.value = {
          ...materialForm.value,
          ...parsedJson
        };
        ElMessage.success('JSON已成功应用到表单');
      } catch (error) {
        ElMessage.error('JSON格式不正确，无法解析');
        console.error('解析JSON失败:', error);
      }
    };
    
    // 应用模板
    const applyTemplate = (templateId: string) => {
      const template = mockTemplates.find((t: TemplateItem) => t.id === templateId);
      if (template) {
        // 更新代码
        componentCode.value = template.code;
        
        // 更新组件信息
        if (template.materialInfo) {
          const { name, description, version, tags } = template.materialInfo;
          
          if (name) materialForm.value.name = name;
          if (description) materialForm.value.description = description;
          if (version) materialForm.value.version = version;
          if (tags && tags.length) materialForm.value.tags = [...tags];
        }
        
        // 同步到文件树
        fileOperations.addFileToTree('Main.vue', template.code);
        
        showTemplateDrawer.value = false;
        ElMessage.success(`已应用模板: ${template.name}`);
      } else {
        ElMessage.error('未找到指定模板');
      }
    };
    
    // 预览模板
    const previewTemplate = (templateId: string) => {
      const template = mockTemplates.find((t: TemplateItem) => t.id === templateId);
      if (template) {
        ElMessage.success(`预览${template.name}模板`);
        // 实际实现应该是打开一个预览对话框
      }
    };
    
    // AI分析组件
    const analyzeComponent = async () => {
      // 这里是分析组件的逻辑
    };
    
    // 提交表单
    const submitForm = async () => {
      try {
        submitting.value = true;
        
        // 表单验证
        if (!materialForm.value.name?.trim()) {
          ElMessage.error('请输入物料名称');
          submitting.value = false;
          return;
        }
        
        if (!materialForm.value.type) {
          ElMessage.error('请选择物料类型');
          submitting.value = false;
          return;
        }
        
        // 获取组件文件内容
        const mainFileId = fileTree.value.find(node => node.isMain)?.id;
        if (!mainFileId) {
          ElMessage.error('请设置一个主文件');
          submitting.value = false;
          return;
        }
        
        // 构建物料数据
        const materialData: Partial<Material> = {
          ...materialForm.value,
          files: Object.entries(componentFiles.value).map(([id, content]) => {
            const node = fileOperations.findNodeById(id);
            return {
              id,
              fileName: node?.fileName || '',
              content,
              isMain: id === mainFileId
            };
          }),
          mainFile: fileOperations.findNodeById(mainFileId)?.fileName || ''
        };
        
        // 发送请求 (假设createMaterial接受任意类型的参数)
        await createMaterial(materialData as any);
        
        ElMessage.success('物料创建成功');
        
        // 跳转到列表页
        router.push('/material-platform');
      } catch (error) {
        ElMessage.error('创建物料失败');
        console.error('创建物料失败:', error);
      } finally {
        submitting.value = false;
      }
    };
    
    // 取消创建
    const cancelCreate = () => {
      ElMessageBox.confirm('确定要取消创建吗？所有已输入的内容将会丢失。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        router.push('/material-platform');
      }).catch(() => {
        // 用户取消了确认对话框，不做任何操作
      });
    };
    
    // 步骤变更
    const handleStepChange = (step: number) => {
      currentStep.value = step;
    };
    
    // 下一步
    const handleNextStep = () => {
      if (currentStep.value === 1) {
        // 执行AI分析
        analyzingComponent.value = true;
        // 模拟分析延迟
        setTimeout(() => {
          isAnalyzed.value = true;
          currentStep.value = 2;
          // 设置默认显示JSON视图
          descriptorTabActive.value = 'json';
          analyzingComponent.value = false;
        }, 1000);
      } else if (currentStep.value < 2) {
        currentStep.value += 1;
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
    };
    
    // 创建文件处理函数
    const handleCreateFile = () => {
      fileOperations.createNewFile(null)();
    };
    
    // 创建文件夹处理函数
    const handleCreateFolder = () => {
      fileOperations.createNewFolder(null)();
    };
    
    // 初始化
    onMounted(() => {
      loadGroups();
      // 设置默认代码模板
      componentCode.value = defaultVue3Template;
    });
    
    // 监听文件内容变化
    watch(componentCode, (newCode) => {
      if (fileOperations.currentSelectedFileId.value && componentFiles.value[fileOperations.currentSelectedFileId.value]) {
        componentFiles.value[fileOperations.currentSelectedFileId.value] = newCode;
      }
    });
    
    return {
      loading,
      submitting,
      analyzingComponent,
      currentStep,
      isAnalyzed,
      descriptorTabActive,
      showTemplateDrawer,
      searchQuery: ref(''),
      fileTree,
      componentCode,
      materialForm,
      descriptorJson,
      newTag,
      steps,
      groups,
      fileList,
      
      // 文件操作相关状态和方法
      ...fileOperations,
      
      // 方法
      formatCurrentCode,
      analyzeComponent,
      handleFileChange,
      handleFolderUpload,
      handleSelectFile,
      handleCodeChange,
      addTag,
      removeTag,
      updateFormFromJson,
      handleStepChange,
      handleNextStep,
      handlePrevStep,
      handleFinish,
      submitForm,
      cancelCreate,
      handleGroupChange,
      handleCreateFile,
      handleCreateFolder,
      
      // 模板相关
      applyTemplate,
      previewTemplate,
      templates: mockTemplates
    };
  },
  render() {
    return (
      <div class="material-create-container" role="region" aria-label="创建物料">
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
              <BasicInfoForm
                materialForm={this.materialForm}
                groups={this.groups}
                onUpdate:materialForm={(form: Partial<Material>) => this.materialForm = form}
                onAdd-tag={this.addTag}
                onRemove-tag={this.removeTag}
              />
            ),
            
            /* 步骤2：组件代码 */
            'step-1': () => (
              <div class="code-editor-container">
                <div class="file-section">
                  <FileUploader
                    fileList={this.fileList}
                    onFile-change={this.handleFileChange}
                    onFolder-upload={this.handleFolderUpload}
                    onCreate-file={this.handleCreateFile}
                    onCreate-folder={this.handleCreateFolder}
                  />
                  
                  <FileTree
                    fileTree={this.fileTree}
                    currentSelectedFileId={this.currentSelectedFileId || ''}
                    onSelect-file={this.handleSelectFile}
                    onCreate-file={(node: ComponentFileNode) => this.createNewFile(node)()}
                    onCreate-folder={(node: ComponentFileNode) => this.createNewFolder(node)()}
                    onRename={(node: ComponentFileNode) => this.renameFileOrFolder(node)()}
                    onDelete={this.deleteFileOrFolder}
                    onSet-main={this.setAsMainFile}
                    onMove={this.showMoveDialog}
                  />
                </div>
                
                <CodeEditor
                  modelValue={this.componentCode}
                  onUpdate:modelValue={this.handleCodeChange}
                  language={this.currentEditingFile?.fileName.endsWith('.vue') ? 'vue' : 
                            this.currentEditingFile?.fileName.endsWith('.ts') ? 'typescript' :
                            this.currentEditingFile?.fileName.endsWith('.js') ? 'javascript' :
                            this.currentEditingFile?.fileName.endsWith('.css') ? 'css' : 'vue'}
                  currentFileName={this.currentEditingFile?.fileName}
                  onFormat={this.formatCurrentCode}
                  onOpen-template={() => this.showTemplateDrawer = true}
                />
                
                <FileOperationDialogs
                  showFileRenameDialog={this.showFileRenameDialog}
                  newFileName={this.newFileName}
                  showMoveFolderDialog={this.showMoveFolderDialog}
                  selectedNodeToMove={this.selectedNodeToMove}
                  availableFolders={this.availableFolders}
                  selectedTargetFolderId={this.selectedTargetFolderId}
                  onUpdate:showFileRenameDialog={(val: boolean) => this.showFileRenameDialog = val}
                  onUpdate:newFileName={(val: string) => this.newFileName = val}
                  onUpdate:showMoveFolderDialog={(val: boolean) => this.showMoveFolderDialog = val}
                  onUpdate:selectedTargetFolderId={(val: string) => this.selectedTargetFolderId = val}
                  onConfirm-rename={() => this.lastOperationCallback && this.lastOperationCallback()}
                  onConfirm-move={this.executeMove}
                />
              </div>
            ),
            
            /* 步骤3：AI分析与描述编辑 */
            'step-2': () => (
              <DescriptorEditor
                materialForm={this.materialForm}
                descriptorJson={this.descriptorJson}
                descriptorTabActive={this.descriptorTabActive}
                groups={this.groups}
                newTag={this.newTag}
                onUpdate:materialForm={(form: Partial<Material>) => this.materialForm = form}
                onUpdate:descriptorJson={(json: string) => this.descriptorJson = json}
                onUpdate:descriptorTabActive={(tab: string) => this.descriptorTabActive = tab}
                onUpdate:newTag={(val: string) => this.newTag = val}
                onAdd-tag={this.addTag}
                onRemove-tag={this.removeTag}
              />
            )
          }}
        </StepPanel>
        
        <TemplateDrawer
          visible={this.showTemplateDrawer}
          templates={this.templates}
          onUpdate:visible={(val: boolean) => this.showTemplateDrawer = val}
          onApply={this.applyTemplate}
          onPreview={this.previewTemplate}
        />
      </div>
    );
  }
}); 