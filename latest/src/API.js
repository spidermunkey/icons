import axios from "axios";
import R from 'ramda'

const PORT = 1279;
const endpoint =`http://localhost:${PORT}/icons`;
// FETCH

class api {
    constructor() {
        this.endpoint =`http://localhost:${PORT}/icons`;
        this.PORT = 1279;

    }

    async getCategoryNames() {
        const categoriesResponse = await axios.get(`${endpoint}/meta/categories`)
        const filterAllCategory = val => val !== 'all';
        const categoryData = [...categoriesResponse.data]
        // log(categoryData)
        return categoryData.filter(
            filterAllCategory
        )
    }

    async getCollectionNames() {
        const collections = await axios.get(`http://localhost:${PORT}/icons/meta/collections`)
        console.log(collections.data)
        return [...collections.data].filter(name => name !== 'test');
    }

    async createCollection(title) {
        const response = await axios.post( resolveEP(`/collections/create`),{payload:{name:title}});
        return response;
    }
    
    async getCollection(title) {
        const response = await axios.get( resolveCollectionEndpoint(`${title}`) );
        return response
    }
    
    async getCategory(title) {

        console.log(title)
        const endpoint = resolveCategoryEndpoint(title);
        console.log(endpoint)

        const response = await axios.get( endpoint )
        console.log(response)
        console.log(responseOk)
        if(responseOk(response))
            return response;
        else console.error('somthing went wrong fetching category: ',title)
        console.log('endpoint: ',endpoint )
        return response;
    }
    
    async addToCollection(title, props, original) {
        const { data } = await axios.post( resolveCollectionEndpoint(title), { payload: {
            props,
            original
        }
    })
        // log(data)
    }


    static resolveEP = resolveEP;
    static resolveCategoryEndpoint = resolveCategoryEndpoint;
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

async function getCategoryNames() {
    console.log('fetching category names')
    console.log('this endpoint', endpoint)
    const categoriesResponse = await axios.get(`${endpoint}/meta/categories`)
    console.log(categoriesResponse)
    const filterAllCategory = categoryName => categoryName !== 'all';
    const categoryData = [...categoriesResponse.data]
    console.log(categoryData)
    // log(categoryData)
    return categoryData.filter(
        filterAllCategory
    )
}

async function getCollectionNames() {
    const collections = await axios.get(`http://localhost:${PORT}/icons/meta/collections`);
    const collectionData = [...collections.data];
    const filterTestCollection = collectionName => collectionName !== 'test';
    // log(collections.data)
    return collectionData.filter(
        filterTestCollection
    );
}

async function createCollection(title) {
    const response = await axios.post( resolveEP(`/collections/create`),{payload:{name:title}});
    return response;
}

async function getCollection(title) {
    const response = await axios.get( resolveCollectionEndpoint(title) );
    return response
}

async function getCategory(title) {
    const endpoint = resolveCategoryEndpoint(title);
    console.log(endpoint)
    const response = await axios.get( endpoint )
        return response;
}

async function addToCollection(title, props, original) {
    const { data } = await axios.post( resolveCollectionEndpoint(title), { payload: {
        props,
        original
    }
})
    console.log(data)
}

const dropCollection = () => 'no'

export default API = {
    getCollectionNames,
    getCategoryNames,
    createCollection,
    addToCollection,
    getCollection,
    getCategory,
}