<template>
  <div class="element-demo">
    <h2>Element Plus 按需引入演示</h2>
    <el-row>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
    
    <el-divider></el-divider>
    
    <el-row>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
      />
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const date = ref('')
</script>

<style scoped>
.element-demo {
  padding: 20px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row .el-button {
  margin-right: 10px;
}
</style> 