const ip = require('./getIP.js').getLocalIP();
const hashed = require('./hashIP.js').hashIP(ip)

module.exports.ipstamp = hashed