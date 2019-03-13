

// const RealXMLHttpRequest = XMLHttpRequest;

export class xhrHook {
  // RealXMLHttpRequest: {new (): XMLHttpRequest} = RealXMLHttpRequest;
  public _xhr = new XMLHttpRequest();
  public _originOpen = this._xhr.open;
  public _originSend = this._xhr.send;
  public _flag:boolean = false;
  public req = {
    xhrInfo: {},
    startTime: 0,
  };

  constructor(cb) {
    
    if( true === this._flag ) {
      return void 0;
    }
    this._flag = true;
    this._originOpen = this._xhr.open;
    
    // 重写open方法.
    this._xhr.open = function(){
      // 暂存url及请求方式.
      this.req.xhrInfo = {
        url: arguments[1],
        method: arguments[0],
        status: null,
      }
      return this._originOpen.apply(this, arguments);
    }

    // 重写send方法.
    this._xhr.send = function( value ) {
      const _self = this;
      this.req.startTime = Date.now();
      const ajaxEnd = ( event ) => () => {
        if( _self.response ) {
          let responseSize = null;
          switch( _self.responseType ) {
            case 'json': 
              responseSize = JSON && JSON.stringify(_self.response).length;
              break;
            case 'blob':
            case 'moz-blob':
              responseSize = _self.response.size;
              break;
            case 'arraybuffer':
              responseSize = _self.response.byteLength;
              break;
            case 'document':
              const domele = _self.response.documentElement;
              responseSize = domele && domele.innerHTML && ( domele.innerHTML.length + 28);
              break;
            default:
              responseSize = _self.response.length;
              break;
          }
          _self.req.xhrInfo.event = event;
          _self.req.xhrInfo.status = _self.status;
          _self.req.xhrInfo.success = ( _self.status >= 200 && _self.status <= 206 ) || _self.status === 304;
          _self.req.xhrInfo.duration = Date.now() - _self.req.startTime;
          _self.req.xhrInfo.responseSize = responseSize;
          _self.req.xhrInfo.requestSize = value ? value.toString().length: 0;
          _self.req.xhrInfo.type = 'xhr';
          cb( _self.req.xhrInfo );
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
      return this._originSend.apply( this, arguments );
    };

    
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