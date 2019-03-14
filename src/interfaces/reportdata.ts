export interface I_ReportData {
  /** 上报信息. */
  msg: string;
  /** 类型 */
  category: 'resource' | 'ajax' | 'jserror';
  /** 时间戳 */
  timestamp: number;
  /** 当前url */
  url: string;
  /** 上报数据 */
  data: I_JSErrorData | I_ResourceData | I_AjaxData;
  /** 资源链接 */
  source: string;
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
  /** Ajax状态 */
  text: string;
  /** Ajax 状态码 */
  status: number;
}