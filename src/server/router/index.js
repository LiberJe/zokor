const parseurl = require('url').parse
const { proxyForward } = require('../interceptor/injector')
const { remoteServer, remoteServerPort, vorlonPort } = require('../../config')

const routes = {
  workbench: () => {},
  qrcode: (req, res) => {
    const data = {
      origin: `http://${remoteServer}:${remoteServerPort}`,
      na: `bdwm://native?pageName=webview&url=http%3A%2F%2F${remoteServer}%3A${remoteServerPort}&header=2`
    }
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end(JSON.stringify(data))
  },
  get: () => {},
  put: () => {},
  delete: () => {},
  post: () => {}
}

function router(req, res, params) {
  const pathname = parseurl(req.url).pathname.substring(1)
  const query = parseurl(req.url, true).query
  const referer = req.headers.referer
  const { devPort, vorlonPort, ip } = params
  console.log(referer)
  if (pathname in routes) {
    routes[pathname](req, res)
  } else if (pathname == 'favicon.ico') {
    return null
  } else {
    proxyForward({req, res, devPort, vorlonPort, ip})
  }

}

exports.router = router