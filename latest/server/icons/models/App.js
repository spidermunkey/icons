const EventEmitter = require("events");

module.exports.App = class App extends EventEmitter{
    constructor(){
        super();
        this.collectionNames = {}
        this.collectionInfo = {}
        this.appState = {}
        this.isSyncing = false

    }

    get_collection_names(collection_type){}
    update_collection_names(collection_type){}

    get_collection_info(collection_type){}
    update_collection_info(collection_type){}

    get_app_state(){}
    update_app_state(){}

}