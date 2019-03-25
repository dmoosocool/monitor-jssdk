import * as config from './config/index';
import * as store from 'store';
import { sendRequest } from './packages/send';
import { jserror } from './packages/jserror';
import { xhrHook } from './packages/xhrhook';
import { WebPerformance } from './packages/performance';
import { result as UA } from './packages/useragent';

export class Monitor {
  public store = store;
  public config = config;
  public serverURL: string;
  public sender:sendRequest;

  constructor(serverURL=config.SERVER_URL) {
    this.sender = new sendRequest( serverURL );
    const _that = this;
    new xhrHook(_that.sender);
    new jserror(_that.sender);

    let _origin_onload = window.onload || function (){};
    window.onload = function(){
      new WebPerformance(_that.sender);
      _that.useragent();
      _origin_onload.apply(this, arguments);
    }
  }
  
  public async useragent(){
    await this.sender.request(UA, config.E_REPORT_TYPE.UserAgent);
  }
}