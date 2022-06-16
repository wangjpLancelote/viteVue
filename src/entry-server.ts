import Main from './main';
import { renderToString } from '@vue/server-renderer';
import { ReqConfig } from './service/public';
import { useSSRStoreWithOut } from '@/store/ssr';

export const ssrStore = useSSRStoreWithOut();
export type TSSRStore = typeof ssrStore;

export async function render (url: string, manifest:{ [key: string]: string[] }, reqConfig: ReqConfig) {
  const { app, router, store } = new Main();

  /** 同构路由 */
  router.push(url);
  await router.isReady();
  const { prefetchData } = router.currentRoute.value.query;
  
  /** 预取数据 */

}