import { defineComponent, ref, watch, onMounted, computed } from 'vue';
import { ElRow, ElForm, ElTooltip, ElFormItem, ElCol, ElCollapse, ElCollapseItem, ElSelect, ElOption, ElInput, ElButton } from 'element-plus';
import { http } from '@renderer/api';
import useCodeConfig from '@renderer/views/draggingDragging/hooks/useCodeConfig.ts';
import { TypeRenderEngine } from '@renderer/packages/RenderEngine/components/TypeRenderEngine.jsx';

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
  setup(props, { emit, slots }) {
    const { collectProps } = useCodeConfig();
    const formRef = ref(null);
    const inputValue = ref({});
    let Api = '';
    const colKeys = ref(new Map());

    onMounted(() => {
      props.item.ref = formRef.value; // 将 ref 抛出给外部
    });

    const submit = () => {
      const getCodeConfig = (params) => http.post(Api, params);
      getCodeConfig({ ...inputValue.value }).then(res => {
        console.log(res);
      });
    };
    const reset = () => {
      props.item.props.formItemProps.itemList.forEach(item => {
        item.props.formItemProps.value = '';
      });
      // inputValue.value = {};
    };

    const getColKey = (item) => {
      if (!colKeys.value.has(item)) {
        colKeys.value.set(item, Math.random().toString(36));
      }
      return colKeys.value.get(item);
    };


    const handleInput = (item, e) => {
      let fnEvent = item?.fnEvent || null;
      item.props.formItemProps.value = e;
      if (fnEvent && fnEvent.onInput) {
        try {
          const fn = new Function('value', fnEvent.onInput.value);
          fn(e);
        } catch (error) {
          console.error('Error executing function:', error);
        }
      }
    };

    const onChange = (item, e) => {
      let fnEvent = item.fnEvent;
      if (fnEvent && fnEvent.onChange) {
        let parameter = [...new Set([...fnEvent.onChange.parameter, ...['props', 'inputValue']])];
        try {
          const fn = new Function(parameter, fnEvent.onChange.value);
          fn(e, props, inputValue.value);
        } catch (error) {
          console.error('Error executing function:', error);
        }
      }
    };

    const renderComponent = (item, formProps) => {
      const colKey = getColKey(item)
      const { isReadOnly, span, label, primaryKey, labelPosition, rules, value } = item.props.formItemProps;
      // 收集控制面板输入的值
      if(value) inputValue.value[primaryKey] = value;

      let children = null;

      if (isReadOnly || formProps.isReadOnly) {
        children = <div>
          {value}
        </div>
      } else {
        children = item.type == 'input' ? <ElInput
          vModel={inputValue.value[primaryKey]}
          onInput={(e) => handleInput(item, e)}>
        </ElInput> :
          <ElSelect
            vModel={inputValue.value[primaryKey]}
            onChange={(e) => onChange(item, e)}>
            <ElOption value="1">选项1</ElOption>
            <ElOption value="2">选项2</ElOption>
          </ElSelect>
      }

      return (
        <ElCol id={colKey} span={Number(span) || Number(formProps.span) || 8}>
          <ElFormItem
            id={primaryKey}
            prop={primaryKey}
            label={label}
            labelPosition={labelPosition}
            rules={rules}
          >
            {children}
          </ElFormItem>
        </ElCol>
      );
    };

    const render = () => {
      const vnodeProps = collectProps(props.item.props); // 收集组件属性
      const childVnode = props.item.props.formItemProps.itemList || [];
      const formProps = vnodeProps.formProps;
      const { api, isSubmit, isReset } = formProps.props;
      Api = api; // 获取接口信息

      inputValue.value = {}

      console.log('vnodeProps',vnodeProps)

      const formChildren = childVnode.map(item => renderComponent(item, formProps.props));

      const formButtons = [
        ...(isSubmit ? [<ElButton type="primary" onClick={submit}>搜索</ElButton>] : []),
        ...(isReset ? [<ElButton onClick={reset}>重置</ElButton>] : [])
      ];

      if (formButtons.length > 0) {
        formChildren.push(
          <div style={{ padding: '0 10px' }}>
            {formButtons}
          </div>
        );
      }

      return (
        <ElForm ref={formRef} vModel={inputValue.value} >
          <ElRow gutter={Number(formProps.props.gutter) || 20}>{formChildren}</ElRow>
        </ElForm>
      );
    };

    const vnode = computed(() => render());

    return () => vnode.value;
  }
});

export default From;
