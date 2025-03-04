const morgan = require('morgan');
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 1279;
// const MessageBroker = require('./icons/messageBroker.js');
const bodyParser = require('body-parser');

const { MessageBroker } = require('./icons/messageBroker.js');
const { Mongo } = require('./icons/model.js');
const { Local } = require('./icons/local.js');
const broker = new MessageBroker(app);
const server = broker.server;
// const PORT = process.env.SPORT || 1279
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const iconRouter = require('./icons/router.js');
const colorRouter = require('./colors/routes/colors.js');

app.use('/icons', iconRouter);
app.use('/colors',colorRouter);
app.get('/', (req,res) => res.json('Hello From The API HOME'));
app.use((req,res) => {
    res.status(404).json("404 not found")
});
async function run() {
    try {
        process.on('uncaughtException',(err) => {
            console.log(err.code)
            console.log(err.reason)
            console.log('[[process]]')
        })
        await Local.init();
        console.log('local db ready'); // event db ready
        await Mongo.connect(); // event db ready
        server.listen(PORT, (err) => {
            console.log(`listening for api connections on port:${PORT}`)
        });
        
    } catch (e) {
        console.log(e);
        console.log('[[server]]');
    }
};

run().catch(e => {
    console.log('i caught that')
});
