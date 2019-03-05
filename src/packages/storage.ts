'use strict';

/**
 * 页面存储的key, 
 */
const STORAGE = {
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

export {
  STORAGE
}