'use strict';
const detectType = ( source ): String => {
  return Object.prototype.toString
    .call(source)
    .split(/[\[,\s,\]]/)[2]
    .toLowerCase()
}

/**
 * 深拷贝
 * @param source 需要拷贝的对象.
 */
const deepCopy = (source):Object => {
  const type = detectType(source);
  if( !(type === 'object' || type === 'array')) {
    return source;
  }

  const newObject = type === 'array' ? source.slice() : Object.assign( {}, source );
  Object.keys(newObject).forEach( (key) => {
    newObject[key] = deepCopy(newObject[key]);
  });

  return newObject;
}

/**
 * 输出调试,
 * @param obj 对象,
 * @param label 显示的标签.
 */
const write = (obj: any, label: string) => {
  const renderText = function (content:any, wapperElement:Element) {
    var type = Object.prototype.toString.call(content);

    switch(type) {
      case '[object Object]':
        wapperElement.append(document.createTextNode( JSON.stringify(content)));
        break;
      case '[object Array]': 
        content.forEach(element => {
          wapperElement.append(document.createTextNode( JSON.stringify(element)));
          wapperElement.append(document.createElement('br'));
          wapperElement.append(document.createElement('br'));
        });
        break;
      default:
        wapperElement.append(document.createTextNode( JSON.stringify(content)));
        break;
    }
  }
  let wapper = document.createElement('div');
  wapper.style.padding = '10px';
  wapper.style.border = '1px solid #333';
  wapper.style.margin = '0 0 5px 0';

  let titleNode = document.createElement('h1');
  titleNode.appendChild(document.createTextNode(label));
  titleNode.style.fontSize = '18px';
  titleNode.style.padding = '5px 0'
  titleNode.style.margin = '0';
  titleNode.style.wordBreak = 'break-all';
  
  let valueNode = document.createElement('div');
  // valueNode.appendChild(document.createTextNode(JSON.stringify(obj)));
  renderText(obj, valueNode);
  valueNode.style.margin = '10px 0';
  valueNode.style.fontSize = '11px';
  valueNode.style.wordBreak = 'break-all';

  wapper.appendChild(titleNode);
  wapper.appendChild(valueNode);
  document.getElementsByTagName('body')[0].appendChild(wapper);
};

/**
 * 获取随机数.
 * @param {number} length  随机数长度
 * @return {string} 随机数 
 */
const randomString = ( length=10 ): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'
  const maxPos = chars.length;
  let pwd = '';

  for(let i = 0 ; i < length; i++ ) {
    pwd = pwd + chars.charAt( Math.floor( Math.random() * maxPos ) );
  }

  return pwd + (+new Date())
}


/**
 * 获取今日最晚时间, 用于计算uv,
 */
const getTodayLastTime = ():string => {
	const date = new Date();
	let year:number = date.getFullYear();
	let month:number|string = date.getMonth() + 1;
	let day:number|string = date.getDate();

	if(month < 10 ) {
		month = '0' + month;
	}

	if( day < 10 ) {
		day = '0' + day;
	}

	return `${year}/${month}/${day} 23:59:59`;
}

export {
  write,
  randomString,
  getTodayLastTime,
  deepCopy,
}