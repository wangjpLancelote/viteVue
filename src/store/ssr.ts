import { defineStore } from "pinia";
import { store } from "@/store";

export interface ISSR {
  ssrPath: string;
}
export const useSSRStore = defineStore({
  id: 'ssr',
  state: (): ISSR => ({
    ssrPath: '',
  }),
  getters: {
    getSSRPath (): string {
      return this.ssrPath;
    }
  },
  actions: {
    setSSRPath (ssrPath: string): void {
      this.ssrPath = ssrPath;
    }
  }
})

export function useSSRStoreWithOut () {
  return useSSRStore(store);
}