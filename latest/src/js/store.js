import { API } from './api.js';
import { Collection, Pocket } from './components/Collection.js';
export class SvgModel extends EventEmitter {
    constructor() {
        super();
        this.state = {}
        this.pocket = new Pocket({ meta: { name: 'bench', size:0, cid:'pocket' }})
        this.updateNeeded = true;
        this.info = {};
        this.on('change',() => this.updateNeeded = true)
    }
    // commands
    async search(query){
        return API.search(query)
    }

    async getPocket(){
        return API.getPocket();
    }
    async updatePocket(icon){
        return API.updatePocket(icon)
    }
    async clearPocket(){
        return API.clearPocket();
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
    
    async getCollectionSample(cid,page=1,limit=50){
        try {
            console.trace(cid)
            const result = await API.getPage(cid,page,limit);
            const {icons,meta} = result;
            console.log(result)
            return {
                icons,
                meta,
                name:meta.name,
                size:meta.size,
                pages:Math.floor(meta.size/limit),
                currentPage: page,
            }
        } catch (error){
            console.log('error fetching collection data',error)
            return {}
        }

    }
    async getCollection(cid, filters = {subtypes:[],sub_collections:[]}) {
        const result = await API.getCollection(cid,filters)
        const collection = new Collection(result)
        console.log(collection)
        return collection
    }

    async getMeta(){
        let data;
        if (this.updateNeeded) {
            data = await API.getCollectionData();
            this.info = data;
            this.updateNeeded = false;
        } else {
            data = this.info;
        }
        const {locals,projects,index} = data
        return {
            locals,
            projects,
            index,
        }

    }

    async getStatus(){
        return API.getStatus();
    }
}
