// chat cpt
// "get machine ip using nodejs"

const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let interfaceName in interfaces) {
    for (let interfaceDetails of interfaces[interfaceName]) {
      // Check if the interface is an IPv4 address and is not internal (localhost)
      if (interfaceDetails.family === 'IPv4' && !interfaceDetails.internal) {
        return interfaceDetails.address;
      }
    }
  }
  return null; // Return null if no valid IP address is found
}

module.exports.getLocalIP = getLocalIP