const { MongoClient } = require('mongodb');

const PASSWORD='VKCHrPYKAkejb1Hv';
const CONNECTION_STRING=`mongodb+srv://JB3:${encodeURIComponent(PASSWORD)}@cluster0.fnp9j.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(CONNECTION_STRING);

module.exports = client;