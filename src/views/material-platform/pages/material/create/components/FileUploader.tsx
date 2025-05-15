import { defineComponent } from 'vue';
import { ElUpload, ElButton, ElIcon } from 'element-plus';
import type { UploadUserFile } from 'element-plus';
import { Upload as UploadIcon, FolderAdd } from '@element-plus/icons-vue';

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
    
    return {
      handleFileChange,
      handleFolderUpload,
      createNewFile,
      createNewFolder
    };
  },
  render() {
    return (
      <div class="file-upload-container">
        <div class="upload-buttons">
          <ElUpload
            action=""
            accept=".vue,.jsx,.tsx,.js,.ts,.css,.scss,.less"
            autoUpload={false}
            fileList={this.fileList}
            onChange={this.handleFileChange}
            limit={10}
            multiple={true}
            beforeUpload={() => false}
          >
            <ElButton type="primary" icon={<ElIcon><UploadIcon /></ElIcon>}>上传文件</ElButton>
          </ElUpload>
          
          <ElUpload
            action=""
            multiple
            autoUpload={false}
            fileList={this.fileList}
            onChange={(file) => this.handleFolderUpload(file.raw || file, this.fileList)}
            beforeUpload={() => false}
          >
            <ElButton icon={<ElIcon><FolderAdd /></ElIcon>}>选择多个文件</ElButton>
          </ElUpload>
        </div>
        
        <div class="file-tree-actions">
          <ElButton 
            size="small" 
            type="primary" 
            icon={<ElIcon><UploadIcon /></ElIcon>}
            onClick={this.createNewFile}
          >
            新建文件
          </ElButton>
          <ElButton 
            size="small" 
            icon={<ElIcon><FolderAdd /></ElIcon>}
            onClick={this.createNewFolder}
          >
            新建文件夹
          </ElButton>
        </div>
      </div>
    );
  }
}); 