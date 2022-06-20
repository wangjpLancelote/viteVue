import { App, getCurrentInstance, inject, watchEffect } from 'vue';

/** html替换符号, 为什么要转义这些字符，因为ssr模式下html要转为字符串，因此这些特殊字符也要转义 */
function htmlspecialchars (str: string): string {
  str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  return str;
}

class Meta {
  private defaultTitle = 'vue_ssr';
  private head: commonObject<any> = {
    title: this.defaultTitle,
    description: '',
    keywords: '',
    image: '',
    metas: [],
  };
  constructor () {

  }

  setHead (heads: commonObject<any>) {
    if (heads.title) {
      this.head.title = heads.title;

    }
    const metas: any[] = [];
    for (const i in heads.metas) {
      const item = heads[i];
      const type = item.type || item.property;
      switch(type) {
        case 'description':
          this.head.description = item.content;
          break;
        case 'keywords':
          this.head.keywords = item.content;
          break;
        case 'og:image':
          this.head.image = item.content;
          break;
        default:
          metas.push(item);
          break;
      }
    }
    this.head.metas = metas;
    if (!import.meta.env.SSR) {
      const title = document.getElementsByTagName('title');
      if (title && title.length) {
        title[0].innerText = heads.title || this.defaultTitle;
      } else {
        const title = document.createElement('title');
        title.innerText = heads.title || this.defaultTitle;
        document.getElementsByTagName('head')[0].appendChild(title);
      }
    }
  }

  getHead () {
    let description = this.head.description;
    let keywords = this.head.keywords;
    let ogDescription = this.head.description;
    let ogImage = this.head.image;
    const metas: any[] = [];
    for (const i in this.head.metas) {
      const item = this.head.metas[i];
      const type = item.name || item.property; // meta里的数据
      switch (type) {
        case 'description':
          description = htmlspecialchars(item.content);
          break;
        case 'keywords':
          if (typeof item.content === 'string') {
            keywords = htmlspecialchars(item.content);
          } else if (item.content instanceof Array) {
            let k: any[] = [];
            for (const i in item.content) {
              k.push(htmlspecialchars(item.content[i]));
            }
            keywords = k.join('、');
          }
          break;
        case 'og:description':
          ogDescription = htmlspecialchars(item.content);
          break;
        case 'og:image':
          ogImage = htmlspecialchars(item.content);
          break;
        default:
          item.content = htmlspecialchars(item.content);
          metas.push(item);
          break;
      }
    }

    return {
      title: this.head.title,
      metas: [
        {
          name: 'description',
          content: description,
        },
        {
          name: 'keywords',
          content: keywords,
        },
        {
          name: 'og:title',
          content: this.head.title,
        },
        {
          name: 'og:description',
          content: ogDescription,
        },
        {
          name: 'og:image',
          content: ogImage,
        },
        ...metas,
      ]
    }
  }

  /** 渲染html string */
  renderToString () {
    const heads = this.getHead();
    let string  = `<title>${ heads.title }</title>`;
    for (const i in heads.metas) {
      const meta = heads.metas[i];
      let key = '';
      let val = '';
      if (meta.name) {
        key = 'name';
        val = meta['name'];
      } else {
        key = 'property';
        val = meta['property'];
      }
      if (!key) return;
      string = `<meta ${key}="${val}" content="${meta.content}"`;
    }
    const date = new Date();
    const time = date.getFullYear().toString()
      + '-' + (date.getMonth() - 1).toString()
      + '-' + date.getDate().toString()
      + '-' + date.getHours().toString()
      + '-' + date.getMinutes().toString()
      + '-' + date.getSeconds().toString();
    string += `<meta name="updateTime" content=${time}`
    return string;
  }
}

export const useMeta = () : Meta | undefined => {
  return inject('meta');
}

/** mixin */
export const metaMinxins = {
  data () {
    const instance = getCurrentInstance();
    return {
      // @ts-ignore
      _metaFn: instance?.type.head,
    }
  },
  created() {
    // @ts-ignore
    if (this._metaFn) {
      // @ts-ignore
      this.$meta.setHead(this._metaFn());
    }
  },
  activated() {
    // @ts-ignore
    if (this._metaFn) {
      // @ts-ignore
      this.$meta.setHead(this._metaFn());
    }
  },
  mounted() {
    // @ts-ignore
    if (this._metaFn) {
      watchEffect(() => {
          // @ts-ignore
          this.$meta.setHead(this._metaFn());
      })
    }
  },
}

/** 通过app.use 调用install方法将$meta注册到app上 */
export default function createMeta () {
  return {
    install (app: App, option: commonObject<any>) {
      const $meta = new Meta();
      if (option.mixin) {
        option.mixin(metaMinxins);
      }
      app.provide('meta', $meta);
      app.config.globalProperties.$meta = $meta;
    }
  }
}
