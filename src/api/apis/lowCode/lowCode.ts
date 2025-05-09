import { http } from '../../index';

// 获取低代码配置
export const getCodeConfig = (params: any) => {
  // 这里我们添加一个模拟响应，因为我们没有真实的后端API
  return Promise.resolve({
    code: 200,
    message: 'success',
    result: {
      codeConfig: params.codeConfigId 
        ? {
            type: 'page',
            title: '页面',
            whetherYouCanDrag: true,
            props: {
              className: 'PageContainer',
              style: '',
            },
            children: [
              {
                "componentName": "div容器",
                "type": "container",
                "icon": "",
                "group": "基础组件",
                "props": {
                  "title": "",
                  "className": "container",
                  "style": ""
                },
                "children": [],
                "key": Date.now().toString()
              }
            ]
          }
        : null
    }
  });
  // 真实环境中使用下面的代码调用API
  // return http.post('/api/lowcode/get-code-config', params);
};

// 保存低代码配置
export const saveCodeConfig = (params: any) => {
  // 模拟响应
  return Promise.resolve({
    code: 200,
    message: 'success',
    result: {
      success: true
    }
  });
  // 真实环境中使用下面的代码调用API
  // return http.post('/api/lowcode/save-code-config', params);
};

// 发布低代码配置
export const publishCodeConfig = (params: any) => {
  // 模拟响应
  return Promise.resolve({
    code: 200,
    message: 'success',
    result: {
      success: true
    }
  });
  // 真实环境中使用下面的代码调用API
  // return http.post('/api/lowcode/publish-code-config', params);
}; 


export const editCodeConfig = (params: any) => {
  return http.post('/api/lowcode/get-code-config-list', params);
};