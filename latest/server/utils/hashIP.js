const crypto = require('crypto');

function hashIP(ip) {
    if (ip) return crypto.createHash('sha256').update(ip).digest('hex');
    else return 0
}
module.exports.hashIP = hashIP
