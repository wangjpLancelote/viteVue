import type { RouteRecordRaw } from "vue-router";

import { isNavigationFailure, Router } from "vue-router";

/** 路由守卫 */
export function createRouterGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    next();
  });

  router.afterEach((to, from, next) => {
    // next();
  });

  router.onError((to, from, next) => {
    // next();
  });
}
