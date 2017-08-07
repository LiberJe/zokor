const { exec } = require('child_process')
const opn = require('opn')
const http = require('http')
const parseurl = require('url').parse
const QRCode = require('qrcode')
const { weinreUrl } = require('./utils.js')

exports.startWeinre = function (proxyPort, weinrePort, weinreProxyPort, ip) {
  let qrcodeURL = `bdwm://native?pageName=webview&url=http%3A%2F%2F${ip}%3A${proxyPort}&header=2`

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
  let script = ''
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(url, (err, dataUrl) => {
      if (err) {
        console.log(err)
      }
      script = `<script>
        window.onload = () => {
          let title = document.createElement('h1');
          title.innerText = 'NA原始链接';
          let qrcode = document.createElement('img');
          qrcode.src='${dataUrl}';
          let targetNode = document.querySelector('.weinreServerProperties');
          targetNode.parentNode.appendChild(title)
          targetNode.parentNode.appendChild(qrcode)
        }
        </script>`
      resolve(script)
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
