import { createApp } from "vue";
import { store, key, setupStore } from "./store/index";
import router from "./routers/Index";
import App from "./App.vue";

import {
  // create naive ui
  create,
  // component
} from "naive-ui";

import "vfonts/Lato.css";
// 等宽字体
import "vfonts/FiraCode.css";

const naive = create();

const app = createApp(App);

app.use(store);
app.use(router);
app.use(naive);

app.mount("#app");
