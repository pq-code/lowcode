import { defineComponent } from 'vue';
import { ElUpload, ElButton, ElIcon, ElTooltip, ElMessage } from 'element-plus';
import type { UploadUserFile } from 'element-plus';
import { Upload as UploadIcon, FolderAdd, Document, DocumentAdd } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'FileUploader',
  props: {
    fileList: {
      type: Array as () => UploadUserFile[],
      default: () => []
    }
  },
  emits: ['file-change', 'folder-upload', 'create-file', 'create-folder'],
  setup(props, { emit }) {
    const handleFileChange = (uploadFile: any) => {
      // 确保使用最新上传的文件
      const file = uploadFile.raw || uploadFile;
      emit('file-change', file);
    };
    
    const handleFolderUpload = (file: any, fileList: any[]) => {
      emit('folder-upload', file, fileList);
    };
    
    const createNewFile = () => {
      emit('create-file', null);
    };
    
    const createNewFolder = () => {
      emit('create-folder', null);
    };
    
    // 检查是否支持文件夹上传
    const isFolderUploadSupported = () => {
      const input = document.createElement('input');
      input.type = 'file';
      // @ts-ignore - 浏览器特定属性，TypeScript不认识
      return typeof input.webkitdirectory !== 'undefined' || 
        // @ts-ignore - 浏览器特定属性
        typeof input.mozdirectory !== 'undefined' || 
        // @ts-ignore - 浏览器特定属性
        typeof input.directory !== 'undefined';
    };
    
    const supportsFolderUpload = isFolderUploadSupported();
    
    // 当不支持文件夹上传时显示提示
    const showFolderUploadNotSupported = () => {
      ElMessage.warning('您的浏览器不支持文件夹上传，请使用Chrome或Edge浏览器');
    };
    
    return {
      handleFileChange,
      handleFolderUpload,
      createNewFile,
      createNewFolder,
      supportsFolderUpload,
      showFolderUploadNotSupported
    };
  },
  render() {
    return (
      <div class="file-upload-container">
        <ElTooltip
          content="支持.vue、.jsx、.tsx等组件文件，支持拖拽上传"
          placement="top"
        >
          <div class="upload-area">
            <ElUpload
              action=""
              accept=".vue,.jsx,.tsx,.js,.ts,.css,.scss,.less"
              autoUpload={false}
              fileList={this.fileList}
              onChange={this.handleFileChange}
              limit={30}
              multiple={true}
              beforeUpload={() => false}
              drag
            >
              <div class="upload-placeholder">
                <ElIcon class="upload-icon"><UploadIcon /></ElIcon>
                <div class="upload-text">
                  <span>拖拽文件到此处 或 <em>点击选择文件</em></span>
                  <p class="upload-subtext">支持 .vue、.jsx、.tsx 等组件相关文件</p>
                </div>
              </div>
            </ElUpload>
          </div>
        </ElTooltip>
        
        <div class="file-operations">
          <div class="file-upload-actions">
            {this.supportsFolderUpload ? (
              <ElUpload
                action=""
                autoUpload={false}
                fileList={this.fileList}
                onChange={(file) => this.handleFolderUpload(file.raw || file, this.fileList)}
                beforeUpload={() => false}
                // @ts-ignore - Element Plus不支持目录上传，但可以通过原生属性支持
                webkitdirectory="true"
              >
                <ElButton type="primary" icon={<ElIcon><FolderAdd /></ElIcon>}>
                  上传文件夹
                </ElButton>
              </ElUpload>
            ) : (
              <ElButton 
                type="primary" 
                icon={<ElIcon><FolderAdd /></ElIcon>}
                onClick={this.showFolderUploadNotSupported}
              >
                上传文件夹
              </ElButton>
            )}
          </div>
          
          <div class="file-tree-actions">
            <ElButton 
              size="default" 
              type="success" 
              icon={<ElIcon><DocumentAdd /></ElIcon>}
              onClick={this.createNewFile}
            >
              新建文件
            </ElButton>
            <ElButton 
              size="default" 
              icon={<ElIcon><FolderAdd /></ElIcon>}
              onClick={this.createNewFolder}
            >
              新建文件夹
            </ElButton>
          </div>
        </div>
      </div>
    );
  }
}); 