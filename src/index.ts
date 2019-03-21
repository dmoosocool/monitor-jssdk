'use strict';

import { result as UA } from './packages/useragent';
import { write, randomString, getTodayLastTime, deepCopy } from './packages/util';
import { STORAGE } from './config/index';
import store from 'store';
import { xhrHook } from './packages/xhrhook';
import { WebPerformance } from './packages/performance';
import { jserror } from './packages/jserror';
import { sendRequest } from './packages/send';
const { ua, browser, engine, os, device, cpu } = UA;
const { MONITOR_INIT, PAGE_VISTOR_TIME, } = STORAGE;

const pageInit = () => {
  new xhrHook( (xhrInfo, resp) => {
    write( [xhrInfo, resp], 'xhrInfo');
  });

  new jserror();
  let monitorInit = store.get(MONITOR_INIT.key);
  let pageVistorTime = store.get(PAGE_VISTOR_TIME.key);
  const date = new Date();
  const today = getTodayLastTime();

  // 如果页面中没有这个key, 或者当前时间大于页面访问的时间 则初始化,
  if( monitorInit === undefined || pageVistorTime === undefined || (date.getTime() > Number(pageVistorTime) )) {
    store.set(MONITOR_INIT.key, randomString());
    store.set(PAGE_VISTOR_TIME.key, +new Date(today));
  }

  write(ua, 'UserAgent');
  write(browser, 'Browser');
  write(engine, 'Engine');
  write(os, 'OS');
  write(device, 'Device');
  write(cpu, 'CPU');

  window.onload = function(){

    const wp = new WebPerformance();
    write(wp.page, 'Page Performance');
    write(wp.resource, 'Resource Performance');

    // var hitokoto = document.querySelector('.hitokoto');
    // var from = document.querySelector('.from');
    update();
    async function update() {
     

      const req = new sendRequest('https://sslapi.hitokoto.cn/');
      const res = await req.request({},'');
      console.log(res);
    }    
  }


  // new sendRequest();
}

pageInit();