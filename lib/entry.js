let run = (() => {
  var _ref = _asyncToGenerator(function* (arg) {
    let localIP = yield getReliableIP();
    let proxyPort = yield getPort(8000);
    let weinrePort = yield getPort(proxyPort + 1);
    let weinreProxyPort = yield getPort(weinrePort + 1);
    require('./app')(arg, proxyPort, weinrePort, weinreProxyPort, localIP);
  });

  return function run(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('events').EventEmitter.prototype._maxListeners = 100;
const { getReliableIP, getPort } = require('./utils.js');

start();

function start(app, utils) {
  let argv = process.argv.slice(2);

  if (argv[0] && Math.floor(argv[0]) == argv[0]) {
    run(argv[0]);
  } else {
    help();
  }
}

function help() {
  console.log('Usage:');
  console.log('     zokor [local port]');
  console.log('Example:');
  console.log('     zokor 8080');
  console.log('Prompt:');
  console.log('     localport must be a integer');
}

module.exports = start;