const { client, local_client } = require('./connect.js');

async function syncOffline(){
  const connection = await client.connect();
  const local_connection = await local_client.connect();

  const db = connection.db('icons');
  const local_db = local_connection.db('icons')
  const collections = await db.listCollections().toArray();
  try {
    const update = async ({ name }) => {
      const sourceCollection = db.collection(name);
      const targetCollection = local_db.collection(name);
      const cursor = sourceCollection.find();
      let batchSize = 1000;
      let batch = [];
      for await (const doc of cursor) {
        batch.push(doc);
        if (batch.length === batchSize) {
          await targetCollection.insertMany(batch);
          batch = [];
        }
      }
      if (batch.length > 0) {
        await targetCollection.insertMany(batch);
      }
    };
    await Promise.all(collections.map(update));
  } catch (error) {
    console.error("Error updating collection schemas:", error);
  } finally {
    await connection.close();
  }
}

syncOffline();
