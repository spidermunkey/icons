const express = require('express');
const router = express.Router();
const Local = require('../models/Local.js')
const {Mongo} = require('../model.js')



router.get('/collections', async function getLocalDownloads(request,response){
  const collection_type = request.query.collectionType;
  collection_type === 'synced' 
  if (collection_type === 'synced')
    response.json(Local.get_synced_collections())
  else 
    response.json(Local.get_collections())
})



router.get('/status', async function getLocalStatus(request,response) {
  const local_status = await Local.get_status();
  // const mongo_stat = (await Mongo.ping()) === 'ready'
  const mongo_stat = true;
  const code = Local.ready && mongo_stat ? 100 : Local.ready && !mongo_stat ?  200 : mongo_stat && !Local.ready ? 300 : 400
  const message = code === 100 ? 'ready' : code === 200 ? 'local db ok' : code === 300 ? 'mongo ready' : 'server not ready'
  const status = {
    db_status: mongo_stat ? 'online' : 'offline',
    local_status: Local.ready ? 'online' : 'offline',
    last_stat: Local?.last_stat || null,
    local_update_needed: local_status.updateNeeded || null,
    last_sync: local_status.lastChangeMs || null,
    last_change: local_status.lastChange || null,
    local_size: local_status.count || null,
    local_collections: Local?.db?.collection_names.length || null,
    added: local_status.added || null,
    changed: local_status.changed || null,
    removed: local_status.removed || null,
    code,
    message,
  }
  response.json(status)
})

module.exports = router;
