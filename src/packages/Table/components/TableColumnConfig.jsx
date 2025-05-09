import { defineComponent, ref, defineExpose } from 'vue';
import { ElDrawer, ElFormItem, ElForm, ElInput, ElButton } from 'element-plus';
import style from '../style/index.module.less';
import TableColumnSide from './TableColumnSide';

const TableColumnConfig = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    item: {
      type: Object,
      default: () => ({})
    },
    children: {
      type: Array,
      default: () => []
    },
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  setup(props, { emit }) {
    const TableColumnSideRef = ref(null);

    // 获取props

    const addFormItem = () => {
      props.item?.children.push(
        {
          label: '表格'+ (props.item?.children.length + 1),
          prop: '',
          width: 200,
          align: "center",
        }
      )
    }

    const deleatFormItem = (i) => {
      props.item?.children.splice(i,1)
    }

    const editFormItem = (i) => {
      console.log('TableColumnSideRef.value', TableColumnSideRef.value)
      TableColumnSideRef.value?.openDrawer(props.item?.children[i])
    }

    const tableColumn = (children) => {
      return children.map((item, i) => {
        return (
          <div className={style.FormItemConfig}>
            <i className='iconfont icon-bianji' style={{'cursor':'pointer'}} onClick={() => {editFormItem(i)}}></i>
            <ElInput size="small" vModel={item.label}/>
            <ElInput size="small" vModel={item.prop}/>
            <i className='iconfont icon-lajitong5' style={{'cursor':'pointer'}}  onClick={() => {
              deleatFormItem(i)
            }}></i>
          </div>
        );
      })
    }

    return () => (
      <div>
        <div className={style.FormItemConfigTitle}>
          <span>标题</span>
          <span>key</span>
        </div>
        <div className={style.FormItemConfigList}>
          {tableColumn(props.item?.props?.tableColumnProps?.itemList || [])}
        </div>
        <div style={"margin-top: 10px"}> <ElButton onClick={addFormItem} text>添加</ElButton> </div>
        <TableColumnSide ref={TableColumnSideRef}></TableColumnSide>
      </div>
    );
  },
});

export default TableColumnConfig;
