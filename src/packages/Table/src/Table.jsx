import { defineComponent, ref, shallowRef, computed, onMounted } from 'vue';
import { ElTooltip, ElTableColumn, ElTable, ElPagination } from 'element-plus';
import useCodeConfig from '@renderer/views/draggingDragging/hooks/useCodeConfig.ts';
import { deepClone } from '@renderer/utils/index';

const Table = defineComponent({
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
    const { collectProps } = useCodeConfig();

    const tableRef = ref(null);
    const divRes = ref(null);

    const SELECTION_COLUMN = { type: 'selection', label: '', width: 55, align: 'center' };
    const SERIAL_NUMBER_COLUMN = { label: '序号',type:"index", width: 55, align: 'center' };

    onMounted(() => {
      // props.item.ref = tableRef.value
    });

    const tableData = shallowRef(deepClone(props.item.data));

    // 获取props
    const tableProps = computed(() => {
      const itemProps = props.item?.props || {};
      const propsKey = (props.item?.type || '').toLowerCase() + 'Props';
      const children = itemProps[propsKey]?.children || [];

      return children.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
    });

    const handleSelectionChange = () => {
      console.log('Selection changed');
    };
    const handleCurrentChange = () => {
      console.log('Current page changed');
    }
    const onChange = () => {
      console.log('onChange');
    }
    const prevClick = () => {
      console.log('prevClick');
    }
    const nextClick = () => {
      console.log('nextClick');
    }

    const getColumns = (tableColumnLists, tableProps) => {
      let columns = deepClone(tableColumnLists) || [];

      if (tableProps.props.selectable) {
        columns.unshift(SELECTION_COLUMN);
      } else {
        columns = columns.filter(item => item.type !== 'selection');
      }

      if (tableProps.props.serialNumber) {
        const index = columns[0].type === 'selection' ? 1 : 0;
        columns.splice(index, 0, SERIAL_NUMBER_COLUMN);
      } else {
        columns = columns.filter(item => item.label !== '序号');
      }

      return columns;
    };

    const renderColumns = (columns) => {
      return columns.map((item) => (
        <ElTableColumn
          prop={item?.prop}
          label={item?.label}
          width={item?.width}
          align={item?.align}
          fixed={item?.fixed}
          minWidth={item?.minWidth}
          showOverflowTooltip={item?.showOverflowTooltip}
          type={item?.type}
          onselectionChange={handleSelectionChange}
        />
      ));
    };

    const renderPaging = (pagingProp, tableProps) => {
      if (!tableProps.props.showPagination) return null;
      return (
        <div style={{ marginTop: '10px', ...pagingProp.style }}>
          <ElPagination
            background={pagingProp?.props?.background || false} // 是否为分页按钮添加背景色
            layout="prev, pager, next" // 组件布局，子组件名用逗号分隔
            total={tableData.value.length} // 总条目数
            pageSize={pagingProp.props?.pageSize || 5} // 每页显示条目个数
            pageSizes={pagingProp.props?.pageSizes || [5, 10, 20]} // 每页显示个数选择器的选项设置
            pagerCount={pagingProp.props?.pagerCount || 5} // 总页数
            currentPage={pagingProp.props?.currentPage || 1} // 当前页数
            size={pagingProp.props.size || 'small'} // 分页大小
            disabled={pagingProp.props.size || false} // 是否禁用分页
            hideOnSinglePage={pagingProp.props?.hideOnSinglePage || false} // 只有一页时是否隐藏分页器
            nextText={pagingProp.props?.nextText} // 下一页按钮的文字
            prevIcon={pagingProp.props?.prevIcon} // 上一页按钮的图标
            prevText={pagingProp.props?.prevText} // 上一页按钮的文字
            appendSizeTo={pagingProp.props?.appendSizeTo} // 下拉框挂载到哪个 DOM 元素
            popperClass={pagingProp.props?.popperClass} // 下拉框的类名
            onSizeChange={handleSizeChange} // 每页显示个数选择器的选项设置
            onCurrentChange={handleCurrentChange} // 当前页数改变时会触发
            onChange={onChange} //onSizeChange 和 onCurrentChange
            onPrevClick={prevClick} //用户点击上一页按钮改变当前页时触发
            onNextClick={nextClick} //用户点击下一页按钮改变当前页时触发}
          />
        </div>
      );
    };

    const handleSizeChange = (e) => {
      console.log('Page size changed', e);
    }
    const render = () => {
      const vnodeProps = collectProps(props.item.props); // 收集组件属性
      console.log('vnodeProps', vnodeProps);
      const tableProps = vnodeProps.tableProps;

      const tableColumnList = props.item.props.tableColumnProps.itemList || [];
      const pagingProp = vnodeProps.pagingProps;

      return (
        <div>
          <ElTable
            ref={tableRef}
            data={tableData.value}
            border={tableProps.props?.border}
            stripe={tableProps.props?.stripe}
            rowStyle={tableProps.props?.rowStyle}
            headerRowClassName={tableProps.props?.headerRowClassName}
            headerCellStyle={tableProps.props?.headerCellStyle}
            cellStyle={tableProps.props?.cellStyle}
            maxHeight={tableProps.props?.maxHeight}
            highlightCurrentRow={tableProps.props?.highlightCurrentRow}
            scrollbarAlwaysOn={tableProps.props?.scrollbarAlwaysOn}
            sortOrders={tableProps.props?.sortOrders}
            defaultSort={tableProps.props?.defaultSort}
            showSummary={tableProps.props?.showSummary}
            summaryMethod={tableProps.props?.summaryMethod}
            style={{
              width: '100%',
              minHeight: '300px',
              height: 'calc(100% - 60px)',
              maxHeight: '720px',
            }}
          >
            {renderColumns(getColumns(tableColumnList, tableProps))}
          </ElTable>
          {renderPaging(pagingProp, tableProps)}
        </div>
      );
    };

    const vnode = computed(() => render());

    return () => vnode.value;
  },
});

export default Table;
