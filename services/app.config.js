const { version } = require('../package.json');

/** 配置路由 */
module.exports = (app) => {
  return app.use('/app-config', (req, res) => {
    const originRoutes = [
      {
        code: 1000,
        url: '/',
        showTitle: true,
      }
    ];
    const routes = originRoutes.map(route => {
      const { url } = route;
      const arr = url.split('#');
      return route;
    });
    res.json({
      code: 0,
      data: {
        version,
        routes,
      },
      describe: {
        version: '当前版本号',
      }
    })
  })
}