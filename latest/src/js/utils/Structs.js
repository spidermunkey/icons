import Cursor from "./structs/Cursor";

export class Bucket {
    constructor(id,type) {
        this.items = new Map();
        this.identity = 'bucket';
        this.id = id || 'none';
        this.type = type || 'none';
        this.idn = 0;
    }
    get size() {
        return this.items.size;
    }
    copyNode(node) {
        let copy = structuredClone(node)
        return copy;
    }
    copyValues() {
        const copies = Array.from(this.items.entries()).map(copyNode);
        return copies;
    }
    copyAll() {
        const copy = new Map()
        this.useKeys().forEach(key => {
            copy.set(
                key,
                copyNode(this.items.get(key))
            )
        })
        return copy;
    }
    push(key, value, opts = { useRef:true , quiet:true }) {
        let obj = value;
        if (this.type == 'index')
            value.cid = this.idn++;
        if (this.type == 'collection')
            value.id = this.idn++;
        if (!opts.useRef) {
            obj = structuredClone(value);
        }
        if (key && !this.items.has(key)) {
            this.items.set(key,obj);
            if(!opts.quiet)
                console.log(`item ${key} was successfully pushed`);
            return true
        }
        console.log('item was not pushed...',key,'already exists in you bucket');
        return false;
    }
    pluck(key) {
        if (this.items.has(key)) {
            this.items.delete(key);
            console.log(key,'successfully plucked')
            return true;
        } else {
            console.log(key,'its not here')
            return false
        }
    }
    has(key) {
        return this.items.has(key);
    }
    use(key,opts = { useRef:true }) {
        if (!opts.useRef)
            return structuredClone(this.items.get(key));
        return this.items.get(key)
    }
    useValues(map = this.items) {
        const values = Array.from(map.values());
        return values;
    }
    useKeys(map = this.items) {
        const keyset = Array.from(map.keys());
        return keyset;
    }
    spread(map,opts) {
        let duplicates = this.compare(map);
        // prevent duplicates
        if (duplicates.length > 0) {
            console.log(`${duplicates.length} duplicates found in the keyset`);
            console.log('no items were added')
            console.log(duplicates);
            return false;
        }
        map.forEach(value,key => {
            this.push(key,value,{quiet:true,...opts});
        });
        return true;
    }
    compare(map) {
        let keys = this.useKeys(map);
        let keycheck = keys.map(key => {
            if (this.has(key))
                return key;
        });
        return keycheck;
    }
    wipe() {
        this.items = new Map();
    }
}

export class Bench {
    constructor() {
        this.refs = new Map();
    }

    get que() {
        const copies = Array.from(this.refs.entries()).map(index => {
            index = structuredClone(index)
            index['isCopy'] = true;
            return index;
        });
        return copies;
    }
    
    use(id, useCopy = false) {
        if (useCopy)
            return structuredClone(this.refs.get(id))
        return this.refs.get(id);
    }
    useValues() {
        return Array.from(this.refs.values());
    }
    useEntries() {
        return Array.from(this.refs.entries())
    }
    useCopies() {
        const copies = Array.from(this.refs.entries()).map(index => {
            index = structuredClone(index)
            index['isCopy'] = true;
            return index;
        });
        return copies;
    }
    push(key,value) {
        if (!this.refs.has(key)) {
            this.refs.set(key,value);
            return true;
        }
        console.log('this is already in your bench')
        return false;
    }

    pluck(id) {
        if (this.refs.has(id)) {
            this.refs.delete(id);
            return true;
        } else {
            console.log('its not here')
            return false
        }

    }
    get size() {
        return this.refs.size;
    }
    has(id) {
        return this.refs.has(id);
    }
    wipe() {
        this.refs = new Map()
    }
}

export class Collection {
    constructor(id,type) {
        this.bucket = new Bucket(id,type);
        this.items = this.bucket.items;
        this.cursor = new Cursor([]);
        this.indexes = {}
    }
    get size() {
        return this.bucket.size;
    }
    get keys() {
        return this.bucket.useKeys();
    }
    get values() {
        return this.bucket.useValues();
    }
    use(key) {
        return this.bucket.use(key,{useRef:true})
    }
    useCopy(key) {
        return this.bucket.use(key)
    }

    addOne(key,value,opts) {
        let status = this.bucket.push(key,value,opts)
        if (status)
            this.cursor.addOne(key)
        return status;
    }
    addMany(map,opts) {
        let status = this.bucket.spread(map,opts);
        if (status)
            this.cursor.addMany(Array.from(map.keys()))
        return status;
    }
    updateValues(map,opts = {startingIndex:undefined}) {
        this.bucket.wipe();
        this.bucket.spread(map)
        this.cursor.update(this.bucket.useKeys(),opts.startingIndex)
        return this.items;
    }
    updateIndex() {
        
    }
    updateId(id) {
        this.id = id;
    }
    has(key) {
        return this.bucket.has(key)
    }
    remove(key) {
        let status = this.bucket.pluck(key);
        if (status)
            this.cursor.pluck(this.items.useKeys().indexOf(key))
    }
    drop() {
        this.items = new Bucket();
        this.cursor = new Cursor([]);
    }
}