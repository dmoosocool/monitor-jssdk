import store from 'store';
import { K_REQ_QUEUE, I_REPORT_DATA } from '../config/index';

/**
 * 发送上报请求.
 */
export class sendRequest {

  public host:string = '';

  constructor(host:string) {
    this.host = host;
    this.checkQueue(); 
  }

  checkQueue() {
    const queue = store.get( K_REQ_QUEUE );
    if(!queue) return;
    const reportQueue = JSON.parse(queue);
    if(!!reportQueue) {
      // todo: 解析并队列上报.
    }
  }


  /**
   * 合并请求,
   * @param data 
   */
  mergeRequest(data: I_REPORT_DATA[]) {
    const newQueue = [];
    data.forEach( (item) => {
      newQueue[item.type].push(item.data);
    })
    store.set( K_REQ_QUEUE , JSON.stringify(newQueue));
  }

  /**
   * 将请求参数转化成Url形式, 只支持一级参数.
   */
  param( obj: Object) {
    const keys = Object.keys(obj);
    let urlString = [];
    keys.forEach( (key) => {
      if( Object.prototype.toString.call(obj[key]) === '[object Object]') {
        return true;
      }
      urlString.push(`${key}=${obj[key]}`);
    })
    return urlString.join('&');
  }

  /**
   * 发送上报请求.
   * @param data 上报接口参数,
   * @param type 接口类型.
   */
  async request( data, type ): Promise<string> {
    return new Promise( (resolve, reject) => {
      if(!data) reject('data is empty.');
      data = JSON.stringify(data);
      const parsed = this.param({ type, data});
      const url = this.host + (this.host.indexOf('?') > -1 ? '&' : '?') + parsed;

      let img = new Image(1, 1);
      img.onload = img.onerror = img.onabort = function() {
        resolve();
        img.onload = img.onerror = img.onabort = null;
        img = null;
      }
      img.src = url;
    });
  }
}