import axios from "axios";
const PORT = 1279;
const endpoint = `http://localhost:${PORT}/icons`;
export const API = {
    async fetch(url,method = 'get'){
        try {
            const res = await axios[method](url)
            return res.data
        } catch (e){
            console.warn('[error]',`[url] : ${url}`,e)
            return false
        }
    },
    async post(url,payload,log = false){
        try {
            const response = await axios.post(url, { payload: payload})
            if (log) console.dir('[[ RESPONSE -- POST ]]',response)
            return response.data
        } catch(e){
            console.warn('[ERROR -- POST]',`[url] : ${url}`,e)
            return false
        }
    },
    async put(url,payload,log = false){
        try {
            const response = await axios.put(url, { payload: payload})
            if (log) console.dir('[[ RESPONSE -- PUT ]]',response)
            return response.data
        } catch(e){
            console.warn('[ERROR -- PUT]',`[url] : ${url}`,e)
            return false
        }
    },
    async delete(url,log=false){
        try {
            const response = await axios.delete(url)
            if (log) console.dir('[[ RESPONSE -- DELETE ]]',response)
            return response.data
        } catch(e){
            console.warn('[ERROR -- DELETE]',`[url] : ${url}`,e)
            return false
        }
    },
    async requestSync(data){
        return this.post(`${endpoint}/collections/sync`, {  cid: data.cid } )
    },
    async requestIgnore(data){
        return this.post(`${endpoint}/collections/ignore`, {  cid: data.cid } )
    },
    async getStatus(){
        const response = await this.fetch(`${endpoint}/local/status`)
        if (response) response.connection = await this.ping('google.com')
        return response
    },
    async getDownloads(n){
        return this.fetch(`${endpoint}/local/downloads?n=${n}`)
    },
    async getIcon(id){
        return this.fetch(`${endpoint}/all/${id}`)
    },
    async search(searchQuery){
        return this.post(`http://localhost:${1279}/icons/all`, { query: searchQuery })
    },
    async savePreset(preset){
        return this.post(`${endpoint}/settings`, { preset:preset })
    },
    async saveIconPreset(id,collection,setting){
        return this.post(`${endpoint}/all/settings/${id}`, { id, collection, setting })
    },
    async deleteIconPreset(id,collection,pid){
        return this.delete(`${endpoint}/all/settings/${id}?pid=${encodeURIComponent(pid)}&collection=${collection}`)
    },
    async setDefaultIconSetting(id,collection,pid){
        return this.put(`${endpoint}/all/settings/${id}`,{id,collection,pid})
    },
    async setCollectionDefault(collection,setting){
        return this.put(`${endpoint}/collections/settings`,{collection,preset:setting})
    },
    async clearCollectionDefault(collection){
        return this.put(`${endpoint}/collections/settings/${collection}`)
    },
    async clearDefaultSetting(id,collection){
        return this.put(`${endpoint}/all/settings/${id}`,{id,collection,pid:0})
    },
    async saveCollectionPreset(cid,setting){
        return this.post(`${endpoint}/collections/settings`, { cid, setting } )
    },
    async removeCollectionPreset(cid,pid){
        return this.delete(`${endpoint}/collections/settings?pid=${encodeURIComponent(pid)}&cid=${encodeURIComponent(cid)}`)
    },
    async updatePresetName(props){
        return this.put(`${endpoint}/all/settings/edit`,props)
    },
    async getUploads(){
        return this.fetch(`${endpoint}/collections/info?type=collection`)
    },
    async getCollectionNames(synced = false) {
        return this.fetch(`${endpoint}/collections/info/names?synced=${synced}`)
    },
    async getCollection(name,filters = {subtypes:[],sub_collections:[]},useFilters=false) {
        let subTypesQuery = encodeURIComponent(filters.subtypes.join(','))
        let subCollectionsQuery = encodeURIComponent(filters.sub_collections.join(','))
        return this.fetch(`${endpoint}/collections/${name}?filter=${useFilters}&st=${subTypesQuery}&sc=${subCollectionsQuery}`)
    },
    async getPage(name,page,limit){
        const res = await this.fetch(`${endpoint}/collections/${name}?filter=false&page=${page}&limit=${limit}`)
        return res;
    },
    async getCollectionData() {
        return this.fetch(`${endpoint}/collections/info?type=default`)
    },
    async createCollection(name,icons) {
        return this.post(`${endpoint}/collections/create` ,{ props: { name, icons }})
    },
    async addToCollection(name,props) {
        return this.post( `${endpoint}/collections/${name}`, { ...props } )
    },
    async dropCollection(name) {
        return axios.delete(`${endpoint}/collections/${name}`);
    },
    async ping(){
        try {
            (await fetch('https://google.com', { method: 'GET', mode: 'no-cors',}))
            return true;
        } catch(e) {
            return false;
        }
    },
}
