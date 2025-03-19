export const IDB = {
    async initializeDB() {
        return new Promise((resolve, reject) => {
            var request = indexedDB.open("icons", 1);
            request.onupgradeneeded = event => this.buildSchema(event)
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = event => reject(event.target.error);
        });
    },

     async addObjectToStore(type,object) {
        const db = await this.initializeDB();
        const validType = ['clicked','copied','edited','moved','added'].includes(type);
        if (validType)
            return new Promise((resolve, reject) => {
                var transaction = db.transaction([type], "readwrite"),
                    objectStore = transaction.objectStore(type),
                    request = objectStore.add(object);
                request.onsuccess = event => resolve(db);
                request.onerror = event => reject(event.target.error);
            });
    },

    async getItemById(db, objectStoreName, itemId) {
        return new Promise((resolve, reject) => {
            var transaction = db.transaction(objectStoreName, "readonly"),
                objectStore = transaction.objectStore(objectStoreName),
                request = objectStore.get(itemId);
            request.onsuccess = event => event.target.result ? resolve(event.target.result) : reject(new Error("errrrm"));
            request.onerror = event => reject(event.target.error);
        });
    },

    async logClickedIcon({name,id,cid}) {
        return new Promise(async (resolve,reject) => {
            const db = await this.initializeDB(), // Initialize the database
                transaction = db.transaction('clicked', 'readwrite'), // Start a transaction with read-write mode
                objectStore = transaction.objectStore('clicked'),
                getRequest = objectStore.get(id); // Attempt to retrieve the item by ID
                getRequest.onerror = (event) => reject(event.target.error); // Reject the Promise if there's an error retrieving the item
                getRequest.onsuccess = function(event) {
                    const item = event.target.result;
                    if (!item) {
                        const newItem = { uuid: uuid(), name, id, cid, count: 1 };
                        const addRequest = objectStore.add(newItem);
                        addRequest.onsuccess = function(event) {
                            console.log('new item added to the object store:', newItem);
                            resolve(newItem); // Resolve the Promise with the newly added item
                        };
                        addRequest.onerror = (event) => reject(event.target.error); // Reject the Promise if there's an error adding the item
                    } else {    // Update the count property of the existing item
                        ++item.count
                        const putRequest = objectStore.put(item);
                        putRequest.onsuccess = (event) => resolve(item); // Resolve the Promise with the updated item
                        putRequest.onerror = (event) => reject(event.target.error); // Reject the Promise if there's an error updating the item
                    }
            }})
    },

    async logCopiedIcon({name,id,cid}) {
        const db = await this.addObjectToStore('copied',{ uuid:uuid(), name, id, cid } )
        return db
    },

    async logEditedIcon({name,id,cid}) {
        const db = await this.addObjectToStore('edited', { uuid:uuid(), name, id, cid } )
        return db
    },

    async logMovedIcon({name,id,cid}) {
        const db = await this.addObjectToStore('moved', { uuid:uuid(), name, id, cid } )
        return db
    },
    
    async logAddedIcon({name,id,cid}) {
        const db = await this.addObjectToStore('added', { uuid:uuid(), name, id, cid } )
        return db
    },

    async getObjectStoreData( objectStoreName ) {
        const db = await this.initializeDB()
        return new Promise((resolve, reject) => {
            var transaction = db.transaction(objectStoreName, "readonly");
            var objectStore = transaction.objectStore(objectStoreName);
            var data = [];
            transaction.oncomplete = () => resolve(data);
            transaction.onerror = (event) => reject(event.target.error);
            var cursorRequest = objectStore.openCursor();
            cursorRequest.onerror = (event) => reject(event.target.error);
            cursorRequest.onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    data.push(cursor.value);
                    cursor.continue();
                }}});
    },

    async getAll(store) {
        const db = await this.initializeDB(); // Initialize the database
        const transaction = db.transaction('clicked', 'readwrite') // Start a transaction with read-write mode
        const objectStore = transaction.objectStore('clicked')
        return objectStore.getAll(); // Attempt to retrieve the item by ID
    },

    buildSchema(event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains("copied")) 
                db.createObjectStore("copied", { keyPath: "id" });            
            if (!db.objectStoreNames.contains('clicked')) 
                db.createObjectStore('clicked',{keyPath:'id'});
            if (!db.objectStoreNames.contains('edited')) 
                db.createObjectStore('edited', {keyPath:'id'});
            if (!db.objectStoreNames.contains('moved')) 
                db.createObjectStore('moved',{keyPath:'id'});
            if(!db.objectStoreNames.contains('added')) 
                db.createObjectStore('added',{keyPath:'id'});
            if (!db.objectStoreName.contains('icons'))
                db.createObjectStore('data',{keyPath:'id'});
            if (!db.objectStoreName.contains('meta'))
                db.createObjectStore('meta',{keyPath: "id"});
    },

    sortByTime(data) {
        return data.sort((a,b) => {
            let aDate = parseInt(a.uuid.split('-')[0],16);
            let bDate = parseInt(b.uuid.split('-')[0],16);
            return aDate - bDate;
        })
    },
    
}
