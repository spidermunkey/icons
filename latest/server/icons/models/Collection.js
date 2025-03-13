
const Database = require('./Database.js')

const { Icon } = require('./Collection/Icon.js')
const { Meta } = require('./Collection/Meta.js')

async function find(cid){
    return (await connect()).collection((await Meta.find(cid)).name)
}

async function findByName(name){
    return (await connect()).collection(((await Meta.findByName(name)).name))
}

async function size(cid){

}

async function addIcon(icon){

}

async function removeIcon(icon){

}

async function updateIcon(icon){

}

async function icons(cid){

}

async function info(cid){
    return await Meta.info(cid)
}

async function data(cid){

}

async function search(cid, query){

}

async function sample(cid){

}

async function create(props){

}

async function sync(props){ 

}

async function destroy(cid){

}

async function addColor(){

}

async function removeColor(){

}

async function setColorDefault(){

}

async function clearColorDefault(){

}

async function addPreset(){

}

async function removePreset(){

}

async function setPreset(){

}

async function removePreset(){

}

async function setPresetDefault(){

}

async function clearPresetDefault(){

}

class Collection {
    
    constructor(properties){
        this.cid = cid
    }
    
    async icon(id){
        const icons = await getCollection(this.id);
        return icons.findOne({id:id})
    }
    async icons({limit,filter,page = 1}){
        return (await getCollection(this.cid))
        .find(...paginate(limit,filter,page))
        .toArray();

    }
    async search({query, limit, page }){
        const validQuery = typeof query === 'string' && query.trim().length > 0
        if (validQuery){
            const icons = await getCollection(this.cid);
            const escaped = query.replace(/[.*+?^=!:${}()|\[\]\/\\]/g,'\\$&');
            return icons.find({
                name: {$regex: escaped, $options: 'i'}
            }).toArray()
        }
        return []
    }
    async info(){
        return findMetaDocument(this.cid)
    }
    async data(paginateOptions = {}){
        return {
            icons: (await this.icons(paginateOptions)),
            meta: (await this.info())
        }
    }

    create(props){
        const {icons} = props;
        const db = connect();
        if (icons && Array.isArray(icons) && icons.length > 0){
            const collectionData = createMetaDocument(props);
            if (collectionData){
                console.log(collectionData)
                icons.forEach(props => {
                    let icon = new Icon(props)
                    icon.add()
                })
            }
        }
    }
    destroy(){
        
    }
    sample(n , random = false){

    }
    sync(props){

    }

    add_color(colorset){
        updateMetaDocument(this.id,)
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

}