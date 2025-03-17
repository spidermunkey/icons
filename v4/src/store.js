import * as _ from './js/utils/DOM-helpers.js';
import Collection from './js/utils/structs/Collection';
import { default as API } from './API.js';
import { IconNode } from './js/utils/structs/Icon.js';

export class SvgModel {
    constructor() {

        this.duplicates = {};
        this.dupeCount = 0;

        this.all = new Collection();

        this.categorySet = new Set();
        this.categories = {};

        this.collectionSet = new Set(),
        this.collections = {};
        
        this.state = {};
        this.ready = false;

    }

    // Populating Collections with deep copies
    async createCollection(name) {

        console.log('creating collection',name);

        if (typeof name != 'string') {
            console.error('type of collection name must be a string... got:' + typeof name)
            return 'name must be a string';
        }

        if (this.collectionSet.has(name)){
            console.error('tried to create collection by the name of',name,'but it already exists');
            return 'name already exist, choose a different collection name';
        }


        this.collectionSet.add(name);
        const collection = new Collection();
        this.collections[name] = collection;

        console.log('collection optimistically created... communicating with server',collection,this.collections[name]);
        const res = await API.createCollection(name);
        console.log(res);

        return collection;
    }

    removeCollection(name) {
        delete this.collections[name]
    }

    checkCollection(dest,key) {
        return this.collections[dest].has(key)
    }

