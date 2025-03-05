
module.exports.Collection = function(props){
    const {
        docname,
        name,
        cid,
        collection_type,
        subtypes,
        sub_collections,
        size,
        created_at,
        preset,
        usePreset,
        settings,
        color,
        colors,
        src_addr,
        ignored,
        synced,
    } = props;
    return {
            docname,
            name,
            cid,
            collection_type,
            subtypes,
            sub_collections,
            size,
            created_at,
            preset,
            usePreset,
            settings,
            color,
            colors,
            src_addr,
            ignored,
            synced,
    }
}
module.exports.Collection = class Collection {
    constructor(props){
        // set meta data
    }
    get_item(item_id){}
    get_items(query){}
    data(){
        // items + meta document
    }
    items(){
        // items
    }
    info(){
        // meta document
    }
    create(props,items){
        // push to remote db
    }
    destroy(){
        
    }
    sync(props,items){
        // upload from local source
    }
}