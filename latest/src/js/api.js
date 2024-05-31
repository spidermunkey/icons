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
        console.log('fetching category names')
        console.log('this endpoint', endpoint)
        const categoriesResponse = await axios.get(`${endpoint}/meta/categories`)
        console.log(categoriesResponse)
        const filterAllCategory = categoryName => categoryName !== 'all';
        const categoryData = [...categoriesResponse.data]
        console.log(categoryData)
        return categoryData.filter(
            filterAllCategory
        )
    },
    async getCollectionNames() {
        const collections = await axios.get(`http://localhost:${PORT}/icons/meta/collections`);
        const collectionData = [...collections.data];
        const filterTestCollection = collectionName => collectionName !== 'test';
        return collectionData.filter(
            filterTestCollection
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
        const response = await axios.get( endpoint )
        return response;
    },
    async addToCollection(title, props, original) {
        const { data } = await axios.post( this.resolveCollectionEndpoint(title), { payload: { props, original } })
        return data;
    },
    async getRandom(n=20) {
        try {
            const { data } = await axios.get( this.resolveEP(`random`))
            return data
        } catch(e) {
            console.log(e)
        }

    },
    dropCollection:() => 'no'
}
