export default function Bucket() {
    this.refs = new Map();
    Object.defineProperty(this, "que", {
        get: function() {
            const copies = Array.from(this.refs.entries()).map(index => {
                index = deepClone(index)
                index['isCopy'] = true;
                return index;
            });
            return copies;
        },
    })

    this.push = (obj) => {
        if (obj.main_id && !this.refs.has(obj.main_id)) {
            this.refs.set(obj.main_id,obj);
            return true;
        }
        console.log('this is already in your bench')
        return false;
    }

    this.pluck = (id) => {
        if (this.refs.has(id)) {
            this.refs.delete(id);
            return true;
        } else {
            console.log('its not here')
            return false
        }

    }
    this.has = (id) => this.refs.has(id);
    this.wipe = () => this.refs = new Map()
}

function deepClone(obj, hash = new WeakMap()) {
    if (Object(obj) !== obj) return obj; // primitives
    if (hash.has(obj)) return hash.get(obj); // cyclic reference
    const result = obj instanceof Set ? new Set(obj) // See note about this!
                 : obj instanceof Map ? new Map(Array.from(obj, ([key, val]) => 
                                        [key, deepClone(val, hash)])) 
                 : obj instanceof Date ? new Date(obj)
                 : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
                 // ... add here any specific treatment for other classes ...
                 // and finally a catch-all:
                 : obj.constructor ? new obj.constructor() 
                 : Object.create(null);
    hash.set(obj, result);
    return Object.assign(result, ...Object.keys(obj).map(
        key => ({ [key]: deepClone(obj[key], hash) }) ));
}