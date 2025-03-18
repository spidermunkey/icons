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

    async collection_id_exists(cid){
        return await Meta.find(cid)
    }

    async collection_name_exists(name){
        return await Meta.findByName(name);

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
        try {
            const validation_status = await validate_collection.call(this,props)
            const isValid = validation_status?.success === true;
            if (isValid){
            return await Collection.create(props)
            } else {
                throw new Error(validation_status.reason)
            }
        } catch(error){
            console.log('error creating collection', error)
        }
        async function validate_collection(props){
            const name = props?.name;
            const collection_id = props?.cid || uuid()
            const restrictedNames = ['all','favorites','recent','uploads','downloads','{{meta}}']
            const collection_exists = await this.collection_id_exists(collection_id)
            const collection_name_exists = await this.collection_name_exists(name) || restrictedNames.includes(name)
            if (!name) return { message: 'collection not created', success: false, reason: 'invalid name property' }
            if (collection_exists) return { message: 'collection not created',success: false, reason:'collection id exists'}
            if (collection_name_exists) return {message: 'collection not created', success:false, reason: 'name already exists'}
            if (!props.icons && !Array.isArray(props.icons) && props.icons.length <= 0)  return {message:'collection not created', success: false, reason: 'invalid icons param'}
            else {
                return { success:true }
            }
        }
    }

    async sync_collection(collection){
        // allows duplicate names... must be distinguished by collection_type
        try {
            console.log(collection)
            const { cid,colors, presets, icons } = collection;
            console.log('syncing local collection')
            const props = Local.getCollectionById(cid);
                    // applying default settings from ui
                    props.colors = colors
                    props.presets = presets
                    // syncing validated icons from ui
                    props.icons = icons
                    props.synced = Date.now()

            const validation_status = ( await validate.call(this,props))
            const isValid = validation_status.success === true;
            if (isValid){
                const synced = await Collection.sync(props)
                if (synced?.success === true){
                    await Local.update_collection(cid,props);
                }
                return synced;
            } else {
                console.log('error finding local collection',validation_status.reason)
                return validation_status
            } 
        } catch(error){
            console.log('error syncing collection',error)
        }
        async function validate(props){
            const name = props?.name
            const restrictedNames = ['{{meta}}']
            if (!props) return {message: 'collection not created', success: false, reason: 'invalid properties'}
            if (!name) return { message: 'collection not created', success: false, reason: 'invalid name property' }
            if (restrictedNames.includes(name)) return { message: 'collection not created', success:false, reason:'restricted name'}
            if (!props.icons && !Array.isArray(props.icons) && props.icons.length <= 0)  return {message:'collection not created', success: false, reason: 'invalid icons param'}
            else {
                return { success:true }
            }
        }
    }


    async get_sample(n){

    }
}
 

const instance = new App();
module.exports = instance