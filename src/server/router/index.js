const parseurl = require('url').parse
const { proxyForward } = require('../interceptor/injector')
const { remoteServer, remoteServerPort, vorlonPort } = require('../../config')
const db = require('../db') 

let activeProject = {}
let mockPathname = []

const routes = {
  qrcode: (req, res) => {
    const data = {
      origin: `http://${remoteServer}:${remoteServerPort}`,
      na: `bdwm://native?pageName=webview&url=http%3A%2F%2F${remoteServer}%3A${remoteServerPort}&header=2`
    }
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end(JSON.stringify(data))
  },
  addproject: handleRouter(db.addproject),
  getprojectlist: handleRouter(db.getprojectlist),
  getactiveprojectkey: handleRouter(db.getactiveprojectkey),
  activeprojectkey: handleRouter(db.activeprojectkey, getMockPathname),
  deleteproject: handleRouter(db.deleteproject),
  getinterface: handleRouter(db.getinterface),
  deleteinterface: handleRouter(db.deleteinterface),
  modifyinterface: handleRouter(db.modifyinterface),
  createinterface: handleRouter(db.createinterface)
}

getMockPathname()

function handleRouter (handleDB, callback = undefined) {
  return (req, res) => {
    let data = ''
    let resdata = {
      error: null,
      msg: '',
      data: {}
    }
    req.on('data', chunk => {
      data+=chunk
    })
    req.on('end', () => {
      let dbres = handleDB(data)
      resdata.data = dbres
      res.writeHead(200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" })
      res.end(JSON.stringify(resdata))
      if (callback) callback()
    })
  }
}

function getMockPathname() {
  activeProject = db.getactiveproject() || {}
  mockPathname = Object.keys(activeProject).length > 0 ? activeProject.mock.map(item => item.url) : []
}

function mockFilter (activeProject, mockPathname, pathname, req, res) {
  let index = mockPathname.indexOf(pathname)
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end(JSON.stringify(activeProject.mock[index].data))
}

function router(req, res, params) {
  const pathname = parseurl(req.url).pathname.substring(1)
  const query = parseurl(req.url, true).query
  const referer = req.headers.referer
  const { devPort, vorlonPort, ip } = params

  if (pathname in routes && (req.headers.origin == 'http://localhost:3000' || req.headers.origin == 'http://localhost:1337')) {
    routes[pathname](req, res)
  } else if (mockPathname.includes(pathname)) {
    mockFilter(activeProject, mockPathname, pathname, req, res)
  } else if (pathname == 'favicon.ico') {
    return null
  } else {
    proxyForward({req, res, devPort, vorlonPort, ip})
  }
}

exports.router = router
exports.getMockPathname = getMockPathname