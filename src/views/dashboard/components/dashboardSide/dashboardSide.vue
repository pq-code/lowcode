<script setup lang="ts">
import { routerMap } from '@renderer/router/index'

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
    modelValue: {
        type: Boolean,
        default() {
            return true;
        },
    },
});

console.log(routerMap)
</script>
<template>
  <div class="dashboardSide-center">
    <div class="ashboardSide-center-main">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="!modelValue"
        :collapse-transition="false"
        router
        :show-timeout="0"
        :hide-timeout="0"
      >
        <el-menu-item v-for="(item) in routerMap" :key="item.name" :index="item.path">
           <i class="iconfont icon-yingyongruanjian"></i>
          <template #title>{{ item.meta.title }}</template>
        </el-menu-item>
      </el-menu>
    </div>
    <el-button text='primary'>
      <i className='iconfont icon-caidan2' @click="()=>{emits('update:modelValue',!props.modelValue)}"></i>
    </el-button>
  </div>
</template>

<style scoped lang="less">
.dashboardSide-center {
  height: calc(100% - 20px);
  padding-bottom: 20px;
  width: 100%;
  background-color: #f6f6f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  .ashboardSide-center-main {
    height: 100%;
    width: 100%;
    .el-menu {
      background-color: #f8f8f8;
      border-right: none
    }
  }
}
</style>
