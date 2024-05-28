export class Tracker {

    constructor() {
        
    }
    
    async initializeDB() {
        console.log('initializing db')
        
        return new Promise((resolve, reject) => {

            var request = indexedDB.open("icons", 1);
    
            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                console.log('upgrade needed');
    
                // Create the object store only if it doesn't already exist
                if (!db.objectStoreNames.contains("copied")) {
                    var copiedStoreData = db.createObjectStore("copied", { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains('clicked')) {
                    var clickedStoreData = db.createObjectStore('clicked',{keyPath:'id'});
                }
                if (!db.objectStoreNames.contains('edited')) {
                    var editedStoreData = db.createObjectStore('edited', {keyPath:'id'});
                }
                if (!db.objectStoreNames.contains('moved')) {
                    var movedStoreData = db.createObjectStore('moved',{keyPath:'id'});
                }
                if(!db.objectStoreNames.contains('added')) {
                    var addedStoreData = db.createObjectStore('added',{keyPath:'id'})
                }
                // console.log('object store',objectStore,'created')
            };
    
            request.onsuccess = function(event) {
                var db = event.target.result;
                resolve(db);
            };
    
            request.onerror = function(event) {
                reject(event.target.error);
            };
        });
    }

     async addObjectToStore(type,object) {
        console.log('adding item')
        
        const db = await this.initializeDB();
        const types = ['clicked','copied','edited','moved','added'];

        if (types.includes(type))
            return new Promise((resolve, reject) => {
                var transaction = db.transaction([type], "readwrite");
                var objectStore = transaction.objectStore(type);
                var request = objectStore.add(object);
        
                request.onsuccess = function(event) {
                    resolve(db);
                };
        
                request.onerror = function(event) {
                    reject(event.target.error);
                };
            });
    }

    async getItemById(db, objectStoreName, itemId) {
        return new Promise((resolve, reject) => {
            var transaction = db.transaction(objectStoreName, "readonly");
            var objectStore = transaction.objectStore(objectStoreName);
    
            var request = objectStore.get(itemId);

            request.onsuccess = function(event) {
                var item = event.target.result;
                if (item) {
                    resolve(item);
                } else {
                    reject(new Error("Item not found"));
                }
            };
    
            request.onerror = function(event) {
                reject(event.target.error);
            };
        });
    }

    async logClickedIcon(props) {

        return new Promise(async (resolve,reject) => {

        console.log('logging clicked item', props);
        const { name, id, cid } = props;

        // Initialize the database
        const db = await this.initializeDB();

        // Start a transaction with read-write mode
        const transaction = db.transaction('clicked', 'readwrite');
        const objectStore = transaction.objectStore('clicked');

        // Attempt to retrieve the item by ID
        const getRequest = objectStore.get(id);

        getRequest.onsuccess = function(event) {
        
            const item = event.target.result;

            if (!item) {
                console.log('could not find item by id... creating new copy');

                // Generate a UUID for the new item
                const uid = uuid();

                // Add the new item to the object store
                const newItem = {
                    uuid: uid,
                    name,
                    id,
                    cid,
                    count: 1,
                };
    
                const addRequest = objectStore.add(newItem);

                addRequest.onsuccess = function(event) {
                    console.log('new item added to the object store:', newItem);
                    resolve(newItem); // Resolve the Promise with the newly added item
                };
        
                addRequest.onerror = function(event) {
                    reject(event.target.error); // Reject the Promise if there's an error adding the item
                };
            } else {

                console.log('found item by id... updating count:', item);
        
                // Update the count property of the existing item
                item.count++;
        
                const putRequest = objectStore.put(item);
        
                putRequest.onsuccess = function(event) {
                    console.log('item updated and logged:', item);
                    resolve(item); // Resolve the Promise with the updated item
                };
        
                putRequest.onerror = function(event) {
                    reject(event.target.error); // Reject the Promise if there's an error updating the item
                };
            }
        }

        getRequest.onerror = function(event) {
            reject(event.target.error); // Reject the Promise if there's an error retrieving the item
        };
    })


    }

    async logCopiedIcon(props) {
        const {name,id,cid} = props
        const uid = uuid();
        const db = await this.addObjectToStore('copied',{
            uuid:uid,
            name,
            id,
            cid
        })
        return db
    }

    async logEditedIcon(props) {
        const {name,id,cid} = props
        const uid = uuid();
        const db = await this.addObjectToStore('edited',{
            uuid:uid,
            name,
            id,
            cid
        })
        return db
    }

    async logMovedIcon(props) {
        const {name,id,cid} = props
        const uid = uuid();
        const db = await this.addObjectToStore('moved',{
            uuid:uid,
            name,
            id,
            cid
        })
        return db
    }
    
    async logAddedIcon(props) {
        const {name,id,cid} = props
        const uid = uuid();
        const db = await this.addObjectToStore('added',{
            uuid:uid,
            name,
            id,
            cid
        })
        return db
    }

    async getObjectStoreData( objectStoreName ) {
        const db = await this.initializeDB()
        return new Promise((resolve, reject) => {
            var transaction = db.transaction(objectStoreName, "readonly");
            var objectStore = transaction.objectStore(objectStoreName);
            var data = [];
    
            transaction.oncomplete = function() {
                resolve(data);
            };
    
            transaction.onerror = function(event) {
                reject(event.target.error);
            };
    
            var cursorRequest = objectStore.openCursor();
    
            cursorRequest.onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    data.push(cursor.value);
                    cursor.continue();
                }
            };
    
            cursorRequest.onerror = function(event) {
                reject(event.target.error);
            };
        });
    }

    sortByTime(data) {

        return data.sort((a,b) => {
            let aDate = parseInt(a.uuid.split('-')[0],16);
            let bDate = parseInt(b.uuid.split('-')[0],16);

            return aDate - bDate

        })

    }
    
}