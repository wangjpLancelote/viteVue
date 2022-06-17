import { Router, RouteLocation } from 'vue-router';
import { Store } from 'vuex';
import { store as StorePinia } from '@/store';
import { Component } from 'vue';
import { useSSRStoreWithOut } from '@/store/ssr';
import { TSSRStore } from '@/entry-server';
import {SSRBaseStore} from '@/store/ssrBase';


export interface ReqConfig {
  v: string;
  token: string;
}

export async function getAsyncData (router: Router, store: SSRBaseStore, isServer: boolean, reqConfig?: ReqConfig):Promise<void> {
  
  return new Promise((resolve, reject) => {
    const { matched, fullPath, query } = router.currentRoute.value;

    /** 服务端路由访问到的组件 */
    const components: Component[] = matched.map(comDefaults => {
      return comDefaults.components.default;
    });
    registerModules(components, router, store, isServer, reqConfig);
    const { prefetchData: isPrefetch } = query;
    if ((isServer && Number(isPrefetch)) || (!isServer && !Number(isPrefetch))) {
      prefetchData(components, router, store, isServer);
    }
    !isServer && store.ssrPath !== fullPath && store.setSSRPath('');

    resolve();
  })
}

/** 动态注册组件
 *  所谓注册组件就是将App上的属性如router、store挂载到单个组件上
 *  registerModule 是Vue组件实例上的方法
 */
export const registerModules = (components: Component[], router: Router, store: SSRBaseStore, isServer: boolean, reqConfig?: ReqConfig) => {
  return components.filter((c: any) => typeof c.registerModule === 'function').forEach((com: any) => {
    com.registerModule({
      route: router.currentRoute,
      store,
      router,
      isServer,
      reqConfig,
    })
  })  
}

/** 预取数据 */
export const prefetchData = (components: Component[], router: Router, store: SSRBaseStore, isServer: boolean) => {
  const asyncDataComponents: Component[] = components.filter((v: any) => typeof v.asyncData === 'function');
  return Promise.all(asyncDataComponents.map((asyncComponent: any) => {
    return asyncComponent.asyncData({
      route: router.currentRoute.value,
      store,
      router,
      isServer,
    })
  }))
}

export const getRealUrl = () => {
  
}

export interface IAsyncDataOption {
  route: RouteLocation; // 路由实例
  store: SSRBaseStore; // store
  router: Router; // 路由原型
  isServer: boolean; // 是否服务端渲染
  reqConfig: ReqConfig;
}

export interface IRegisterModuleOption {
  reqConfig: ReqConfig;
}

/** 对Vue组件实例挂载asyncData和registerModule方法 */
declare module '@vue/runtime-core' {
  export interface ComponentCustomOptions {
    asyncData?: (option: IAsyncDataOption) => void;
    registerModule?: (option: IRegisterModuleOption) => void
  }
  export interface ComponentCustomProperties {
    asyncData?: (option: IAsyncDataOption) => void;
    registerModule?: (option: IRegisterModuleOption) => void
  }
}