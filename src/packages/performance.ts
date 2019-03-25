'use strict';
import { sendRequest } from './send';
import { SERVER_URL, E_REPORT_TYPE } from '../config/index';
interface I_PagePerformance {
  /** 是否支持page performance */
  status: boolean;
  /** dns时长 */
  dns: number;
  /** tcp时长 */
  tcp: number;
  /** 白屏时长 */
  wct: number;
  /** dom渲染时长 */
  dom: number;
  /** 页面onload时长 */
  load: number;
  /** 页面准备时长 */
  ready: number;
  /** 重定向时长 */
  redirct: number;
  /** unload时长 */
  unload: number;
  /** 请求时长 */
  request: number;
  /** 解析dom时长 */
  parsingDom: number;
}

/**
 * 默认 pagePerformance.
 */
const defaultPagePerformance: I_PagePerformance = {
  status: false,
  dns: 0,
  tcp: 0,
  wct: 0,
  dom: 0,
  load: 0,
  ready: 0,
  redirct: 0,
  unload: 0,
  request: 0,
  parsingDom: 0
}

export class WebPerformance {

  public page: I_PagePerformance;  // 页面性能.
  public resource: object[];  // 资源性能.
  public sender: sendRequest;

  constructor( sender: sendRequest) {
    this.sender = sender;
    // 获取页面性能.
    this.page = this.getPagePerformance();
    // 获取资源加载性能.
    this.resource = this.getResourcePerformance();

    this.senddata();
  }

  private async senddata() {
    await this.sender.request(this.page, E_REPORT_TYPE.Performace);
    await this.sender.request(this.resource, E_REPORT_TYPE.ResourceError);
  }

  /**
   *  获取页面性能,
   */
  private getPagePerformance = (): I_PagePerformance => {
    let pPerformance: I_PagePerformance;
    if ( window.performance && window.performance.timing ) {
      const timing = window.performance.timing;
      pPerformance = {
        status: true,
        dns: timing.domainLookupEnd - timing.domainLookupStart || 0,
        tcp: timing.connectEnd - timing.connectStart || 0,
        wct: timing.responseStart - timing.navigationStart || 0,
        dom: timing.domContentLoadedEventEnd - timing.navigationStart || 0,
        load: timing.loadEventEnd - timing.navigationStart || 0,
        ready: timing.fetchStart - timing.navigationStart || 0,
        redirct: timing.redirectEnd - timing.redirectStart || 0,
        unload: timing.unloadEventEnd - timing.unloadEventStart || 0,
        request: timing.responseEnd - timing.responseStart || 0,
        parsingDom: timing.domComplete - timing.domInteractive || 0,
      };
    } else {
      pPerformance = defaultPagePerformance;
    }
    return pPerformance;
  };

  /**
   * 获取资源加载性能.
   */
  private getResourcePerformance = (): object[] => {
    let rList = [];
    if( window.performance && window.performance.getEntries ) {
      const resource = window.performance.getEntriesByType('resource');
      if( !resource && !resource.length) return rList;

      resource.forEach( (item: PerformanceResourceTiming) => {
        let json = {
          name: item.name,
          method: 'GET',
          type: item.initiatorType,
          duration: item.duration.toFixed(2) || 0,
          decodedBodySize: item.decodedBodySize || 0,
          nextHopProtocol: item.nextHopProtocol,
        }

        rList.push(json);
      });
    }
    return rList;
  }
}