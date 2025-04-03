const { EventEmitter } = require('ws');
const { Scanner } = require('../scanner.js');

module.exports = {
    ready: false,
    stats: {},
    last_stat: 0,
    scanner: Scanner,
    updating: false,
    loading: false,
    db: null,
    events: new EventEmitter(),

    async init(updateNeeded = false) {
        if (updateNeeded) await this.update();
        if (this.ready && !this.updating && this.db !== null) {
          return this.db;
        }
        else {
          return await this.loadDB()
        }
    },
    async save() {
      console.log('saving all changes to local db')
      this.scanner.overwrite(this.readDB());
      console.log('updating...')
      await this.loadDB()
    },
    async reset() {
      this.update_each({ignored: false, synced: false})
      return this.db;
    },
    readDB(){
      if (this.db !== null){
        return this.db
      }
      console.log('reading local database file...')
      return this.scanner.read()
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
      return this.db
    },

    async get_status(){
      console.log('scanning for local database statistics...')
        this.last_stat = Date.now()
        return this.scanner.stat()
    },

    async update(){
      if (!this.updating) {
        console.log('update triggered... this may take a moment');
        this.ready = false;
        this.updating = true;
        await this.scanner.update();
        await this.loadDB();
        this.ready = true;
        this.updating = false;
        console.log(this.db)
        return this.db;
      } else {
        console.log('update process already started')
      }

    },

    async addTarget(pathname){
      try {
        const time = Date.now();
        await this.scanner.addTarget(pathname)
        this.db = await this.scanner.read()
        const added = {};
        // return new collections
        for (const id in this.db.collections){
          if (this.db.collections[id]?.created_at > time)
            added[id] = this.db.collections[id]
        }
        return added;
      }
      catch(error){
        console.log(error)
        return false;
      }
    },

    async updateRepository(pathname){
      try {
        const time = Date.now();
        await this.scanner.updateTarget([pathname])
        this.db = await this.scanner.read()
        const added = {};
        // return new collections
        for (const id in this.db.collections){
          if (this.db.collections[id]?.created_at > time)
            added[id] = this.db.collections[id]
        }
        return added;
      }
      catch(error){
        console.log(error)
        return false;
      }
    },

    async deleteRepository(pathname){
      await this.scanner.removeTarget(pathname)
      this.db = await this.scanner.read()
      return this.db.collections;
    },
    
    count(){
      const db = this.readDB();
      let count = 0;
      for (const id in db.all)
        count++;
      return count;
    },

    get_collection(collection_id){ // { icons | name | meta }
      const db = this.readDB();
      return db.collections[collection_id]
    },
    get_collections(){
      const db = this.readDB();
      let collections = [];
      for (const name in db.collections){
        let collection = db.collections[name];
        if (!collection.ignored)
          collections.push(collection)
      }
      return collections
    },
    get_synced_collections(){
      const db = this.readDB();
      let collections = [];
      for (const cid in db.collections){
        let collection = db.collections[cid];
        if (!collection.ignored && collection.synced)
          collections.push(collection)
      }
      return collections
    },
    getCollectionById(collection_id){
      console.log('finding local collection')
      const db = this.readDB();
      let found = null;
      for (const cid in db.collections){
        let collection = db.collections[cid]
        if (collection.cid === collection_id) {
          return collection;
        }
      }
      return found
    },

    async sync(id){
      const collection = this.getCollectionById(id)
      if (collection){
        console.log('setting collection synced: ',id)
        collection.synced = Date.now();
        await this.save();
        return true;
      } else {
        console.log('collection not found... ')
        return false;
      }
    },
    async unsync(id){
      const collection = this.getCollectionById(id)
      if (collection){
        console.log('setting collection synced: ',id)
        collection.synced = false;
        await this.save();

        return true;
      } else {
        console.log('collection not found... ')
        return false;
      }
    },
    async update_each(props){
      const db = this.readDB();
      for (const cid in db.collections){
        let collection = db.collections[cid]
        console.log(`updating local collection...: ${{name:collection.name,...props}} `);
        db.collections[cid] = {
          ...collection,
          ...props
        }
      }
      await this.save();
    },
    async update_collection(id,props){
      const db = this.readDB()
      for (const cid in db.collections){
        if (db.collections[cid]?.cid === id) {
          let collection = db.collections[cid];
          db.collections[cid] = {
            ...collection,
            ...props
          }
          console.log('updating collection',collection.name,'with', props)
          break;
        }
      }

      await this.save();
    },
}
