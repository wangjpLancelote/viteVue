import http from '@/utils/axios';
import { Layout } from "@/routers/constant";

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  // return http.request({
  //   url: '/menus',
  //   method: 'GET',
  // });
  return new Promise((resolve, _reject) => {
    resolve([{ path: '/dashboard', name: '仪表盘', component: Layout, meta: { title: 'Dashboard', sort: 0 } }, { path: 'console', parent: '/dashboard', component: () => import("@/views/dashboard/console.vue") }]);
  });
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?) {
  // return http.request({
  //   url: '/menu/list',
  //   method: 'GET',
  //   params,
  // });
  return new Promise((resolve, _reject) => {
    resolve([]);
  })
}