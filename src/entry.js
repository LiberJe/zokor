require('events').EventEmitter.prototype._maxListeners = 100
const fs = require('fs')
const { getReliableIP, getPort } = require('./utils')
const { vorlonPort, zokorPort } = require('./config')

start()

function start (app, utils) {
  let argv = process.argv.slice(2)
  if (argv[0] == 'config') {
    config(argv)
  } else if (argv[0] && Math.floor(argv[0]) == argv[0]) {
    run(argv[0])
  } else if (argv.length == 2 && Math.floor(argv[1]) == argv[1]) {
    run(argv[1], argv[0])
  } else {
    help()
  }
}

function run (devPort, devServer = "localhost") {
  let userConfig = JSON.parse(fs.readFileSync('./setting.json'))
  getReliableIP()
    .then(localIP => {
      require('./server/app')(devServer, devPort, zokorPort, vorlonPort, localIP, userConfig)
    })
}

function config(argv) {
  if (argv[1] == 'env' && argv[2] ) {
    let userConfig = JSON.parse(fs.readFileSync('./setting.json'))

    if (argv[2] == 'bdwm') {
      userConfig.env = 'bdwm'
    } else if (argv[2] == 'ele') {
      userConfig.env = 'ele'
    } else {
      userConfig.env = null
    }

    fs.writeFileSync('./setting.json', JSON.stringify(userConfig))
    console.log("config success")
  } else if (argv[1] == 'mole' && argv[2]) {
    let userConfig = JSON.parse(fs.readFileSync('./setting.json'))

    if (argv[2] == 'open') {
      userConfig.mole = true
    } else if (argv[2] == 'close') {
      userConfig.mole = false
    } else {
      userConfig.mole = false
    }

    fs.writeFileSync('./setting.json', JSON.stringify(userConfig))
    console.log("config success")
  } else {
    help()
  }
}

function help () {
  console.log('Usage:')
  console.log('     zokor [local server] [local port]')
  console.log('Example:')
  console.log('     zokor 8080')
  console.log('     or')
  console.log('     zokor my.iwm.name 8080')
  console.log('Prompt:')
  console.log('     localport must be a integer')
  console.log('')
  console.log('For more detailed usage, please refer to the official document')
  console.log('     https://github.com/LiberJe/zokor')
  console.log('')
}

module.exports = start
