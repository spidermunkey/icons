const ip = require('./getIP.js')();
const hashed = require('./hashIP.js')(ip)

module.exports.ipstamp = hashed