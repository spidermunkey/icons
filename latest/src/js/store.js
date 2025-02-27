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
        return API.search(query)
    }

    async saveCollectionColorset(cid,colorset){
        console.log('saving collection colorset',cid)
        return API.saveCollectionColorset(cid,colorset)
    }
    async saveIconColorset(cid,colorset){
        console.log('saving icon colorset')
        return API.saveIconColorset(cid,colorset)
    }

    async deleteIconColorset(id,collection,csid){
        return API.deleteIconColor(id,collection,csid)
    }
    async setDefaultIconColor(id,collection,csid){
        console.log('applying icon colorset default')
        return API.setDefaultIconColor(id,collection,csid)
    }
    async applyDefaultCollectionColorset(cid,colorset){
        console.log('applying default collection colorset')
        return API.setDefaultCollectionColor(cid,colorset);
    }
    async clearCollectionDefaultColor(collection){
        console.log('clearing collection default')
        return API.clearCollectionDefaultColor(collection)
    }
    async deleteCollectionColor(cid,csid){
        return API.removeCollectionColor(cid,csid)
    }

    async saveIconPreset(id,collection,setting){
        return API.saveIconPreset(id,collection,setting);
    }
    async deleteIconPreset(id,collection,pid){
        return API.deleteIconPreset(id,collection,pid);
    }
    async updatePresetName(props){
        return API.updatePresetName(props)
    }
    async setCollectionDefault(collection,setting){
        return API.setCollectionDefault(collection,setting);
    }
    async clearCollectionDefault(cid){
        return API.clearCollectionDefault(cid)
    }
    async setDefaultIconSetting(id,collection,pid){
        return API.setDefaultIconSetting(id,collection,pid)
    }
    async clearDefaultSetting(id,collection){
        return API.clearDefaultSetting(id,collection)
    }
    async saveCollectionPreset(cid,setting){
        return API.saveCollectionPreset(cid,setting);
    }
    async deleteCollectionPreset(cid,pid){
        return API.removeCollectionPreset(cid,pid)
    }
    async dropCollection(collectionName){
        return API.dropCollection(collectionName);
    }

    async addToCollection({ destination, icon }) {
        const id = uuid()
        let collection = this.collections[destination]
        if (!collection) collection = new Collection(destination)
        else if (collection[id] !== undefined) return console.warn('this id already exists')
        let copy = icon.save()

        copy.collection = destination
        copy.trace = icon.id
        copy.id = id
        collection[id] = icon
        console.log('optimistic update successful... asynchronously adding to database now')
        const response = await API.addToCollection( destination, copy.props )
        console.log('a2c response...')
        return response;
    }

    async getCollectionNames() {
        return API.getCollectionNames(synced);
    }

    async populateAllIcons() {
        const response = (await API.getCollection('all'))[0];
        return response
    }
    async getIcon(id){
        return API.getIcon(id);
    }
    createCollection( data ) {
        return new Collection(data)
    }
    async saveCollection(name,icons){
        return API.createCollection(name,icons)
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
            this.collections[name] = new Collection(collection,filters)
            this.notify('collection retreived')
            return this.collections[name]
        }
        const collection = (await API.getCollection(name,filters,useFilters))[0];
        this.collections[name] = new Collection(collection,filters);
        this.notify('collection retreived')
        console.log('COLLECTION RETRIEVED',collection)
        return this.collections[name];
    }
    async populateCollectionData() {
        const userCollections = await this.getCollectionNames();
        for (const name of userCollections){
            const response = await this.getCollection(name);
            this.collections[name] = new Collection(response);
        }
    }
    async getMeta() {
        const data = await API.getCollectionData();
        let meta = {
            uploads: data?.uploads,
            auto: data?.auto,
            projects: data?.projects,
            names: [],
        }
        for (const x in meta.uploads){
            meta.names.push(meta.uploads[x].name);
          }
          for (const x in meta.auto){
            meta.names.push(meta.auto[x].name);
          }
          for (const x in meta.projects){
            meta.names.push(meta.projects[x].name);
          }
        return meta
    }
    async getNames() {
        const meta = await this.getMeta();
        return meta.names;
    }
}
