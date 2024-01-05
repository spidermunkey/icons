const env = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const PORT = 1279;
const bodyParser = require('body-parser');

const { MongoClient } = require('mongodb');
const { CONNECTION_STRING } = require('./config.js');

// const PORT = process.env.SPORT || 1279

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const iconRouter = require('./routes/icons.js');
const colorRouter = require('./routes/colors.js');

app.use('/icons', iconRouter);
app.use('/colors',colorRouter);
app.get('/timers', async function(req,res,next){
    const db = req.app.locals.connection.db('Timers');
    const collection = db.collection('all');
    console.log(req.body);
    const data = await collection.find().toArray();
    const mapper = (data) => { return {
        title: data.title,
        id: data.id,
        time: data.time,
        initial: data.initial,
        }
    }
    return res.json(data.map(mapper));
});
app.post('/timers', async function(req,res,next){
    const collectionName = 'all'
    const db = req.app.locals.connection.db('Timers');
    // const data = JSON.parse(req.body);
    // console.log(data)
    console.log(req.body);
    let schema = {
        title: req.body.title,
        id: req.body.id,
        time: req.body.time,
        initial: req.body.initial,
    }
    
    try {
        const collection = db.collection('all');
        const result = await collection.insertOne(schema,  function(err,result) {
            
            if (err) message = { status:"error", reason: err, code:500 };
            if (result) message = { status:"success", code:200 };

            return message;

        })
        console.log('successfully added',schema.id,'to',collectionName);
        res.json(schema);
        console.log(result)

    } catch(e) {
        console.log(e)
        message = { status: "error", reason: e, code: 500 }
        res.json(message);
        return message;
    }
})
app.delete('/timers', async function(req,res,next) {
    const collectionName = 'all'
    const db = req.app.locals.connection.db('Timers');
    const dID = req.query.id;
    console.log(req.query)
    console.log(dID)
    try {
        const collection = db.collection('all');
        const result = await collection.findOneAndDelete({"id":dID})
        console.log('found',dID);
        res.json(result);
        console.log(result)

    } catch(e) {
        console.log(e)
        message = { status: "error", reason: e, code: 500 }
        res.json(message);
        return message;
    }
})

app.get('/', (req,res) => res.json('Hello From The API HOME'));

app.use((req,res) => {
    res.status(404).send("404 not found")
});

async function run() {
    
    try {
        
        const connection = await MongoClient.connect(CONNECTION_STRING);
        app.locals.connection = connection;
        app.listen(PORT, (err) => console.log(`listening for api connections on port:${PORT}`))

    } catch (e) {
        console.log(e);
    }

};

run();