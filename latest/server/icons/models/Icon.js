
const Database = require('./Database.js');
const { getCollection } = require('./Collection.js');
// missing added uploaded_at prop
// can't figure out if spread may leave out some properties
class Icon {
    constructor(props){
        this.properties = configure(props)
    }

    async upload(){
        const collection = await getCollection(this.properties.cid);
        return collection.findOneAndUpdate(
            {id:id},
            {$set:this.properties},
            {upsert:true}
        )
    }

    async add(cid){
        const collection = await getCollection(cid);
        return collection.findOneAndUpdate(
            {id:id},
            {$set:this.properties},
            {upsert:true}
        )
    }

    async destroy(collection_id){
        const collection = await getCollection(this.properties.cid);
        return collection.findOneAndDelete({id:id});
    }

    async update(properties){
        const collection = await getCollection(this.properties.cid);
        return collection.findOneAndUpdate({id:id},{
            $set:filterProperties(properties)
        })
    }
}

function configure(props){
    return {
        name: props?.name || null,
        collection: props?.collection || null,

        id: props?.id || null, // original id
        cid: props?.cid || null, // collection id

        subtype: props?.subtype || null,
        sub_collection: props?.sub_collection || null,

        vid: props?.vid || null, // version id [deprecated for now]
        trace: props?.trace || null, // trace id [depricated for now]
        
        markup: props?.markup || '',

        color: props?.color || null,
        colors: props?.colors || {},
        preset: props?.preset || null,
        presets: props?.presets || {},

        benched: props?.benched || false,
        favorite: props?.favorite || false,
        ignored: props?.ignored || false,

        created_at: props?.create_at || Date.now(),
        updated_at: props?.updated_at || null,
    }
}

function filterProperties(props){
    const configurable = ['favorite','benched','name','color','colors','preset','presets','ignores','updated_at'];
    for (const prop in props){
        if (configurable.includes(prop)){
            configurable[prop] = props[prop]
        }
    }
    return configurable;
}

module.exports = {
    Icon,
}