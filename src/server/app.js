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

function vorlonStart(devServer, devPort, zokorPort, remoteServer, remoteServerPort, vorlonPort, vorlonUrl, ip, userConfig) {
  return new Promise((resolve, reject) => {
    let vorlonFunc = (devServer, devPort, remoteServerPort, zokorPort, vorlonPort, vorlonUrl, userConfig, resolve) => {
      console.log(`zokor serve start`)
      console.log(`${devServer}:${devPort} <=> localhost:${zokorPort}`)

      let vorlon = exec(`node ${vorlonUrl}`, (err, stdout) => {
        if (err) {
          console.log(err)
          console.log('Error on opening vorlon')
        }
      })
      vorlon.stdout.on('data', data => {
        if (data.indexOf(vorlonPort) >= 0) {
          opn(`http://localhost:${vorlonPort}`)
          userConfig.mole
            ? resolve(remoteServerPort)
            : resolve(zokorPort)
        }
      })
    }
    
    let moleProxyFunc = (devServer, devPort, moleProxyUrl, remoteServer, zokorPort, remoteServerPort, resolve) => {
      let moleProxy = exec(`node ${moleProxyUrl} ${remoteServer}:8008 ${zokorPort} ${remoteServerPort}`, (err, stdout) => {
        if (err) {
          console.error(err)
        }
        if (/Exiting/.test(stdout)) {
          remoteServerPort++
          moleProxyFunc(devServer, devPort, moleProxyUrl, remoteServer, zokorPort, remoteServerPort, resolve)
        } else {
          console.log(stdout)
          process.exit(1)
        }
      })

      moleProxy.stdout.on('data', data => {
        if (data.indexOf(remoteServer) >= 0) {
          console.log(data)
          vorlonFunc(devServer, devPort, remoteServerPort, zokorPort, vorlonPort, vorlonUrl, userConfig, resolve)
        }
      })
    }

    userConfig.mole
      ? moleProxyFunc(devServer, devPort, moleProxyUrl, remoteServer, zokorPort, remoteServerPort, resolve)
      : vorlonFunc(devServer, devPort, remoteServerPort, zokorPort, vorlonPort, vorlonUrl, userConfig, resolve)
  })
}

function staticPageHandler(pathname, res) {
  fs.readFile(pathname == '/' ? path.resolve(__dirname, `../client/build/index.html`) : path.resolve(__dirname, `../client/build${pathname}`), function (err, data) {
    if (err) {
      return console.error(err);
    }
    res.writeHead(200, {'Content-type': mime.lookup(pathname), "Access-Control-Allow-Origin": "*"})
    res.end(data,"utf-8");
  })
}

module.exports = function(devServer, devPort, zokorPort, vorlonPort, ip, userConfig) {
  vorlonStart(devServer, devPort, zokorPort, remoteServer, remoteServerPort, vorlonPort, vorlonUrl, ip, userConfig)
    .then(curRemoteServerPort => {
      http.createServer((req, res) => {
        router(req, res, {devServer, devPort, vorlonPort, curRemoteServerPort, ip, userConfig})
      }).listen(zokorPort)
    
      http.createServer((req, res) => {
        const pathname = parseurl(req.url).pathname
        staticPageHandler(pathname, res)
      }).listen(3000)
    })
}