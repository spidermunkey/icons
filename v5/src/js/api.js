import axios from "axios";
const PORT = 1279;
const endpoint =`http://localhost:${PORT}/icons`;
export const API = {

    async getCategoryNames() {
        const url = `${endpoint}/meta/categories`
        return [...(await axios.get(url).data)].filter(
            categoryName => categoryName !== 'all'
        )
    },
    
    async getCollectionNames() {
        let url = `http://localhost:${PORT}/icons/meta/collections`
        const res = await axios.get(url)
        console.log(res)
        const names = res.data.map(
            collection => collection != null ? collection.name : null
        )
        return names;
    },
    async getCollectionData() {
        let url = `http://localhost:${PORT}/icons/meta/collections`
        const collections = (await axios.get(url)).data.filter(
            collectionName => collectionName != null && collectionName.name !== '{{meta}}' && collectionName != null
        )
        console.log(collections)
        return collections;
    },
    async createCollection(title) {
        const response = await axios.post( resolveEP(`/collections/create`),{payload:{name:title}});
        return response;
    },
    async getCollection(title) {
        const response = await axios.get( resolveCollectionEndpoint(title) );
        console.log(response.data)
        return response.data
    },
    async getCategory(title) {
        const endpoint = resolveCategoryEndpoint(title);
        console.log('no cache records... populating from scratch')
        const response = await axios.get( endpoint );
        console.log(response.data)
        return response.data;
    },
    async addFavorite(props) {

    },
    async addToCollection(title, props) {
        const { data } = await axios.post( resolveEP(`collections`), { payload: { 
            collection: title,
            props,
         } })
        return data;
    },
    async getRandom(n=20,collection="all") {
        const url = resolveEP(`random/${collection}?n=${n}`);
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

function resolveEP(endpoint) {
    return `http://localhost:${PORT}/icons/${endpoint}`
}

function resolveCategoryEndpoint(categoryName) {
    return resolveEP(`categories/${categoryName}`)
}

function resolveCollectionEndpoint(collectionName) {
    return resolveEP(`collections/${collectionName}`)
}
