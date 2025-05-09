<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import draggingDraggingL from '@renderer/views/draggingDragging/components/draggingDraggingL.jsx'
import draggingDraggingMain from '@renderer/views/draggingDragging/components/draggingDraggingMain.jsx'
import draggingDraggingR from '@renderer/views/draggingDragging/components/draggingDraggingR.jsx'
import draggingDraggingHead from '@renderer/views/draggingDragging/components/draggingDraggingHead.jsx'
import  useCanvasOperation from './hooks/useCanvasOperation';
import { getCodeConfig } from "@renderer/api/apis/lowCode/lowCode";
import './style/draggingDraggingL.less'
import { storeToRefs } from "pinia";
import { useDraggingDraggingStore } from "@renderer/stores/draggingDragging/useDraggingDraggingStore";

  const store = useDraggingDraggingStore();
  const { pageJSON } = storeToRefs(store);

const lengthWidth = ref(true);
const { init } = useCanvasOperation();

const mousedown = (e) => {
  console.log('鼠标右键',e)
}
onMounted(()=> {
  init()
  getCodeConfig(
    {
      codeConfigName: 'test',
      codeConfigId:'4f25f23c-eadf-41f7-9557-b74514064fe8',
    }
  ).then((res)=>{
    if(res.result.codeConfig) {
       pageJSON.value = res.result.codeConfig
    }
    console.log('获取到保存数据res',pageJSON.value)
  })
})
</script>
<template>
  <div class="draggingDragging" @contextmenu.prevent='mousedown'>
    <div class="draggingDragging-head">
      <draggingDraggingHead></draggingDraggingHead>
    </div>

    <div class="draggingDragging-center">
      <div class="draggingDragging-l" :style="{ maxWidth: lengthWidth ? '320px' : '80px', minHeight : '80px'}">
        <draggingDraggingL></draggingDraggingL>
      </div>
      <div class="draggingDragging-middle">
        <draggingDraggingMain></draggingDraggingMain>
      </div>
      <div class="draggingDragging-r">
        <draggingDraggingR></draggingDraggingR>
      </div>
    </div>
  </div>
</template>
<style scoped lang='less'>
 .draggingDragging {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  .draggingDragging-head {
    height: 50px;
  }
  .draggingDragging-center {
    display: flex;
    height: calc(100% - 50px);
    width: 100%;
    .draggingDragging-l {
      width: 300px;
      height: 100%;
      background: #ffff;
    }
    .draggingDragging-middle {
      flex: 1;
      height: 100%;
      background: #ebebeb;
    }
    .draggingDragging-r {
      width: 270px;
      height: 100%;
      background: #ffff;
    }
  }
 }
</style>
