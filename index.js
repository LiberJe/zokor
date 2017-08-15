require('events').EventEmitter.prototype._maxListeners = 100
require('babel-register')

var app = require('./src/app')
var utils = require('./src/utils')
var entry = require('./src/entry')

entry(app, utils)
