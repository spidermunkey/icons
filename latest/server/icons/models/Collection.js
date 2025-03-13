
const Database = require('./Database.js')
const { Meta, findMetaDocument, findMetaDocumentByName, createMetaDocument, updateMetaDocument } = require('./Meta.js')
const { Icon } = require('./Icon.js')
const { Color } = require('./Color.js');


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

async function getCollection(cid){
    return (await connect()).collection((await findMetaDocument(cid)).name)
}

async function getCollectinByName(name){
    return (await connect()).collection(((await findMetaDocumentByName(name)).name))
}

module.exports = {
    Collection,
    getCollection,
    getCollectinByName,

}