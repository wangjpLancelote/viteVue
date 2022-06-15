import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import { createRouterGuards } from "./router-guard";
import { App } from "vue";
import { RedirectRoute } from "@/routers/base";
import { PageEnum } from "@/enums/PageEnum";

const modules = import.meta.globEager("./modules/**/*.ts");

const routeModuleList: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

function sortRoute(a, b) {
  return (a.meta?.sort || 0) - (b.meta?.sort || 0);
}

routeModuleList.sort(sortRoute);

export const RootRoute: RouteRecordRaw = {
  path: "/",
  name: "Root",
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: "Root",
  },
};

export const LoginRoute: RouteRecordRaw = {
  path: "/login",
  name: "Login",
  component: () => import("@/views/login/index.vue"),
  meta: {
    title: "登录",
  },
};

//需要验证权限
export const asyncRoutes = [...routeModuleList];

//普通路由 无需验证权限
export const constantRouter: any[] = [LoginRoute, RootRoute, RedirectRoute];

// const routes: Array<RouteRecordRaw> = [
//   {
//     path: "",
//     redirect: (_) => {
//       return {
//         path: "/helloworld",
//       };
//     },
//   },
//   {
//     path: "/helloworld",
//     name: "helloworld",
//     component: HelloWorld,
//   },
//   {
//     path: "/about",
//     name: "about",
//     component: () => import("../components/About.vue"),
//   },
//   {
//     path: "/:currentPath(.*)*", // 路由未匹配到，进入这个
//     redirect: (_) => {
//       return { path: "/404" };
//     },
//   },
// ];

const router = createRouter({
  history: createWebHistory(""),
  strict: true,
  routes: [...asyncRoutes, ...constantRouter], // 路由列表
  scrollBehavior(to, from, savedPosition) {
    return {
      el: "#app",
      top: 0,
      behavior: "smooth",
    };
  },
});

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
}

// createRouterGuards(router);

export default router;
