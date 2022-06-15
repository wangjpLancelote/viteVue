import http from '@/utils/axios';

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  // return http.request({
  //   url: '/menus',
  //   method: 'GET',
  // });
  return new Promise((resolve, _reject) => {
    resolve([]);
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