import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import { createRouterGuards } from "./router-guard";

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: (_) => {
      return {
        path: "/helloworld",
      };
    },
  },
  {
    path: "/helloworld",
    name: "helloworld",
    component: HelloWorld,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../components/About.vue"),
  },
  {
    path: "/:currentPath(.*)*", // 路由未匹配到，进入这个
    redirect: (_) => {
      return { path: "/404" };
    },
  },
];

const router = createRouter({
  history: createWebHistory(""),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      el: "#app",
      top: 0,
      behavior: "smooth",
    };
  },
});

createRouterGuards(router);

export default router;
