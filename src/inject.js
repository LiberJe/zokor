const fs = require('fs')
const { exec } = require('child_process')
const opn = require('opn')
const http = require('http')
const parseurl = require('url').parse
const QRCode = require('qrcode')
const { replaceTpl } = require('./utils')
const { weinreUrl } = require('./config')

let scriptW = fs.readFileSync(require.resolve('./weinreScript.js')).toString()

exports.startWeinre = function (serverAddress, serverPort, weinrePort, weinreProxyPort, ip) {
  let qrcodeURL = `http://${serverAddress}:${serverPort}`
  let qrcodeNaURL = `bdwm://native?pageName=webview&url=http%3A%2F%2F${serverAddress}%3A${serverPort}&header=2`

  exec(`node ${weinreUrl} --httpPort ${weinrePort} --boundHost -all-`, (err, stdout) => {
    if (err) {
      console.log(err)
      console.log('Error on opening weinre')
    }
  })

  qrcodeInjection(qrcodeURL, 'dataUrl').then(() => {
    return qrcodeInjection(qrcodeNaURL, 'naUrl')
  }).then(script => {
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
            let jq = '<script src="http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js"></script><script src="http://cdn.staticfile.org/jquery.qrcode/1.0/jquery.qrcode.min.js"></script>'
            let data = injector(chunk, jq)
            data = injector(data, script)
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

    opn(`http://localhost:${weinreProxyPort}/client/#anonymous`)
  })
}

function qrcodeInjection (url, name) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(url, (err, data) => {
      if (err) {
        console.log(err)
      }
      getScript(name, url).then(script => {
        let injectScript = `<script>${script}</script>`
        resolve(injectScript)
      })
    })
  })
}

function getScript (tplName, targetData) {
  return new Promise((resolve, reject) => {
    scriptW = replaceTpl(scriptW, {name: tplName, variable: targetData})
    resolve(scriptW)
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
