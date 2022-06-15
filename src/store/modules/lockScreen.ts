import { IS_LOCKSCREEN } from "../mutation-type";
import { defineStore } from "pinia";
// import { store, setupStore } from "/@/store/modules/lockScreen";

// 长时间不操作默认锁屏时间
const initTime = 60 * 60;
