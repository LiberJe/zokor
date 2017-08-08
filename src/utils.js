const os = require('os')
const dns = require('dns')
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

function getReliableIP () {
  return new Promise((resolve, reject) => {
    dns.lookup(os.hostname(), (err, address) => {
      if (err) {
        if (!address) {
          let ip = getIP()
          resolve(ip)
        }
      } else {
        resolve(address)
      }
    })
  })
}

function getNetworkIP () {
  return new Promise((resolve, reject) => {
    let socket = net.createConnection(80, 'www.baidu.com')
    socket.on('connect', () => {
      let ip = socket.localAddress
      socket.end()
      resolve(ip)
    })
    socket.on('error', (e) => {
      console.log(e)
    })
  })
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

function replaceTpl (str, {name, variable}) {
  let reg = new RegExp(`{{${name}}}`)
  let res = str.replace(reg, variable)
  return res
}

exports.getIP = getIP
exports.getReliableIP = getReliableIP
exports.getPort = getPort
exports.replaceTpl = replaceTpl
