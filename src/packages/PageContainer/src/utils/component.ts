
// const app = createApp({});

// 自动注册
export const customComponent = async () => {
  // const name = item.npm.exportName // 组件名称
  // const packages = item.npm.package
  // console.log(packages)
  // debugger
  // // const component = await import(/* @vite-ignore */ `${main}`)
  // // const component = await import(packages)
  // const component = await import.meta.glob(packages);
  // app.component(name,component[packages])

  // function loadjs(url: string) {
  //   return new Promise((resolve, reject) => {
  //     const script = document.createElement("script");
  //     script.src = url;
  //     script.type="module"
  //     script.onload = () => resolve(true); // 改为只解析成功的状态
  //     script.onerror = (error) => reject(error);
  //     document.head.appendChild(script);
  //   });
  // }

  // const name = item.npm.exportName; // 组件名称
  // try {
  //   await loadjs(item.npm.package);
  //   if (window[name]) {
  //     // 这种方式加载组件，会直接将组件挂载在全局变量 window 下，所以 window[name] 取值后就是组件
  //     app.component(name, window[name]);
  //     console.log(`Component ${name} registered successfully.`);
  //   } else {
  //     console.error(`Component ${name} not found in global window.`);
  //   }
  // } catch (err) {
  //   console.error(err);
  // }
  // if (item.npm.component) {
  //   console.log(item.npm.component)
  //   debugger
  //   if (window[item.npm.name]) {
  //     window[item.npm.name] = item.npm.component
  //   }
  //   debugger
  //   // window[item.npm.name] = item.npm.component
  //   const name = item.npm.exportName // 组件名称
  //   app.component(name, item.npm.component);
  // }

};
