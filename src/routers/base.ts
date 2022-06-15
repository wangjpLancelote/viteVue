import type { AppRouteRecordRaw } from "@/routers/types";
import { ErrorPage, RedirectName, Layout } from "@/routers/constant";

export const ErrorPageRoute: AppRouteRecordRaw = {
  path: "/:path(.*)*",
  name: "ErrorPage",
  component: Layout,
  meta: {
    title: "ErrorPage",
    hideBreadcrumb: true,
  },
  children: [
    {
      path: "/:path(.*)*",
      name: "ErrorPageSon",
      component: ErrorPage,
      meta: {
        title: "ErrorPage",
        hideBreadcrumb: true,
      },
    },
  ],
};

export const RedirectRoute: AppRouteRecordRaw = {
  path: "/redirect",
  name: RedirectName,
  component: Layout,
  meta: {
    title: RedirectName,
    hideBreadcrumb: true,
  },
  children: [
    {
      path: "/redirect/:path(.*)",
      name: RedirectName,
      component: () => import("@/views/redirect/index.vue"),
      meta: {
        title: RedirectName,
        hideBreadcrumb: true,
      },
    },
  ],
};
