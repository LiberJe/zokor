require('babel-register')({
  presets: [ 'latest' ]
})
require('babel-polyfill')

require('./src/entry')