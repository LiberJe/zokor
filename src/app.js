const http = require('http')
const { exec } = require('child_process')
const opn = require('opn')
const parseurl = require('url').parse
const { startWeinre, injector } = require('./inject')
const { moleProxyUrl, defaultServer, remotePort } = require('./config')

module.exports = function (localPort, proxyPort, weinrePort, weinreProxyPort, ip) {
  http.createServer((req, res) => {
    const opt = parseurl(`http://${ip}:${localPort}${req.url}`)
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

  run(localPort, proxyPort, remotePort, ip, weinrePort, weinreProxyPort)
}

function run (localPort, proxyPort, remotePort, ip, weinrePort, weinreProxyPort) {
  let moleProxy = exec(`node ${moleProxyUrl} ${proxyPort} ${remotePort}`, (err, stdout) => {
    if (err) {
      console.error(err)
    }
    if (/Exiting/.test(stdout)) {
      remotePort++
      run(localPort, proxyPort, remotePort, ip, weinrePort, weinreProxyPort)
    } else {
      console.log(stdout)
      process.exit(1)
    }
  })

  moleProxy.stdout.on('data', data => {
    if (data.indexOf(defaultServer) >= 0) {
      console.log(data)
      opn(`https://family.waimai.baidu.com/fe/static/#result/https%3A%2F%2Fs.waimai.baidu.com%2Fxin%2Fopen.html%23http%3A%2F%2F${defaultServer}%3A${remotePort}`)

      console.log(`zokor serve start`)
      console.log(`${ip}:${localPort} <=> ${ip}:${proxyPort}`)

      startWeinre(defaultServer, remotePort, weinrePort, weinreProxyPort, ip)
    }
  })
}
