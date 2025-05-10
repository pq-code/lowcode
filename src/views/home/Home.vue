<template>
  <div class="home-container">
    <div class="header">
      <div class="logo">
        <img src="@/assets/vue.svg" alt="Logo" class="logo-img" />
        <h1 class="system-name"> 低代码开发系统</h1>
      </div>
      <div class="version">Version 1.0.0</div>
    </div>
    
    <div class="content">
      <div class="platform-cards">
        <div class="platform-card" @click="navigateTo('/material-platform')">
          <div class="card-icon">
            <el-icon><Tools /></el-icon>
          </div>
          <h2 class="card-title">物料平台</h2>
          <p class="card-desc">管理组件物料、上传自定义组件、配置组件描述</p>
          <el-button type="primary" class="card-btn">进入平台</el-button>
        </div>
        
        <div class="platform-card" @click="navigateTo('/lowcode')">
          <div class="card-icon">
            <el-icon><Grid /></el-icon>
          </div>
          <h2 class="card-title">低代码平台</h2>
          <p class="card-desc">通过拖拽方式构建页面、配置组件属性、生成代码</p>
          <el-button type="primary" class="card-btn">开始开发</el-button>
        </div>
      </div>
      
      <div class="system-info">
        <h3>系统概览</h3>
        <div class="info-content">
          <div class="info-item">
            <h4>物料平台</h4>
            <p>物料平台负责组件物料的管理，提供组件上传、AI辅助配置、组件预览和物料发布功能。</p>
            <p>所有物料配置将存储在数据库中，并通过API提供给低代码平台使用。</p>
          </div>
          
          <div class="info-item">
            <h4>低代码平台</h4>
            <p>低代码平台提供可视化开发环境，支持组件拖拽、属性配置、页面预览和代码生成。</p>
            <p>平台通过API从物料平台获取物料描述，实现物料与渲染引擎的解耦。</p>
          </div>
        </div>
      </div>
    </div>
    
    <footer class="footer">
      <p>©2025 低代码平台 | <a href="#">使用文档</a> | <a href="#">GitHub</a></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Tools, Grid } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped lang="less">
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  .logo {
    display: flex;
    align-items: center;
    
    .logo-img {
      height: 40px;
      margin-right: 15px;
    }
    
    .system-name {
      font-size: 24px;
      font-weight: 600;
      color: #409eff;
      margin: 0;
    }
  }
  
  .version {
    color: #909399;
    font-size: 14px;
  }
}

.content {
  flex: 1;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.platform-cards {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.platform-card {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .card-icon {
    font-size: 48px;
    color: #409eff;
    margin-bottom: 20px;
  }
  
  .card-title {
    font-size: 22px;
    margin: 0 0 15px;
    color: #303133;
  }
  
  .card-desc {
    color: #606266;
    margin-bottom: 25px;
    line-height: 1.6;
  }
  
  .card-btn {
    margin-top: auto;
  }
}

.system-info {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  h3 {
    font-size: 20px;
    margin: 0 0 20px;
    color: #303133;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 10px;
  }
  
  .info-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .info-item {
    h4 {
      font-size: 18px;
      margin: 0 0 10px;
      color: #409eff;
    }
    
    p {
      color: #606266;
      line-height: 1.6;
      margin: 0 0 10px;
    }
  }
}

.footer {
  text-align: center;
  padding: 20px;
  background-color: #fff;
  color: #909399;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  
  a {
    color: #409eff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 