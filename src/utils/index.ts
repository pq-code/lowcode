const hexList: string[] = []
for (let i = 0; i <= 15; i++) {
  hexList[i] = i.toString(16)
}

/**
 * 生成UUID
 * @returns {string} UUID
 */
export const buildUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 深拷贝对象
 * @param {any} obj 要拷贝的对象
 * @returns {any} 拷贝后的新对象
 */
export const deepClone = (obj: any): any => {
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  // 处理对象
  const result: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    result[key] = deepClone(obj[key]);
  });
  return result;
};

// 后端要求参数去掉''
export function removeEmptyStrings(e: Record<string, any>): Record<string, any> {
  let obj = e;
  if (obj['params']) {
    obj = deepClone(obj['params']);
    for (let key in obj) {
      if (obj[key] === '') {
        delete obj[key];
      } else if (key.indexOf("Time") !== -1 && Array.isArray(obj[key])) {
        obj[key] = {
          start: obj[key][0] + '00:00:00',
          end: obj[key][1] + '23:59:59',
        };
      }
    }
    return { ...e, params: obj };
  } else {
    return obj;
  }
}

// 判断是否是JSOn
export function isJsonStr(str: any) {
  if (typeof str == 'string') {
    try {
        return true;
    } catch (e) {
        return true;
    }
  }else {
    return false;
  }
};

// 如果是JSON转非JSON
export function isJsonStrTrans(str: any) {
  if (typeof str == 'string') {
    try {
        const obj = JSON.parse(str);
        if (typeof obj == 'object' && obj) {
            return JSON.parse(str);
        } else {
            return str;
        }
    } catch (e) {
        // console.log('error：' + str + '!!!' + e);
        return str;
    }
  }else {
      return str;
  }
};

// JSON转非JSON并且深拷贝
export function deepConversionJson (obj: any) {
  let map = new Map()
  function __deepConversionJson(e:any) {
    if (e === null || typeof e !== 'object') return e
    if (map.has(e)) {
      return map.get(e)
    }
    let result = Array.isArray(e) ? [] : {}
    map.set(e, result)
    for (let key in e) {
      if (typeof e[key] === 'object') {
        result[key] = __deepConversionJson(e[key])
      } else {
        result[key] = isJsonStrTrans(e[key])
      }
    }
    return result
  }
  return __deepConversionJson(obj)
  // return obj
};


export const getImageUrl = (path:string) => {
  return new URL(`../assets/${path}`, import.meta.url).href
}



/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * 驼峰转下划线
 * @param {string} str 驼峰字符串
 * @returns {string} 下划线字符串
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

/**
 * 下划线转驼峰
 * @param {string} str 下划线字符串
 * @returns {string} 驼峰字符串
 */
export const underlineToHump = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * 驼峰转横杠
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

export const getCssVar = (prop: string, dom = document.documentElement) => {
  return getComputedStyle(dom).getPropertyValue(prop)
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt: string) {
  if (!time) return ''
  else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}

/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

/**
 * 首字母大写
 */
export function firstUpperCase(str: string) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * 把对象转为formData
 */
export function objToFormData(obj: any) {
  const formData = new FormData()
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key])
  })
  return formData
}
