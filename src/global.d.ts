import { IAsyncDataOption, IRegisterModuleOption } from './src/service/public';
import { AxiosPromise, AxiosRequestConfig } from 'axios';
declare global {
  type commonObject<T> = {
    [key: string]: T;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: (param: AxiosRequestConfig) => AxiosPromise;
    [key: string]: any;
  }
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

export {};