'use strict';

import { result as UA } from './packages/useragent';
import { write, randomString, getTodayLastTime } from './util';
import { STORAGE } from './packages/storage';
import store from 'store';

const { ua, browser, engine, os, device, cpu } = UA;
const { MONITOR_INIT, PAGE_VISTOR_TIME, } = STORAGE;

const pageInit = () => {
  let monitorInit = store.get(MONITOR_INIT.key);
  let pageVistorTime = store.get(PAGE_VISTOR_TIME.key);
  const date = new Date();
  const today = getTodayLastTime();

  // 如果页面中没有这个key, 或者当前时间大于页面访问的时间 则初始化,
  if( monitorInit === undefined || pageVistorTime === undefined || (date.getTime() > pageVistorTime)) {
    store.set(MONITOR_INIT.key, randomString());
    store.set(PAGE_VISTOR_TIME.key, +new Date(today));
  }

  write(ua, 'UserAgent');
  write(browser, 'Browser');
  write(engine, 'Engine');
  write(os, 'OS');
  write(device, 'Device');
  write(cpu, 'CPU');
}

pageInit();