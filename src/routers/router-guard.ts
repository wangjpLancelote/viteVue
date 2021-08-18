import type { RouteRecordRaw } from "vue-router";

import { isNavigationFailure, Router } from "vue-router";

/** 路由守卫 */
export function createRouterGuards(router: Router) {
  router.beforeEach(() => {});

  router.afterEach(() => {});

  router.onError(() => {});
}
