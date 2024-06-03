import { API } from './api.js';
import { Model } from './model.js';
import { IconNode } from './components/Icon.js';

export class SvgModel {
    constructor() {
        this.all = {}
        this.categoryNames = []
        this.categories = {}
        this.collectionNames = []
        this.collections = {}
        this.state = {}
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
    async getRandom(n=20){
        let icons = await API.getRandom();
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

    async addToCollection({ destination, id, meta, onSuccess, onFailure }) {
        let collection = this.collections[destination];
        if (!collection) {
            console.log('collection doesnt exist... creating it now');
            collection = await this.createCollection(destination);
            if (typeof collection == 'string') {
                const message = { message: `error creating collection: ${collection}`, success: false, reason: "unknown", from: 'VM'}
                if (onFailure) onFailure(message);
                return message;
            }
       } else if (this.collections[destination][id] !== undefined) {
            const message = { message: "this id already exists", success:false, reason:"duplicate id",from:'VM'}
            if (onFailure) onFailure(message);
            return message;
        }
        
        let copy = meta.save();
        if (destination === 'favorites'){
            meta.isFavorite = true;
            copy.isFavorite = true;
            copy.observer.isFavorite = true;
        }
        meta.knownCollections.push(destination);
        copy.category = destination;
        copy.observer.category = destination;
        collection[id] = meta
        console.log('optimistic update successful... asynchronously adding to database now');
        const res = API.addToCollection( destination, copy, meta );
        const message = {message:'optimistic update successful... asynchronously adding to database now',success:true ,promise:res,size: collection.size}
        if (onSuccess) onSuccess(message);
        return message
    }

    addManyToCollection(collection,array) {
        array.forEach(obj => {
            const {cid} = obj
            const node = new IconNode(obj)
            this.collections[collection][cid] = node;
        })
        console.log('finished adding',array,'to',collection)
    }

    removeFromCollection(id, collection) {
        delete this.collections[collection][id]
    }

    async getRandomIcons() {

    }
    // calls to api
    async getCategoryNames() {
        if (this.categoryNames)
            return this.categoryNames;
        return API.getCategoryNames();
    }
    
    async getCollectionNames() {
        // if (this.collectionNames)
        //     return this.collectionNames
        return API.getCollectionNames();
    }

    async getIcons() {
        return API.getCategory('all');
    }

    async populateCategoryData() {
        const data = await this.getIcons();
        // console.log('here',data)

        
        for (let i = 0; i < data.length; i++) {
            let backpack = data[i],
                meta = new IconNode(backpack),
                {id,cid,category} = meta;
            if (!this.categoryNames.includes(category)){
                this.categoryNames.push(category);
                this.categories[category] = {}
            }
            this.all[id] = meta;
            this.categories[category][cid] = meta;
            this.all.length = i;
            // Model.add(backpack);
        }

        console.log('storing category data in indexed db')
    }

    async populateCollectionData() {

        console.log('fetching collection names')
        const userCollections = await this.getCollectionNames()
        console.log('collections: ', userCollections)
        for (const name of userCollections){
            this.collectionNames.push(name);
            this.collections[name] = {};
            console.log('fetching data for collections')
            const {data} = await API.getCollection(name);
            this.addManyToCollection(name,data);
        }
    }

    async init() {
        console.log('initializing store...')
        await this.populateCategoryData()
        await this.populateCollectionData()
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
