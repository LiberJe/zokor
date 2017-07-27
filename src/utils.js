const os = require('os')
const net = require('net')

function getIP () {
  let network = os.networkInterfaces()
  let ip = ''
  for (let devname in network) {
    let iface = network[devname]
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        ip = alias.address
      }
    }
  }
  return ip
}

function getPort (port = 8000) {
  port = parseInt(port)

  function checkPort (port, res) {
    let server = net.createServer().listen(port)

    server.on('listening', () => {
      server.close()
      res(port)
    })

    server.on('error', () => {
      port++
      checkPort(port, res)
    })
  }

  return new Promise((resolve, reject) => {
    checkPort(port, resolve)
  })
}

exports.getIP = getIP
exports.getPort = getPort
