import axios, { AxiosRequestConfig } from 'axios'
import { App } from 'vue';

export default function createAxios () {
  return {
    install (app: App) {
      function $axios (params: AxiosRequestConfig) {
        return axios(params).then((response: any) => {
          return response.data;
        }).catch((reject) => {
          return {};
        })
      }
      app.provide('axios', $axios);
      app.config.globalProperties.$axios = $axios;
    }
  }
}