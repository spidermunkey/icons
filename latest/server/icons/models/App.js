const EventEmitter = require("events");

const Local = require('./Local.js')
const Database = require('./Database.js');
const Meta = require('./Collection/Meta.js')
const Collection = require('./Collection.js')
const { uuid } = require('../../utils/uuid.js');

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
        const names = await Meta.names(collection_type);
        return names;
    }

    async create_collection(props){
        const name = props?.name;
        const collection_id = props?.collection_id || uuid();
        const restrictedNames = ['all','favorites','recent','uploads','downloads','{{meta}}'];
        const collection_exists = await Meta.find(collection_id)
        const collection_name_exists = await Meta.findByName(name);

        if (!name) return { message: 'collection not created', success: false, reason: 'invalid name property' }
        if (collection_exists) return { message: 'collection not created',success: false, reason:'collection id exists'}
        if (collection_name_exists) return {message: 'collection not created', success:false, reason: 'name already exists'}
        if (restrictedNames.includes(name)) return  { message: 'collection not created',success: false, reason:'restricted collection name'}        
        if (!props.icons && !Array.isArray(props.icons) && props.icons.length <= 0)  return {message:'collection not created', success: false, reason: 'invalid icons param'}
        try {
            return await Collection.create(props)
        } catch(error){
            console.log('error creating collection', error)
        }
    }



    async get_sample(n){

    }
}
 

const instance = new App();
module.exports = instance