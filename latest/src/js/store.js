import { API } from './api.js';
import { Icon } from './components/Icon.js';
import { Collection } from './components/Collection.js';
export class SvgModel extends EventEmitter {
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
        this.status = null;
        this.ready = false;
        this.statusBroker = new Task(API.getLocalStatus)
        this.connectionBroker = new Task(API.getConnection)
        this.data = {
            connection: {
                // localHost: new Task(API.getServerConnection),
                internet: new Task(API.getConnection),
            },
            local: {
                downloads: {
                    collection_names: new Task(API.getCollectionNames),
                    collection_data: new Task(API.getDownloads.bind(API,20)),
                },
                upload: {
                    collection_names: new Task(API.getCollectionNames.bind(API,true)),
                    collection_data: new Task(API.getUploads.bind(API,20)),
                },
                meta: {
                    // totalIcons: new Task(API.getLocalSize)
                    // totalCollections: new Task(API.getTotalCollectionSize)
                    // lastSync: new Task(API.getLastSync)
                    state: new Task(API.getStatus.bind(API))
                }
            },
            remote: {
                synced: {
                    collection_names: new Task(API.getCollectionNames),
                    collection_data: new Task(API.getCollectionData)
                },
                user: {
                    // collection_names: new Task(API.getUserCollectionNames),
                    // collection_data: new Task(API.getUserCollections)
                },
                meta: {
                    // totalIcons: new Task(API.getRemoteSize)
                    // totalCollections: new Task(API.getRemoteCollectionSize)
                    // state: new Task(API.getRemoteStatus)
                }
            }
        }
    }

    // commands
    async search(query){
        // should parsed for sorting
            // by name
            // by created on
            // by subtype
            // by default

        return API.search(query)
    }
    async saveCollectionColorset(cid,colorset){
        return API.saveCollectionColorset(cid,colorset)
    }
    async saveIconColorset(cid,colorset){
        return API.saveIconColorset(cid,colorset)
    }
    async deleteIconColorset(id,collection,csid){
        return API.deleteIconColor(id,collection,csid)
    }
    async setDefaultIconColor(id,collection,csid){
        return API.setDefaultIconColor(id,collection,csid)
    }
    async applyDefaultCollectionColorset(cid,colorset){
        return API.setDefaultCollectionColor(cid,colorset);
    }
    async clearCollectionDefaultColor(collection){
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
    async dropCollection(collectionId){
        return API.dropCollection(collectionId);
    }
    async addToCollection({ destination, icons }) {
        const response = await API.addToCollection( destination, icons )
        return response;
    }
    // queries
    async getCollectionNames(collection_type) {
        return API.getCollectionNames(collection_type);
    }
    async populateAllIcons() {
        const response = (await API.getCollection('all'))[0];
        return response
    }
    async getIcon(id){
        return API.getIcon(id);
    }
    async saveCollection(name,icons){
        const cid = uuid();
        const destination = name;
        const renamed = icons.map(icon => {
            const copy = icon.save();
            copy.cid = cid;
            copy.collection = destination;
            return copy
        })
        return API.createCollection({cid,name,icons:renamed})
    }
    async getCollectionSample(name,page=1,limit=50){
        try {
            const result = await API.getPage(name,page,limit);
            const validIcons = []
            console.log(result,name)
            const {icons,meta} = result;
            icons.forEach( icon => {
                const i = new Icon(icon);
                if (i.isValid) validIcons.push(i)
                // else console.warn('skipping',i)
            })
            const sampleCollection = new Collection({icons,meta})
                // lazy decorator
                sampleCollection.size = meta.size,
                sampleCollection.pages = Math.floor(meta.size/limit),
                sampleCollection.currentPage = page,
                sampleCollection.getPage =(num) => {
                    return this.getCollectionSample(meta.name,num,limit)
                }
                return sampleCollection
        } catch (error){
            console.log('error fetching collection data',name)
            console.log('should probably flag for cleanup')
            throw new Error('error loading collection...')
        }

    }
    async getCollection(name, filters = {subtypes:[],sub_collections:[]}) {
        const result = await API.getCollection(name,filters)
        const collection = new Collection(result)
        return collection
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
            locals: data?.locals,
            projects: data?.projects,
            index: data?.index,
            names: [],
        }
        for (const x in meta.locals){
            meta.names.push(meta.locals[x].name);
          }
          for (const x in meta.projects){
            meta.names.push(meta.projects[x].name);
          }
          for (const x in meta.index){
            meta.names.push(meta.index[x].name);
          }
        return meta
    }
    async getNames() {
        const meta = await this.getMeta();
        console.log(meta)
        console.log(meta.names)
        return meta.names;
    }
    async getStatus(){
        return API.getStatus();
    }

}
