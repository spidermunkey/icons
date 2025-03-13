const Database = require('../Database.js');
const { uuid } = require('../../../utils/uuid.js');
const { objectIsEmpty } = require('../../../utils/objectIsEmpty.js');

const config = {
    document_alias: '[[meta_doc]]',
    collection_alias: '{{meta}}',
    configurable: ['name','viewbox','vbx','vby','vbw','vbh','stroke','fill','x','y','height','width','rotation'],
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

function configure(props){
    return {
        name: props?.name || 'untitled',
        // can be collection or icon preset,
        pid: props?.pid || uuid(),
        viewbox: props?.viewbox || '',
        vbx: props?.vbx || 0,
        vby: props?.vby || 0,
        vbw: props?.vbw || 24,
        vbh: props?.vbh || 24,
        stroke: props?.stroke || null,
        fill: props?.fill || null,
        x: props?.x || null,
        y: props?.y || null,
        height: props?.height || '',
        width: props?.width || '',
        rotation: props?.rotation || null,
        created_at: props?.created_at || DateTime.stamp().ms,
    }
}

async function connect(){
    return Database.meta()
}

async function meta(cid){
    return (await connect()).findOne({cid:cid})
}

async function add(cid,props) {
    try {
        return (await connect()).findOneAndUpdate(
            {cid:cid},
            {
                $set:{
                    [`presets.${props?.pid || uuid()}`]: configure(props),
                    update_on: Date.now(),
                }
            },
            {returnDocument:'after'})
    } catch(error){
        console.error('error adding collection preset...')
        throw error
    }
}

async function destroy(cid,pid){
    const data = await meta(cid)
    const presetIsDefault = data && data.preset?.pid === pid
    try {

        if (!pid) throw new Error('invalid preset id')
        if (pid === 'original') throw new Error('cannot destroy original preset...')

        return (await connect()).findOneAndUpdate({
            cid:cid,
            $unset:{[`presets.${pid}`]:""},
            $set:{
                preset: presetIsDefault ? presetIsDefault : {},
                updated_on: Date.now()
            }
        })

    } catch(error){
        console.error('error removing preset...')
        throw error
    }
}

async function update(cid,props){
    try {
        return (await connect()).findOneAndUpdate({
            cid:cid,
            [`presets.${props?.pid}`]: {$exists:true} 
        },{
            $set:{
                [`presets.${props?.pid}`]:config.filterProperties(props),
                updated_on: Date.now()
            }
        })
    } catch(error){
        console.error('error updating preset')
        throw error
    }
}

async function setDefault(cid,colorset){
    try {
        (await connect()).findOneAndUpdate(
            { cid: cid,
             },
            { 
                $set: {
                    color: colorset,
                    updated_on: Date.now(),
                }
            },
            {returnDocument:'after'})
    } catch (error) {
        console.error("Error clearing default color: ");
        throw error;
    }
}

async function clearDefault(cid){
    try {
        (await connect()).findOneAndUpdate(
            { cid: cid,
             },
            { 
                $set: {
                    preset: {},
                    updated_on: Date.now(),
                }
            },
            {returnDocument:'after'})
    } catch (error) {
        console.error("Error clearing default preset: ");
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