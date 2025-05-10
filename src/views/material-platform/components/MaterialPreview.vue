<template>
  <div class="material-preview">
    <div class="preview-header">
      <h2>物料预览: {{ material?.name || '加载中...' }}</h2>
      <p class="description">{{ material?.description || '暂无描述' }}</p>
    </div>
    
    <div v-if="loading" class="loading">
      <el-skeleton :rows="10" animated />
    </div>
    
    <div v-else-if="!material" class="not-found">
      <el-empty description="未找到物料" />
    </div>
    
    <template v-else>
      <div class="preview-content">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="component-preview">
              <div class="preview-title">组件预览</div>
              <div class="preview-container">
                <div class="preview-iframe">
                  <iframe 
                    v-if="material" 
                    :src="`/api/preview?materialId=${material.id}`"
                    frameborder="0"
                    class="preview-frame"
                  ></iframe>
                  
                  <!-- 模拟预览 -->
                  <div v-if="material.type === 'button'" class="mock-preview">
                    <el-button type="primary">按钮预览</el-button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="material-json">
              <div class="json-title">物料配置</div>
              <div class="json-content">
                <pre>{{ formatJson(material) }}</pre>
              </div>
            </div>
          </el-col>
          
          <el-col :span="8">
            <div class="material-details">
              <div class="details-title">物料信息</div>
              <div class="details-content">
                <div class="detail-item">
                  <span class="label">ID:</span>
                  <span class="value">{{ material.id }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">名称:</span>
                  <span class="value">{{ material.name }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">类型:</span>
                  <span class="value">{{ material.type }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">版本:</span>
                  <span class="value">{{ material.version }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">分组:</span>
                  <span class="value">{{ getGroupName(material.group) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">创建时间:</span>
                  <span class="value">{{ formatTime(material.createTime) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">更新时间:</span>
                  <span class="value">{{ formatTime(material.updateTime) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">创建者:</span>
                  <span class="value">{{ material.creator || '系统' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">标签:</span>
                  <div class="tag-list">
                    <el-tag 
                      v-for="tag in material.tags" 
                      :key="tag" 
                      size="small"
                      class="tag-item"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="props-details">
              <div class="props-title">属性列表</div>
              <div class="props-content">
                <el-collapse>
                  <el-collapse-item 
                    v-for="(prop, propName) in material.props" 
                    :key="propName"
                    :title="prop.title || propName"
                  >
                    <div class="prop-detail">
                      <div class="prop-item">
                        <span class="label">属性名:</span>
                        <span class="value">{{ propName }}</span>
                      </div>
                      <div class="prop-item">
                        <span class="label">类型:</span>
                        <span class="value">{{ prop.type }}</span>
                      </div>
                      <div class="prop-item">
                        <span class="label">默认值:</span>
                        <span class="value">{{ prop.default !== undefined ? prop.default : '无' }}</span>
                      </div>
                      <div class="prop-item">
                        <span class="label">必填:</span>
                        <span class="value">{{ prop.required ? '是' : '否' }}</span>
                      </div>
                      <div class="prop-item" v-if="prop.description">
                        <span class="label">描述:</span>
                        <span class="value">{{ prop.description }}</span>
                      </div>
                      <div class="prop-item" v-if="prop.enum && prop.enum.length">
                        <span class="label">可选值:</span>
                        <div class="enum-list">
                          <el-tag 
                            v-for="(value, index) in prop.enum" 
                            :key="index"
                            size="small"
                            class="enum-item"
                          >
                            {{ value }}
                          </el-tag>
                        </div>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <div class="preview-actions">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="editMaterial">编辑物料</el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchMaterialDetail } from '../services/materialService';
import type { Material } from '../services/materialService';

// 扩展Material接口，确保包含props属性
interface MaterialWithProps extends Material {
  props?: Record<string, any>;
}

const route = useRoute();
const router = useRouter();
const materialId = route.params.id as string;

const material = ref<MaterialWithProps | null>(null);
const loading = ref(true);

// 加载物料详情
const loadMaterial = async () => {
  try {
    loading.value = true;
    material.value = await fetchMaterialDetail(materialId);
    loading.value = false;
  } catch (error) {
    loading.value = false;
    ElMessage.error('加载物料详情失败');
    console.error('加载物料详情失败:', error);
  }
};

// 获取分组名称
const getGroupName = (groupId: string) => {
  const groupMap: Record<string, string> = {
    'base': '基础组件',
    'layout': '布局组件',
    'form': '表单组件',
    'data': '数据组件',
    'feedback': '反馈组件'
  };
  
  return groupMap[groupId] || groupId;
};

// 格式化时间
const formatTime = (time?: string) => {
  if (!time) return '未知';
  
  try {
    const date = new Date(time);
    return date.toLocaleString();
  } catch (e) {
    return '格式错误';
  }
};

// 格式化JSON
const formatJson = (data: any) => {
  return JSON.stringify(data, null, 2);
};

// 编辑物料
const editMaterial = () => {
  if (material.value) {
    router.push(`/material-platform/edit/${material.value.id}`);
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 生命周期钩子
onMounted(() => {
  loadMaterial();
});
</script>

<style scoped lang="less">
.material-preview {
  padding: 20px;
  
  .preview-header {
    margin-bottom: 30px;
    
    h2 {
      margin: 0 0 10px;
    }
    
    .description {
      color: #606266;
      margin: 0;
    }
  }
  
  .loading,
  .not-found {
    padding: 40px 0;
  }
  
  .preview-content {
    margin-bottom: 30px;
  }
  
  .component-preview {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    overflow: hidden;
    
    .preview-title {
      padding: 15px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid #ebeef5;
    }
    
    .preview-container {
      padding: 30px;
      
      .preview-iframe {
        width: 100%;
        height: 200px;
        border: 1px dashed #dcdfe6;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .preview-frame {
          width: 100%;
          height: 100%;
        }
        
        .mock-preview {
          padding: 20px;
        }
      }
    }
  }
  
  .material-json {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
    
    .json-title {
      padding: 15px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid #ebeef5;
    }
    
    .json-content {
      padding: 15px;
      max-height: 400px;
      overflow-y: auto;
      background-color: #f5f7fa;
      
      pre {
        margin: 0;
        white-space: pre-wrap;
        font-family: monospace;
      }
    }
  }
  
  .material-details,
  .props-details {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    overflow: hidden;
    
    .details-title,
    .props-title {
      padding: 15px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid #ebeef5;
    }
    
    .details-content,
    .props-content {
      padding: 15px;
    }
    
    .detail-item,
    .prop-item {
      margin-bottom: 10px;
      
      .label {
        font-weight: 500;
        color: #303133;
        display: block;
        margin-bottom: 5px;
      }
      
      .value {
        color: #606266;
      }
      
      .tag-list,
      .enum-list {
        margin-top: 5px;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }
    }
  }
  
  .preview-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
}
</style> 