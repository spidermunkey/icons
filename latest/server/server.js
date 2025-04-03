// load environment variables
require('dotenv').config({ path: `.env`});

const PORT = 1279;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Local = require('./icons/models/Local.js');
const Database = require('./icons/models/Database.js');

app.use(require('morgan')('tiny'));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(bodyParser.json({limit:'10mb'}));
app.use(express.json());
app.use(require('cors')());

app.use('/icons', require('./icons/router.js'));
app.get('/', (req,res) => res.json('Hello From The API HOME'));
app.use((req,res) => res.status(404).json("404 not found"));

async function reset(){
    await Database.reset(); // drop all collections
    await Local.reset(); // unsync all collections
}

async function hardReset(){
    await Database.reset(); // drop all collections
    await Local.update(); // recompile from file system state
}

async function scan(){
    await Local.update();
}

async function run() {
    try {
        process.on('uncaughtException',(error) => console.log('[[ process ]]', error ))
        console.log('local db ready');
        // await hardReset();
        await Database.connect();
        // console.log(Local.getCollectionById('m8yh5muq-00M8LWCPPESZ').name)
        app.listen(PORT, (error) => {
            if (error) console.log('error starting server:', error)
            else console.log(`icon server running on port:${PORT}`)
        });
    } catch (error) {
        console.log('[[server]]',error);
    }
};

run();
