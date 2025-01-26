import { API } from './api.js';
import { Icon } from './components/Icon.js';
import { Collection } from './components/Collection.js';
import { EventEmitterClass } from './utils/EventEmitter.js';
export class SvgModel extends EventEmitterClass {
    constructor() {
        super();
        this.all = {};
        this.collectionNames = []
        this.collections = {}
        this.state = {}
        this.meta = null
        this.pocket = {
            name: 'bench',
            updated_on: null,
            meta: {
                ready: true,
                size:0,
            },
            icons:[],
            state: {},
            getIcon(id) {
                return (this.icons.filter(icon => icon.id == id))[0]
            },
            iconExists(icon){
                return this.icons.includes(icon)
            },
            add(icon){
                if (this.iconExists(icon)) {
                    console.log('FOUND IT')
                     this.icons = this.icons.filter(icon => icon !== icon)
                     --this.meta.size;
                    $('.bench-count').textContent = this.meta.size;
                    return;

                }
                this.icons.push(icon)
                ++this.meta.size;
                $('.bench-count').textContent = this.meta.size;
            }
        }
        this.ready = false;
    }
    async search(query){
        const result = await API.search(query)
        return result;
    }
    async savePreset(preset){
        const res = await API.savePreset(preset);
        return res;
    }
    async saveIconPreset(id,collection,setting){
        const res = await API.saveIconPreset(id,collection,setting);
        return res;
    }
    async deleteIconPreset(id,collection,pid){
        const res = await API.deleteIconPreset(id,collection,pid);
        return res;
    }
    async updatePresetName(props){
        const res = await API.updatePresetName(props)
        return res
    }
    async setCollectionDefault(collection,setting){
        const res = await API.setCollectionDefault(collection,setting);
        return res;
    }
    async clearCollectionDefault(cid){
        const res = await API.clearCollectionDefault(cid)
        return res;
    }
    async setDefaultIconSetting(id,collection,pid){
        const res = await API.setDefaultIconSetting(id,collection,pid)
        return res
    }
    async clearDefaultSetting(id,collection){
        const res = await API.clearDefaultSetting(id,collection)
        return res
    }
    async saveCollectionPreset(cid,setting){
        const res = await API.saveCollectionPreset(cid,setting);
        return res;
    }
    async deleteCollectionPreset(cid,pid){
        const res = await API.removeCollectionPreset(cid,pid)
        return res
    }
    async dropCollection(collectionName){
        const res = await API.dropCollection(collectionName);
        return res;
    }
    async addMany(name,icons) {
        try {
            let complete = await Promise.all(icons.map(icon => this.addToCollection({destination: name, icon})))
            return complete
        } catch(event){
            console.log(event)
        }
    }

    async addToCollection({ destination, icon }) {
        const id = uuid()
        let collection = this.collections[destination]
        if (!collection) collection = await this.addCollection(destination)
        else if (collection[id] !== undefined) return console.warn('this id already exists')
        let copy = icon.save()

        copy.collection = destination
        copy.trace = icon.id
        copy.id = id
        collection[id] = icon
        console.log('optimistic update successful... asynchronously adding to database now')
        const response = await API.addToCollection( destination, copy.props )
        console.log(response)
        if (response.success){
            this.collections[destination].meta.ready = false;
        }
        return response;
    }

    removeFromCollection(id, collection) {
        delete this.collections[collection][id]
    }

    async getCollectionNames(synced = true) {
        if (this.ready && this.collectionNames)
            return this.collectionNames

        const names = await API.getCollectionNames(synced);
        this.collectionNames = names;
        return this.collectionNames;
    }

    async populateAllIcons() {
        const response = (await API.getCollection('all'))[0];
        this.all = this.createCollection(response)
    }
    async getIcon(id){
        const icon = await API.getIcon(id);
        console.log(icon)
    }
    createCollection( data ) {
        // console.log('creating collection',data)
        const collection = new Collection(data)
        this.notify('collection compiled',collection)
        return collection
    }
    async saveCollection(name,icons){
        const result = await API.createCollection(name,icons)
        return result
    }

    async getCollectionPaginated(name,page=1,limit=50){
        const {meta,icons} = (await API.getPage(name,page,limit))[0];
        const validIcons = []
        icons.forEach( icon => {
            const i = new Icon(icon);
            if (i.isValid) validIcons.push(i)
            // else console.warn('skipping',i)
        })
        return {
            name: meta.name,
            sub_collections: meta.sub_collections,
            sub_types: meta.sub_types,
            size: meta.size,
            pages: Math.floor(meta.size/limit),
            currentPage: page,
            icons:validIcons,
            async getPage(num){
                return API.getPage(this.name,num,limit)
            }
        }

    }
    async getCollection(name, filters = {subtypes:[],sub_collections:[]}, useFilters = false) {
        let local = this.collections[name];
        if (name == 'all' && this.ready == true){
            this.notify('collection retreived')
            return this.all;
        }
        if (!local || local.meta.ready == false){
            const collection = (await API.getCollection(name,filters,useFilters))[0]
            this.collections[name] = this.createCollection(collection,filters)
            this.notify('collection retreived')
            return this.collections[name]
        }
        const collection = (await API.getCollection(name,filters,useFilters))[0];
        this.collections[name] = this.createCollection(collection,filters);
        this.notify('collection retreived')
        console.log('COLLECTION RETRIEVED',collection)
        return this.collections[name];
    }
    async populateCollectionData() {
        const userCollections = await this.getCollectionNames();
        for (const name of userCollections){
            const response = await this.getCollection(name);
            this.collections[name] = this.createCollection(response);
        }
    }
    async getMeta() {
        const data = await API.getCollectionData();
        let meta = this.meta = {
            uploads: data?.uploads,
            auto: data?.auto,
            projects: data?.projects,
            names: [],
        }
        for (const x in this.meta.uploads){
            this.meta.names.push(this.meta.uploads[x].name);
          }
          for (const x in this.meta.auto){
            this.meta.names.push(this.meta.auto[x].name);
          }
          for (const x in this.meta.projects){
            this.meta.names.push(this.meta.projects[x].name);
          }
        return meta
    }
    async getNames() {
        this.meta = await this.getMeta();
        return this.meta.names;
    }
    async getSettings(context){
        console.log('GETTING SETTINGS',context)
        // const settings = this.settings = await API.getSettings();
        // console.log(settings)
        return {}
    }
}
