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

async function info(){
    try {
        return await find(properties.cid);
    } catch (error) {
        console.error("Error fetching meta info: ", error);
        throw error;
    }
}


async function create(props){
    try {
        return (await connect()).findOneAndUpdate(
            {cid:props.cid},
            {$set:{
                ...configure(props),
                created_at: Date.now()
            }
            },
            {upsert:true})
    } catch (error) {
        console.error("Error creating meta document: ", error);
        throw error;
    }
}
async function find(cid){
    try {
        return await (await connect()).findOne({ cid: cid });
    } catch (error) {
        console.error("Error finding meta document by cid: ", error);
        throw error;
    }
}
async function findByName({name,cid}){
    try {
        return await (await connect()).findOne({ name: name, cid: cid });
    } catch (error) {
        console.error("Error finding meta document by name: ", error);
        throw error;
    }
}
async function update(cid,props){
    try {
        const configuredProps = await configure(props);  // Ensuring the structure is correct
        return await (await connect()).findOneAndUpdate(
            { cid: cid },
            {
                $set: {
                    ...config.filterProperties(configuredProps),
                    updated_on: Date.now()
                }
            }
        );
    } catch (error) {
        console.error("Error updating meta document: ", error);
        throw error;
    }
}

async function destroy(cid){
    try {
        return await (await connect()).deleteMany({
            cid: cid,
            docname: config.document_alias
        });
    } catch (error) {
        console.error("Error destroying meta document: ", error);
        throw error;
    }
}

async function addColor(cid,colorset){
    try {
        return await Color.add(cid, colorset);
    } catch (error) {
        console.error("Error adding color to meta document: ", error);
        throw error;
    }
}
async function removeColor(cid,csid){
    try {
        return await Color.destroy(cid, csid);
    } catch (error) {
        console.error("Error removing color from meta document: ", error);
        throw error;
    }
}
async function setColorDefault(cid,colorset){
    try {
        return await Color.update(cid, colorset);
    } catch (error) {
        console.error("Error setting default color in meta document: ", error);
        throw error;
    }
}
async function clearColorDefault(cid){
    try {
        return await Color.clearDefault(cid);
    } catch (error) {
        console.error("Error clearing default color in meta document: ", error);
        throw error;
    }
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