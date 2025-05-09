
export const Container = {
  componentName: "div容器",
  type: "container",
  icon: "icon-fuxuankuangkong",
  group: "基础组件",
  props: {
    divProps: {
      title: '容器属性',
      children: [
        {
          label: '高度',
          type: 'input',
          value: '',
          key: 'csheight'
        },
        {
          label: '文字大小',
          type: 'input',
          value: '23',
          key: 'csfontSize'
        },
        {
          label: '粗细',
          type: 'input',
          value: '',
          key: 'csfontWeight'
        },
        {
          label: '内间距',
          type: 'input',
          value: '10',
          key: 'cspadding'
        },
        {
          label: '外间距',
          type: 'input',
          value: '',
          key: 'csmargin'
        },
        {
          label: 'className',
          type: 'input',
          value: '',
          key: 'className'
        },
        {
          label: '布局方式',
          type: 'segmented',
          value: '',
          key: 'display',
          options: [
            {
              label: 'grid',
              value: 'grid'
            },
            {
              label: 'flex',
              value: 'flex'
            }
          ]
        },
        {
          label: '是否滚动',
          type: 'segmented',
          value: '',
          key: 'overflow',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
      ],
      style: {
      }
    },
    titleProps: {
      title: '标题',
      children: [
        {
          label: '标题',
          type: 'input',
          value: '',
          key: 'title'
        },
        {
          label: '高度',
          type: 'input',
          value: '30',
          key: 'csheight'
        },
        {
          label: '文字大小',
          type: 'input',
          value: '23',
          key: 'csfontSize'
        },
        {
          label: '粗细',
          type: 'input',
          value: '',
          key: 'csfontWeight'
        },
        {
          label: '内间距',
          type: 'input',
          value: '',
          key: 'cspadding'
        },
        {
          label: '外间距',
          type: 'input',
          value: '0 0 10 0',
          key: 'csmargin'
        },
        {
          label: '标题位置',
          type: 'segmented',
          value: '',
          key: 'cstextAlign',
          options: [
            {
              label: '左',
              value: 'left'
            },
            {
              label: '中',
              value: 'center'
            },
            {
              label: '右',
              value: 'right'
            },
          ]
        },
        {
          label: 'className',
          type: 'input',
          value: '',
          key: 'className'
        },
      ],
      style: {
      }
    },
    className: 'container',
    style: ''
  },
  children:[]
}
