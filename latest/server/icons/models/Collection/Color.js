const Database = require('../Database.js')
const {uuid} = require('../../../utils/uuid.js')
const config = {
    document_alias: '[[meta_doc]]',
    collection_alias: '{{meta}}',
    configurable: ['color','colors'],
    configure(props){
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

async function find(cid){
    return (await connect()).findOne({cid:cid})
}

async function add(cid,colorset){
    try {
        return await (await connect()).findOneAndUpdate(
            { cid: cid },
            { $set: {
                [`colors.${colorset?.csid || uuid()}`]: colorset,
                updated_on: Date.now(),
            }},
            { returnDocument: 'after' }
        );
    } catch (error) {
        console.error("Error adding color: ", error);
        throw error;
    }
}

async function destroy(cid,csid){
    try {
        const data = await find(cid);
        const colorIsDefault = data?.color && data.color?.csid === csid;
        
        return await (await connect()).findOneAndUpdate(
            { cid: cid },
            {
                $unset: { [`colors.${csid}`]: "" },
                $set: {
                    color: colorIsDefault ? {} : data.color,
                    updated_on: Date.now(),
                }
            },
            { returnDocument: 'after' }
        );
    } catch (error) {
        console.error("Error removing color: ", error);
        throw error;
    }
}

async function update(cid,props){
    try {
        return await (await connect()).findOneAndUpdate(
            { cid: cid },
            { 
                $set: {
                    ...config.configure(props),
                    updated_on: Date.now(),
                }
            }
        );
    } catch (error) {
        console.error("Error updating color: ", error);
        throw error;
    }
}

async function setDefault(cid,colorset){
    try {
        return await update(cid, { color: colorset });
    } catch (error) {
        console.error("Error setting default color: ", error);
        throw error;
    }
}

async function clearDefault(cid){
    try {
        return await setDefault(cid, { color: {} });
    } catch (error) {
        console.error("Error clearing default color: ", error);
        throw error;
    }
}

module.exports = {
    add,
    destroy,
    update,
    setDefault,
    clearDefault,
}