import { API } from './api.js';
import { Icon } from './components/Icon.js';
import { Collection, Pocket } from './components/Collection.js';
export class SvgModel extends EventEmitter {
    constructor() {
        super();
        this.state = {}
        this.pocket = new Pocket({ meta: { name: 'bench',size:0 }})
    }
    // commands
    async search(query){
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
                return {
                    icons,
                    meta,
                    name:meta.name,
                    size:meta.size,
                    pages:Math.floor(meta.size/limit),
                    currentPage: page
                }
        } catch (error){
            console.log('error fetching collection data',name)
            console.log('should probably flag for cleanup')
            throw new Error('error loading collection...')
        }

    }
    async getCollection(name, filters = {subtypes:[],sub_collections:[]}) {
        const result = await API.getCollection(name,filters)
        const collection = new Collection(result)
        console.log(collection)
        return collection
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
