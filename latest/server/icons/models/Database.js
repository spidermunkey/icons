const { MongoClient } = require('mongodb')
const {CONNECTION_STRING} = require('../../.config/env')

class Database {
    constructor(){
        this.uri = CONNECTION_STRING;
        this.client = null;
        this.status = 'offline';
        this.connection = false;
        this.connections = 0;
    }

    async getDB(name){
        if (!this.client) {
            console.log('No client found, attempting to reconnect...');
            await this.connect();
        }
        if (!this.client) {
            console.error('Failed to connect to MongoDB.');
            return null
        }
        console.log(`Retrieving database: ${name}...`);
        const database = this.client.db(name)
        return database;
    }

    icons() {
        return this.getDB('icons')
    }

    colors(){
        return this.getDB('colors')
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
        if (!this.client) {
            console.log('ping!')
            await this.connect(); // Ensure the client is connected before pinging
        }
        try {
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
            await this.client.close();
            console.log('Disconnected from MongoDB');
        }
    }

}

const instance = new Database();
module.exports = instance