import { defineComponent, ref, defineExpose } from 'vue';
import { ElDrawer, ElFormItem, ElForm, ElInput, ElButton } from 'element-plus';
import style from '../style/index.module.less';
import FormItemEdit from '../components/FormItemEdit';

const From = defineComponent({
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
    const FormItemEditRef = ref(null);

    const addItem = () => ({
      componentName: "输入框",
      type: "input",
      icon: "",
      group: "基础组件",
      npm: {
        exportName: "ElInput",
        package: "element-plus",
        destructuring: true
      },
      props: {
        formItemProps: {
          primaryKey: `input`+ props.item?.props.formItemProps.itemList.length,
          label: "表单项",
          size: "medium",
          device: "desktop",
          fullWidth: true
        },
        placeholder: "请输入"
      },
      key: Math.random().toString(36)
    });

    const addFormItem = () => {
      props.item?.props.formItemProps.itemList.push(addItem());
    };

    const deleteFormItem = (index) => {
      props.item?.props.formItemProps.itemList.splice(index, 1);
    };

    const editFormItem = (index) => {
      FormItemEditRef.value?.openDrawer(props.item?.props.formItemProps.itemList[index]);
    };

    const renderFormItem = (children) => {
      return children.map((item, index) => (
        <div className={style.FormItemConfig}>
          <i className='iconfont icon-bianji cursor:pointer' onClick={() => editFormItem(index)}></i>
          <ElInput size="small" vModel={item.props.formItemProps.label} />
          <ElInput size="small" vModel={item.props.formItemProps.primaryKey} />
          <i className='iconfont icon-lajitong5 cursor:pointer' onClick={() => deleteFormItem(index)}></i>
        </div>
      ));
    };

    return () => (
      <div>
        <div className={style.FormItemConfigTitle}>
          <span>标题</span>
          <span>key</span>
        </div>
        <div className={style.FormItemConfigList}>
          {renderFormItem(props.item?.props.formItemProps.itemList || [])}
        </div>
        <div style="margin-top: 10px">
          <ElButton onClick={addFormItem} text>添加</ElButton>
        </div>
        <FormItemEdit ref={FormItemEditRef} />
      </div>
    );
  },
});

export default From;
