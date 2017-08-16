
const moleProxyUrl = require.resolve('mole-proxy');

const weinreUrl = require.resolve('weinre').replace(/[\/|\\]lib[\/|\\]weinre.js/, '/weinre');

const defaultServer = 'cp01-rdqa-dev418-anqin-iwm.epc.baidu.com';

const remotePort = 8000;

exports.moleProxyUrl = moleProxyUrl;
exports.weinreUrl = weinreUrl;
exports.defaultServer = defaultServer;
exports.remotePort = remotePort;