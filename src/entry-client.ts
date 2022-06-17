import Main from './main';
import { getAsyncData, getRealUrl } from './service/public';

/** 客户端代码，需要挂载DOM节点 */
export default class EntryClient extends Main {
  public constructor () {
    super();
    this.initState();
    this.registerRouterHook();
  }

  /** 初始化状态 */
  public initState () {

  }

  /** 注册路由钩子 */
  public registerRouterHook () {

  }
}