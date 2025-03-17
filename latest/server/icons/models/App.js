const EventEmitter = require("events");

const Local = require('./Local.js')
const Database = require('./Database.js');
const Meta = require('./Collection/Meta.js')

class App extends EventEmitter {

    constructor(){
        super()

        this.collectionNames = {

        }

        this.collectionInfo = {

        }

        this.state = {

        }

        this.local = Local.init()
        this.database = Database
    }

    async get_collection_info(){
        const documents = await Meta.info();
        return documents;
    }

    async get_collection_names(){
        // find collection that also has meta data (properly synced)

    }

    async get_sample(n){

    }
}
 

const instance = new App();
module.exports = instance