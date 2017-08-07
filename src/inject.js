const fs = require('fs')
const { exec } = require('child_process')
const opn = require('opn')
const http = require('http')
const parseurl = require('url').parse
const QRCode = require('qrcode')
const { replaceTpl } = require('./utils')
const { weinreUrl } = require('./config')

exports.startWeinre = function (serverAddress, serverPort, weinrePort, weinreProxyPort, ip) {
  let qrcodeURL = `bdwm://native?pageName=webview&url=https%3A%2F%2Fs.waimai.baidu.com%2Fxin%2Fopen.html%23http%3A%2F%2F${serverAddress}%3A${serverPort}&header=2`

  exec(`node ${weinreUrl} --httpPort ${weinrePort} --boundHost -all-`, (err, stdout) => {
    if (err) {
      console.log(err)
      console.log('Error on opening weinre')
    }
  })

  qrcodeInjection(qrcodeURL).then(script => {
    http.createServer((req, res) => {
      const opt = parseurl(`http://${ip}:${weinrePort}${req.url}`)
      opt.headers = req.headers
      opt.method = req.method

      const weinreReq = http.request(opt, weinreRes => {
        weinreRes.on('end', () => {
          res.end()
        })

        weinreRes.on('data', chunk => {
          if (/html/i.test(weinreRes.headers['content-type'])) {
            let data = injector(chunk, script)
            res.setHeader('content-length', data.length)
            res.write(data)
          } else {
            res.write(chunk)
          }
        })

        if (!/html/i.test(weinreRes.headers['content-type'])) {
          res.writeHead(weinreRes.statusCode, weinreRes.headers)
        }
        // weinreRes.pipe(res)
      })

      weinreReq.on('error', err => {
        console.log(err)
        res.end()
      })
      req.pipe(weinreReq)
    }).listen(weinreProxyPort)

    // console.log(`weinreProxy serve start`)
    // console.log(`${ip}:${weinrePort} <=> ${ip}:${weinreProxyPort}`)

    opn(`http://${ip}:${weinreProxyPort}/client/#anonymous`)
  })
}

function qrcodeInjection (url) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(url, (err, dataUrl) => {
      if (err) {
        console.log(err)
      }
      getScript('dataUrl', dataUrl).then(script => {
        let injectScript = `<script>${script}</script>`
        resolve(injectScript)
      })
    })
  })
}

function getScript (tplName, targetData) {
  return new Promise((resolve, reject) => {
    fs.readFile('./src/weinreScript.js', (err, data) => {
      if (err) {
        console.log(err)
      }
      let str = data.toString()
      let res = replaceTpl(str, {name: tplName, variable: targetData})
      resolve(res)
    })
  })
}

function injector (data, script) {
  let dataStr = data.toString()
  let i = dataStr.indexOf('</body>')
  if (i > 0) {
    let dataStrLeft = dataStr.substring(0, i)
    let dataStrRight = dataStr.substring(i)
    let newDataStr = `${dataStrLeft}${script}${dataStrRight}`

    return Buffer.from(newDataStr)
  } else {
    return data
  }
}

exports.injector = injector
