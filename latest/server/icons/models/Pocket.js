const Database = require('./Database.js')
const Icon = require('./Collection/Icon.js')


async function find(){
    return (await Database.icons()).collection('{{pocket}}').find().toArray();
}

async function clear(){
    return (await find()).forEach(icon => remove(icon))
}

async function add(icon){
    return await Icon.pocket(icon)
}

async function remove(icon){
    return await Icon.unpocket(icon)
}

async function add(collection_id){

}

async function create(collection_name){
    
}

module.exports = {
    find,
    add,
    remove,
    clear,
}