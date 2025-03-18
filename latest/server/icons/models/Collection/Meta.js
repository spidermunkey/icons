// missing error handlers
const Database = require('../Database.js');
const Color = require('./Color.js');
const Preset = require('./Preset.js');

const { uuid } = require('../../../utils/uuid.js');
const { objectIsEmpty} = require('../../../utils/objectIsEmpty.js')

const config = {
    document_alias: '[[meta_document]]',
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
        if (!objectIsEmpty(configurable))
            return configurable
        new Error('no properties to configure');
    },
    handleQuery(query = {}){

    }
}

async function connect(){
    return await Database.meta();
}

function configure(props){
    return {
        docname: config.document_alias,
        name: props.name,
        cid: props?.cid || uuid(),
        collection_type: props?.collection_type || 'project',
        subtypes: props?.subtypes || [],
        sub_collections: props?.sub_collections || [],
        size: props?.size || props?.icons.length || undefined,
        created_at: props?.created_at || Date.now(),
        preset: props?.preset || null,
        presets: props?.presets || {},
        color: props?.color || null,
        colors: props?.colors || {},
        sample: props?.sample || props?.icons?.slice(0,25) || [],
        src_addr:props?.src_addr || undefined,
        synced: props?.collection_type === 'local' ? props?.synced : null, // should be date stamp
        filters: {
            sub_collections:[],
            subtypes:[],
        }
    }
}

async function info(){
    try {
        const meta = await connect();
        const info = await meta.find({
            docname:'[[meta_document]]'
        }).toArray();
        const formated = info.reduce((result,document) => {
            const collection_id = document.cid;
            switch (document.collection_type) {
                case 'project': 
                    result['projects'][collection_id] = document; 
                    break;
                case 'local': 
                    result['locals'][collection_id] = document; 
                    break;
                case 'indexed': 
                    result['indexed'][collection_id] = document; 
                    break;
                default: null
            }
            return result;
        },{       
            // collection types             
            locals: {},
            projects:{},
            indexed:{}
        })
        return formated;
    } catch (error) {
        console.error("Error fetching meta info: ");
        throw error;
    }
}

async function names(collection_type){
    const info = await this.info()
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
}

async function create(props){
    const collection_id = props?.cid || uuid();
    try {
        const created = await (await connect()).findOneAndUpdate(
            {cid:collection_id},
            {$set:{
                ...configure(props),
                created_at: Date.now()
            }
            },
            {upsert:true, returnDocument:'after'})
        return created.value;
    } catch (error) {
        console.error("Error creating meta document: ");
        throw error;
    }
}

async function find(cid){
    try {
        return (await connect()).findOne({ cid: cid });
    } catch (error) {
        console.error("Error finding meta document by cid: ");
        throw error;
    }
}

async function findByName(name,collection_type){
    try {
        return await (await connect()).findOne( { name:name, collection_type: collection_type ? collection_type : {$exists: true}});
    } catch (error) {
        console.error("Error finding meta document by name: ");
        throw error;
    }
}

async function update(cid,props){
    try {
        return (await connect()).findOneAndUpdate(
            { cid: cid },
            {
                $set: {
                    ...config.filterProperties(props),
                    updated_on: Date.now()
                }
            },{returnDocument:'after'}
        );
    } catch (error) {
        console.error("Error updating meta document: ");
        throw error;
    }
}

async function destroy(cid){
    try {
        return (await connect()).deleteMany({
            cid: cid,
            docname: config.document_alias
        });
    } catch (error) {
        console.error("Error destroying meta document: ");
        throw error;
    }
}

async function addColor(cid,colorset){
    try {
        return await Color.add(cid, colorset);
    } catch (error) {
        throw error;
    }
}

async function removeColor(cid,csid){
    try {
        return await Color.destroy(cid, csid);
    } catch (error) {
        throw error;
    }
}

async function setColorDefault(cid,colorset){
    try {
        return await Color.update(cid, colorset);
    } catch (error) {
        throw error;
    }
}

async function clearColorDefault(cid){
    try {
        return await Color.clearDefault(cid);
    } catch (error) {
        throw error;
    }
}

async function addPreset(cid,preset){
    try {
        return await Preset.add(cid,preset)
    } catch (error){
        throw error
    }
}

async function removePreset(cid,pid){
    try{
        return await Preset.destroy(cid,pid);
    } catch (error){
        throw error;
    }
}

async function setPresetDefault(cid,preset){
    try {
        return await Preset.setDefault(cid,preset)
    } catch (error){
        throw error;
    }
}

async function clearPresetDefault(cid){
    try {
        return await Preset.clearDefault(cid)
    } catch (error){
        throw error
    }
}

module.exports = {
    
    info,
    names,
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

    addPreset,
    removePreset,
    setPresetDefault,
    clearPresetDefault,

}