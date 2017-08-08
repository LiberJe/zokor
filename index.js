const { getReliableIP, getPort } = require('./src/utils.js')

let version = process.version.match(/^v([0-9]+)\./)[1] - 0
if (version < 8) {
  console.log('Node version too old (' + process.version + '), please update to v8.0+')
  process.exit(1)
}

start()

function start () {
  let argv = process.argv.slice(2)

  if (!argv[0]) {
    help()
  } else if (Math.floor(argv[0]) == argv[0]) {
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
  require('./src/app')(arg, proxyPort, weinrePort, weinreProxyPort, localIP)
}

function help () {
  console.log('Usage:')
  console.log('     zokor [local port]')
  console.log('Example:')
  console.log('     zokor 8080')
  console.log('Prompt:')
  console.log('     localport must be a integer')
}
