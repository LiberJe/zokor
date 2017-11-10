const http = require('http')
const zlib = require('zlib')
const gzip = zlib.createGzip()
const parseurl = require('url').parse

function injector(target, injection, pos) {
  let data = target.toString()
  let i = data.indexOf(pos)
  if (i > 0) {
    let dataStrLeft = data.substring(0, i)
    let dataStrRight = data.substring(i)
    let newData = `${dataStrLeft}${injection}${dataStrRight}`

    return Buffer.from(newData)
  } else {
    return data
  }
}

function proxyForward({ req, res, ip, devServer, devPort, vorlonPort }) {
  const opt = parseurl(`http://${devServer}:${devPort}${req.url}`)
  opt.headers = req.headers
  opt.method = req.method

  const proxyReq = http.request(opt, proxyRes => {
    proxyRes.on('end', () => {
      res.end()
    })

    proxyRes.on('data', chunk => {
      if (/html/i.test(proxyRes.headers['content-type'])) {
        let insertURL = `<script src="http://${ip}:${vorlonPort}/vorlon.js"></script>`
        let data = injector(chunk, insertURL, '</body>')
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
  req.pipe(gzip).pipe(proxyReq)
}

exports.injector = injector
exports.proxyForward = proxyForward