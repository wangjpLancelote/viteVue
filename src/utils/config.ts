import { createApp, createSSRApp, App, Component } from 'vue';
import { createMemoryHistory, createWebHashHistory } from 'vue-router';

const envs = import.meta.env;

let appConfig = envs;
if (typeof process !== 'undefined') {
  appConfig = process.env as any;
}

if (typeof window !== 'undefined' && window['__APP_CONFIG__']) {
  appConfig = window['__APP_CONFIG__'] as any;
}

export const config = {
  base_h5: '',
  base_url: '',
}

export const isSSR = import.meta.env.SSR;

/** 构建App */
export const _createApp = (root: Component): App => {
  return isSSR ? createSSRApp(root) : createApp(root);
}

/** SSR路由在Node环境中无法使用Hash，因此要用Memory */
export const routerHistory = () => {
  return isSSR ? createMemoryHistory() : createWebHashHistory();
}