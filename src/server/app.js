const http = require('http')
const fs = require("fs");
const mime = require("mime");
const path = require('path')
const { exec } = require('child_process')
const opn = require('opn')
const zlib = require('zlib')
const gzip = zlib.createGzip()
const parseurl = require('url').parse
const { moleProxyUrl, vorlonUrl, serveUrl, vorlonPort, remoteServer, remoteServerPort } = require('../config')
const { router } = require('./router')

function vorlonStart(remoteServer, devPort, zokorPort, remoteServerPort, vorlonPort, ip) {
  let moleProxy = exec(`node ${moleProxyUrl} ${remoteServer}:8008 ${zokorPort} ${remoteServerPort}`, (err, stdout) => {
    if (err) {
      console.error(err)
    }
    if (/Exiting/.test(stdout)) {
      remoteServerPort++
      vorlonStart(remoteServer, devPort, zokorPort, remoteServerPort, vorlonPort, ip)
      // 未杀死进程
    } else {
      console.log(stdout)
      process.exit(1)
    }
  })

  moleProxy.stdout.on('data', data => {
    if (data.indexOf(remoteServer) >= 0) {
      console.log(data)
      console.log(`zokor serve start`)
      console.log(`localhost:${devPort} <=> localhost:${zokorPort}`)

      let vorlon = exec(`node ${vorlonUrl}`, (err, stdout) => {
        if (err) {
          console.log(err)
          console.log('Error on opening vorlon')
        }
      })
      vorlon.stdout.on('data', data => {
        if (data.indexOf(vorlonPort) >= 0) {
          opn(`http://localhost:${vorlonPort}`)
        }
      })
    }
  })
}

function staticPageHandler(path, res) {
  fs.readFile(path == '/' ? `./src/client/build/index.html` : `./src/client/build${path}`, function (err, data) {
    if (err) {
      return console.error(err);
    }
    res.writeHead(200, {'Content-type': mime.lookup(path), "Access-Control-Allow-Origin": "*"})
    res.end(data,"utf-8");
  })
}

module.exports = function(devPort, zokorPort, vorlonPort, ip) {
  http.createServer((req, res) => {
    router(req, res, {devPort, vorlonPort, ip})
  }).listen(zokorPort)

  http.createServer((req, res) => {
    const pathname = parseurl(req.url).pathname
    staticPageHandler(pathname, res)
  }).listen(3000)

  vorlonStart(remoteServer, devPort, zokorPort, remoteServerPort, vorlonPort, ip)
}