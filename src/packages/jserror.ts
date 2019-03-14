import { I_ReportData } from '../interfaces/reportdata';
export class jserror {
  constructor(){
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

      //Todo: 资源上报.
      return reports;
    }
  }

  // 捕获资源( img, script, css, jsonp )错误.
  catchResourceError() {
    window.addEventListener( 'error' , function( e ) {
      const msg = `${e.target[0].localName} is load error.`;
      const category = 'resource';
      const timestamp = new Date().getTime();
      const url = location.href;
      const source = e.target[0].currentSrc;
      const reports: I_ReportData = {
        msg,
        category,
        timestamp,
        url,
        source,
        data: {
          type: e.type,
          target: e.target[0].localName,
        }
      };
      //Todo: 资源上报.
      return reports;
    });
  }

  // 捕获Ajax错误.
  catchAjaxError() {
    const _originAjaxAbort = XMLHttpRequest.prototype.abort;
  }
}
