/*
    Holds references, trying to be fancy creating my own datastructure

*/ 
export class Bucket {

    constructor() {
        this.items = new Map();
        this.identity = 'bucket';
        this.idn = 0;
    }

    get size() {
        return this.items.size;
    }
    get keys() {
        return Array.from(this.items.keys());
    }
    get values() {
        return Array.from(this.items.values());
    }
    get copies() {
        return Array.from(this.items.values()).map(structuredClone);
    }

    push( key, value ) {
        
        if (!key) return `item not pushed bucket... invalid key`;
        if (!value) return `item not pushed to bucket... invalid value`;
        if (this.items.has(key)) return `item not pushed to bucket... duplicate key`;

        this.items.set(key,value);
        return 'success';
    }

    pluck(key) {
        return this.items.delete(key);
    }

    has(key) {
        return this.items.has(key);
    }

    use(key) {
        return this.items.get(key);
    }

    useValue(key) {
        return structuredClone(this.items.get(key))
    }

    spread(map) {

        let duplicates = this.compare(map);

        if (duplicates.length > 0) {
            console.error(`${duplicates.length} duplicates found in the keyset. No items were added`,duplicates);
            return duplicates;
        }

        map.forEach((value,key) => this.push(key,value));
        return this;
    }

    compare(map) {
        return Array.from(map.keys()).filter(this.has);
    }

    wipe() {
        this.items = new Map();
    }
    
}