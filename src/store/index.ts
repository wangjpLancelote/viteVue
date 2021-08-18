import { InjectionKey } from "@vue/runtime-core";
import { createStore, Store } from "vuex";
import { createPinia } from "pinia";
import type { App } from "vue";

export interface State {
  count: number;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state() {
    return {
      count: 0,
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});

export const piniaStore = createPinia();
export const setupStore = (app: App<Element>) => {
  return app.use(piniaStore);
};
