
const Database = require('./Database.js')
const Icon = require('./Collection/Icon.js')
const Meta = require('./Collection/Meta.js')

const { print } = require('../../utils/print.js')

async function find(cid){
    return (await connect()).collection((await Meta.find(cid)).name)
}

async function findByName(name){
    return (await connect()).collection(((await Meta.findByName(name)).name))
}

async function size(cid){
    return (await find(cid)).countDocuments();
}

async function icons(cid, {limit,filter,page = 1}){
    return (await find(cid))
    .find(
    {},
    {...paginate(limit,filter,page)})
    .toArray();
}

async function info(cid){
    return await Meta.find(cid)
}

async function data(cid, paginateOptions = {}){
    return {
        icons: (await icons(cid,paginateOptions)),
        meta: (await info(cid))
    }
}

async function search(cid,{query, limit, page }){
    const validQuery = typeof query === 'string' && query.trim().length > 0
    if (validQuery){
        const icons = await find(cid);
        const escaped = query.replace(/[.*+?^=!:${}()|\[\]\/\\]/g,'\\$&');
        return icons.find(
            { name: {$regex: escaped, $options: 'i'} },
            {...paginate(limit,filter,page)})
            .toArray()
    }
    return []
}

async function create(props){
    try {
        const {icons} = props;
        if (icons && Array.isArray(icons) && icons.length > 0) {
            const collectionData = await Meta.create(props);
            if (collectionData){
                await Promise.all(icons.map(async props => {
                    await Icon.add(props)
                }))
            } else throw new Error('meta data invalid')
            return collectionData
        } else throw new Error('invalid icons param')

    } catch (error){
        console.error('error creating collection', error);
        throw error;
    }

}

async function sync(props){ 
    try {
        const {icons} = props;
        if (icons && Array.isArray(icons) && icons.length > 0){
            const collectionData = await Meta.create(props);
            if (collectionData){
                const faulty = []
                const progress = icons.length;
                let count = 0;
                await Promise.all(icons.map(async props => {
                    try {
                        await Icon.sync(props)
                        print(`icon synced -- [${++count}/${progress}]`)
                    } catch (error){
                        faulty.push(props.name)
                        print(`error syncing icon`)
                    }
                }))
                return { success:true, message:'sync process complete'}
            } else throw new Error('meta data invalid')
        } else throw new Error('invalid icons param')
    } catch (error){
        console.error('error syncing collection', error);
        throw error;
    }

}

async function unsync(props){
    try {
        const {icons} = props;
        if (icons && Array.isArray(icons) && icons.length > 0){
            const collectionData = await Meta.destroy(props.cid);
            if (collectionData){
                const faulty = []
                await Promise.all(icons.map(async props => {
                    try {
                        await Icon.unsync(props)
                    } catch(error){
                        faulty.push(props)
                        print('error unsyncing icon' )
                    }
                }))
            }
        }
        return {success:true,message:'collection unsynced'}
    } catch (error){
        console.error('error unsyncing collection',error)
        throw error
    }

}

async function destroy(cid){
    try {
        const dropped = await (await find(cid)).drop();
        if (dropped){
           const meta_dropped = await Meta.destroy(cid);
           if (meta_dropped){
            return {success:true,message:'collection dropped'}
           } else throw new Error('error cleaning up meta data')
        } else throw new Error('error dropping collection')
    } catch (error){
        console.error('error removing collection', error);
        throw error;
    }

}

async function connect(){
    return Database.icons('icons');
}

function paginate(limit,filter,page = 1){
    const query = {}
    const validSubCollectionFilter = filter?.sub_collections && Array.isArray(filter.sub_collections) && filter.sub_collections.length > 0
    const validSubtypeFilter = filter?.subtypes && Array.isArray(filter.subtypes) && filter.subtypes.length > 0
    const validLimit = !isNaN(parseInt(limit)) && parseInt(limit) > 0
    const validPage = !isNaN(parseInt(page)) && parseInt(page) > 0
    if (validSubCollectionFilter){
        query.sub_collections = {$in: filter.sub_collections}
    }
    if (validSubtypeFilter){
        query.subtypes = {$in: filter.subtypes}
    }
    const options = {}
    if (limit && validLimit && validPage ) {
        options.limit = parseInt(limit);
        options.skip = (parseInt(page) - 1) * parseInt(limit)
    }
    return {query,options}
}

module.exports = {
    find,
    findByName,
    size,
    icons,
    info,
    data,
    search,
    create,
    sync,
    unsync,
    destroy,

}