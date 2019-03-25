import store from 'store';
import { K_REQ_QUEUE, I_REPORT_DATA } from '../config/index';
import { param } from './util';

/**
 * 发送上报请求.
 */
export class sendRequest {

  public host:string = '';
  constructor(host:string) {
    this.host = host;
  }
  /**
   * 发送上报请求.
   * @param data 上报接口参数,
   * @param type 接口类型.
   */
  async request( data, type ): Promise<string|Object|null> {
    return new Promise( (resolve, reject) => {
      const sender = new XMLHttpRequest();
      sender.open('POST',this.host);
      sender.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      let datas = param({data, type, _reporter: true});
      sender.send(datas);
      // sender.onreadystatechange = function(){
      //   if( sender.readyState === 4 && sender.status === 200 ) {
      //     const contentType = sender.getResponseHeader('content-type');
      //     if(contentType.indexOf('json') > -1 ) {
      //       // resolve( JSON.parse(sender.responseText) );
      //     }else{
      //       // resolve(sender.responseText);
      //     }
      //   }
      // }

      resolve();
    });
  }
}