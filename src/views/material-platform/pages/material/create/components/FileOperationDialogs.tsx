import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { ElDialog, ElInput, ElButton, ElSelect, ElOption, ElMessage } from 'element-plus';
import type { ComponentFileNode } from '../../../../types';

export default defineComponent({
  name: 'FileOperationDialogs',
  props: {
    showFileRenameDialog: {
      type: Boolean,
      default: false
    },
    newFileName: {
      type: String,
      default: ''
    },
    showMoveFolderDialog: {
      type: Boolean,
      default: false
    },
    selectedNodeToMove: {
      type: Object as PropType<ComponentFileNode | null>,
      default: null
    },
    availableFolders: {
      type: Array as PropType<ComponentFileNode[]>,
      default: () => []
    },
    selectedTargetFolderId: {
      type: String,
      default: ''
    }
  },
  emits: [
    'update:showFileRenameDialog', 
    'update:newFileName', 
    'update:showMoveFolderDialog', 
    'update:selectedTargetFolderId',
    'confirm-rename',
    'confirm-move'
  ],
  setup(props, { emit }) {
    const updateShowFileRenameDialog = (value: boolean) => {
      emit('update:showFileRenameDialog', value);
    };
    
    const updateNewFileName = (value: string) => {
      emit('update:newFileName', value);
    };
    
    const updateShowMoveFolderDialog = (value: boolean) => {
      emit('update:showMoveFolderDialog', value);
    };
    
    const updateSelectedTargetFolderId = (value: string) => {
      emit('update:selectedTargetFolderId', value);
    };
    
    const confirmRename = () => {
      if (props.newFileName) {
        emit('confirm-rename');
        updateShowFileRenameDialog(false);
      } else {
        ElMessage.warning('名称不能为空');
      }
    };
    
    const confirmMove = () => {
      emit('confirm-move');
      updateShowMoveFolderDialog(false);
    };
    
    return {
      updateShowFileRenameDialog,
      updateNewFileName,
      updateShowMoveFolderDialog,
      updateSelectedTargetFolderId,
      confirmRename,
      confirmMove
    };
  },
  render() {
    return (
      <div>
        {/* 文件重命名对话框 */}
        <ElDialog
          modelValue={this.showFileRenameDialog}
          title="输入名称"
          width="30%"
          destroyOnClose
          onUpdate:modelValue={this.updateShowFileRenameDialog}
          beforeClose={() => this.updateShowFileRenameDialog(false)}
        >
          <ElInput 
            modelValue={this.newFileName} 
            placeholder="请输入名称" 
            onInput={(val: string) => this.updateNewFileName(val)}
            onUpdate:modelValue={(val: string) => this.updateNewFileName(val)}
          />
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <ElButton onClick={() => this.updateShowFileRenameDialog(false)}>取消</ElButton>
            <ElButton type="primary" onClick={this.confirmRename}>确认</ElButton>
          </div>
        </ElDialog>
        
        {/* 移动文件/文件夹对话框 */}
        <ElDialog
          modelValue={this.showMoveFolderDialog}
          title="选择目标文件夹"
          width="30%"
          destroyOnClose
          onUpdate:modelValue={this.updateShowMoveFolderDialog}
          beforeClose={() => this.updateShowMoveFolderDialog(false)}
        >
          <div>
            <h4>请选择将 "{this.selectedNodeToMove?.fileName}" 移动到哪个文件夹：</h4>
            <ElSelect 
              modelValue={this.selectedTargetFolderId} 
              style={{ width: '100%', marginTop: '15px' }}
              onChange={(val: string) => this.updateSelectedTargetFolderId(val)}
              onUpdate:modelValue={(val: string) => this.updateSelectedTargetFolderId(val)}
            >
              {this.availableFolders.map((folder) => (
                <ElOption 
                  key={folder.id} 
                  label={folder.fileName} 
                  value={folder.id} 
                />
              ))}
            </ElSelect>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <ElButton onClick={() => this.updateShowMoveFolderDialog(false)}>取消</ElButton>
            <ElButton type="primary" onClick={this.confirmMove}>确认移动</ElButton>
          </div>
        </ElDialog>
      </div>
    );
  }
}); 