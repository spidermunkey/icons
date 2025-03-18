const express = require('express')
const router = express.Router()
const { Mongo } = require('../model.js')
const Local = require('../models/Local.js')

const App = require('../models/App.js')


router.get('/info', async function getCollectionData(request,response){
  try {
    console.log('fetching collection data')
    result = await App.get_collection_info();
    response.json(result)
  } catch (error){
    console.log(error)
    response.status(500).send({success:false,code:500,message:'error processing request'})
  }

})

router.get('/info/names', async function getCollectionNames(request,response) {
  try {
    const collection_type = request.query.collectionType;
    console.log('fetching collection data')
    result = await App.get_collection_names(collection_type);
    response.json(result)
  } catch (error){
    console.log(error)
    response.status(500).send({success:false,code:500,message:'error processing request'})
  }
})


router.post('/create', async function createCollection (request,response) {
  const data = await App.create_collection(request.body.payload.props)
  if (data?.success === false){
    console.log(data)
  }
  response.json(data)
})
router.post('/sync', async function sync_collection(request,response){
  console.log('syncing local collection')
  const { payload } = request.body
  if (!payload?.cid)
      return response.json({message: 'upload failed', success: false, reason: 'invalid collection id'})
  let cid = payload.cid;
  console.log('searching in local db')
  let collection = Local.getCollectionById(cid);
  if (collection) {
    console.log('collection found... checking remote database...')
    const isSync = await Mongo.check_collection_id(collection.cid)
    console.log('cloud sync status', isSync)
    if (!isSync){
      console.log('syncing collection',collection.name,collection.cid)
      try {
        const data = Local.get_collection(collection.name)
        const status = await Mongo.sync_collection( data )
        console.log('STAT',status)
        if (status.success == true) {
          const result = await Local.sync(cid);
          if (result){ console.log('local update success!')}
          else {
            console.log('error syncing local collection')
            response.json({message: 'local sync failed', success: false, reason: 'unknown'})
          }
        }
        console.log('upload status done',status)
        response.json(status)
      } catch(e) {
        console.log(e)
        response.json({message: 'local sync failed', success: false, reason: 'unknown'})
      }
    } else {
      response.json({message: 'upload failed', success: false, reason: 'collection is synced in mongo db'})
    }
  }
})
router.post('/ignore', async function ignore_collection(request,response){
  console.log('ignoring collection')
  const { payload } = request.body
  if (!payload?.cid){
     response.json({message: 'upload failed', success: false, reason: 'invalid collection id'})
     return
  }
  let cid = payload.cid
  let done = Local.ignore(cid)
  let confirmed = Local.getCollectionById(cid).ignored == true
  if (confirmed) console.log('CONFIRMED')
  response.json({message: 'proccess complete', success: confirmed, reason: null})
})
router.delete('/:collectionID', async function dropCollection(request,response){
  const collection = request.params.collectionID;
  const result = await Mongo.remove_collection(collection);
  if (result.success == true) {
    await Local.update_collection(result.id, {synced:false})
  }
  console.log('delete Result',result)
  response.json(result)
})
router.post('/:collectionID/:id',async function searchCollection(request,response){
  
})
router.get('/:collection', async function getCollection (request, response) {
  const cName = request.params.collection;
  const page = request.query?.page;
  const limit = request.query?.limit;
  const filterSubType = request.query?.st
  const filterSubCollection = request.query?.sc
  let filters = {subtypes:[],sub_collections:[]};
  filters['subtypes'] = !filterSubType || filterSubType === '' ? [] : decodeURIComponent(request.query.st).split(',').filter(i => i != '' && i != null && i != undefined);
  filters['sub_collections'] = !filterSubCollection || filterSubCollection === '' ? [] : decodeURIComponent(request.query.sc).split(',').filter(i => i != '' && i != null && i != undefined);
  let data =  await Mongo.get_collection( { page , limit, filters, collection_name:cName } );
  response.json(data)
})

router.put('/:collectionID', async function editCollection(request,response){
  
})
router.post('/:collectionName', async function addToCollection (request, response) {
  const { payload } = request.body;
  const result = await Mongo.addToCollection(payload)
  response.json(result)
})

router.put('/settings/:collection', async function clearDefaultSetting(request,response){
  const collection = request.params.collection
  const result = await Mongo.clear_collectionDefault_setting(collection)
  response.json(result)
})
router.get('/settings/:collection', async function getCollectionSettings(request,response){
  
})
router.post('/settings',async function addCollectionSetting(request,response){
  const { payload } = request.body;
  // needs better sanitization
  const {cid,setting} = payload;
  console.log('PAYLOAD', cid , setting )
  const result = await Mongo.add_collection_preset(cid,setting);
  response.json(result);
})
router.delete('/settings',async function deleteCollectionSetting(request,response){
  let cid = decodeURIComponent(request.query.cid)
  let pid = decodeURIComponent(request.query.pid)
  const result = await Mongo.delete_collection_preset(cid,pid)
  response.json(result);
})
router.put('/settings', async function applySettingDefault(request,response){
    const { payload } = request.body
    // needs better sanitization
    const {collection,preset} = payload;
    const result = await Mongo.set_collectionDefault_setting(collection,preset)
    response.json(result)
})
router.post('/colors', async function add_collection_colorset(request,response) {
  const { payload } = request.body
  // needs better sanitization
  const {cid,colorset} = payload
  console.log('ADDING COLORSET', colorset )
  const result = await Mongo.add_collection_colorset(cid,colorset);
  response.json(result);
})
router.put('/colors/:collection', async function clear_default_color(request,response){
  const collection = request.params.collection;
  const result = await Mongo.clear_collectionDefault_color(collection);
  response.json(result)
})
router.delete('/colors', async function removeCollectionColorset(request,response){
  let cid = decodeURIComponent(request.query.cid);
  let csid = decodeURIComponent(request.query.csid);
  const result = await Mongo.delete_collection_color(cid,csid);
  response.json(result);
})

router.get('/', async function getCollections(request,response) {
  const result = Local.get_collections(true);
  response.json(result);
})

module.exports = router
