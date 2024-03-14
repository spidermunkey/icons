import axios from "axios";
import R from 'ramda'
const PORT = 1279;
// FETCH

function resolveEP(ep) {
    return `http://localhost:${PORT}/icons/${ep}`
}

function resolveCategoryEndpoint(categoryName) {
    return resolveEP(`categories/${categoryName}`)
}

function resolveCollectionEndpoint(collectionName) {
    return resolveEP(`collections/${collectionName}`)
}

async function getCategoryNames() {
    const categories = await axios.get(`http://localhost:${PORT}/icons/meta/categories`)
    // console.log(categories.data)
    return [...categories.data].filter(val => val !== 'all')
}

async function getCollectionNames() {
    const collections = await axios.get(`http://localhost:${PORT}/icons/meta/collections`)
    console.log(collections.data)
    return [...collections.data].filter(name => name !== 'test');
}

async function createCollection(title) {
    const response = await axios.post( resolveEP(`/collections/create`),{payload:{name:title}});
    return response;
}

async function getCollection(title) {
    const response = await axios.get( resolveCollectionEndpoint(`${title}`) );
    return response
}

async function getCategory(title) {
    const response = await axios.get( resolveCategoryEndpoint( `${title}`) );
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