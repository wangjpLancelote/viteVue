import { createApp } from "vue";
import { store, key, setupStore } from "./store/index";
import router, { setupRouter } from "./routers/Index";
import App from "./App.vue";
import MakeitCaptcha from "makeit-captcha";
import "makeit-captcha/dist/captcha.min.css";
import { AppProvider } from "/@/components/Application";
import { setupNaive } from "/@/plugins/index";
import {
  // create naive ui
  create,
  // component
} from "naive-ui";

import "vfonts/Lato.css";
// 等宽字体
import "vfonts/FiraCode.css";

// const naive = create();

async function bootstrap() {
  const appProvider = createApp(AppProvider);

  const app = createApp(App);
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

  app.mount("#app", true);
}

void bootstrap();
