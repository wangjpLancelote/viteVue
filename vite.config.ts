import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import pkg from "./package.json";
import { format } from "date-fns";
import { OUTPUT_DIR } from "./build/constant";
const { dependencies, devDependencies, name, version } = pkg;

/** 应用的信息 */
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
};

function pathResolve(dir: string) {
  return resolve(process.cwd(), ".", dir);
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: /\/#\//,
        replacement: pathResolve("types") + "/",
      },
      {
        find: "@",
        replacement: pathResolve("src") + "/",
      },
    ],
    dedupe: ["vue"],
  },
  define: {
    __APP_INFO__: JSON.stringify(__APP_INFO__),
  },
  /** 服务请求| 转发 */
  server: {},
  optimizeDeps: {
    include: [],
    exclude: ["vue-demi"],
  },
  /** 构建参数 */
  build: {
    target: "es2015",
    outDir: OUTPUT_DIR,
  },
});
