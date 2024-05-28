import { Bucket } from "./Bucket.js";
import { Cursor } from "./Cursor.js";

export default class Collection {
    
    constructor() {
        this.bucket = new Bucket();
        this.cursor = new Cursor([]);
        this.indexes = {}
    }

    get size() {
        return this.items.size;
    }

    get keys() {
        return this.bucket.keys;
    }

    get values() {
        return this.bucket.values;
    }

    get items() { 
        return this.bucket.items;
    }
    
    use(key) {
        return this.bucket.use(key)
    }

    useValue(key) {
        return this.bucket.useValue(key)
    }

    add(key,value) {
        let status = this.bucket.push(key,value)
        if (status === 'success') this.cursor.addOne(key)
        return status;
    }

    spread(map) {
        let status = this.bucket.spread(map);
        if (status) this.cursor.spread(Array.from(map.keys()))
        return status;
    }

    has(key) {
        return this.bucket.has(key);
    }

    remove(key) {
        let status = this.bucket.pluck(key);
        if (status) this.cursor.pluck(this.items.useKeys().indexOf(key));
    }

    drop() {
        this.items = new Bucket();
        this.cursor = new Cursor([]);
    }
}