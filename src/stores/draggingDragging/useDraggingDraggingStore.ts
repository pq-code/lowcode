import { ref} from 'vue'
import { defineStore } from 'pinia'


export const useDraggingDraggingStore = defineStore('draggingDraggingStore', () => {

// 页面JSON
//   const pageJSON = ref({
//     type: 'page',
//     title: '页面',
//     whetherYouCanDrag: true,
//     props: {
//       className: 'PageContainer',
//       style: '',
//     },
//     children: [
//       {
//         "componentName": "div容器",
//         "type": "container",
//         "icon": "",
//         "group": "基础组件",
//         "props": {
//             "title": "",
//             "className": "container",
//             "style": ""
//         },
//       "children": [
//         {
//           "componentName": "表单",
//           "type": "Form",
//           "icon": "",
//           "group": "基础组件",
//           "npm": {
//               "exportName": "Form",
//               "package": "@/packages",
//               "destructuring": true
//           },
//           "props": {
//               "name": "title",
//               "propType": "string",
//               "description": "标题",
//               "defaultValue": "标题"
//           },
//           "children": [
//               {
//                   "componentName": "输入框",
//                   "type": "input",
//                   "icon": "",
//                   "group": "基础组件",
//                   "npm": {
//                       "exportName": "ElInput",
//                       "package": "element-plus",
//                       "destructuring": true
//                   },
//                   "props": {
//                       "formItemProps": {
//                           "primaryKey": "760",
//                           "label": "表单项",
//                           "size": "medium",
//                           "device": "desktop",
//                           "fullWidth": true
//                       },
//                       "placeholder": "请输入"
//                   }
//               },
//               {
//                   "componentName": "输入框",
//                   "type": "input",
//                   "icon": "",
//                   "group": "基础组件",
//                   "npm": {
//                       "exportName": "ElInput",
//                       "package": "element-plus",
//                       "destructuring": true
//                   },
//                   "props": {
//                       "formItemProps": {
//                           "primaryKey": "760",
//                           "label": "表单项",
//                           "size": "medium",
//                           "device": "desktop",
//                           "fullWidth": true
//                       },
//                       "placeholder": "请输入"
//                   }
//               },
//               {
//                   "componentName": "输入框",
//                   "type": "input",
//                   "icon": "",
//                   "group": "基础组件",
//                   "npm": {
//                       "exportName": "ElInput",
//                       "package": "element-plus",
//                       "destructuring": true
//                   },
//                   "props": {
//                       "formItemProps": {
//                           "primaryKey": "760",
//                           "label": "表单项",
//                           "size": "medium",
//                           "device": "desktop",
//                           "fullWidth": true
//                       },
//                       "placeholder": "请输入"
//                   }
//               }
//           ],
//           "key": "e6eed8c8-708a-b22b-a068-c979006ff0fa"
//         },
//         {
//           "componentName": "输入框",
//           "type": "input",
//           "icon": "",
//           "group": "基础组件",
//           "npm": {
//               "exportName": "El-Input",
//               "package": "element-plus",
//               "destructuring": true
//           },
//           "props": {
//               "name": "title",
//               "propType": "string",
//               "description": "标题",
//               "defaultValue": "标题"
//           },
//           "key": "8aaa3b0d-bf59-fc6a-bbda-d2c427d58bd1"
//       }
//         ],
//         "key": "48d881f1-4a36-dc3a-26f0-3448f4cb902e"
//     },
//     ]
  //   })

  const pageJSON = ref({
    type: 'page',
    title: '页面',
    whetherYouCanDrag: true,
    props: {
      className: 'PageContainer',
      style: '',
    },
    children: [
      {
        "componentName": "容器",
        "type": "container",
        "icon": "icon-fuxuankuangkong",
        "group": "基础组件",
        "key": "container_" + Math.random().toString(36).substring(2, 9),
        "props": {
          "divProps": {
            "title": "容器属性",
            "children": [
              {
                "label": "高度",
                "type": "input",
                "value": "300",
                "key": "csheight"
              },
              {
                "label": "文字大小",
                "type": "input",
                "value": "14",
                "key": "csfontSize"
              }
            ],
            "style": {}
          },
          "className": "container",
          "style": ""
        },
        "children": []
  }
    ]
  })
  const currentDragObject = ref({}) // 当前拖拽对象

  const currentEnvironment = ref(true) // 当前环境

  const currentOperatingObject = ref()  // 当前操作对象
  const oldCurrentOperatingObject = ref() // 上一个操作对象

  const historyOperatingObject = ref([]) // 历史操作列表 最多纪录20步
  const currentOperatingObjectIndex = ref(0) // 当前处于第几步

  return {
    pageJSON,
    currentDragObject,
    currentEnvironment,
    currentOperatingObject,
    oldCurrentOperatingObject,
    historyOperatingObject,
    currentOperatingObjectIndex,
  }

})
