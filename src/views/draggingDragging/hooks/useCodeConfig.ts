import { computed, onMounted, onBeforeUnmount } from "vue";

export default function useCanvasOperation() {


  // 使用 Map 替代 WeakMap
  const processStringAddPxCache = new Map<string, string>();

  // 预编译正则表达式
  const unitRegex = /(px|rem|%|em)$/i;
  const commaSpaceRegex = /[, ]+/;
  const camelCaseRegex = /([a-z])([A-Z])/g;

  const processStringAddPx = computed(() => {
    return (str: string) => {
      if (processStringAddPxCache.has(str)) {
        return processStringAddPxCache.get(str)!;
      }
      if (!str) {
        return '0';
      }
      let result: string;
      if (commaSpaceRegex.test(str)) {
        const strArray = str.split(commaSpaceRegex).filter(Boolean);
        const processedArray = strArray.map(item => unitRegex.test(item) ? item : `${item}px`);
        result = processedArray.length ? processedArray.join(' ') : '23px';
      } else {
        result = unitRegex.test(str) ? str : `${str}px`;
      }

      processStringAddPxCache.set(str, result);
      return result;
    }
  });

  // 渲染前收集配置信息
  const collectProps = (item: any) => {
    const vnodeProps: any = {};

    const convertKey = (key: string) => {
      if (key.startsWith('cs')) {
        key = key.slice(2);
        key = key.replace(camelCaseRegex, '$1-$2').toLowerCase();
      }
      return key;
    };

    Object.keys(item).forEach((key) => {
      if (key.includes('Props')) {
        const resultProps: any = {};
        item[key]?.children.forEach((child: any) => {
          if(!child.key) return
          const newKey = convertKey(child.key);
          resultProps[newKey] = child.value;
        });

        vnodeProps[key] = {
          props: resultProps,
          style: {
            'text-align': resultProps['text-align'],
            'font-size': processStringAddPx.value(resultProps['font-size']),
            'font-weight': resultProps['font-weight'],
            'margin': processStringAddPx.value(resultProps['margin']) || '10px 0px',
            'padding': processStringAddPx.value(resultProps['padding']) || '0px',
            'display': resultProps['display']
          }
        };
        if (resultProps['height'] && resultProps['height'].length) {
          vnodeProps[key].style['height'] = processStringAddPx.value(resultProps['height'])
        }
      }
    });

    return vnodeProps;
  };

  onMounted(() => {
    // init()
  });

  onBeforeUnmount(() => {
    // 清理资源
    processStringAddPxCache.clear();
  });


  return {
    processStringAddPx,
    collectProps
  }
}

