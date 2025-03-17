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

    async get_collection_names(collection_type){
        // find collection that also has meta data (properly synced)
        console.log(collection_type)
        const info = await this.get_collection_info()
        const names = [];
            if (collection_type && info[collection_type]){
                const collection = info[collection_type]
                for (const id in collection){
                    names.push(collection[id].name)
                }
            } else {
                for (const collection_type in info){
                    const collections = info[collection_type]
                    for (const id in collections){
                        const collection = collections[id]
                        names.push(collection.name)
                    }
                }
            }
        
            return names
        const collections = (await icons.listCollections().toArray())
            .map(c => c.name)
            .filter(name => name !== '{{meta}}');

        return collections;


    }

    async get_sample(n){

    }
}
 

const instance = new App();
module.exports = instance