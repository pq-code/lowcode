<script setup lang="ts">
import dashboardHead from '@renderer/views/dashboard/components/dashboardHead/dashboardHead.vue'
import dashboardMain from '@renderer/views/dashboard/components/dashboardMain/dashboardMain.vue'

// import { useMainStore } from '@renderer/stores/useMainStore'
// const store = useMainStore()
</script>
<template>
  <div class="dashboard-center">
    <div class="dashboard-title">
      <dashboardHead></dashboardHead>
    </div>
    <div class="dashboard-main">
      <dashboardMain></dashboardMain>
    </div>
  </div>
</template>

<style scoped lang="less">
.dashboard-center {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  .dashboard-title {
    height: 50px;
  }
  .dashboard-main {
    flex: 1;
    width: 100vw;
    background: #ebebeb;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }
}
</style>
