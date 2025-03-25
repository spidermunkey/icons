const express = require('express');
const router = express.Router();
const Pocket = require('../models/Pocket');

router.get('/',async function getPocketData(request,response){
  response.json(await Pocket.find())
})

router.put('/',async function updatePocket(request,response){
    try {
        const propsToUpdate = request.body.payload?.props;
        const icon = request.body.payload.icon;
        console.log(propsToUpdate,icon)
        if (Object.hasOwn(propsToUpdate,'benched')){
            response.json(propsToUpdate.benched ? await Pocket.add(icon) : await Pocket.remove(icon))
        } else {
            response.status(404).send({success:false,code:404,message:'item not found'})
        }
    } catch (error){
        console.log(error)
        response.status(500).send({success:false,code:500,message:'error processing request'})
    }
})

router.delete('/',async function clearPocket(request,response){
    response.json(await Pocket.clear())
})

module.exports = router;
