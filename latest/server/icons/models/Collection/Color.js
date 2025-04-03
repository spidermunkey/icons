const Database = require('../Database.js')
const {uuid} = require('../../../utils/uuid.js');
const { objectIsEmpty } = require('../../../utils/objectIsEmpty.js');

const config = {
    document_alias: '[[meta_doc]]',
    collection_alias: '{{meta}}',
    configurable: ['name','elements','shapes'],
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
}

// doesn't validate if colorset_type is really global but it should
function configure(props){
    if (props?.colorset_type=='global'){
        return {
            csid: props?.csid || uuid(),
            colorset_type: 'global',
            name: props?.name || 'untitled',
            elements: props?.elements || {},
            shapes: props?.shapes || {},
        }
    } else {
        return {
            ...props,
            csid: props?.csid || uuid(),
            colorset_type: 'variable',
            name: props?.name || 'untitled',
        }
    }

}

async function connect(){
    return await Database.meta()
}

async function meta(cid){
    return (await connect()).findOne({cid:cid})
}

async function add(cid,colorset){
    try {
        return await (await connect()).findOneAndUpdate(
            { cid: cid },
            { $set: {
                [`colors.${colorset?.csid || uuid()}`]: configure(colorset),
                updated_on: Date.now(),
            }},
            { returnDocument: 'after' }
        );
    } catch (error) {
        console.error("Error adding color: ");
        throw error;
    }
}

async function destroy(cid,csid){
    try {
        const data = await meta(cid);
        const colorIsDefault = data && data?.color && data.color?.csid === csid;
        const restricted = ['original'];
        if (restricted.includes(csid)){
            console.warn('deleting original preset not allowed')
            return {}
        }
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
        console.error("Error removing color: ");
        throw error;
    }
}

async function update(cid,props){
    try {
        return await (await connect()).findOneAndUpdate(
            { cid: cid,
                [`colors.${props?.csid}`]: { $exists: true }
             },
            { 
                $set: {
                    [`colors.${props.csid}`]:config.filterProperties(props),
                    updated_on: Date.now(),
                }
            },
            {returnDocument:'after'}
        );
    } catch (error) {
        console.error("Error updating color: ");
        throw error;
    }
}

async function setDefault(cid,colorset){
    try {
        return (await connect()).findOneAndUpdate(
            { cid: cid,
             },
            { 
                $set: {
                    color: configure(colorset),
                    updated_on: Date.now(),
                }
            },
            {returnDocument:'after'})
    } catch (error) {
        console.error("Error setting default color: ");
        throw error;
    }
}

async function clearDefault(cid){
    const meta = await connect();
    const document = await meta.findOne({cid:cid})
    const original = document.colors?.original;
    try {
        return (await connect()).findOneAndUpdate(
            { cid: cid,
             },
            { 
                $set: {
                    color: original,
                    updated_on: Date.now(),
                }
            },
            {returnDocument:'after'})
    } catch (error) {
        console.error("Error clearing default color: ");
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