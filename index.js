const { exec, execSync } = require('child_process')
const fs = require('fs')
const opn = require('opn')
const dep = require('./dependencies.json')
const { getIP, getPort } = require('./src/utils.js')

if (dep.moleProxy && dep.weinre) {
  start()
} else {
  if (!dep.moleProxy) {
    console.log('Your computer is not installed mole-proxy, ready to install mole-proxy')
    execSync('npm install -g mole-proxy', (err, stdout) => {
      if (err) {
        console.log('Please manually install mole-proxy globally')
      } else {
        dep.moleProxy = true
      }
    })
  }
  if (!dep.weinre) {
    console.log('Your computer is not installed mole-proxy, ready to install weinre')
    execSync('npm install -g weinre', (err, stdout) => {
      if (err) {
        console.log('Please manually install weinre globally')
      } else {
        dep.weinre = true
      }
    })
  }
  fs.writeFileSync('dependencies.json', JSON.stringify(dep))
  start()
}

function start () {
  let argv = process.argv.slice(2)

  if (!argv[0] || !argv[1]) {
    help()
  } else if (Math.floor(argv[0]) == argv[0] && Math.floor(argv[1]) == argv[1]) {
    let moleProxy = exec(`mole-proxy ${argv[0]} ${argv[1]}`, (err, stdout) => {
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
        let localIP = getIP()
        getPort(8000).then(proxyPort => {
          getPort(proxyPort + 1).then(weinrePort => {
            getPort(weinrePort + 1).then(weinreProxyPort => {
              opn(`https://family.waimai.baidu.com/fe/static/#result/http%3A%2F%2F${localIP}%3A${proxyPort}`)
              require('./src/app')(argv[0], argv[1], proxyPort, weinrePort, weinreProxyPort, localIP)
            })
          })
        })
      }
    })
  } else {
    help()
  }
}

function help () {
  console.log('Usage:')
  console.log('     zokor [local port] [remote port]')
  console.log('Example:')
  console.log('     zokor 8080 8010')
}
