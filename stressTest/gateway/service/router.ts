
import {
    createProxyMiddleware,
    debugProxyErrorsPlugin, // subscribe to proxy errors to prevent server from crashing
    loggerPlugin, // log proxy events to a logger (ie. console)
    errorResponsePlugin, // return 5xx response on proxy error
    proxyEventsPlugin, // implements the "on:" option
    fixRequestBody
  } from 'http-proxy-middleware';



// required plugins for proxy middleware
const plugins = [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin]


export default class router{
    proxy(address : string){            
        console.log(address)               // proxing the routes to specific service with the address
        return createProxyMiddleware({
            target:  address,
            changeOrigin: true,
            pathRewrite: {
              [`^/`]: "",
            },
            plugins : plugins
          })
    }
}