    async addToCollection({ destination, name, meta, onSuccess, onFailure }) {

        let collection = this.collections[destination];

        if (!collection) {
            
            console.log('collection doesnt exist... creating it now');
            collection = await this.createCollection(destination);

            if (typeof collection == 'string') {
                const message = { message: `error creating collection: ${collection}`, success: false, reason: "unknown", from: 'VM'}
                if (onFailure) onFailure(message);
                return message;
            }

        }

        else if (this.collections[destination].has(name)) {
            const message = { message: "this name already exists", success:false, reason:"duplicate name",from:'VM'}
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
        

        const addedToViewModel = collection.add(name,copy);

        if (!addedToViewModel) {
            const message = {message:'something went wrong with optimistic update', success:false,reason:'could not be added to viewModel',from:'VM'};
            if (onFailure) onFailure(message);
            return message
        }

        console.log('optimistic update successful... asynchronously adding to database now');
        const res = API.addToCollection( destination, copy, meta );
        console.log(res)
        
        const message = {message:'optimistic update successful... asynchronously adding to database now',success:true ,promise:res,size: collection.size}
        if (onSuccess) onSuccess(message);

        return message
    }

    addManyToCollection(collection,array) {
        array.forEach(obj => {
            const {name,rebased} = obj
            // console.log('adding',collection,'as a known collection to',name)
            const node = new IconNode(obj)
            node.knownCollections.push(collection)
            this.collections[collection].add(rebased ? rebased : name, node)
        })
        console.log('finished adding',array,'to',collection)
    }

    removeFromCollection(name, collection) {
        this.collections[collection].remove(name);
    }

    // calls to api
    async getCategoryNames() {
        return API.getCategoryNames();
    }
    async getCollectionNames() {
        const names = await API.getCollectionNames();
        console.log('NAMES',names)
        return names
    }

    async init() {
        var data;
        // const conn = await API.ping();
        // console.log(conn)
        // if (!conn) {
        //     console.log('%cICONS -- PORT=OFFLINE ... connection refused', "color: orange; font-family: arial; font-size:20px")
        //     var data = await fetch('./data/icons.json')            
        //         .then((res) => { 
        //             console.log(res)
        //             const data = JSON.parse(res);
        //             console.log('DATA',data)
        //             return res.json()})
        //         .then((data) => {
        //             console.log('DATA',data)
        //             data.forEach(el => {
        //                 list.push(el)
        //                 // console.log(el);
        //             })})

        //     console.log(data,'here')
        //     return {}
        // }

         var {data} = await API.getCategory('all');
         let icons = data[0].icons;
        console.log('DATA',data)
        // setting static properties
        // and building the dataset
        for (let i = 0; i < icons.length; i++) {
            let backpack = icons[i];
            
            // element props
            let key = backpack.name;
            // let obj = Object.create(IconProto)
            let meta = new IconNode(backpack);
            // let meta = Object.assign(obj,props);

            // Populate Categories with orignal references
            if (!this.categorySet.has(meta.category)){
                // keeping track of different categories
                this.categorySet.add(meta.category);
                this.categories[meta.category] = new Collection();
            }

            // handling duplicate names
            if (this.all.has(key))
            {
                // if known duplicate doesn't exist create an object for it
                if (!this.duplicates.hasOwnProperty(key)) {
                    this.duplicates[key] = {
                        count: 1,
                        categoryCount: 0,
                        dupes: new Map(),
                    }
                    // setting the existing element first
                    this.duplicates[key].dupes.set(key,this.all.use(key));
                }

                // then the new element with a modified name
                let newKey = `${key}--${meta.category}`;
                
                // handling duplicates withing categories
                if (this.duplicates[key].dupes.has(newKey)) {
                    // console.log('category dupe found!')
                    newKey = `${newKey}--${++this.duplicates[key].categoryCount + 1}`;
                }

                // add a property showing that the name has been modified
                meta.rebased = newKey;

                // proceed mapping operations
                this.duplicates[key].dupes.set(newKey,meta);
                this.all.add(newKey,meta);
                this.categories[meta.category].add(newKey,meta);
                
                // update count
                this.duplicates[key].count = this.duplicates[key].count + 1;
                this.dupeCount++;
            } else {
                // ...otherwise
                this.all.add(key,meta);
                this.categories[meta.category].add(key,meta);
            }
        }
        // set property indicating if svgs of the same name exist
        if (this.dupeCount > 0) {
            for (let name in this.duplicates) {
                this.duplicates[name].dupes.forEach(value => {
                    // setting a reference back to all the icons of the same name
                    value.others = this.duplicates[name]
                    if (this.duplicates[name].categoryCount > 0)
                        value.othersInSameCategory = this.duplicates[name].categoryCount;
                })
            }
            function log_duplicates()
            { 
                // console.log('found',this.dupeCount,'duplicates');
                // console.log('here they are', this.duplicates);
            }
        }
        const userCollections = await this.getCollectionNames();
        for (const name of userCollections){
            this.collectionSet.add(name);
            const collection = new Collection();
            this.collections[name] = collection;
            const {data} = await API.getCollection(name);
            if (data[0]?.icons.length > 0){
                console.log('DAT',data[0].icons)
                this.addManyToCollection(name,data[0].icons);
            }
        }
        this.ready = true;
        console.log(this)
        return this;
    }
    async update() {
        const {data} = await API.getCategory('all')
    }
    async updateCollection(name) {

        if (store.collections[name]) {
            const {data} = await API.getCollection(name)
            const collection = store.collections[name]
            collection.drop();
            addManyToCollection(collection,data)
        }
    
    }
}




// function deepClone(obj, hash = new WeakMap()) {
//     if (Object(obj) !== obj) return obj; // primitives
//     if (hash.has(obj)) return hash.get(obj); // cyclic reference
//     const result = obj instanceof Set ? new Set(obj) // See note about this!
//                  : obj instanceof Map ? new Map(Array.from(obj, ([key, val]) => 
//                                         [key, deepClone(val, hash)])) 
//                  : obj instanceof Date ? new Date(obj)
//                  : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
//                  // ... add here any specific treatment for other classes ...
//                  // and finally a catch-all:
//                  : obj.constructor ? new obj.constructor() 
//                  : Object.create(null);
//     hash.set(obj, result);
//     return Object.assign(result, ...Object.keys(obj).map(
//         key => ({ [key]: deepClone(obj[key], hash) }) ));
// }
