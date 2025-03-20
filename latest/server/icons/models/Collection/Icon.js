
const Database = require('../Database.js');
const Meta = require('./Meta.js');
const { objectIsEmpty } = require('../../../utils/objectIsEmpty.js');
const { print } = require('../../../utils/print.js')
config = {
    configurable_collection_type: 'project', // can add / delete to projects.
    configurables:[ 'favorite','benched','name','ignored','updated_at','preset','color' ],
    filterProperties(props){
        const configurable = {}
        for (const prop in props){
            if (this.configurables.includes(prop)){
                configurable[prop] = props[prop]
            }
        }
        if (!objectIsEmpty(configurable))
            return configurable;
        throw new Error('no properties configured')
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

function configurePreset(props){
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

function configureColor(props){
    return {
        ...props,
        csid: props?.csid || uuid(),
        colorset_type: 'variable',
        name: props?.name || 'untitled',
    }
}

async function connect() {
    return Database.icons()
}

async function getCollection(name){
    return (await connect()).collection(name)
}

async function index(){
    return await getCollection('all')
}

async function getCollectionNameById(cid){
    return (await Meta.find(cid))?.name;
}

async function getCollectionTypeById(cid){
    const collectionType =  (await Meta.find(cid))?.collection_type
    console.log(collectionType);
    return collectionType
}

async function sync(props) { // upload from local => <collection_type> : 'remote' || <collection_type> : 'index'
    try {
        const schema = configure(props);
        if (!schema.collection) throw new Error('sync failed invalid collection  name')
        const collection = await getCollection(schema.collection);
        const all = await index();
        const added = await collection.findOneAndReplace({id:schema.id},{...schema},{upsert:true, returnDocument:'after'});
        const indexed = await all.findOneAndReplace({id:schema.id},{...schema},{upsert:true, returnDocument:'after'});
        return {success: { added:added.value , indexed:indexed.value }, reason:'', message:'process complete' }

    } catch (error){
        console.log(error)
        throw error
    }
}

async function unsync(props){
    try {

        const schema = configure(props);
        if (!schema.collection) throw new Error('sync failed invalid collection id or name')

        const collection = await getCollection(schema.collection);
        const all = await index();
        const added = await collection.findOneAndDelete({id:schema.id},{...schema},);
        const indexed = await all.findOneAndDelete({id:schema.id},{...schema},);
        
        return {success: { added , indexed }, reason:'acknowledged', message:'process complete' }

    } catch (error){
        throw error
    }

        
}

async function add(props){ // copy from remote db => <collection_type>: 'project'
    try {

        const schema = configure(props);
        if (!schema.collection) {
            throw new Error('add to collection failed invalid collection id or name')
        }
        else if (!schema.cid) {
            throw new Error('add to collection failed.... invalid collection id',schema)
        }
        else if (await getCollectionTypeById(schema.cid) !== 'project') throw new Error('add to collection failed... invalid collection type')
        const collection = await getCollection(schema.collection);
        const added = await collection.findOneAndReplace({id:schema.id},{...schema},{ upsert:true, returnDocument:'after'});
        return {success: added.value, reason:'acknowledged', message:'process complete'}

    } catch (error){
        return {succes:false,reason:error,message:'error adding icon'}
    }
}

async function destroy(props){ // <collection_type> ? 'project'
    try {

        if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
        else if (!props.cid ) throw new Error('add to collection failed.... invalid collection id')
        else if (await getCollectionTypeById(props.cid) !== 'project') throw new Error('add to collection failed... invalid collection type')
        
        const collection = await getCollection(props.collection);
        const removed = await collection.findOneAndDelete({id:props.id});

        return {success: removed, reason:'acknowledged', message:'process complete'}

    } catch (error){
        throw error
    }
}

async function update( props , propsToUpdate ){ // <collection_type> ? 'project'
    try {
        if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
        else if (!props.cid ) throw new Error('add to collection failed.... invalid collection id')
        else if (await getCollectionTypeById(props.cid) !== 'project' ) {
            // can only add to pocket
            throw new Error('add to collection failed... invalid collection type')
        }
        
        const collection = await getCollection(props.collection);
        const updated = await collection.findOneAndUpdate(
            { id: props.id},
            { $set: config.filterProperties(propsToUpdate) });
        const updatedIndex = (await getCollection('all')).findOneAndUpdate(
            {id:props.id},
            { $set: config.filterProperties(propsToUpdate) })

        return {success: updated.value, reason:'acknowledged', message:'process complete'}

    } catch (error){
        throw error
    }
}

async function pocket(props){
    if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
    else if (!props.cid ) throw new Error('add to collection failed.... invalid collection id')
    console.log('adding to pocket');

        await (await getCollection('{{pocket}}')).findOneAndReplace(
        {id:props.id},
        { ...props },
        {upsert:true})

        const collection = await getCollection(props.collection);

        const updated = await collection.findOneAndUpdate(
            { id: props.id},
            { $set: {benched:true}},
            { returnDocument:'after'});
        const updatedIndex = (await getCollection('all')).findOneAndUpdate(
            {id:props.id},
            { $set: {benched:true}})

    return {success: updated.value, reason:'acknowledged', message:'process complete'}

}

async function unpocket(props){
    console.log('removing from pocket')
    if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
    else if (!props.cid ) throw new Error('add to collection failed.... invalid collection id')
    await (await getCollection('{{pocket}}')).findOneAndDelete(
        {id:props.id},
    )
    const collection = await getCollection(props.collection);
    const updated = await collection.findOneAndUpdate(
        { id: props.id},
        { $set: {benched:false} },
        { returnDocument:'after' });
    const updatedIndex = (await getCollection('all')).findOneAndUpdate(
        {id:props.id},
        { $set: {benched:false} })

    return {success: updated.value, reason:'acknowledged', message:'process complete'}

}

async function addColor( props , colorset ){
    try {
        if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
        const collection = await getCollection(props.collection);
        const updated = await collection.findOneAndUpdate(
            { id: props.id },
            { $set: {[`colors.${colorset?.csid || uuid()}`]: configureColor(colorset)} });
        return {success: updated, reason:'acknowledged', message:'process complete'}

    } catch (error){
        throw error
    }
}

async function removeColor( props , colorset ){
    try {
        if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
        const collection = await getCollection(props.collection);
        const updated = await collection.findOneAndUpdate(
            { id: props.id,
                [`colors.${colorset?.csid}`]: { $exists:true }
             },
            { $unset: {[`colors.${colorset?.csid}`]: "" } });
        return {success: updated, reason:'acknowledged', message:'process complete'}

    } catch (error){
        throw error
    }
}

async function setColorDefault( props , colorset ){
    try {
        if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
        const collection = await getCollection(props.collection);
        const updated = await collection.findOneAndUpdate(
            { id: props.id },
            { $set: { color: configureColor(colorset) }});
        return {success: updated, reason:'acknowledged', message:'process complete'}

    } catch (error){
        throw error
    }
}

async function clearColorDefault(props){
    try {
        if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
        const collection = await getCollection(props.collection);
        const updated = await collection.findOneAndUpdate(
            { id: props.id },
            { $set: { color: {} }});
        return {success: updated, reason:'acknowledged', message:'process complete'}

    } catch (error){
        throw error
    }
}

async function addPreset(props, preset ){
    try {
        if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
        const collection = await getCollection(props.collection);
        const updated = await collection.findOneAndUpdate(
            { id: props.id },
            { $set: {[`presets.${preset?.pid || uuid()}`]: configurePreset(preset)} });
        return {success: updated, reason:'acknowledged', message:'process complete'}

    } catch (error){
        throw error
    }
}

async function removePreset(props, preset ){
    try {
        if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
        const collection = await getCollection(props.collection);
        const updated = await collection.findOneAndUpdate(
            { id: props.id,
                [`presets.${preset?.csid}`]: { $exists:true }
             },
            { $unset: {[`presets.${preset?.pid}`]: "" } });
        return {success: updated, reason:'acknowledged', message:'process complete'}

    } catch (error){
        throw error
    }
}

async function setPresetDefault( props , preset){
    try {
        if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
        const collection = await getCollection(props.collection);
        const updated = await collection.findOneAndUpdate(
            { id: props.id },
            { $set: { preset: configurePreset(preset) }});
        return {success: updated, reason:'acknowledged', message:'process complete'}

    } catch (error){
        throw error
    }
}

async function clearPresetDefault(props){
    try {
        if (!props.collection ) throw new Error('add to collection failed invalid collection id or name')
        const collection = await getCollection(props.collection);
        const updated = await collection.findOneAndUpdate(
            { id: props.id },
            { $set: { preset: {} }});
        return {success: updated, reason:'acknowledged', message:'process complete'}

    } catch (error){
        throw error
    }
}






module.exports = {
    sync,
    unsync,
    add,
    destroy,
    update,
    pocket,
    unpocket,

    addColor,
    removeColor,
    setColorDefault,
    clearColorDefault,

    addPreset,
    removePreset,
    setPresetDefault,
    clearPresetDefault,

}