const {getLocalIP} = require('./getIP.js');
const {hashIP} = require('./hashIP.js')
module.exports.ipstamp = hashIP(getLocalIP())