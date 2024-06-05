import { API } from './api.js';
import { Model } from './model.js';
import { Icon } from './components/Icon.js';

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
        this.ready = false
    }

    async createCollection(name) {
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
        if (!collection) collection = await this.createCollection(destination);
        else if (collection[id] !== undefined) 
            return console.warn('this id already exists')
        
        let copy = icon.save();

        if (destination === 'favorites'){
            icon.isFavorite = true;
            API.addFavorite(icon.props) // markup current icon;
            copy.isFavorite = true;
        }

        copy.collection = destination;
        copy.trace = icon.id;
        copy.id = id;
        collection[id] = icon;

        console.log('optimistic update successful... asynchronously adding to database now');
        const res = API.addToCollection( destination, copy.props );
        return  {message:'optimistic update successful... asynchronously adding to database now',success:true ,promise:res,size: collection.size}
    }

    addManyToCollection(collection,array) {
        array.forEach(obj => {
            const {cid} = obj
            const node = new Icon(obj)
            this.collections[collection][cid] = node;
        })
        console.log('finished adding',array,'to',collection)
    }

    removeFromCollection(id, collection) {
        delete this.collections[collection][id]
    }

    // calls to api
    async getCategoryNames() {
        return API.getCategoryNames();
    }
    
    async getCollectionNames() {
        return API.getCollectionNames();
    }

    async getMeta() {
        const meta = await API.getCollectionData();
        for (const document of meta) {
            this.meta[document.name] = document;
        }
        return this.meta;
    }

    async getAll() {
        const {icons} = await API.getCategory('all');
        return icons;
    }

    async populateCategoryData() {
        const {icons} = await API.getCategory('all');

        for (let i = 0; i < icons.length; i++) {
            let backpack = icons[i],
                meta = new Icon(backpack),
                {id,cid,category} = meta;
            if (!this.categoryNames.includes(category)){
                this.categoryNames.push(category);
                this.categories[category] = {}
            }
            this.all[id] = meta;
            this.categories[category][cid] = meta;
            this.all.length = i;
        }

    }

    async populateCollectionData() {

        const userCollections = await this.getCollectionNames()
        console.log('here',userCollections)
        for (const name of userCollections){
            this.collectionNames.push(name);
            this.collections[name] = {};
            const {icons} = await API.getCollection(name);
            this.addManyToCollection(name,icons);
        }
    }

    async init() {
        console.log('initializing store...')
        await this.populateCategoryData()
        await this.populateCollectionData()
        await this.getMeta()
        this.ready = true
        console.log('model ready')
        console.log(this)
        return this
    }

    async updateCollection(name) {
        if (store.collections[name]) {
            let {data} = await API.getCollection(name),
                collection = store.collections[name];
            if (data) collection = addManyToCollection(collection,data)
        }
    }
}


