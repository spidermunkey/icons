const Database = require('./Database.js')
const Icon = require('./Collection/Icon.js')


async function find(){
    return (await Database.icons()).collection('{{pocket}}').find().toArray();
}

async function clear(){
    return (await Database.icons()).collection('{{pocket}}').drop();
}

async function add(icon){
    return await Icon.pocket(icon)
}

async function remove(icon){
    return await Icon.unpocket(icon)
}

module.exports = {
    find,
    add,
    remove,
    clear,
}