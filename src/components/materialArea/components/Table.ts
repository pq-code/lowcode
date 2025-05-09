

export const Table = {
  componentName: "tabel表格",
  type: "table",
  icon: "icon-Tab_zidingyiziduan",
  group: "基础组件",
  npm: {
    exportName: "Ptabel",
    package: "@renderer/packages",
    component: 'packages/Table/src/Table.jsx',
    destructuring: true,
  },
  children: [],
  props: {
    name: "title",
    propType: "string",
    description: "标题",
    defaultValue: "标题",
    tableProps: {
      title: '表格属性',
      children: [
        {
          label: '是否只读',
          type: 'segmented',
          value: false,
          options: [{
            label: '是',
            value: true
          },
          {
            label: '否',
            value: false
            },],
          key: 'isReadOnly'
        },
        {
          label: '是否可以勾选',
          type: 'segmented',
          value: true,
          options: [{
            label: '是',
            value: true
          },
          {
            label: '否',
            value: false
            },],
          key: 'selectable'
        },
        {
          label: '是否带序号',
          type: 'segmented',
          value: true,
          options: [{
            label: '是',
            value: true
          },
          {
            label: '否',
            value: false
            },],
          key: 'serialNumber'
        },
        {
          label: '是否分页',
          type: 'segmented',
          value: true,
          options: [{
            label: '是',
            value: true
          },
          {
            label: '否',
            value: false
            },],
          key: 'showPagination'
        },
        {
          label: '是否纵向带边框',
          type: 'segmented',
          value: true,
          options: [{
            label: '是',
            value: true
          },
          {
            label: '否',
            value: false
            },],
          key: 'border'
        },
        {
          label: '是否为斑马纹',
          type: 'segmented',
          value: true,
          options: [{
            label: '是',
            value: true
          },
          {
            label: '否',
            value: false
            },],
          key: 'stripe'
        },
        {
          label: '列的宽度是否自撑开',
          type: 'segmented',
          value: true,
          options: [{
            label: '是',
            value: true
          },
          {
            label: '否',
            value: false
            },],
          key: 'fit'
        },
        {
          label: '是否显示表头',
          type: 'segmented',
          value: true,
          options: [{
            label: '是',
            value: true
          },
          {
            label: '否',
            value: false
            },],
          key: 'showHeader'
        },
        {
          label: '是否计算合计',
          type: 'segmented',
          value: true,
          options: [{
            label: '是',
            value: true
          },
          {
            label: '否',
            value: false
            },],
          key: 'showSummary'
        },
        {
          label: 'Table 的尺寸',
          type: 'segmented',
          value: '',
          key: 'fit',
          options: [
            {
              label: 'large',
              value: 'large'
            },
            {
              label: 'default',
              value: 'default'
            },
            {
              label: 'small',
              value: 'small'
            }
          ]
        },
        {
          label: '行和列的布局方式',
          type: 'segmented',
          value: '',
          key: 'tableLayout',
          options: [
            {
              label: 'fixed',
              value: 'fixed'
            },
            {
              label: 'auto',
              value: 'auto'
            }
          ]
        },
        {
          label: 'height',
          type: 'input',
          value: '',
          key: 'height'
        },
      ]
    },
    tableColumnProps: {
      title: '表格项',
      component: 'packages/Table/components/TableColumnConfig.jsx',
      children: [],
      itemList:  [
        {
          label: "表格1",
          prop: 'a',
          width: 200,
          align: "center",
        },
        {
          label: "表格2",
          prop: 'b',
          width: 200,
          align: "center",
        },
        {
          label: "表格3",
          prop: 'c',
          width: 200,
          align: "center",
        },
        {
          label: "表格4",
          prop: 'd',
          width: 200,
          align: "center",
        },
        {
          label: "表格5",
          prop: 'e',
          width: 200,
          align: "center",
        },
      ]
    },
    pagingProps: {
      title: '分页',
      children: [
        {
          label: '每页显示条数',
          type: 'input',
          value: '',
          key: 'pageSize'
        },
        {
          label: '当前页',
          type: 'input',
          value: '',
          key: 'currentPage'
        },
        {
          label: '总条数',
          type: 'input',
        }
      ]
    },
  },
  data: [
    {
      a: '1',
      b: '1',
      c: '1',
      d: '1',
      e: '1'
    },
    {
      a: '2',
      b: '2',
      c: '2',
      d: '2',
      e: '2'
    },
    {
      a: '3',
      b: '3',
      c: '3',
      d: '3',
      e: '3'
    },
    {
      a: '4',
      b: '4',
      c: '4',
      d: '4',
      e: '4'
    },
    {
      a: '5',
      b: '5',
      c: '5',
      d: '5',
      e: '5'
    },
    {
      a: '6',
      b: '6',
      c: '6',
      d: '6',
      e: '6'
    },
  ]
}

