const Database = require('./Database.js')
const {uuid} = require('../../utils/uuid.js')
const config = {
    document_alias: '[[meta_doc]]',
    collection_alias: '{{meta}}',
    configurable: ['color','colors'],
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

async function find(cid){
    return (await connect()).findOne({cid:cid})
}

async function add(cid,colorset){
    return (await connect()).findOneAndUpdate(
        {cid:cid},
        { $set:{
            [`colors.${colorset?.csid || uuid()}`]:colorset,
            updated_on: Date.now(),
        }},{returnDocument: 'after'})
}

async function destroy(cid,csid){
    const data = (await find(cid));
    const colorIsDefault = data?.color && data.color?.csid === csid;
    return (await connect()).findOneAndUpdate(
        {cid:cid},
        {
            $unset:{ [`colors.${csid}`]: "" },
            $set:{
                color: colorIsDefault ? {} : data.color,
                updated_on: Date.now(),
        }
        },
        {returnDocument:'after'})
}

async function update(cid,props){
    return (await connect()).findOneAndUpdate({cid:cid}, { 
        $set:{
            ...config.filterProperties(props),
            updated_on: Date.now(),
        }
    })
}

async function setDefault(cid,colorset){
    return update( cid, { color:colorset } )
}

async function clearDefault(cid){
    return setDefault(cid,{ color: {} })
}

module.exports = {
    add,
    destroy,
    update,
    setDefault,
    clearDefault,
}