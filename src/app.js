const http = require('http')
const parseurl = require('url').parse
const { startWeinre, injector } = require('./inject.js')

module.exports = function (localPort, remotePort, proxyPort, weinrePort, weinreProxyPort, ip) {
  startWeinre(proxyPort, weinrePort, weinreProxyPort, ip)

  http.createServer((req, res) => {
    const opt = parseurl(`http://cp01-rdqa-dev418-anqin-iwm.epc.baidu.com:${remotePort}${req.url}`)
    opt.headers = req.headers
    opt.method = req.method

    const proxyReq = http.request(opt, proxyRes => {
      proxyRes.on('end', () => {
        res.end()
      })

      proxyRes.on('data', chunk => {
        if (/html/i.test(proxyRes.headers['content-type'])) {
          let insertURL = `<script src="http://${ip}:${weinrePort}/target/target-script-min.js#anonymous"></script>`
          let data = injector(chunk, insertURL)
          res.setHeader('content-length', data.length)
          res.write(data)
        } else {
          res.write(chunk)
        }
      })

      if (!/html/i.test(proxyRes.headers['content-type'])) {
        res.writeHead(proxyRes.statusCode, proxyRes.headers)
      }

      // proxyRes.pipe(res)
    })
    proxyReq.on('error', err => {
      console.error(err)
      res.end()
    })
    req.pipe(proxyReq)
  }).listen(proxyPort)

  console.log(`zokor serve at ${ip}:${proxyPort}`)
}
