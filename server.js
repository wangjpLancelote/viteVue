/** 服务端 渲染运行文件 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const serial = require('serialize-javascript');
const appConfig = require('./services/app.config');
export const createServer = (root = process.cwd(), isProd = process.env.RUN_TYPE === 'build') => {
  const resolve = (p) => path.resolve(__dirname, p); // 路径
  
}