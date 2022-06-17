import Store, { NotifyOptions } from '@wefly/vue-store-next';
import { ReqConfig } from '@/service/public';

export class SSRBaseStore extends Store {
  public ssrPath: string = '';
  public subList: NotifyOptions[]= [];

  public constructor (reqConfig?: ReqConfig) {
    super();
    this.subscribe((event: any) => {
      this.subList.push(event);
    })
    return this.init() as SSRBaseStore;
  }
  public setSSRPath (path: string) {
    this.ssrPath = path;
  }
}

export default SSRBaseStore;