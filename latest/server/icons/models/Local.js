const DateTime = require('../../utils/Datetime.js');

const { uuid } = require('../../utils/uuid.js');
const { Scanner } = require('../scanner.js');

const fs = require('fs-extra');
const path = require('path');
const fileSystemTargets = require('../local/fsconfig.js').scanner_config
const {
    targetDirectory,
    fileSystemMap,
    fileSytemDB,
    ignoreList,
} = fileSystemTargets

module.exports.Local = {
    ready: false,
    stats: {},
    last_stat: 0,
    scanner: Scanner,

    async init(updateNeeded = false) {
        if (updateNeeded) await this.update();
        else if (this.ready && this.status !== 'updating') return this;
        else await this.map_db();
        return this;
    },
    
    getDB(){
      return this.scanner.read()
    },
    overwrite(store){
      this.scanner.overwrite(store)
    },

    async get_status(){
        this.last_stat = DateTime.stamp().ms
        return this.scanner.stat()
    }

}