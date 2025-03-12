const EventEmitter = require("events");

const Local = require('./Local.js')
const Database = require('./Database.js');

const { Mongo } = require('./model.js');

class App extends EventEmitter {

    constructor(){
        super();

        this.collectionNames = {

        }
        this.collectionInfo = {

        }

        this.state = {
            init:false,
            message: 'app not initialized',
            hasChanged: false
        }

        this.isSyncing = false
        this.local = Local.init()
        this.database = Database
    }

    async getConnection(){
        const db_connection = await Database.ping()
        const ready  = Local.ready && mongo_stat
        const localOnly = Local.ready && !mongo_stat
        const onlineOnly = mongo_stat && !Local.ready
        const offline = !ready && !localOnly && !onlineOnly
        const message = ready ? 'ready' : localOnly ? 'local only' : onlineOnly ? 'online only' : 'server fault'
        const status = {
            remote: db_connection,
            local: Local.ready,
            message,
        }
        return status
    }

    async get_collection_names(collection_type){

    }

    async get_collection_info(collection_type){

    }


}

const instance = new App();
module.exports = instance