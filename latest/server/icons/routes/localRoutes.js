const express = require('express');
const router = express.Router();
const Local = require('../models/Local.js')
const Database = require('../models/Database.js')

router.get('/collections', async function getLocalDownloads(request,response){
  const collection_type = request.query.collectionType;
  if (collection_type === 'synced'){
    console.log('fetching synced collections')
    response.json(Local.get_synced_collections())
  }
  else {
    console.log('fetching all collections')
    response.json(Local.get_collections())
  }
})

router.get('/status', async function getLocalStatus(request,response) {
  const local_status = await Local.get_status();
  const mongo_stat = (await Database.ping());
  // const mongo_stat = true;
  const ready  = Local.ready && mongo_stat
  const localOnly = Local.ready && !mongo_stat
  const onlineOnly = mongo_stat && !Local.ready
  const offline = !ready && !localOnly && !onlineOnly
  const message = ready ? 'ready' : localOnly ? 'local only' : onlineOnly ? 'online only' : 'server fault'
  const code = Local.ready && mongo_stat ? 100 : Local.ready && !mongo_stat ?  200 : mongo_stat && !Local.ready ? 300 : 400
  
  const status = {
    db_status: mongo_stat ? 'online' : 'offline',
    local_status: Local.ready ? 'online' : 'offline',
    last_stat: Local?.last_stat || null,
    local_update_needed: local_status.updateNeeded || null,
    last_sync: local_status.lastChangeMs || null,
    last_change: local_status.lastChange || null,
    local_size: local_status.count || null,
    local_collections: Local?.db?.collection_names.length || null,
    added: local_status.added?.length || null,
    changed: local_status.changed?.length || null,
    removed: local_status.removed?.length || null,
    targets: local_status?.targets || [],
    code,
    message,
  }
  response.json(status)
})

router.post('/add', async function addUserTarget(request,response){
  const pathname = decodeURIComponent(request.body.payload.path)
  const test = await Local.addTarget(pathname);
  response.json( test )
})
module.exports = router;
