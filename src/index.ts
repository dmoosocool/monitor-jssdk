'use strict';

// import { result as UA } from './packages/useragent';
import { write, randomString, getTodayLastTime } from './util';
// import { STORAGE } from './packages/storage';
// import store from 'store';

// const { ua, browser, engine, os, device, cpu } = UA;
// const { MONITOR_INIT, PAGE_VISTOR_TIME, } = STORAGE;

// const pageInit = () => {
//   let monitorInit = store.get(MONITOR_INIT.key);
//   let pageVistorTime = store.get(PAGE_VISTOR_TIME.key);
//   const date = new Date();
//   const today = getTodayLastTime();

//   // 如果页面中没有这个key, 或者当前时间大于页面访问的时间 则初始化,
//   if( monitorInit === undefined || pageVistorTime === undefined || (date.getTime() > pageVistorTime)) {
//     store.set(MONITOR_INIT.key, randomString());
//     store.set(PAGE_VISTOR_TIME.key, +new Date(today));
//   }

//   write(ua, 'UserAgent');
//   write(browser, 'Browser');
//   write(engine, 'Engine');
//   write(os, 'OS');
//   write(device, 'Device');
//   write(cpu, 'CPU');
// }

// pageInit();

// import { xhrHook } from './packages/XMLHttpRequest';


// new xhrHook( (xhrInfo)=>{
//   write(xhrInfo, 'xhrInfo');
// })



class B implements XMLHttpRequest{
  readyState:number = 0;
  responseText:string = '';
  responseType:XMLHttpRequestResponseType = '';
  responseURL:string = '';
  responseXML:Document;
  status:number;
  statusText:string;
  timeout:number;
  upload:XMLHttpRequestUpload;
  withCredentials:boolean;
  DONE:number;
  HEADERS_RECEIVED:number;
  LOADING:number;
  OPENED:number;
  UNSENT:number;
  addEventListener(){}
  removeEventListener(){}
  dispatchEvent():boolean{ return false;};
  getAllResponseHeaders():string{return ''}
  getResponseHeader():string{ return''}
  setRequestHeader(){}
  overrideMimeType(){}
  open(){}
  abort(){}
  response(){}
  send(){}
  onabort(){}
  onerror(){}
  onload(){}
  onloadend(){}
  onloadstart(){}
  onprogress(){}
  onreadystatechange(){}
  ontimeout(){}

}

new B();