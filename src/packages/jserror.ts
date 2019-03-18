import { I_ReportData } from '../interfaces/reportdata';
import { write } from '../util';
export class jserror {

  constructor( ) {
    this.catchJSError();
    this.catchResourceError();
  }

  // 捕获js文件错误.
  catchJSError() {
    window.onerror = function ( message, source, line, col, error ) {
      const url = location.href;
      const msg = ( error && error.stack ) ? error.stack.toString().toLowerCase() : message.toString().toLowerCase();
      const category = 'jserror';
      const reports: I_ReportData = {
        msg,
        category, 
        timestamp: new Date().getTime(),
        url,
        source,
        data: {
          line,
          col
        }
      }

      write(reports, 'JS_ERROR');
    }
  }

  // 捕获资源( img, script, css, jsonp )错误.
  catchResourceError() {
    document.addEventListener( 'error' , function( e:any ) {
      const source = e.target.outerHTML;
      const msg = `${ e.target.localName } is load error.`;
      const category = 'resource';
      const timestamp = new Date().getTime();
      const url = location.href;
      const reports: I_ReportData = {
        msg,
        category,
        timestamp,
        url,
        source,
        data: {
          type: e.type,
          target: source,
        }
      };

      write(reports, 'RESOURCE_ERROR');
    }, true);
  }

  // 捕获Ajax错误.
  // catchAjaxError() {
  //   const _originAjaxSend = XMLHttpRequest.prototype.send;
  //   const cb = this.AjaxCallback;
  //   XMLHttpRequest.prototype.send = function (){
  //     const _origin_onreadystatechange = this.onreadystatechange;
  //     this.onreadystatechange = function(res) {
  //       if( this.status === 200 && this.readySize === 4) {
  //         cb && cb(res, 'OK');
  //       }
  //       else if( this.status >= 400 && this.status <= 499) {
  //         cb && cb(res, 'CLIENT_ERROR');  
  //       }
  //       else if( this.status >= 500 && this.status <= 599) {
  //         cb && cb(res, 'SERVER_ERROR');
  //       }
  //       _origin_onreadystatechange.apply( this, arguments );
  //     }
  //     _originAjaxSend.apply( this, arguments);
  //   }
  // }
}
