const EventEmitter = require("events");

const Local = require('./Local.js')
const {Mongo} = require('./model.js');
const Database = require('./Database.js');

module.exports.App = class App extends EventEmitter {

    constructor(){
        super();

        this.collectionNames = {}
        this.collectionInfo = {}

        this.state = {
            init:false,
            message: 'app not initialized',
        }

        this.isSyncing = false
        this.local = Local.init()
        this.db = Mongo
        this.hydrate()
    }

    async getConnection(){
        
        const db_connection = await Database.ping()
        const ready  = Local.ready && mongo_stat
        const localOnly = Local.ready && !mongo_stat
        const onlineOnly = mongo_stat && !Local.ready
        const offline = !ready && !localOnly && !onlineOnly
        const message = ready ? 'ready' : localOnly ? 'local only' : onlineOnly ? 'online only' : 'server fault'
        const status = {
            mongo: db_connection,
            local: Local.ready,
            message,
        }
        return status
    }

    async updateConnection(){
        const {mongo,local,message} = await this.getConnection();
        this.state.mongo = mongo,
        this.state.local = local,
        this.state.message = message;
    }
    getLocalStatus(){
        return {
            last_stat: Local?.last_stat || null,
            local_update_needed: local_status.updateNeeded || null,
            last_sync: local_status.lastChangeMs || null,
            last_change: local_status.lastChange || null,
            local_size: local_status.count || null,
            local_collections: Local?.db?.collection_names.length || null,
            added: local_status.added?.length || null,
            changed: local_status.changed?.length || null,
            removed: local_status.removed?.length || null,
            message: this.state.message
        }
    }

    getStatus(){

    }
    get_collection_names(collection_type){}
    update_collection_names(collection_type){}

    get_collection_info(collection_type){}
    update_collection_info(collection_type){}

    get_app_state(){}
    update_app_state(){}

}