const { exec } = require('child_process')
const opn = require('opn')
const { getReliableIP, getPort, moleProxyUrl } = require('./src/utils.js')

let version = process.version.match(/^v([0-9]+)\./)[1] - 0
if (version < 7) {
  console.log('Node version too old (' + process.version + '), please update to v7.0+')
  process.exit(1)
}

start()

function start () {
  let argv = process.argv.slice(2)

  if (!argv[0] || !argv[1]) {
    help()
  } else if (Math.floor(argv[0]) == argv[0] && Math.floor(argv[1]) == argv[1]) {
    let moleProxy = exec(`node ${moleProxyUrl} ${argv[0]} ${argv[1]}`, (err, stdout) => {
      if (err) {
        console.error(err)
      }
    })

    moleProxy.stdout.on('data', data => {
      console.log(data)
      if (data.indexOf(argv[1]) < 0) {
        console.log('Something wrong')
        if (/Exiting/.test(data)) {
          console.log('Maybe you need change a remotePort')
        }
      } else {
        run(argv[0], argv[1])
      }
    })
  } else {
    help()
  }
}

async function run (arg0, arg1) {
  let localIP = await getReliableIP()
  let proxyPort = await getPort(8000)
  let weinrePort = await getPort(proxyPort + 1)
  let weinreProxyPort = await getPort(weinrePort + 1)
  opn(`https://family.waimai.baidu.com/fe/static/#result/http%3A%2F%2F${localIP}%3A${proxyPort}`)
  require('./src/app')(arg0, arg1, proxyPort, weinrePort, weinreProxyPort, localIP)
}

function help () {
  console.log('Usage:')
  console.log('     zokor [local port] [remote port]')
  console.log('Example:')
  console.log('     zokor 8080 8010')
}
