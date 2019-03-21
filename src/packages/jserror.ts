import { write } from './util';
import { E_REPORT_TYPE, I_REPORT_DATA } from '../config/index';
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
      const reports: I_REPORT_DATA = {
        type: E_REPORT_TYPE.JsError,
        data: {
          msg,
          timestamp: new Date().getTime(),
          url,
          source,
          reporter: {
            line,
            col
          }
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
      const timestamp = new Date().getTime();
      const url = location.href;
      const reports: I_REPORT_DATA = {
        type: E_REPORT_TYPE.ResourceError,
        data: {
          msg,
          timestamp,
          url,
          source,
          reporter: {
            type: e.type,
            target: source,
          }
        }
      };
      write(reports, 'RESOURCE_ERROR');
    }, true);
  }
}
