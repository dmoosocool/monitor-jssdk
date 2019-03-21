
export enum REPORT_TYPE {
  Performace = 1,
  UserAgent,
  JsError,
  ResourceError,
  AjaxError,
}

export interface REPORT_DATA {
  /** 类型 */
  type: REPORT_TYPE.AjaxError | REPORT_TYPE.JsError | REPORT_TYPE.Performace | REPORT_TYPE.ResourceError | REPORT_TYPE.UserAgent;
  data: {
    msg: string;
    /** 时间戳 */
    timestamp: number;
    /** 当前url */
    url: string;
    /** 资源链接 */
    source?: string;
    /** 上报数据 */
    reporter: I_JSErrorData | I_ResourceData | I_AjaxData;
  }
}

interface I_JSErrorData {
  /** 发生错误的行号 */
  line: number;
  /** 发生错误的列号 */
  col: number;
}



interface I_ResourceData {
  /** 资源的元素名称 */
  target: string;
  /** 资源类型 */
  type: string;
}

interface I_AjaxData {
  /** Ajax 状态码 */
  status: number;
  /** Ajax 请求地址 */
  url: string,
  /** Ajax 请求方式 */
  method: string,
  /** Ajax 事件 */
  event: string,
  /** 是否请求成功 */
  success: boolean,
  /** 请求耗时 */
  duration: number,
  /** Response长度 */
  responseSize: number,
  /** Request长度 */
  requestSize: number,
  /** 请求类型,  */
  type: 'XMLHttpRequest' | 'fetch'
}