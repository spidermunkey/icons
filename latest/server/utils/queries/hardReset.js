const client = require('../connect')
const {Local} = require('../../icons/local')
async function hardReset(){
    const connection = await client.connect();
    console.log('connected');
    const db = client.db('icons');
    const meta = db.collection('{{meta}}')
    const collections = (await db.listCollections().toArray()).map(o => o.name);
    const deleted = [];
    console.log(collections)
    const done = await Promise.all(collections.map(async name => {
        await db.dropCollection(name)
    }))
    await Local.reset()
    console.log('done...')
}

hardReset();