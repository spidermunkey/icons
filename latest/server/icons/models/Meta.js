// missing error handlers
// missing added uploaded_at prop
// can't figure out if spread may leave out some properties

const config = {
    document_alias: '[[meta_doc]]',
    collection_alias: '{{meta}}',
    // should probably be a map that also verifies specific type
    configurable: ['name','size','preset','presets','color','colors','filters'],
    filterProperties(props){
        const configurable = {};
        for (const prop in props){
            if (config.configurable.includes(prop)){
                configurable[prop] = props[prop]
            }
        }
        return configurable;
    },
}

class Meta {
    constructor(props){
        this.properties = configure(props)
    }

    async info(){
        return find(this.properties.cid);
    }
    async create(){
        return create(this.properties);
    }
    async edit(props){
        return update(this.properties.cid,props)
    }
    async destroy(){
        return destroy(this.properties.cid);
    }
 
}

function configure(props){
    return {
        docname: config.document_alias,
        name: props.name,
        cid: props?.cid || uuid(),
        collection_type: props?.collection_type || 'project',
        subtypes: props?.subtypes || [],
        sub_collections: props?.sub_collections || [],
        size: props?.size || undefined,
        created_at: props?.created_at || Date.now(),
        preset: props?.preset || null,
        presets: props?.presets || {},
        color: props?.color || null,
        colors: props?.colors || {},
        src_addr:props?.src_addr || undefined,
        synced: props?.collection_type === 'local' ? props?.synced : null, // should be date stamp
        filters: {
            sub_collections:[],
            subtypes:[],
        }
    }
}

async function connect(){
    return (await Database.getDB('icons')).collection(config.collection_alias);
}

async function findByName({name,cid}){
    const items = (await connect()).find({name:name}).toArray();
    if (items.length > 0 && cid){
        return items.filter(item => item.cid === cid)[0]
    }
    return items;
}

async function find(cid){
    return (await connect()).findOne({cid:cid})
}

async function create(props){
    return (await connect()).findOneAndUpdate(
        {cid:this.cid},
        {$set:configure(props)},
        {upsert:true})
}

async function update(cid,props){
    return (await connect()).findOneAndUpdate({cid:cid},{ 
        $set:{
            ...config.filterProperties(props),
            updated_on: Date.now(),
        }
    })
}

async function destroy(cid){
    return (await connect()).deleteMany({
        cid:cid,
        docname:config.document_alias
    })
}


module.exports = {
    Meta,
    createMetaDocument: create,
    updateMetaDocument: update,
    destroyMetaDocument: destroy,
    findMetaDocument: find,
    findMetaDocumentByName: findByName,
}