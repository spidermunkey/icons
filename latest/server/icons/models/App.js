const EventEmitter = require("events");

const Local = require('./Local.js');
const Database = require('./Database.js');
const Meta = require('./Collection/Meta.js');
const Collection = require('./Collection.js');
const Icon = require('./Collection/Icon.js');
const { uuid } = require('../../utils/uuid.js');
const { print } = require('../../utils/print.js');

class App extends EventEmitter {
    constructor(){
        super()
        this.local = Local.init()
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
            const { cid, colors, presets, icons } = collection;
            console.log('syncing local collection',presets)
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

    async drop_collection(cid){
        try {
            const collection = await Meta.find(cid);
            const collection_type = collection?.collection_type
            const dropped = await Collection.destroy(cid);
            let unsynced
            if (dropped?.success == true && collection_type === 'local'){
                unsynced = await Local.unsync(cid)
            }
            const result = {
                ...dropped,
                unsynced,
            }
            console.log('delete Result', dropped)
        } catch(error){
            console.log('error dropping collection',error)
            return {success:false,reason:error,message: 'error dropping collection'}
        }

    }
    // should be refactored to accept cids
    async get_collection({ collection, limit, page, filters}){
        try {
            console.log(collection)
            // refactor to find index
            if (collection === 'all'){
                const result = await Collection.all()
                return result;
            }
            const result = await Collection.data(collection,{limit,page,filters})
            return result
        } catch (error){
            return {success:false,reason:error,message:'error retrieving collection'}
        }
    }

    async addToCollection({collection,icons}){
        try {
            const meta = await Meta.find(collection)
            if (meta){
                const faulty = [];
                const added = await Promise.all(icons.map(async props => {
                    console.log(props)
                    const updated = {
                        ...props,
                        collection: meta.name,
                        cid: meta.cid,
                        id: uuid(),
                    }
                    try {
                        print('updating icon...')
                        const added =  await Icon.add(updated)
                        print(`added ${updated.name} to ${updated.collection}`)
                        return added;
                    } catch (error){
                        print(`error adding ${updated.name} to ${updated.collection}`)
                        faulty.push(props)
                    }
                }))
                // not async
                await update_size(meta);
                return {success:true, message:'process complete', reason: faulty.length,}
            } else throw new Error('collection not found');
        } catch (error){
            return {success:false,reason:error,message:'error adding to collection'}
        }
        async function update_size(meta){
            // this feels dangerous
            const cid = meta.cid;
            const size = await Collection.size(meta.cid);
            const updated = await Meta.update(cid,{size:size})
            console.log('size updated')
            console.log(updated.value)
        }
    }

}

const instance = new App();
module.exports = instance