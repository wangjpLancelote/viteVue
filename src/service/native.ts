import Store, { SSRBaseStore } from '@/store/ssrBase';
import { App } from 'vue';
import { Router } from 'vue-router';
import { getUrlQuery } from './public';


export interface StateFromNativeResponse {
  code: string | number;
  data: any
}


export const getStateFromNative = (r: StateFromNativeResponse, app: App) => {
  const { data, code } = r;

}

/** 初始化微信环境，注入wx SDK */
export const initWXEnv = () => {
  const script = document.createElement('script');
  script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
 document.body.appendChild(script); 
}