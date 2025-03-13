// missing error handlers
const Database = require('./Database.js');
const Color = require('./Color.js');

const { uuid } = require('../../utils/uuid.js');

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

async function connect(){
    return (await Database.getDB('icons')).collection(config.collection_alias);
}
async function info(){
    return find(properties.cid);
}
async function configure(props){
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
async function create(props){
    return (await connect()).findOneAndUpdate(
        {cid:props.cid},
        {$set:{
            ...config.filterProperties(props),
            created_at: Date.now()
        }
        },
        {upsert:true})
}
async function find(cid){
    return (await connect()).findOne({cid:cid})
}
async function findByName({name,cid}){
    return (await connect()).findOne({name:name, cid:cid});
}
async function update(cid,props){
    return (await connect()).findOneAndUpdate({cid:cid}, { 
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

async function addColor(cid,colorset){
    return Color.add(cid,colorset)
}
async function removeColor(cid,csid){
    return Color.destroy(cid,csid)
}
async function setColorDefault(cid,colorset){
    return Color.update(cid,colorset)
}
async function clearColorDefault(cid){
    return Color.clearDefault(cid)
}

module.exports = {
    info,
    configure,
    create,
    find,
    findByName,
    update,
    destroy,
    addColor,
    removeColor,
    setColorDefault,
    clearColorDefault,
}