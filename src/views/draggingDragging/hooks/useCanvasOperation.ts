import { ref, onMounted, onBeforeUnmount } from "vue";
import { useDraggingDraggingStore } from "@renderer/stores/draggingDragging/useDraggingDraggingStore";
import { deepClone } from "@renderer/utils/index";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { editCodeConfig } from "@renderer/api/apis/lowCode/lowCode";
export default function useCanvasOperation() {
  let {
    pageJSON, // 页面所有数据
    currentDragObject, // 当前拖拽对象
    currentOperatingObject, // 当前操作对象
    currentOperatingObjectIndex, // 当前处于第几步
    historyOperatingObject, // 历史操作列表 最多纪录20步
  } = storeToRefs(useDraggingDraggingStore());

  /**
   * 添加当前操作对象的历史记录
   *
   * @returns 无返回值
   */
  const addHistoryOperatingObject = () => {
    // if (historyOperatingObject.value.length >= 20) {
    //   // 使用 slice 替代 shift + push，减少数组操作
    //   historyOperatingObject.value = historyOperatingObject.value.slice(1);
    //   currentOperatingObjectIndex.value =
    //     historyOperatingObject.value.length - 1;
    // }
    // // 假设 deepClone 函数存在且能正确返回 pageJSON.value 的深拷贝
    // const clonedPage = deepClone(pageJSON.value) as typeof pageJSON;
    // if (clonedPage !== undefined) {
    //   if (
    //     historyOperatingObject.value.length - 1 !==
    //     currentOperatingObjectIndex.value
    //   ) {
    //     // 如果当前处于中间步骤，则清空后续步骤，并重新添加
    //     historyOperatingObject.value = historyOperatingObject.value.slice(
    //       0,
    //       currentOperatingObjectIndex.value + 1
    //     );
    //     historyOperatingObject.value.push(clonedPage);
    //     currentOperatingObjectIndex.value =
    //       historyOperatingObject.value.length - 1;
    //     return;
    //   }
    //   // 判断当前值和上一次是否相同，相同就不保存了
    //   if (
    //     JSON.stringify(clonedPage) ===
    //     JSON.stringify(
    //       historyOperatingObject.value[historyOperatingObject.value.length - 1]
    //     )
    //   ) {
    //     return;
    //   }
    //   historyOperatingObject.value.push(clonedPage);
    //   currentOperatingObjectIndex.value =
    //   historyOperatingObject.value.length - 1;
    // }
  };

  /**
   * 回到上一操作
   *
   * @returns 无返回值
   */
  const backHistoryOperatingObject = () => {
    if (
      historyOperatingObject.value.length > 1 &&
      currentOperatingObjectIndex.value >= 0
    ) {
      // 获取历史中的倒数第二个对象，并设置为当前页面状态
      const previousPage =
        historyOperatingObject.value[currentOperatingObjectIndex.value - 1];
      if (previousPage) {
        pageJSON.value = deepClone(previousPage); // 使用 deepClone 来避免直接修改原始数据
        currentOperatingObjectIndex.value -= 1;
      }
    }
  };
  /**
   * 撤销回到下一操作
   *
   * @returns 无返回值
   */
  const upHistoryOperatingObject = () => {
    if (
      historyOperatingObject.value.length > 1 &&
      currentOperatingObjectIndex.value < historyOperatingObject.value.length
    ) {
      // 获取上一步状态
      currentOperatingObjectIndex.value += 1;
      const previousPage =
        historyOperatingObject.value[currentOperatingObjectIndex.value];
      if (previousPage) {
        pageJSON.value = deepClone(previousPage); // 使用 deepClone 来避免直接修改原始数据
      }
    }
  };

  /**
   * 清空页面，但是不清空操作步骤
   *
   * @returns 无返回值
   */
  const clearHistoryOperatingObject = () => {
    pageJSON.value = {
      type: 'page',
      title: '页面',
      whetherYouCanDrag: true,
      props: {
        className: 'PageContainer',
        style: '',
      },
      children: [
      ]
    }; // 清空
    currentDragObject.value = {};
    currentOperatingObject.value = {};
    addHistoryOperatingObject();
  };

  /**
   * 保存历史操作对象
   */
  const saveHistoryOperatingObject = () => {
    try {
      addHistoryOperatingObject(); // 记录历史记录
      // 保存成功后，延迟一秒提示
      console.log("保存成功",pageJSON.value);
      editCodeConfig({
        codeConfig: pageJSON.value,
        codeConfigName: 'test',
        codeConfigId:'4f25f23c-eadf-41f7-9557-b74514064fe8',
        // userId: 'op_Kr4i1oy0H73j6lmolby7-QOsw',
        // userName : 'yk'
      }).then(res => {
        ElMessage({ message: "保存成功", type: "success" });
        console.log(res);
      })
    } catch (err) {
      console.error("保存失败----" + err);
    }
  };

  /**
   * 深度优先搜索并删除目标节点
   *
   * @param node 当前节点
   * @param targetKey 目标节点的key值
   * @returns 如果找到并删除目标节点则返回true，否则返回false
   */
  const depthFirstSearchAndDelete = (node, targetKey) => {
    if (!node) return false;

    if (node instanceof Array) {
      node.map(e => depthFirstSearchAndDelete(e, targetKey))
    }

    if (node.key === targetKey) {
      return true;
    }

    if (node.children && node.children instanceof Array && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        if (depthFirstSearchAndDelete(node.children[i], targetKey)) {
          node.children.splice(i, 1);
          currentOperatingObject.value = null
          break;
        }
      }
    }
    return false
  };

  /**
   * 删除对象
   *
   * @returns 无返回值
   */
  // const deleteObject = () => {
  //   if (!currentOperatingObject.value) {
  //     console.error("当前操作对象为空，无法删除");
  //     return;
  //   }

  //   for (let i = 0; i < pageJSON.value.children.length; i++) {
  //     if (pageJSON.value.children[i]?.key == currentOperatingObject.value.key) {
  //       pageJSON.value.children.splice(i, 1);
  //       currentOperatingObject.value = null
  //       break;
  //     }
  //     depthFirstSearchAndDelete(pageJSON.value.children[i], currentOperatingObject.value.key) // 深层查找
  //   }
  // };

  // 快捷键绑定
  // ctrl+z 撤销
  // ctrl+shift+z 取消撤销
  // ctrl+y 重做
  // ctrl+s 保存
  // ctrl+a 全选

  const handleKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      // 适应Mac的Command键
      switch (event.key) {
        case "z":
          if (event.shiftKey) {
            event.preventDefault(); // 阻止浏览器默认行为
            upHistoryOperatingObject(); // 取消撤销
          } else {
            event.preventDefault(); // 阻止浏览器默认行为
            backHistoryOperatingObject(); // 撤销
          }
          break;
        case "y":
          event.preventDefault(); // 阻止浏览器默认行为
          clearHistoryOperatingObject(); // 清空页面
          break;
        case "s":
          event.preventDefault(); // 阻止浏览器默认行为
          // 实现保存逻辑
          saveHistoryOperatingObject();
          break;
        case "Backspace":
          // event.preventDefault(); // 阻止浏览器默认行为
          // 实现删除逻辑
          // deleteObject();
          break;
        case "a":
          // 实现全选逻辑
          break;
      }
    } else {
      switch (event.key) {
        case "Backspace":
          // event.preventDefault(); // 阻止浏览器默认行为
          // // 实现删除逻辑
          // deleteObject();
          break;
        case "a":
          // 实现全选逻辑
          break;
      }
    }
  };

  const initObject = ref(false);

  const init = () => {
    console.log("开始监听");
    if (!initObject.value) {
      document.addEventListener("keydown", handleKeyDown);
      initObject.value = true;
    } else {
      console.log("已经开启监听");
    }
  };

  onMounted(() => {
    // init()
  });

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleKeyDown);
  });

  return {
    addHistoryOperatingObject,
    backHistoryOperatingObject,
    upHistoryOperatingObject,
    clearHistoryOperatingObject,
    handleKeyDown,
    init,
  };
}
