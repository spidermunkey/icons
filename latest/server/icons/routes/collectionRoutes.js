const express = require('express')
const router = express.Router()
const { Mongo } = require('../model.js')
const Local = require('../models/Local.js')
const App = require('../models/App.js')

router.get('/info', async function getCollectionData(request,response){
  try {
    response.json(await App.get_collection_info())
  } catch (error){
    console.log(error)
    response.status(500).send({success:false,code:500,message:'error processing request'})
  }
})

router.get('/info/names', async function getCollectionNames(request,response) {
  try {
    response.json(await App.get_collection_names(request.query.collectionType))
  } catch (error){
    console.log(error)
    response.status(500).send({success:false,code:500,message:'error processing request'})
  }
})

router.post('/create', async function createCollection (request,response) {
  try {
    response.json(await App.create_collection(request.body.payload.props))
  } catch (error) {
    console.log(error)
    response.status(500).send({success:false,code:500,message:'error processing request'})
  }
})

router.post('/sync', async function sync_collection(request,response){
  try {
    response.json(await App.sync_collection(request.body.payload.props))
  } catch (error) {
    console.log(error)
    response.status(500).send({success:false,code:500,message:'error processing request'})
  }
})

router.post('/ignore', async function ignore_collection(request,response){
  try {
    response.json(Local.ignore(request.payload.cid))
  } catch (error) {
    console.log(error)
    response.status(500).send({success:false,code:500,message:'error processing request'})
  }
})

router.delete('/del/:collectionID', async function dropCollection(request,response){
  try {
    response.json(App.drop_collection(request.params.collectionID))
  } catch (error) {
    console.log(error)
    response.status(500).send({success:false,code:500,message:'error processing request'})
  }
})

// refactor to accept collection ids instead of names or collection type in addition to name
// to support duplicate names (local.name, project.name)
router.get('/:collectionID', async function getCollection (request, response) {
  try {
    response.json(await App.get_collection({
      collection: request.params.collectionID,
      page: request.query?.page, 
      limit: request.query?.limit,
      filters: {
        subtypes: !(request.query?.st) || request.query?.st === '' ? [] : decodeURIComponent(request.query.st).split(',').filter(i => i != '' && i != null && i != undefined),
        sub_collections: !(request.query?.sc) || request.query?.sc === '' ? [] :  decodeURIComponent(request.query.sc).split(',').filter(i => i != '' && i != null && i != undefined),
      }
    }))
  } catch(error){
    console.log(error)
    response.status(500).send({success:false,code:500,message:'error processing request'})
  }
})

router.put('/edit/:collectionID', async function editCollection(request,response){
  
})

router.post('/add/:collectionID', async function addToCollection (request, response) {
  try {
    response.json(await App.addToCollection({
      collection: request.params.collectionID,
      icons: request.body.payload.icons
    }))
  } catch(error){
    console.log(error)
    response.status(500).send({success:false,code:500,message:'error processing request'})
  }
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
  console.log(cid,colorset)
  console.log('ADDING COLORSET', colorset )
  const result = await App.addCollectionColor(cid,colorset)
  response.json(result);
})


router.delete('/colors', async function removeCollectionColorset(request,response){
  let cid = decodeURIComponent(request.query.cid);
  let csid = decodeURIComponent(request.query.csid);
  console.log(cid,csid)
  const result = await App.deleteCollectionColor(cid,csid)
  response.json(result);
})

router.put('/colors/default', async function setDefaultColor(request,response){
  const {cid,colorset} = request.body.payload
  console.log(cid,colorset)
  const result = await App.setDefaultCollectionColor(cid,colorset)
  console.log('resy',result)
  response.json(result)
})

router.delete('/colors/default/:collection',async function clearDefaultColor(request,response){
  const cid = request.params.collection;
  console.log(cid)
  const result = await App.clearDefaultCollectionColor(cid)
  console.log('resy',result);
  response.json(result)
})

router.put('/colors/edit/:collection', async function edit_collection_color(request,response){
  const cid = request.params.collection;
  const color = request.payload.color;
  const result = await App.editColor(cid,color)
  response.json(result)
})

module.exports = router
