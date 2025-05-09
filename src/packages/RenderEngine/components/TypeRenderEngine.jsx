import Form from "@/packages/Form";
import { ElInput } from "element-plus";
import DlockContainer from '@/packages/DlockContainer/src/DlockContainer.jsx';
import { defineAsyncComponent } from 'vue';

const component = (url) => {
  return defineAsyncComponent({
    loader: async () => {
      if (url.includes('element')) {
        return await import(/* @vite-ignore */url.replace('@renderer', '@'));
      } else {
        return await import(/* @vite-ignore */url.replace('@renderer', '@'));
      }
    },
    delay: 200,
  });
};

const componentGenerators = {
  container: (item, children) => (
    <DlockContainer item={item}>
      {children || null}
    </DlockContainer>
  ),
  Form: (item, children) => (
    <Form key={item.key} item={item} children={children}>
      {children || null}
    </Form>
  ),
  input: (item, children) => (
    <ElInput {...item.props.formItemProps} >
      {children || null}
    </ElInput>
  ),
  // 其他类型的处理
};

/**
 * 根据类型和子元素渲染不同类型的组件
 *
 * @param item 当前渲染组件的类型信息
 * @param children 当前渲染组件的子元素
 * @returns 渲染完成的组件元素
 */
export const TypeRenderEngine = (item, children) => {
  let npm = item.npm;
  let AsyncComp = null;
  let returnElement = null;

  if (npm?.component && npm.component.includes('packages')) {
    AsyncComp = component(npm.component);
  } else {
    const generator = componentGenerators[item.type];
    if (generator) {
      returnElement = generator(item, children);
    }
  }

  return returnElement || <AsyncComp key={item.key} item={item} children={children}>{children}</AsyncComp>;
};
