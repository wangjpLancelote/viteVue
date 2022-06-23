/** 服务端 渲染运行文件 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const serial = require('serialize-javascript');
const resolve = (p) => path.resolve(__dirname, p); // 路径

const usePool = true;
const isDev = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'dev:seo';
const isSEO = process.env.NODE_ENV === 'production:seo' || process.env.NODE_ENV === 'dev:seo';

/** 将dist文件复制到run文件夹下 */
function cp2run () {
  function copy (from, to) {
    const files = fs.readdirSync(from);
    for (let file in files) {
      if (files.hasOwnProperty(file)) {
        let _src = path.join(from, files[file]);
        let _run = path.join(to, files[file]);
        let _srcStat = fs.statSync(_src);
        if (_srcStat.isDirectory()) {  // 是目录
          if (!fs.existsSync(_run)) {
            fs.mkdirSync(_run);
          }
          copy(_src, _run);
        } else if (_srcStat.isFile()) {
          fs.copyFileSync(_src, _run);
        }
      }
    }
  }
  if (!fs.existsSync(resolve('run'))) {
    fs.mkdirSync(resolve('run'));
  }
  copy(resolve('dist'), resolve('run'));
}

/** 反爬虫 */
function isSpider (req) {
  const ua = req.headers['user-agent'] ? req.headers['user-agent'].toLocaleLowerCase() : "";
  return ~ua.indexOf('spider') || ~ua.indexOf('bot');
}

async function createServer () {
  const app = express();
  /** serve-static 是express 自带的模块 */
  app.use(require('serve-static')(resolve('run/client')))

  let vite, seoRender, spaTemplate, seoTemplate, manifest,
  if (isDev) {
    /** 启动server 利用的就是vite的createServer 采用SSR模式 */
    vite = await require('vite').createServer({
      root: process.cwd(),
      logLevel: 'info',
      server: {
        middlewareMode: 'ssr',
        watch: {
          usePolling: true,
          interval: 100,
        }
      }
    });
    app.use(vite.middlewares);
    manifest = {};
  } else { // 生产环境
    /** 复制文件
     *  1. 打包后删除旧文件可能会出现未刷新浏览器的情况下访问出错
     *  2. 防止爬虫快照访问资源失败
     */
    await cp2run();
    spaTemplate = fs.readFileSync(resolve('run/client/index.html'), 'utf-8'); // 读取html文件
    seoTemplate = spaTemplate.replace(/<script\b[^>]*>[\s\S*]<\/script>/, '').replace(/<link rel="modulereload" \b[^>]*>/, ''); // 为什么要去掉script和link，因为seo不需要运行js
    manifest = require('./run/client/ssr-manifest.json');
    seoRender = require(resolve('run/server/entry-server.js'));

  }

  const maxLen = 20;
  const appList = [];
  /** 匹配所有router */
  app.use('*', (req, res) => {
    try {
      const url = req.originalUrl;
      if (url === '/list.json') {
        res.status(200).set({ 'Content-Type': 'text/html' }).end(JSON.stringify({ list: ['a', 'b', 'c'] }));
        return;
      }
      let template, entryServer;
      if (isDev) {
        template = fs.readFileSync(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        if (isSEO) {
          template = template.replace(`<script type="module" src="/src/entry-client.ts"></script>`, ''); 
        } else {
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
        }
      } else if (isSEO) { // 生产环境seo
        template = seoTemplate;
        entryServer = seoRender;
      } else { // 生产环境server
        if (await isSpider(req)) {
          template = seoTemplate;
        } else {
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
          return;
        }
        entryServer = seoRender;
      }
      let vm; // 实例
      if (usePool) { // 池化
        vm = appList.shift();
        if (!vm) {
          vm = entryServer.createApp();
        }
      } else {
        vm = entryServer.createApp();
      }

      const [appHtml, preloadLinks, meta] = await entryServer.render(vm, url, manifest);
      if (appList.length < maxLen) {
        appList.push(vm);
      }
      /** 替换html上的占位符，这也是SSR框架的通用做法，通过占位符替换对应内容,这里可以加一个判断操作 */
      if (!~template.indexOf(`<!--meta-->`)) {
        throw new Error(`HTML模板页面缺少【<!--meta-->】占位符`)
      }
      if (!~template.indexOf(`<!--preload-links-->`)) {
        throw new Error(`HTML模板页面缺少【<!--preload-links-->】占位符`)
      }
      if (!~template.indexOf(`<!--app-html-->`)) {
        throw new Error(`HTML模板页面缺少【<!--app-html-->】占位符`)
      }
      const html = template.replace(`<!--meta-->`, meta).replace(`<!--preload-links-->`, preloadLinks).replace(`<!--app-html-->`, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      res.status(500).end(e.stack);
    }
  })

  return app;
}


createServer().then(app => {
  app.listen(4000);
  console.log(`-----------------------服务已启动:端口${4000}-----------------------------`);
  console.log(`-----------------------服务已启动:运行地址:${'http://127.0.0.1:4000'}-----------------------------`);
})