import axios from "axios";
const PORT = 1279;
const endpoint =`http://localhost:${PORT}/icons`;
export const API = {

    resolveEP(endpoint) {
        return `http://localhost:${PORT}/icons/${endpoint}`
    },
    resolveCategoryEndpoint(categoryName) {
        
        return this.resolveEP(`categories/${categoryName}`)
    },
    resolveCollectionEndpoint(collectionName) {
        return this.resolveEP(`collections/${collectionName}`)
    },
    async getCategoryNames() {
        const url = `${endpoint}/meta/categories`
        return [...(await axios.get(url).data)].filter(
            categoryName => categoryName !== 'all'
        )
    },
    async getCollectionNames() {
        let url = `http://localhost:${PORT}/icons/meta/collections`
        return [...(await axios.get(url)).data].filter(
            collectionName => collectionName !== 'test'
        );
    },
    async createCollection(title) {
        const response = await axios.post( this.resolveEP(`/collections/create`),{payload:{name:title}});
        return response;
    },
    async getCollection(title) {
        const response = await axios.get( this.resolveCollectionEndpoint(title) );
        return response
    },
    async getCategory(title) {
        
        const endpoint = this.resolveCategoryEndpoint(title);
        return caches.match(endpoint).then(async cacheRespone => {
            if(cacheRespone){
                let data = await cacheRespone.json();
                console.log('found cache',data)
                return data;
            } else {
                console.log('no cache records... populating from scratch')
                const response = await axios.get( endpoint );
                await caches.open('icons').then(cache => {
                    console.log(cache);
                    cache.add(endpoint);
                    console.log(endpoint);
                })
                return response.data;
            }
        })

    },
    async addToCollection(title, props, original) {
        const { data } = await axios.post( this.resolveCollectionEndpoint(title), { payload: { props, original } })
        return data;
    },
    async getRandom(n=20) {
        const url = this.resolveEP('random');
        const data = await this.cache(url);
        return data;
    },
    async cache(endpoint) {
        return caches.match(endpoint).then(
            async cacheRespone => {
                if(cacheRespone){
                    let data = await cacheRespone.json();
                    console.log('found cache',data)
                    return data;
                } else {
                    console.log('no cache records... populating from scratch')
                    const response = await axios.get( endpoint );
                    caches.open('icons').then(
                        cache => cache.add(endpoint)
                    )
                    return response.data;
                }}
            )
    },
    dropCollection:() => 'no'
}
