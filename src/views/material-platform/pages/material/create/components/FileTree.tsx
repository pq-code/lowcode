import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { ElTree, ElIcon, ElPopover, ElMessage } from 'element-plus';
import {
  Document,
  Edit,
  Delete,
  FolderAdd,
  DocumentAdd,
  Folder,
  Position as MoveIcon
} from '@element-plus/icons-vue';
import type { ComponentFileNode } from '../../../../types';

export default defineComponent({
  name: 'FileTree',
  props: {
    fileTree: {
      type: Array as PropType<ComponentFileNode[]>,
      required: true
    }
  },
  emits: ['select-file', 'create-file', 'create-folder', 'rename', 'delete', 'move'],
  setup(props, { emit }) {
    const selectFile = (node: ComponentFileNode) => {
      if (!node.isFolder) {
        emit('select-file', node);
      }
    };
    
    const handleCreateFile = (node: ComponentFileNode) => {
      emit('create-file', node);
    };
    
    const handleCreateFolder = (node: ComponentFileNode) => {
      emit('create-folder', node);
    };
    
    const handleRename = (node: ComponentFileNode) => {
      emit('rename', node);
    };
    
    const handleDelete = (node: ComponentFileNode) => {
      emit('delete', node);
    };
    
    const handleMove = (node: ComponentFileNode) => {
      emit('move', node);
    };
    
    // 节点点击处理
    const handleNodeClick = (data: ComponentFileNode) => {
      if (!data.isFolder) {
        selectFile(data);
      }
    };
    
    return {
      selectFile,
      handleCreateFile,
      handleCreateFolder,
      handleRename,
      handleDelete,
      handleMove,
      handleNodeClick
    };
  },
  render() {
    return (
      <div class="file-tree-container">
        <ElTree
          data={this.fileTree}
          props={{
            children: 'children',
            label: 'fileName',
            isLeaf: (data: any) => !data.isFolder
          }}
          node-key="id"
          default-expand-all
          onNode-click={this.handleNodeClick}
          v-slots={{
            default: ({ node, data }: any) => (
              <div class="custom-tree-node">
                <span class="node-content" onClick={() => !data.isFolder && this.selectFile(data)}>
                  <ElIcon class="node-icon">
                    {data.isFolder ? <Folder /> : <Document />}
                  </ElIcon>
                  <span class="node-label">
                    {data.fileName}
                  </span>
                </span>
                <span class="node-actions">
                  <ElPopover
                    placement="bottom"
                    width={80}
                    trigger="click"
                    v-slots={{
                      reference: () => (
                        <ElIcon><Edit /></ElIcon>
                      ),
                      default: () => (
                        <div class="node-action-menu">
                          {data.isFolder && (
                            <div class="action-item" onClick={() => this.handleCreateFile(data)}>
                              <ElIcon><DocumentAdd /></ElIcon>
                              <span>新建文件</span>
                            </div>
                          )}
                          {data.isFolder && (
                            <div class="action-item" onClick={() => this.handleCreateFolder(data)}>
                              <ElIcon><FolderAdd /></ElIcon>
                              <span>新建文件夹</span>
                            </div>
                          )}
                          <div class="action-item" onClick={() => this.handleRename(data)}>
                            <ElIcon><Edit /></ElIcon>
                            <span>重命名</span>
                          </div>
                          {data.parentId && (
                            <div class="action-item" onClick={() => this.handleMove(data)}>
                              <ElIcon><MoveIcon /></ElIcon>
                              <span>移动文件</span>
                            </div>
                          )}
                          <div class="action-item" onClick={() => this.handleDelete(data)}>
                            <ElIcon><Delete /></ElIcon>
                            <span>删除</span>
                          </div>
                        </div>
                      )
                    }}
                  />
                </span>
              </div>
            )
          }}
        />
      </div>
    );
  }
}); 