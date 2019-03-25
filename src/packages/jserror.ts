import { write } from './util';
import { E_REPORT_TYPE, I_REPORT_DATA, SERVER_URL } from '../config/index';
import { sendRequest } from './send';
export class jserror {
  public sender:sendRequest;
  constructor( sender: sendRequest ) {
    this.sender = sender;
    this.catchJSError();
    this.catchResourceError();
  }

  // 捕获js文件错误.
  catchJSError() {
    const _that = this;
    window.onerror = async function ( message, source, line, col, error ) {
      const url = location.href;
      const msg = ( error && error.stack ) ? error.stack.toString().toLowerCase() : message.toString().toLowerCase();
      const reports: I_REPORT_DATA = {
        type: E_REPORT_TYPE.JsError,
        data: {
          msg,
          timestamp: new Date().getTime(),
          url,
          source,
          reporter: encodeURIComponent(JSON.stringify({
            line,
            col
          }))
        }
      }
      
      await _that.sender.request(reports.data, reports.type);
      // write(reports, 'PAGE_ERROR');
    }
  }

  // 捕获资源( img, script, css, jsonp )错误.
  catchResourceError() {
    const _that = this;
    document.addEventListener( 'error' , async function( e:any ) {
      const source = e.target.outerHTML;
      const msg = `${ e.target.localName } is load error.`;
      const timestamp = new Date().getTime();
      const url = location.href;
      const reports: I_REPORT_DATA = {
        type: E_REPORT_TYPE.ResourceError,
        data: {
          msg,
          timestamp,
          url,
          source,
          reporter: encodeURIComponent(JSON.stringify({
            type: e.type,
            target: source,
          }))
        }
      };
      await _that.sender.request(reports.data, reports.type);
      // write(reports, 'RESOURCE_ERROR');
    }, true);
  }
}
