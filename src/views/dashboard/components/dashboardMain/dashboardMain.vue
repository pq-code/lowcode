<script setup lang="ts">
import { ref } from 'vue'
import dashboardSide from '@renderer/views/dashboard/components/dashboardSide/dashboardSide.vue'


let lengthWidth = ref( window.innerWidth > 1000 ? true : false)
// 收起撤面板
let onWindowResize = () => {
  return (lengthWidth.value = window.innerWidth >= 1000)
}
window.addEventListener('resize', onWindowResize)

</script>

<template>
  <div class="dashboard-main-center-left" :style="{ maxWidth: lengthWidth ? '220px' : '65px' }">
    <dashboardSide v-model="lengthWidth"></dashboardSide>
  </div>

  <!-- 子系统容器 -->
  <div class="dashboard-main-center-right" id="subsystem">
    <!-- <routersLink></routersLink> -->
    <div class="dashboard-main-center-right-main">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="less">
.dashboard-main-center-left {
  width: 220px;
  height: 100%;
}
.dashboard-main-center-right {
  height: 100%;
  width: 100%;
  background: #ebebeb;
  display: flex;
  flex-direction: column;

  .dashboard-main-center-right-main {
    // flex: 1;
    height: 100%;
    // height: calc(100% - 60px);
    // height: calc(100vh - 128px);
    overflow: scroll;
  }
}
</style>
