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

    get values() {
      return this.useValues();
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
        console.warn('this is already in your bench')
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
