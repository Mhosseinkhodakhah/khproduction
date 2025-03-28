"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_proxy_middleware_1 = require("http-proxy-middleware");
// required plugins for proxy middleware
const plugins = [http_proxy_middleware_1.debugProxyErrorsPlugin, http_proxy_middleware_1.loggerPlugin, http_proxy_middleware_1.errorResponsePlugin, http_proxy_middleware_1.proxyEventsPlugin];
class router {
    proxy(address) {
        console.log(address); // proxing the routes to specific service with the address
        return (0, http_proxy_middleware_1.createProxyMiddleware)({
            target: address,
            changeOrigin: true,
            pathRewrite: {
                [`^/`]: "",
            },
            plugins: plugins
        });
    }
}
exports.default = router;
