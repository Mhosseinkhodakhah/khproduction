
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
  private node = 0;
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


  proxy2(address: string) {
    console.log(address)               // proxing the routes to specific service with the address
    if (this.node == 0) {
      this.node =1
      return createProxyMiddleware({
        target: "http://localhost:4000",
        changeOrigin: true,
        pathRewrite: {
          [`^/`]: "",
        },
        plugins: plugins
      })
    } else {
      this.node =0
      return createProxyMiddleware({
        target: "http://localhost:4005",
        changeOrigin: true,
        pathRewrite: {
          [`^/`]: "",
        },
        plugins: plugins
      })

    }
  }

}




