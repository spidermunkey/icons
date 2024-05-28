export class Node {
    constructor(val) {
        this.value = val;
        this.next = null;
        this.prev = null;
    }
}

class Stack {
    constructor() {
        this.items = [];
    }

    push(value) {
        this.items.push(value);
    }
    pop() {
        return this.items.pop();
    }
    isEmpty() {
        return this.items.length === 0;
    }
    toArray() {
        return this.items.slice();
    }
}

export class Cursor {
    constructor(array, opts = { startingIndex: 1, showLogs: false }) {
        // if type array is not passed throw error
        this.identity = 'cursor'
        this.showLogs = opts.showLogs;
        this.cursor = this.validateCursor(array,opts.startingIndex);
        if (this.cursor)
            this.items = ["first",...array,"last"];
        else {
            this.items = ["first","last"]
        }
    }

    get first() {
        return this.items[1]
    }
    get last() {
        return this.items[this.items.length - 2]
    }
    get next() {
        return this.items[this.cursor + 1]
    }
    get prev() {
        return this.items[this.cursor - 1]
    }
    get current() {
        return this.items[this.cursor]
    }
    get all() {
        return this.items.filter(index => index !== 'first' && index !== 'last');
    }
    get size() {
        return this.items.length - 2;
    }
    get status() {
        if (this.size === 0)
            return 'empty'
        else
            return this.current;
    }
    skipToIndex(index) {
        if (isNaN(index)) {
            if (this.showLogs)
             console.log(`\nskip function was expecting a number... you passed ${index}`)
            return NaN;
        }
        if (index > this.size || index < 0) {
            if (this.showLogs)
             console.log(`\nuh oh....index of ${index} doesn\'t exist\ntry a number from 0 to ${this.size}\n`);
            return undefined;
        }
        if (this.showLogs)
         console.log(`\nskipping to the ${nthSuffix(index)} [zero]index`);
        this.cursor = index + 1;
        return this.items[index + 1];
    }
    skipToNext() {
        console.log(this.next)
        if (this.next == "last") {
            // if (this.showLogs)
            //  console.log('\nskipping to first');
            this.cursor = 1;
            return this.first;
        }
        this.cursor += 1;
        return this.current;
    }
    skipToPrev() {
        if (this.prev == "first") {
            if (this.showLogs)
             console.log('\nskipping to last');
            this.cursor = this.size;
            return this.last;
        }
        this.cursor -=1;
        return this.current;
    }
    skipToLast() {
        this.skipToIndex(this.size);
    }
    skipToFirst() {
        this.skipToIndex(0);
    }
    pluck(index) {
        if (this.showLogs)
            console.log(`removing the ${this.nthSuffix(index + 1)} index\n`);
        this.items.splice(index + 1,1);
    }
    push(element) {
        if (this.showLogs)
         console.log(`\nadding ${element} to the list`);
        this.items[this.items.length - 1] = element;
        this.items.push('last');
        if (this.showLogs)
         console.log(`list updated... we\'re still on the ${this.nthSuffix(this.cursor)} index\n`);
    }
    update(elements,startingIndex = 1) {
        let index = this.validateCursor(elements,startingIndex);
        if (index) {
            this.cursor = index;
            this.items = ["first",...elements,"last"];
        }
    }
    spread(elements) {
        this.items.pop();
        this.items = [...this.items,...elements];
        this.items.push('last');
        return this.items;
    }
    nthSuffix(num) {
        if (!isNaN(num)) {
            let n = num;
            let suff;

            if (num > 20) {
                // convert to string
                let d = num.toString()
                // grab the last digit
                n = d[d.length - 1];
            }

            n == 1 ? suff = 'st'
            : n == 2 ? suff = 'nd'
            : n == 3 ? suff = 'rd'
            : suff = 'th'

            return num.toString() + suff;
        }
        return `this function expects numbers`
    }
    validateCursor(array,startingIndex) {
        let cursor;
        if(!Array.isArray(array)) {
            if (this.showLogs)
             console.log(`Cursor instance canceled... was expecting an array you passed ${array}`);
            return false;
        } else if (isNaN(startingIndex)) {
            if (this.showLogs)
             console.log(`Cursor instance canceled.... expecting a number for startingIndex you passed ${startingIndex}`);
            return false
        }

        if (startingIndex !== 0 && startingIndex < array.length - 1 ) {
            cursor = startingIndex;
        }
        if (array.length < 2 && array.length > 0) {
            cursor = 1;
        }
        if (array.length === 0)
            cursor = 1;
        return cursor; 
    }
}

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
    use(key) {
        return this.bucket.use(key,{useRef:true})
    }
    useCopy(key) {
        return this.bucket.use(key)
    }
    useValues() {
        return this.bucket.useValues();
    }
    useKeys() {
        return this.bucket.useKeys();
    }
    addOne(key,value,opts) {
        let status = this.bucket.push(key,value,opts)
        if (status)
            this.cursor.push(key)
        return status;
    }
    addMany(map,opts) {
        let status = this.bucket.spread(map,opts);
        if (status)
            this.cursor.spread(Array.from(map.keys()))
        return status;
    }
    updateValues(map,opts = {startingIndex:null}) {
        this.bucket.wipe();
        this.bucket.spread(map)
        if (opts.startingIndex)
            this.cursor.update(this.bucket.useKeys(),opts.startingIndex)
        else
            this.cursor = new Cursor(items.useKeys());
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

export class Model {
    constructor() {
        this.duplicates = {};
        this.dupeCount = 0;
        this.cursor = new Cursor([]);
        this.all = new Collection('all','collection');

        this.categorySet = new Set();
        this.categories = {};

        this.collectionSet = new Set(['Favorites','Recently Added']),
        this.collections = {
            favorites: new Collection('Favorites','collection'),
            recentlyAdded: new Collection('Recently Added','collection'),
        };
    }
    addOne(key,data,opts) {

        let category = data.category;

        if (category && !this.categorySet.has(category)){
            let categoryName = category
            // keeping track of different categories
            this.categorySet.add(categoryName);
            this.categories[categoryName] = new Collection(categoryName,'index');
        }

        if (!this.all.has(key)){
            this.all.addOne(key,data);
            if (category) {
                // data.cid = this.categories[category].index++;
                this.categories[category].addOne(key,data);
        }
        } else if (this.all.has(key)) { // handling duplicate names
            // if known duplicate doesn't exist create an object for it
            if (!this.duplicates.hasOwnProperty(key)) {
                this.duplicates[key] = {
                    count: 1,
                    dupes: new Map(),
                }
            }

            // then the new element with a modified name
            let newKey = `${key}--${category || Model.createUID()}`;
            // add a property showing that the name has been modified
            data.rebased = newKey;

            // proceed mapping operations
            this.duplicates[key].dupes.set(newKey,data);
            this.all.addOne(newKey,data,{...opts});
            if (category) {
                // data.cid = this.categories[category].index++;
                this.categories[category].addOne(newKey,data);
            }

            // update count
            this.duplicates[key].count = this.duplicates[key].count + 1;
            this.dupeCount++;
        }
        // data.id = this.idn++;
    }
    addToCollection(name, data) {
        if (this.collections[name].has(name))
            return alert(`${name} already exist in the collection and was not added`)

        this.collections[name].addOne(name,data);
    }
    // Populating Collections with deep copies
    createCollection(name) {
        if (this.collectionSet.has(name))
            return alert(`collection ${name} already exist choose a different name`);

        this.collectionSet.add(name);
        this.collections[name] = new Collection(name,'collection');
        this.collections[name].collectionIDN = 0;
    }
    createIndex(name) {
        return new Collection(name,'index');
    }
    removeCollection(name) {
        if (name == 'Favorites' || name == 'Recently Added')
            return alert('cannot remove this collection')
        if (!this.collectionSet.has(name))
            return alert(`the collection ${name} does not exist`)
        this.collectionSet.delete(name);
        delete this.collections[name];
    }

    // removeFromCollection(name, collection) {
    //     this.collections[collection].remove(name);
    // }

    static createUID() {
        const uid = () => {
            let timmy = Date.now().toString(36).toLocaleLowerCase();
            let randy = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
            randy = randy.toString(36).slice(0, 12).padStart(12, '0').toLocaleUpperCase();
            return ''.concat(timmy, '-', randy);
        }
    }
}

export class IconNode {
    constructor(props) {
        this.name = props.name;
        this.category = props.category;
        this.markup = props.markup;
        this.isFavorite = false;
        this.knownCollections = [];
        this.id = undefined;
        this.cid = null;
        this.values = this.parseElement(this.createWrapper(props));
        this.versions = new Stack();
        this.observer = structuredClone({
            ...props,
            isFavorite: this.isFavorite,
            knownCollections: this.knownCollections,
            id: this.id,
            cid: this.cid,
            values: this.values,
            versions: this.versions,
        })
    }
    get props() {
        return this.observer
    }
    set props(value) {
        this.observer = {
            ...this.observer,
            ...value,
        }
    }
    get showcase(){
        let element = this.createWrapper();
        element.dataset.role = 'svg_wrapper';
        element.classList.add('svg-wrapper');
        return element
    }
    get updatedShowcase() {
        let element = this.createWrapper(this.observer,{useValues:true});
        element.dataset.role = 'svg_wrapper';
        element.classList.add('svg-wrapper');
        return element
    }
    get benchPreview(){
        let element = this.createWrapper(this.observer);
        element.dataset.role = 'bench_preview';
        element.classList.add('comp--bench', 'button--sm');
        return element;
    }
    get previews(){
        let markup = this.observer.markup;
        let components = {
            all:`<div class="preview-group">
                    <div class="label">
                        <span>Logos</span>
                    </div>
                    <div class="preview-components logo">
                        <div class="logo--lg comp pb-component showcase">
                            ${markup}
                        </div>
                        <div class="logo--md comp pb-component sg-1">
                            ${markup}
                        </div>
                        <div class="logo--sm comp pb-component sg-2">
                            ${markup}
                        </div>
                        <div class="logo--xs comp pb-component sg-3">
                            ${markup}
                        </div>
                    </div>
                </div>
                <div class="preview-group">
                    <div class="label">
                        <span>Squared</span>
                    </div>
                    <div class="preview-components squared">
                        <div class="squared--lg comp">
                            ${markup}
                        </div>
                        <div class="squared--md comp">
                            ${markup}
                        </div>
                        <div class="squared--sm comp">
                            ${markup}
                        </div>
                        <div class="squared--xs comp">
                            ${markup}
                        </div>
                    </div>
                </div>
                <div class="preview-group">
                    <div class="label">
                        <span>Squared (Rounded)</span>
                    </div>
                    <div class="preview-components squared-rounded">
                        <div class="squared-rounded--xs comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--sm comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--md comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--lg comp">
                            ${markup}
                        </div>
                    </div>
                </div>
                <div class="preview-group">
                    <div class="label">
                        <span>Round</span>
                    </div>
                    <div class="preview-components round">
                        <div class="round--xs comp">
                            ${markup}
                        </div>
                        <div class="round--sm comp">
                            ${markup}
                        </div>
                        <div class="round--md comp">
                            ${markup}
                        </div>
                        <div class="round--lg comp">
                            ${markup}
                        </div>
                    </div>
                </div>
                <div class="preview-group">
                    <div class="label">
                        <span>Button</span>
                    </div>
                    <div class="preview-components button">
                        <div class="button--sm comp">
                            ${markup}
                        </div>
                        <div class="button--md comp">
                            ${markup}
                        </div>
                        <div class="button--lg comp">
                            ${markup}
                        </div>
                    </div>
                </div>
                <div class="preview-group">
                    <div class="label">
                        <span>Nested</span>
                    </div>
                    <div class="preview-components nested">
                        <div class="nested--right comp">
                            ${markup}
                        </div>
                        <div class="nested--left comp">
                            ${markup}
                        </div>
                    </div>
                </div>`,
            logos: {
                all: `<div class="preview-components logo">
                        <div class="logo--lg comp pb-component showcase">
                            ${markup}
                        </div>
                        <div class="logo--md comp pb-component sg-1">
                            ${markup}
                        </div>
                        <div class="logo--sm comp pb-component sg-2">
                            ${markup}
                        </div>
                        <div class="logo--xs comp pb-component sg-3">
                            ${markup}
                        </div>
                    </div>`,
                xs:`<div class="logo--xs comp pb-component sg-3">${markup}</div>`,
                sm:`<div class="logo--sm comp pb-component sg-2">${markup}</div>`,
                md:`<div class="logo--md comp pb-component sg-1">${markup}</div>`,
                lg:`<div class="logo--lg comp pb-component showcase">${markup}</div>`,
            },
            squared: {
                all:`<div class="preview-components squared">
                        <div class="squared--lg comp">
                            ${markup}
                        </div>
                        <div class="squared--md comp">
                            ${markup}
                        </div>
                        <div class="squared--sm comp">
                            ${markup}
                        </div>
                        <div class="squared--xs comp">
                            ${markup}
                        </div>
                    </div>`,
                xs:`<div class="squared--xs comp">${markup}</div>`,
                sm:`<div class="squared--sm comp">${markup}</div>`,
                md:`<div class="squared--md comp">${markup}</div>`,
                lg:`<div class="squared--lg comp">${markup}</div>`,
            },
            rounded_square: {
                all:`<div class="preview-components squared-rounded">
                        <div class="squared-rounded--xs comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--sm comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--md comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--lg comp">
                            ${markup}
                        </div>
                    </div>`,
                xs:`<div class="squared-rounded--xs comp">${markup}</div>`,
                sm:`<div class="squared-rounded--sm comp">${markup}</div>`,
                md:`<div class="squared-rounded--md comp">${markup}</div>`,
                lg:`<div class="squared-rounded--lg comp">${markup}</div>`,
            },
            round: {
                all:`<div class="preview-components round">
                        <div class="round--xs comp">
                            ${markup}
                        </div>
                        <div class="round--sm comp">
                            ${markup}
                        </div>
                        <div class="round--md comp">
                            ${markup}
                        </div>
                        <div class="round--lg comp">
                            ${markup}
                        </div>
                    </div>`,
                xs:`<div class="round--xs comp">${markup}</div>`,
                sm:`<div class="round--sm comp">${markup}</div>`,
                md:`<div class="round--md comp">${markup}</div>`,
                lg:`<div class="round--lg comp">${markup}</div>`,
            },
            buttons: {
                all: `<div class="preview-components button">
                        <div class="button--sm comp">
                            ${markup}
                        </div>
                        <div class="button--md comp">
                            ${markup}
                        </div>
                        <div class="button--lg comp">
                            ${markup}
                        </div>
                    </div>`,
                sm:`<div class="button--sm comp">${markup}</div>`,
                md:`<div class="button--md comp">${markup}</div>`,
                lg:`<div class="button--lg comp">${markup}</div>`,
            },
            nested: {
                all: `<div class="preview-components nested">
                        <div class="nested--right comp">
                            ${markup}
                        </div>
                        <div class="nested--left comp">
                            ${markup}
                        </div>
                    </div>`,
                left:`<div class="nested--left comp">${markup}</div>`,
                right:`<div class="nested--right comp">${markup}</div>`,
            }
        }
        return components;
    }
    get svg() {
        return this.observer.markup;
    }
    get header() {
        return {
            name: this.observer.name,
            category: this.observer.category,
            markup: this.markup,
        }
    }

    get viewBox() {
        if (this.observer.values.has('viewBox'))
            return this.parseViewBoxString(this.observer.values.get('viewBox'))
        else {
            console.log('no viewbox property')
            return false;
        }
    }
    set viewBox(value) {
        if (Array.isArray(value))
            value = this.formatViewBoxArray(value);
        if (this.observer.values.has('viewBox')) {
            this.observer.values.set('viewBox',value);
            console.log('viewbox set', this.observer.values.get('viewBox'));
            return true;
        }
        console.log('idk what happend with the viewbox');
        return false;
    }

    set pos(args) {
        let [index,val] = args;
        let viewbox = this.observer.values.get('viewBox');

        let vb = this.parseViewBoxString(vb);
        vb[index] = val;
        viewbox = this.formatViewBoxArray(vb);
        return true;
    }
    set vbx(x) {
        this.pos = [0,x];
    }
    set vby(y) {
        this.pos = [1,y]
    }
    set vbw(w) {
        this.pos = [2,w]
    }
    set vbh(h) {
        this.pos = [3,h]
    }

    set rotation(deg) {
        this.observer.values.set('transform',`rotate(${deg})`)
        return deg;
    }

    undo() {
        if (this.versions.isEmpty())
            return
        return this.versions.pop();
    }
    save(value) {
        this.props = value;
        this.versions.push(value);
        return this.props;
    }
    copy() {
        window.navigator.clipboard.writeText(this.svg)
        console.log('copied');
        return true;
    }
    use() {
        return structuredClone(this.props);
    }

    parseElement(element) {
        let icon = element.querySelector('svg');
        let values = new Map([
            ['height',icon.getAttribute('height')],
            ['width',icon.getAttribute('width')],
            ['x',icon.getAttribute('x')],
            ['y',icon.getAttribute('y')],
            ['viewBox',icon.getAttribute('viewBox')],
            ['transform',{value: icon.getAttribute('transform')}],
        ]);
        return values;
    }
    parseViewBoxString(string) {
        return string.split(/\s+|,/);
    }
    formatViewBoxArray(array) {
        return array.join(' ');
    }
    getUpdatedPreviews() {
        return this.observer.previews;
    }
    getUpdatedClone(icon,values) {
        let attributes = Array.from(values.keys())
        attributes.forEach(attr => {
            let val = values.get(attr)
            if (val && !icon.getAttribute(attr) !== val) {
                console.log('overwriting icon attribute',attr,'on',icon,'to',val)
                icon.setAttribute(attr,val);
            }
        })
        return icon;
    }
    createWrapper(props,opts = {useValues: false}){
        let {name,category,markup,values} = props || this;
        let el = document.createElement('div');
        el.dataset.category = category;
        el.dataset.name = name;
        el.dataset.cid = this.cid;
        el.dataset.id = this.id;
        el.innerHTML = markup;

        let icon = el.querySelector('svg');
        if (!values && !icon.getAttribute('viewBox')) {
            console.log('setting default viewbox in',category)
            icon.setAttribute('viewBox','0 0 24 24');
            this.markup = icon.outerHTML
            return el;
        } else if (values && opts.useValues) {
            return this.getUpdatedClone(icon,values);
        }
        return el;
    }

    getLogo(type) {
        let component = this.previews.logos[type]
        if (!component) {
            console.log(type,'doesn\t exist try one of these',Array.from(Object.getOwnPropertyNames(this.previews.logos)).filter(name => name !== 'all'))
            return false
        } else 
            return component
    }
    getSquared(type) {
        let component = this.previews.logos[type]
        if (!component) {
            console.log(type,'doesn\t exist try one of these',Array.from(Object.getOwnPropertyNames(this.previews.squared)).filter(name => name !== 'all'))
            return false
        } else 
            return component
    }
    getRoundedSquare(type) {
        let component = this.previews.logos[type]
        if (!component) {
            console.log(type,'doesn\t exist try one of these',Array.from(Object.getOwnPropertyNames(this.previews.rounded_square)).filter(name => name !== 'all'))
            return false
        } else 
            return component
    }
    getButton(type) {
        let component = this.previews.logos[type]
        if (!component) {
            console.log(type,'doesn\t exist try one of these',Array.from(Object.getOwnPropertyNames(this.previews.button)).filter(name => name !== 'all'))
            return false
        } else 
            return component
    }
    getNested(type) {
        let component = this.previews.nested[type]
        if (!component) {
            console.log(type,'doesn\t exist try one of these',Array.from(Object.getOwnPropertyNames(this.previews.nested)).filter(name => name !== 'all'))
            return false
        } else 
            return component
    }
}