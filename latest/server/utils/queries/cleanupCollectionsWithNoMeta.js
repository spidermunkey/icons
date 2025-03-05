const client = require('../connect.js');

async function deleteCollectionsWithNoMeta(){
    const connection = await client.connect();
    console.log('connected');
    const db = client.db('icons');
    const meta = db.collection('{{meta}}')
    const collections = (await db.listCollections().toArray()).map(o => o.name);
    const deleted = [];
    console.log(collections)
    const done = await Promise.all(collections.map(async name => {
        console.log('sifting collections')
        const metaDoc = await meta.findOne({name:name,docname:'[[meta_document]]'})
        if (!metaDoc){
            console.log('deleting',name)
            await db.dropCollection(name)
            deleted.push(name)
        }
    }))
    console.log(`collections deleted : ${deleted}`)
}

 deleteCollectionsWithNoMeta();