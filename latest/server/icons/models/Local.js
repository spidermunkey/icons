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
      if (this.db !== null){
        return this.db
      }
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
    async save() {
      console.log('saving all changes to local db')
      this.scanner.overwrite(this.readDB());
      console.log('updating...')
      await this.loadDB()
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
        return this.db;
      } else {
        console.log('update process already started')
      }

    },
    count(){
      const db = this.readDB();
      let count = 0;
      for (const id in db.all)
        count++;
      return count;
    },

    get_collection(collection_name){ // { icons | name | meta }
      const db = this.readDB();
      return db.collections[collection_name]
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
      for (const name in db.collections){
        let collection = db.collections[name];
        if (!collection.ignored && collection.synced)
          collections.push(collection)
      }
      return collections
    },
    getCollectionById(cid){
      console.log('finding local collection')
      const db = this.readDB();
      let found = null;
      for (const collection_name in db.collections){
        let collection = db.collections[collection_name]
        if (collection.cid === cid) {
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
      for (const collection_name in db.collections){
        let collection = db.collections[collection_name]
        console.log(`updating local collection...: ${{name:collection_name,...props}} `);
        db.collections[collection_name] = {
          ...collection,
          ...props
        }
      }
      await this.save();
    },
    async update_collection(id,props){
      const db = this.readDB()
      let found = null;
      let name;
      for (const collection_name in db.collections){
        if (db.collections[collection_name]?.cid === id) {
          found = db.collections[collection_name];
          name = collection_name;
          break;
        }
      }
        if (found){
          console.log('updating collection',name,'with', props)
          db.collections[name] = {
            ...found,
            ...props
          }
          await this.save();
      }
    },
}
