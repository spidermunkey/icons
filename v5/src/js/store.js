import { API } from './api.js';
import { Icon } from './components/Icon.js';
import { Cursor } from './var/cursor.js';
import { Pocket } from './components/Pocket.js';
export class SvgModel {
    constructor() {
        // this.model = new Model();
        this.all = {}
        this.categoryNames = []
        this.categories = {}
        this.collectionNames = []
        this.collections = {}
        this.state = {}
        this.meta = {}
        this.bench = {
            name: 'bench',
            updated_on:null,
            pocket: new Pocket(),
            meta: {
                ready: true,
            },
            state: {},
            get icons() {
                return this.pocket.icons;
            },
            getIcon(id) {
                return (this.icons.filter(icon => icon.id == id))[0]
            },
        }
        this.pocket = this.bench.pocket;
        this.ready = false
    }
    createCollection({icons,meta,state}) {
        if (icons){
            const i = icons.map(icon => {
                const i = new Icon(icon);
                if (i.isValid) {
                    return i;
                } else console.log(i)
                
            })
            return {
                icons: i,
                cursor: new Cursor(i),
                meta: {
                    ready: true,
                },
                state: {},
                getIcon(id) {
                    return (this.icons.filter(icon => icon.id == id))[0]
                },
                get ready() {

                },
                set ready(val){

                }
            }
        }
    }
    async addCollection(name) {
        console.log('creating collection',name);
        if (typeof name !== 'string') {
            console.error('type of collection name must be a string... got:' + typeof name)
            return 'name must be a string';
        }
        if (this.collectionNames.includes(name)){
            console.error('tried to create collection by the name of',name,'but it already exists');
            return 'name already exist, choose a different collection name';
        }
        this.collectionNames.push(name);
        this.collections[name] = {};
        console.log('collection optimistically created... communicating with server',this.collections[name]);
        const res = await API.createCollection(name);
        console.log(res);
        return this.collections[name];
    }
    async getPinned(collection = 'favorites') {
        const {data} = await API.getCollection(collection);
        return data.map(value => value.markup)
    }
    async getRandom(n=20,collection){
        let icons = await API.getRandom(n,collection);
        return icons
    }
    async sync() {
        API.sync(this.model)
        return new Promise(() => {
            const db = indexedDB.open('icons')
        })
    }
    removeCollection(name) {
        delete this.collections[name];
        API.dropColletion(name);
    }
    async addToCollection({ destination, icon }) {
        console.log(`adding ${icon} to ${destination}`)
        const id = uuid();
        let collection = this.collections[destination];
        if (!collection) collection = await this.addCollection(destination);
        else if (collection[id] !== undefined) 
            return console.warn('this id already exists')
        if (destination === 'favorites'){
            icon.isFavorite = true;
            API.addFavorite(icon.props)
        }
        let copy = icon.save();
        copy.collection = destination;
        copy.trace = icon.id;
        copy.id = id;
        collection[id] = icon;
        console.log('optimistic update successful... asynchronously adding to database now');
        const response = await API.addToCollection( destination, copy.props );
        console.log(response)
        if (response.success){
            this.collections[destination].meta.ready = false;
        }
        return response;
    }

    removeFromCollection(id, collection) {
        delete this.collections[collection][id]
    }

    async getCategoryNames() {
        return API.getCategoryNames();
    }
    
    async getCollectionNames() {
        if (this.ready && this.collectionNames)
            return this.collectionNames
        const names = API.getCollectionNames();
        this.collectionNames = names;
        return this.collectionNames
    }

    async getMeta() {
        const data = await API.getCollectionData();
        let meta = {
            collectionNames: await this.getCollectionNames(),
            random: await this.getRandom(20),
            documents: {},
        }
        for (const document of data) 
            meta.documents[document.name] = document;
        return meta
    }

    async getAll() {
        const {icons} = await API.getCategory('all');
        return icons;
    }

    async populateAllIcons() {
        const response = await API.getCategory('all');
        this.all = this.createCollection(response)
    }

    async getCollection(name) {
        let local = this.collections[name];
        if (name == 'all' && this.ready == true)
            return this.all;
        if (local && local.meta.ready == true)
            return this.collections[name];
        if (!local || local.meta.ready == false){
            local = this.createCollection((await API.getCollection(name)));
            return this.collections[name]
        }
        
        const collection = await API.getCollection(name);
        return collection;
    }

    async populateCollectionData() {
        const userCollections = await this.getCollectionNames()
        for (const name of userCollections){
            const response = await this.getCollection(name);
            this.collections[name] = this.createCollection(response);
        }
    }

    async updateCollection(name) {
        const response = await this.getCollection(name);
        this.collections[name] = this.createCollection(response);
    }

    async init() {
        console.log('initializing store...')
        // await this.populateAllIcons();
        // await this.populateCollectionData()
        // this.meta = await this.getMeta()
        this.ready = true
        console.log('model ready')
        console.log(this)
        return this
    }
}
