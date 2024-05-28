import axios from "axios";
import R from 'ramda'
const PORT = 1279;
// FETCH

async function ping() {
    try {
        console.log('pinging server')
        axios.get('http://localhost/1279')
    }catch(e) {
        console.log('connection failed')
        return null;
    }
}

function resolveEP(ep) {
    return `http://localhost:${PORT}/icons/${ep}`
}

function resolveCategoryEndpoint(categoryName) {
    return resolveEP(`categories/${categoryName}`)
}

function resolveCollectionEndpoint(collectionName) {
    return resolveEP(`collections/${collectionName}`)
}

async function getCategoryNames() 
{
    try {
        const collections = await axios.get(`http://localhost:${PORT}/icons/meta/collections`)
        console.log(collections.data)
        return [...collections.data].filter(name => name !== 'test');
    } catch(e) {
        console.log('error fetching category names')
        console.log('REQUESTING OFFLINE SERVICE');
        return []
    }
}

async function getCollectionNames() {
    try {

    const collections = await axios.get(`http://localhost:${PORT}/icons/meta/collections`)
    console.log(collections.data)
    return [...collections.data].filter(name => name !== 'test');

    }
        catch(e) {
            console.log('error fetching collection names')
            console.log('REQUESTING OFFLINE SERVICE');
            return []
        }
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
    try {
        const response = await axios.get( resolveCategoryEndpoint( `${title}`) );
        return response;
    } catch (e) {
        console.log('error fetching category data',e);
        console.log('requesting offline service...')
            return []
    }

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

const api = {
    ping,
    getCollectionNames,
    getCategoryNames,
    createCollection,
    addToCollection,
    getCollection,
    getCategory,
}

export default api