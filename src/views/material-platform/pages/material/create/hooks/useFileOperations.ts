import { ref } from 'vue';
import type { Ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { ComponentFileNode } from '../../../../types';

export interface UseFileOperationsOptions {
  fileTree: Ref<ComponentFileNode[]>;
  componentFiles: Ref<Record<string, string>>;
  materialName: Ref<string>;
}

export default function useFileOperations(options: UseFileOperationsOptions) {
  const { fileTree, componentFiles, materialName } = options;
  
  const currentSelectedFileId = ref<string | null>(null);
  const currentEditingFile = ref<ComponentFileNode | null>(null);
  const showFileRenameDialog = ref(false);
  const newFileName = ref('');
  const lastOperationCallback = ref<Function | null>(null);
  
  // 在setup函数中添加显示移动对话框所需的状态
  const showMoveFolderDialog = ref(false);
  const availableFolders = ref<ComponentFileNode[]>([]);
  const selectedNodeToMove = ref<ComponentFileNode | null>(null);
  const selectedTargetFolderId = ref<string>('');
  
  // 选择文件
  const selectFile = (node: ComponentFileNode) => {
    if (node.isFolder) return;
    
    currentSelectedFileId.value = node.id;
    currentEditingFile.value = node;
    return componentFiles.value[node.id] || '';
  };
  
  // 获取或创建父文件夹
  const getOrCreateParentFolder = (parentNode: ComponentFileNode | null): ComponentFileNode => {
    // 如果已经有父节点，直接返回
    if (parentNode) return parentNode;
    
    // 否则使用根组件文件夹
    const componentName = materialName.value || 'component';
    const existingFolder = fileTree.value.find(node => node.fileName === componentName && node.isFolder);
    
    // 如果根文件夹不存在，则创建一个
    if (existingFolder) {
      return existingFolder;
    }
    
    // 创建新的根文件夹
    const newRootFolder: ComponentFileNode = {
      id: `folder_${Date.now()}`,
      fileName: componentName,
      isFolder: true,
      children: []
    };
    
    fileTree.value.push(newRootFolder);
    return newRootFolder;
  };
  
  // 创建新文件
  const createNewFile = (parentNode: ComponentFileNode | null) => {
    newFileName.value = 'NewFile.vue';
    showFileRenameDialog.value = true;
    
    const createFile = () => {
      const fileName = newFileName.value;
      const fileId = `file_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const defaultContent = '<template>\n  <div>New Component</div>\n</template>\n\n<script setup lang="ts">\n// Your code here\n</script>\n\n<style scoped>\n/* Your styles here */\n</style>';
      
      // 获取或创建父文件夹
      const parentFolder = getOrCreateParentFolder(parentNode);
      
      // 创建文件节点
      const newFileNode: ComponentFileNode = {
        id: fileId,
        fileName: fileName,
        isFolder: false,
        content: defaultContent,
        parentId: parentFolder.id,
        path: parentFolder.path ? `${parentFolder.path}/${fileName}` : fileName
      };
      
      // 添加到父文件夹
      if (parentFolder.children) {
        parentFolder.children.push(newFileNode);
      } else {
        parentFolder.children = [newFileNode];
      }
      
      // 保存文件内容
      componentFiles.value[fileId] = defaultContent;
      
      // 选择新文件
      selectFile(newFileNode);
      
      // 操作完成关闭对话框
      showFileRenameDialog.value = false;
    };
    
    lastOperationCallback.value = createFile;
    return createFile;
  };
  
  // 创建新文件夹
  const createNewFolder = (parentNode: ComponentFileNode | null) => {
    newFileName.value = 'NewFolder';
    showFileRenameDialog.value = true;
    
    const createFolder = () => {
      const folderName = newFileName.value;
      const folderId = `folder_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // 获取或创建父文件夹
      const parentFolder = getOrCreateParentFolder(parentNode);
      
      // 创建文件夹节点
      const newFolderNode: ComponentFileNode = {
        id: folderId,
        fileName: folderName,
        isFolder: true,
        children: [],
        parentId: parentFolder.id,
        path: parentFolder.path ? `${parentFolder.path}/${folderName}` : folderName
      };
      
      // 添加到父文件夹
      if (parentFolder.children) {
        parentFolder.children.push(newFolderNode);
      } else {
        parentFolder.children = [newFolderNode];
      }
      
      // 操作完成关闭对话框
      showFileRenameDialog.value = false;
    };
    
    lastOperationCallback.value = createFolder;
    return createFolder;
  };
  
  // 查找节点
  const findNodeById = (id: string, nodes: ComponentFileNode[]): ComponentFileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      
      if (node.children && node.children.length > 0) {
        const found = findNodeById(id, node.children);
        if (found) return found;
      }
    }
    
    return null;
  };
  
  // 删除文件或文件夹
  const deleteFileOrFolder = (node: ComponentFileNode) => {
    if (!node.parentId) return;
    
    // 查找父节点
    const findParentNode = (nodeId: string, tree: ComponentFileNode[]): ComponentFileNode | null => {
      for (const item of tree) {
        if (item.id === nodeId) return item;
        if (item.children) {
          const found = findParentNode(nodeId, item.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const parentNode = findParentNode(node.parentId, fileTree.value);
    if (!parentNode || !parentNode.children) return;
    
    // 从父节点的子节点列表中移除
    parentNode.children = parentNode.children.filter(child => child.id !== node.id);
    
    // 如果当前选中的文件被删除，则清除选择
    if (currentSelectedFileId.value === node.id) {
      currentSelectedFileId.value = null;
      currentEditingFile.value = null;
    }
    
    // 如果是文件，清除文件内容缓存
    if (!node.isFolder) {
      delete componentFiles.value[node.id];
    }
  };
  
  // 重命名文件或文件夹
  const renameFileOrFolder = (node: ComponentFileNode) => {
    newFileName.value = node.fileName;
    showFileRenameDialog.value = true;
    
    const performRename = () => {
      const oldName = node.fileName;
      const newName = newFileName.value;
      
      // 更新节点名称
      node.fileName = newName;
      
      // 更新路径
      if (node.path) {
        node.path = node.path.replace(oldName, newName);
      }
      
      // 如果是文件夹，需要更新所有子文件的路径
      if (node.isFolder && node.children) {
        const updateChildrenPaths = (children: ComponentFileNode[], oldPath: string, newPath: string) => {
          for (const child of children) {
            if (child.path) {
              child.path = child.path.replace(oldPath, newPath);
            }
            
            if (child.isFolder && child.children) {
              updateChildrenPaths(child.children, oldPath, newPath);
            }
          }
        };
        
        updateChildrenPaths(node.children, oldName, newName);
      }
    };
    
    lastOperationCallback.value = performRename;
    return performRename;
  };
  
  // 移动文件或文件夹
  const moveFileOrFolder = (nodeId: string, targetFolderId: string) => {
    // 查找要移动的节点
    const nodeToMove = findNodeById(nodeId, fileTree.value);
    if (!nodeToMove) {
      ElMessage.error('未找到要移动的文件');
      return;
    }
    
    // 查找目标文件夹
    const targetFolder = findNodeById(targetFolderId, fileTree.value);
    if (!targetFolder || !targetFolder.isFolder) {
      ElMessage.error('目标不是文件夹或不存在');
      return;
    }
    
    // 不能移动到自己的子文件夹中
    if (nodeToMove.isFolder) {
      let parent = targetFolder;
      while (parent) {
        if (parent.id === nodeToMove.id) {
          ElMessage.error('不能将文件夹移动到其子文件夹中');
          return;
        }
        
        if (!parent.parentId) break;
        const nextParent = findNodeById(parent.parentId, fileTree.value);
        if (!nextParent) break;
        parent = nextParent;
      }
    }
    
    // 查找当前父节点
    const currentParentId = nodeToMove.parentId;
    if (!currentParentId) {
      ElMessage.error('无法移动根文件夹');
      return;
    }
    
    const currentParent = findNodeById(currentParentId, fileTree.value);
    if (!currentParent || !currentParent.children) {
      ElMessage.error('源文件夹不存在或为空');
      return;
    }
    
    // 从当前父节点移除
    currentParent.children = currentParent.children.filter(child => child.id !== nodeToMove.id);
    
    // 添加到目标文件夹
    if (!targetFolder.children) {
      targetFolder.children = [];
    }
    
    // 更新路径
    const updateNodePath = (node: ComponentFileNode, newParentPath: string) => {
      const newPath = `${newParentPath}/${node.fileName}`;
      node.path = newPath;
      node.parentId = targetFolder.id;
      
      if (node.isFolder && node.children) {
        for (const child of node.children) {
          updateNodePath(child, newPath);
        }
      }
    };
    
    // 更新路径
    updateNodePath(nodeToMove, targetFolder.path || targetFolder.fileName);
    
    // 添加到新文件夹
    targetFolder.children.push(nodeToMove);
    
    ElMessage.success('移动成功');
  };
  
  // 显示移动对话框
  const showMoveDialog = (node: ComponentFileNode) => {
    if (!node.parentId) {
      ElMessage.warning('根文件夹不能移动');
      return;
    }
    
    // 获取扁平化的子文件夹列表
    const getFlatChildFolders = (folders: ComponentFileNode[]): ComponentFileNode[] => {
      let result: ComponentFileNode[] = [];
      
      for (const folder of folders) {
        if (folder.isFolder && folder.id !== node.id) {
          result.push(folder);
          
          if (folder.children) {
            const childFolders = folder.children.filter(item => item.isFolder && item.id !== node.id);
            if (childFolders.length > 0) {
              result = [...result, ...getFlatChildFolders(childFolders)];
            }
          }
        }
      }
      
      return result;
    };
    
    // 获取所有可用文件夹
    availableFolders.value = getFlatChildFolders(fileTree.value);
    
    // 如果没有可用文件夹
    if (availableFolders.value.length === 0) {
      ElMessage.warning('没有可用的目标文件夹');
      return;
    }
    
    // 设置默认选择的目标文件夹
    selectedTargetFolderId.value = availableFolders.value[0].id;
    // 保存要移动的节点
    selectedNodeToMove.value = node;
    // 显示移动对话框
    showMoveFolderDialog.value = true;
  };
  
  // 执行移动操作
  const executeMove = () => {
    if (selectedNodeToMove.value && selectedTargetFolderId.value) {
      moveFileOrFolder(selectedNodeToMove.value.id, selectedTargetFolderId.value);
      // 关闭对话框
      showMoveFolderDialog.value = false;
    }
  };
  
  // 设置文件为主文件
  const setAsMainFile = (node: ComponentFileNode) => {
    if (node.isFolder) {
      ElMessage.warning('文件夹不能设为主文件');
      return;
    }
    
    if (!node.fileName.endsWith('.vue')) {
      ElMessage.warning('只有Vue文件可以设为主文件');
      return;
    }
    
    // 重置所有文件的主文件标志
    const resetMainFlag = (nodes: ComponentFileNode[]) => {
      for (const n of nodes) {
        if (!n.isFolder) {
          n.isMain = false;
        }
        
        if (n.children) {
          resetMainFlag(n.children);
        }
      }
    };
    
    resetMainFlag(fileTree.value);
    
    // 标记当前文件为主文件
    node.isMain = true;
    ElMessage.success(`已将 ${node.fileName} 设为主文件`);
  };
  
  // 添加文件到文件树
  const addFileToTree = (fileName: string, content: string) => {
    const fileId = `file_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const componentName = materialName.value || 'component';
    const folderPath = `${componentName}/`;
    const filePath = `${folderPath}${fileName}`;
    
    // 检查根目录是否已存在组件文件夹
    let rootFolder = fileTree.value.find(node => node.fileName === componentName && node.isFolder);
    
    if (!rootFolder) {
      // 创建根文件夹
      rootFolder = {
        id: `folder_${Date.now()}`,
        fileName: componentName,
        isFolder: true,
        children: []
      };
      fileTree.value.push(rootFolder);
    }
    
    // 创建文件节点
    const fileNode: ComponentFileNode = {
      id: fileId,
      fileName: fileName,
      isFolder: false,
      content: content,
      parentId: rootFolder.id,
      path: filePath,
      lastModified: Date.now(),
      language: fileName.split('.').pop() || 'vue',
      size: content.length,
      isMain: fileName.includes('index') || fileName === `${componentName}.vue` // 自动判断主文件
    };
    
    // 将文件添加到根文件夹
    if (rootFolder.children) {
      rootFolder.children.push(fileNode);
    } else {
      rootFolder.children = [fileNode];
    }
    
    // 保存文件内容
    componentFiles.value[fileId] = content;
    
    // 如果是第一个文件，自动选择它
    if (currentSelectedFileId.value === null) {
      currentSelectedFileId.value = fileId;
      currentEditingFile.value = fileNode;
      return content;
    }
    
    return null;
  };
  
  // 按路径添加文件到树结构
  const addFileWithPathToTree = (paths: string[], content: string) => {
    const componentName = materialName.value || 'component';
    
    // 确保根目录是组件名
    let rootFolder = fileTree.value.find(node => node.fileName === componentName && node.isFolder);
    
    if (!rootFolder) {
      rootFolder = {
        id: `folder_${Date.now()}`,
        fileName: componentName,
        isFolder: true,
        children: []
      };
      fileTree.value.push(rootFolder);
    }
    
    // 从路径中创建文件树结构
    let currentNode = rootFolder;
    let currentPath = componentName;
    
    // 第一个元素是文件夹名，最后一个是文件名
    for (let i = 0; i < paths.length; i++) {
      const pathPart = paths[i];
      currentPath += `/${pathPart}`;
      
      // 最后一个元素是文件
      if (i === paths.length - 1) {
        const fileId = `file_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const fileNode: ComponentFileNode = {
          id: fileId,
          fileName: pathPart,
          isFolder: false,
          content: content,
          parentId: currentNode.id,
          path: currentPath,
          lastModified: Date.now(),
          language: pathPart.split('.').pop() || 'vue',
          size: content.length,
          isMain: pathPart.includes('index') || pathPart === `${componentName}.vue` // 自动判断主文件
        };
        
        if (!currentNode.children) {
          currentNode.children = [];
        }
        
        currentNode.children.push(fileNode);
        
        // 保存文件内容
        componentFiles.value[fileId] = content;
        
        // 如果是第一个文件，自动选择它
        if (currentSelectedFileId.value === null) {
          currentSelectedFileId.value = fileId;
          currentEditingFile.value = fileNode;
          return content;
        }
      } 
      // 处理文件夹
      else {
        let folderNode = currentNode.children?.find(node => 
          node.fileName === pathPart && node.isFolder);
        
        if (!folderNode) {
          folderNode = {
            id: `folder_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            fileName: pathPart,
            isFolder: true,
            children: [],
            parentId: currentNode.id,
            path: currentPath
          };
          
          if (!currentNode.children) {
            currentNode.children = [];
          }
          
          currentNode.children.push(folderNode);
        }
        
        currentNode = folderNode;
      }
    }
    
    return null;
  };
  
  // 寻找主文件ID
  const findMainFileId = (rootFolder: ComponentFileNode): string | undefined => {
    // 查找被标记为主文件的节点
    const findMainFile = (node: ComponentFileNode): string | undefined => {
      if (!node.isFolder && node.isMain) {
        return node.id;
      }
      
      if (node.children) {
        for (const child of node.children) {
          const foundId = findMainFile(child);
          if (foundId) return foundId;
        }
      }
      
      return undefined;
    };
    
    // 首先查找标记为主文件的
    const mainId = findMainFile(rootFolder);
    if (mainId) return mainId;
    
    // 如果没有标记，查找index.vue或与组件名同名的.vue文件
    const findMainByName = (node: ComponentFileNode): string | undefined => {
      const componentName = materialName.value || '';
      
      if (!node.isFolder && 
          (node.fileName === 'index.vue' || 
          node.fileName === `${componentName}.vue`)) {
        return node.id;
      }
      
      if (node.children) {
        for (const child of node.children) {
          const foundId = findMainByName(child);
          if (foundId) return foundId;
        }
      }
      
      return undefined;
    };
    
    const mainByNameId = findMainByName(rootFolder);
    if (mainByNameId) return mainByNameId;
    
    // 如果还没找到，就使用第一个.vue文件
    const findFirstVueFile = (node: ComponentFileNode): string | undefined => {
      if (!node.isFolder && node.fileName.endsWith('.vue')) {
        return node.id;
      }
      
      if (node.children) {
        for (const child of node.children) {
          const foundId = findFirstVueFile(child);
          if (foundId) return foundId;
        }
      }
      
      return undefined;
    };
    
    return findFirstVueFile(rootFolder);
  };
  
  return {
    // 状态
    currentSelectedFileId,
    currentEditingFile,
    showFileRenameDialog,
    newFileName,
    lastOperationCallback,
    showMoveFolderDialog,
    availableFolders,
    selectedNodeToMove,
    selectedTargetFolderId,
    
    // 方法
    selectFile,
    createNewFile,
    createNewFolder,
    deleteFileOrFolder,
    renameFileOrFolder,
    moveFileOrFolder,
    showMoveDialog,
    executeMove,
    setAsMainFile,
    addFileToTree,
    addFileWithPathToTree,
    findNodeById,
    findMainFileId
  };
} 