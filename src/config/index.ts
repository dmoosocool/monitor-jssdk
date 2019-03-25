import { REPORT_TYPE, REPORT_DATA} from  '../interfaces/reportdata';
export const SERVER_URL = 'http://localhost:3000/reporter';
export const K_REQ_QUEUE = 'MONITOR_QUEUE';
export const E_REPORT_TYPE = REPORT_TYPE;
export interface I_REPORT_DATA extends REPORT_DATA {};

/**
 * 页面存储的key, 
 */
export const STORAGE = {
  // 计算uv, 
  MONITOR_INIT: {
    key: '__MONITOR_PAGE_HASH',
    value: ''
  },

  // 请求时间, 配合__MONITOR_PAGE_HASH, 计算uv,
  PAGE_VISTOR_TIME: {
    key: '__MONITOR_PAGE_VISTOR_TIME',
    value: 0
  },

  // 请求地址
  PAGE: {
    key: '__MONITOR_PAGE_HREF',
    value: ''
  },
}

