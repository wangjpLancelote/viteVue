import { renderToString } from '@vue/server-renderer';
import { ReqConfig, getAsyncData } from './service/public';
import { useSSRStoreWithOut } from '@/store/ssr';
import { createBootstrap } from './main';
import { RouteLocationRaw } from 'vue-router';
import { App, ssrContextKey } from 'vue';

export const ssrStore = useSSRStoreWithOut();
export type TSSRStore = typeof ssrStore;

export async function render (app: App, url: RouteLocationRaw, manifest:{ [key: string]: string[] }, reqConfig: ReqConfig): Promise<any[]> {

  /** app.config.globalProperties.$router 挂载在全局的$router实例 */
  await app.config.globalProperties.$router.push(url);
  await app.config.globalProperties.$router.isReady();

  // /** 预取数据 */
  // await getAsyncData(router, store, true, reqConfig);

  /** 生成html */
  const ctx: any = {};
  const html = await renderToString(app, ctx);

  if (app._context.provides[ssrContextKey]) {
    delete app._context.provides[ssrContextKey];
  }

  /** $meta 自定义属性 */
  const _meta = app.config.globalProperties.$meta.renderToString();

  const preloadLinks = ctx.modules ? renderPreloadLinks(ctx.modules, manifest): [];

  return [html, preloadLinks, _meta];
}

/** 加载scripts|links */
function renderPreloadLinks (modules: any, manifest: any): string {
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