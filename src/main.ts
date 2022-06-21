import Store, { SSRBaseStore } from './store/ssrBase';
import { createApp, App as APP } from "vue";
import { store, key, setupStore } from "./store/index";
import router, { setupRouter } from "./routers/Index";
import { Router } from 'vue-router';
import App from "./App.vue";
import MakeitCaptcha from "makeit-captcha";
import "makeit-captcha/dist/captcha.min.css";
import { AppProvider } from "/@/components/Application";
import { setupNaive } from "/@/plugins/index";
import { _createApp } from "./utils/config";
import createAxios from './plugins/axios';
import createMeta from './plugins/meta';

import {
  // create naive ui
  create,
  // component
} from "naive-ui";

import "vfonts/Lato.css";
// 等宽字体
import "vfonts/FiraCode.css";
import { TSSRStore } from "./entry-server";

// const naive = create();

export async function bootstrap() {
  const appProvider = createApp(AppProvider);

  const app = createApp(App);

  const meta = createAxios();
  const $axios = createAxios();
  /** 挂载Naive UI */
  setupNaive(app);
  // app.use(naive); // naiveUI

  app.use(MakeitCaptcha); // 滑块验证码

  app.use(store); // store
  app.use(router); // router
  //优先挂载一下 Provider 解决路由守卫，Axios中可使用，Dialog，Message 等之类组件
  appProvider.mount("#appProvider", true);
  await setupRouter(app);
  /** 路由准备好之后挂载实例 */
  await router.isReady();

  app.use(meta, { mixin: false });
  app.use($axios);

  app.mount("#app", true);
}

/** 构建适用于服务端和客户端的boot */
export const createBootstrap = async (isServer?: boolean) => {
  const appProvider = _createApp(AppProvider);
  const app = _createApp(App);
  const meta = createAxios();
  const $axios = createAxios();
  setupNaive(app);
  app.use(MakeitCaptcha);
  app.use(store);
  app.use(router);
  appProvider.mount('#appProvider', true);
  await setupRouter(app);
  await router.isReady();

  app.use(meta, { mixin: false });
  app.use($axios);

  app.mount('#app', true);
}

/** 这里自执行函数，在SSR中需要官关闭自动执行，这里调整为在entry-client执行 */
void bootstrap();

/** 暴漏出App实例供server.ts使用 */
export default class Main {
  public app: APP = _createApp(App);
  public router: Router = router;
  public store: SSRBaseStore = new Store();
  
  constructor () {
    const { app, router, store } = this;
    setupNaive(app);
    app.use(store).use(router)
    setupRouter(app);
  }
}
