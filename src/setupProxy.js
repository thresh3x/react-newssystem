const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/ajax',
        createProxyMiddleware({
            target: 'http://m.maoyan.com',
            changeOrigin: true
        })
    )
}