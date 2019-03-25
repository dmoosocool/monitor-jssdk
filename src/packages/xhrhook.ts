import { I_REPORT_DATA, SERVER_URL } from '../config/index';
import { REPORT_TYPE } from '../interfaces/reportdata';
import { param2obj, param as ParerURL } from './util';
import { sendRequest } from './send';
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
      data: null,
    },
    startTime: 0,
  };

  public sender: sendRequest;
  constructor( sender: sendRequest) {
    if( true === this._flag ) {
      return void 0;
    }
    const _self = this;
    this._flag = true;
    this.sender = sender;
    // 重写open方法.
    XMLHttpRequest.prototype.open = function(){
      // 暂存url及请求方式.
      // _self.req.xhrInfo.url = arguments[1];
      _self.req.xhrInfo.method = arguments[0];
      _self.req.xhrInfo.status = null;
      return _self._originOpen.apply(this, arguments);
    }

    // 重写send方法.
    XMLHttpRequest.prototype.send = function( value ) {
      const _that = this;
      _self.req.startTime = Date.now();
      var ajaxEnd = ( event ) => async () => {
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
          _self.req.xhrInfo.url = _that.responseURL;
          _self.req.xhrInfo.event = event;
          _self.req.xhrInfo.status = this.status;
          _self.req.xhrInfo.success = ( this.status >= 200 && this.status <= 206 ) || this.status === 304;
          _self.req.xhrInfo.duration = Date.now() - _self.req.startTime;
          _self.req.xhrInfo.responseSize = responseSize;
          _self.req.xhrInfo.requestSize = value ? value.toString().length: 0;
          _self.req.xhrInfo.type = 'xhr';
          _self.req.xhrInfo.data = value;
          // 判断是否为自身上报请求, 如果是则不记录. 并删除标记字段.
          if( typeof value === 'string' || !value) {
            let param = !value ? {} : param2obj(value.toString());
            if(!param.hasOwnProperty('_reporter')) {
              let ajaxReporter:I_REPORT_DATA = {
                type: (!!_self.req.xhrInfo.success) ? REPORT_TYPE.AjaxSuccess : REPORT_TYPE.AjaxError,
                data: {
                  msg: (!!_self.req.xhrInfo.success) ? 'success' : `type:[${_self.req.xhrInfo.type}] ${_self.req.xhrInfo.url} request faild.`,
                  timestamp: +new Date,
                  url: location.href,
                  reporter: encodeURIComponent(JSON.stringify(_self.req.xhrInfo)),
                }
              };
              await _self.sender.request(ajaxReporter.data, ajaxReporter.type);
            }
          }
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
          return response;
        });
      }
    }
  }
}