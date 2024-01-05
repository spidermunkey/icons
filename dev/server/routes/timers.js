const express = require('express');
const router = express.Router();

router.get(getTimers)

async function getTimers(req,res,next) {

    const db = req.app.locals.connection.db('Timers');
    const collection = db.collection('all');
    console.log(req.body);
    const data = await collection.find().toArray(); 
    return res.json(data);
}

module.exports = router;