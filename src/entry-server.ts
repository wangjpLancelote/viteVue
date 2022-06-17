import Main from './main';
import { renderToString } from '@vue/server-renderer';
import { ReqConfig, getAsyncData } from './service/public';
import { useSSRStoreWithOut } from '@/store/ssr';
import {SSRBaseStore} from './store/ssrBase';

export const ssrStore = useSSRStoreWithOut();
export type TSSRStore = typeof ssrStore;

export async function render (url: string, manifest:{ [key: string]: string[] }, reqConfig: ReqConfig) {
  const { app, router, store } = new Main(); // 构建一个app实例

  /** 同构路由 */
  router.push(url);
  await router.isReady();
  const { prefetchData } = router.currentRoute.value.query;
  Number(prefetchData) && ssrStore.setSSRPath(url); // 收集SSR path
  /** 预取数据 */
  await getAsyncData(router, store, true, reqConfig);

  /** 生成html */
  const ctx: any = {};
  const html = await renderToString(app, ctx);

  const preloadLinks = ctx.modules ? 
  renderPreloadLinks(ctx.modules, manifest): [];

  return [html, preloadLinks, store];
}

/** 加载scripts|links */
function renderPreloadLinks (modules: any, manifest: any) {
  let links = '';
  const seen = new Set();
  modules.forEach((id: string) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file: string) => {
        if (!seen.has(file)) {
          seen.add(file);
          links += renderPreloadLink(file);
        }
      })
    }
  })
  return links;
}

function renderPreloadLink (file: string): string {
  if (file.endsWith('.js')) { // 处理js链接
    return `<link rel="modulePreload" crossorigin href=${file}>`
  } else if (file.endsWith('.css')) { // 处理css
    `<link rel="stylesheet" href=${file}>`;
  }
  return '';

}