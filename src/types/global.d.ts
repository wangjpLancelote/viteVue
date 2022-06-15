declare type Recordable<T = any> = Record<string, T>;

declare type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T;
};

interface ImportMetaEnv extends ViteEnv {
  __: unknown;
}

declare interface ViteEnv {
  VITE_PORT: number;
  VITE_USE_MOCK: boolean;
  VITE_PUBLIC_PATH: string;
  VITE_GLOB_APP_TITLE: string;
  VITE_GLOB_APP_SHORT_NAME: string;
  VITE_DROP_CONSOLE: boolean;
  VITE_GLOB_PROD_MOCK: boolean;
  VITE_GLOB_IMG_URL: string;
  VITE_PROXY: [string, string][];
  VITE_BUILD_COMPRESS: "gzip" | "brotli" | "none";
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
}
