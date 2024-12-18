/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
import { IncomingMessage, ServerResponse } from 'http'
import httpProxy from 'http-proxy'

const proxy = httpProxy.createProxyServer()

proxy.on('proxyRes', function (proxyRes, req, res) {
    //set-cookie
    var cookies = proxyRes.headers['set-cookie']
    if (cookies) {
        var newCookies = cookies.map(function (cookie) {
            return cookie.replace("__session-django", '__session')
        })
        proxyRes.headers['set-cookie'] = newCookies
    }
})

proxy.on('proxyReq', function (proxyReq, req, res) {
    //cookie
    var cookie = proxyReq.getHeader('cookie') as string
    if (cookie) {
        var newCookie = cookie.replace(/__session/g, '__session-django')
        proxyReq.setHeader('cookie', newCookie)
    }
})

// Make sure that we don't parse JSON bodies on this route:
export const config = {
    api: {
        bodyParser: false
    }
}

export default (req: IncomingMessage, res: ServerResponse) => {
    const API_URL = 'https://k-violet-api-84227771803e.herokuapp.com/'

    // const API_URL = 'http://127.0.0.1:8000/'

    return new Promise<void>((resolve, reject) => {
        proxy.web(
            req,
            res,
            {
                target: API_URL,
                changeOrigin: true
            },
            err => {
                if (err) {
                    return reject(err)
                }
                resolve()
            }
        )
    })
}
