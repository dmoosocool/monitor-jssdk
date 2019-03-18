'use strict';

import { result as UA } from './packages/useragent';
import { write, randomString, getTodayLastTime } from './util';
import { STORAGE } from './packages/storage';
import store from 'store';
import { xhrHook } from './packages/xhrhook';
import  { WebPerformance } from './packages/performance';
import { jserror } from './packages/jserror';

const { ua, browser, engine, os, device, cpu } = UA;
const { MONITOR_INIT, PAGE_VISTOR_TIME, } = STORAGE;

const pageInit = () => {
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

    var hitokoto = document.querySelector('.hitokoto');
    var from = document.querySelector('.from');
    update();
    function update() {
        var gethi = new XMLHttpRequest();
        gethi.open("GET","https://sslapi.hitokoto.cn/");
        //这里选择类别，详见官方文档
        gethi.send();
        gethi.onreadystatechange = function () {
            if (gethi.readyState===4 && gethi.status===200) {
                var Hi = JSON.parse(gethi.responseText);
                hitokoto.innerHTML = Hi.hitokoto;
                from.innerHTML = "出自: <b>" + Hi.from + "</b>"; //可自定义输出格式
            }
        }
    }
  }

  new xhrHook( (xhrInfo) => {
    write(xhrInfo, 'xhrInfo');
  });
}

pageInit();

document.body.onclick = function() {
  write(['asd','asd'],'test');
}