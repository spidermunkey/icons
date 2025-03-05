const DateTime = require('../../utils/Datetime.js');
const { uuid } = require('../../utils/uuid.js');
const { Scanner } = require('../scanner.js');


module.exports = {
    ready: false,
    stats: {},
    last_stat: 0,
    scanner: Scanner,
    updating: false,
    loading: false,
    db: null,

    readDB(){
      console.log('reading local database file...')
      return this.scanner.read()
    },
    async init(updateNeeded = false) {
        // poorly handles case where init is called while loading db.
        if (updateNeeded) await this.update();
        else if (this.ready && !this.updating) return this;
        else if (this.db !== null) return this.db;
        else this.loadDB();
        return this;
    },
    async loadDB(){
      if (!this.loading){
        this.loading = true;
        console.log('loading filesystem db into memory...');
        this.db = this.readDB();
        this.status = await this.get_status();
        this.ready = true;
        this.loading = false;
      } else {
        console.log('loading process already started!')
      }

    },
    async get_status(){
      console.log('scanning for local database statistics...')
        this.last_stat = DateTime.stamp().ms
        return this.scanner.stat()
    },
    async update(){
      if (!this.updating) {
        console.log('update triggered... this may take a moment');
        this.ready = false;
        this.updating = true;
        await this.scanner.update();
        await this.loadDB();
        return this.db;
      } else {
        console.log('update process already started')
      }

    },


}