const { MongoClient } = require('mongodb')
const {print} = require('../../utils/print.js')
const CONNECTION_STRING = `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@cluster${process.env.MONGO_CLUSTER}.fnp9j.mongodb.net/?retryWrites=true&w=majority`

class Database {
    
    constructor() {
        this.uri = CONNECTION_STRING;
        this.client = null;
        this.status = 'offline';
        this.connection = false;
        this.connections = 0;
        this.meta_alias = '{{meta}}';
        this.user_alias = '{{user}}';
    }

    async getDB(name){
        try {
            if (!this.client) {
                print('No client found, attempting to reconnect...');
                await this.connect();
            }
            if (!this.client) {
                print('Failed to connect to MongoDB.');
                return null
            }
            print(`Retrieving database: ${name}...`);
            const database = this.client.db(name)
            return database;
        } catch(error){
            console.error('error retrieving database...',error)
            throw (error);
        }
    }

    async meta(){
        try {
            return (await this.getDB('icons')).collection(this.meta_alias);
        } catch(error){
            console.error('error retrieving icon meta data...',error)
            throw(error)
        }
    }

    async user(){
        try {
            return (await this.getDB('icons')).collection(this.user_alias);
        } catch(error){
            console.error('error retrieving user data',error)
            throw(error)
        }
    }

    icons() {
        return this.getDB('icons')
    }

    async reset(){
        const collectionNames = (await (await this.icons()).listCollections().toArray()).map(collection => collection.name)
        const dropped = collectionNames.map(async name => {
            (await this.icons()).collection(name).drop();
        })
    }

    async stat(){
        try {
            console.log('checking mongodb stats....')
            if (!this.client || this.status === 'offline'){
                this.connections = 0;
                throw new Error('no active client...')
            }
            const adminDB = this.client.db('admin');
            const serverStatus = await adminDB.command({serverStatus:1});
            this.connections = serverStatus.connections;
        } catch(error){
            console.error('Error fetching connection info:',error.message)
        } finally {
            console.log('Database Connection:', this.status)
            console.log('Internet Reponse:', this.connection)
            console.log('Active Connections:', this.connections)
            return {
                db_status: this.status,
                internet: this.connection,
                connections: this.connections,
            }
        }
    }

    async ping() {
        try {
            if (!this.client) {
                console.log('ping!')
                await this.connect(); // Ensure the client is connected before pinging
            }
            const result = await this.client.db('admin').command({ ping: 1 });
            if (result.ok === 1) {
                console.log('MongoDB is responsive.');
                return true; // Database is online
            }
        } catch (error) {
            console.error(`Ping failed: ${error}`);
            return false; // Database is offline or unreachable
        }
    }

    async connection(){
        try {
            console.log('checking mongodb connection...')
            const isResponsive = await this.ping();
            if (isResponsive){
                this.connection = true
            } else {
                this.connection = false
                this.db = null;
            }
            return {
                connected: this.connection,
                status: this.status,
            }
        } catch (error){
            console.error('error establishing db connection', error);
            throw(error);
        }
    }

    async connect(){
        if (!this.client){
            try {
                this.client = new MongoClient(this.uri);
                console.log('creating client connection');
                await this.client.connect();
                this.status = 'connected';
                this.connection = true;
                console.log('mongodb connection established');
            } catch(error){
                console.error(`DB connection error: ${error.message}`);
                this.status = 'offline';
                this.client = null;
            } finally {
                await this.stat()
                return this.client;
            }
        }
        return this.client;
    }

    async disconnect() {
        if (this.client) {
            try {
                await this.client.close();
                console.log('Disconnected from MongoDB');
            } catch (error){
                console.error('something went wrong disconnecting with mongodb...', error)
            }
        }
    }

}

const instance = new Database();
module.exports = instance
