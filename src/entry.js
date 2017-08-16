require('events').EventEmitter.prototype._maxListeners = 100
const { getReliableIP, getPort } = require('./utils.js')

start()

function start (app, utils) {
  let argv = process.argv.slice(2)

  if (argv[0] && Math.floor(argv[0]) == argv[0]) {
    run(argv[0])
  } else {
    help()
  }
}

async function run (arg) {
  let localIP = await getReliableIP()
  let proxyPort = await getPort(8000)
  let weinrePort = await getPort(proxyPort + 1)
  let weinreProxyPort = await getPort(weinrePort + 1)
  require('./app')(arg, proxyPort, weinrePort, weinreProxyPort, localIP)
}

function help () {
  console.log('Usage:')
  console.log('     zokor [local port]')
  console.log('Example:')
  console.log('     zokor 8080')
  console.log('Prompt:')
  console.log('     localport must be a integer')
}

module.exports = start
