import { I_ReportData } from '../interfaces/reportdata';
import { REPORT_TYPE } from '../config';
export class xhrHook {
  public _originOpen = XMLHttpRequest.prototype.open; // 原XMLHttpRequest.open方法
  public _originSend = XMLHttpRequest.prototype.send; // 原XMLHttpRequest.send方法
  public _flag:boolean = false;
  public req = {
    xhrInfo: {
      url: null,
      method: null,
      status: null,
      event: null,
      success: null,
      duration: null,
      responseSize: null,
      requestSize: null,
      type: null,
    },
    startTime: 0,
  };

  constructor(cb) {
    if( true === this._flag ) {
      return void 0;
    }
    const _self = this;
    this._flag = true;
    
    // 重写open方法.
    XMLHttpRequest.prototype.open = function(){
      // 暂存url及请求方式.
      _self.req.xhrInfo.url = arguments[1];
      _self.req.xhrInfo.method = arguments[0];
      _self.req.xhrInfo.status = null;
      return _self._originOpen.apply(this, arguments);
    }

    // 重写send方法.
    XMLHttpRequest.prototype.send = function( value ) {
      _self.req.startTime = Date.now();
      const ajaxEnd = ( event ) => () => {
        if( this.response ) {
          let responseSize = null;
          switch( this.responseType ) {
            case 'json': 
              responseSize = JSON && JSON.stringify(this.response).length;
              break;
            case 'blob':
            case 'moz-blob':
              responseSize = this.response.size;
              break;
            case 'arraybuffer':
              responseSize = this.response.byteLength;
              break;
            case 'document':
              const domele = this.response.documentElement;
              responseSize = domele && domele.innerHTML && ( domele.innerHTML.length + 28);
              break;
            default:
              responseSize = this.response.length;
              break;
          }
          _self.req.xhrInfo.event = event;
          _self.req.xhrInfo.status = this.status;
          _self.req.xhrInfo.success = ( this.status >= 200 && this.status <= 206 ) || this.status === 304;
          _self.req.xhrInfo.duration = Date.now() - _self.req.startTime;
          _self.req.xhrInfo.responseSize = responseSize;
          _self.req.xhrInfo.requestSize = value ? value.toString().length: 0;
          _self.req.xhrInfo.type = 'xhr';

          const resp = ( this.getResponseHeader('content-type').indexOf('json') > -1 ) ? JSON.parse(this.response) : this.response;

          
          if(!_self.req.xhrInfo.success) {
            const ajaxError:I_ReportData = {
              type: REPORT_TYPE.AjaxError,
              data: {
                msg: `type:[${_self.req.xhrInfo.type}] ${_self.req.xhrInfo.url} request faild.`,
                timestamp: +new Date,
                url: location.href,
                reporter: _self.req.xhrInfo,
              }
            }

            console.log(ajaxError);
          }

          cb( _self.req.xhrInfo, resp );
        }
      }

      if ( this.addEventListener ) {
        this.addEventListener('load', ajaxEnd('load'), false);
        this.addEventListener('error', ajaxEnd('error'), false);
        this.addEventListener('abort', ajaxEnd('abort'), false);
      }
      else {
        const _origin_onreadystatechange = this.onreadystatechange;
        this.onreadystatechange = function( event ) {
          if( _origin_onreadystatechange ) {
            this._originOpen.apply( this, arguments);
          }

          if( this.readyState === 4 ) { 
            ajaxEnd('end')();
          }
        };
      }
      return _self._originSend.apply( this, arguments );
    };

    // 重写fetch
    if( window.fetch ) {
      const _originFetch = window.fetch;
      window.fetch = function (){
        const startTime = Date.now();
        const args = [].slice.call(arguments);

        let fetchInput = args[0];
        let method = 'GET';
        let url = '';

        if( 'string' == typeof fetchInput) {
          url = fetchInput;
        }
        else if( 'Request' in window && fetchInput instanceof Request ) {
          url = fetchInput.url;
          if(fetchInput.method) {
            method = fetchInput.method;
          }
        } 
        else {
          url = fetchInput.toString();
        }

        if( args[1] && args[1].method ) {
          method = args[1].method;
        }

        const fetchData = {
          method,
          url,
          status: null,
          type: '',
          duration: 0,
        }

        return _originFetch.apply( this, args).then(( response ) => {
          fetchData.status = response.status;
          fetchData.type = 'fetch';
          fetchData.duration = Date.now() - startTime;
          cb( fetchData );

          return response;
        });
      }
    }
  }
}