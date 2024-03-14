/* previous implimentation
            index[1,2] is the name and category for sorting purposes
            index[2] = {
                "name"
                "category"
                "raw svg markup"
            }

            however i think the data set could be easier reason about if it was just a map
            and the data was sorted else were...

            [name]: {
                name
                category
                markup
                ...props
            }
*/
import SlidingTracker from './slider.js'
import Bucket from './bucket.js'
import TabHandler from './tabber.js'

class IconNode {
    constructor(props) {
        this.name = props.name;
        this.category = props.category;
        this.markup = props.markup;
        this.isFavorite = false;
        this.knownCollections = [];
        this.observer = structuredClone(props)
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
    get benchPreview(){
        let element = this.createWrapper(this.observer);
        element.dataset.role = 'bench_preview';
        element.classList.add('comp--bench', 'button--sm');
        return element
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
    getUpdatedPreviews() {
        return this.previews
    }
    save(value) {
        this.props = value;
        return this.props;
    }

    createWrapper(props){
        let {name,category,main_id,category_id,markup} = props || this;
        let el = document.createElement('div');
        el.dataset.category = category;
        el.dataset.name = name;
        el.dataset.cid = category_id;
        el.dataset.id = main_id;
    
        el.innerHTML = markup;
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
// import Icon from './idek.js'
// console.log(Icon)
// console.log(TabHandler);

class SvgModel {
    constructor(list) {

        this.duplicates = {};
        this.dupeCount = 0;

        this.collectionSet = ['Favorites','Recently Added'],

        this.components = new Map(),

        this.all = new Map();

        this.categorySet = new Set();

        this.categories = {};

        this.collections = {
            favorites: new Map(),
            recentlyAdded: new Map(),
        };

        // setting static properties
        // and building the dataset
        for (let i = 0; i < list.length; i++) {
            let backpack = list[i][2];
            
            // element props
            let key = backpack.name;
            // let obj = Object.create(IconProto)
            let meta = new IconNode(backpack);
            // let meta = Object.assign(obj,props);

            // Populate Categories with orignal references
            if (!this.categorySet.has(backpack.category)){
                // keeping track of different categories
                this.categorySet.add(backpack.category);
                this.categories[backpack.category] = new Map();
            }

            // handling duplicate names
            if (this.all.has(key))
            {
                // if known duplicate doesn't exist create an object for it
                if (!this.duplicates.hasOwnProperty(key)) {
                    this.duplicates[key] = {
                        count: 1,
                        categoryCount: 0,
                        dupes: new Map(),
                    }
                    // setting the existing element first
                    this.duplicates[key].dupes.set(key,this.all.get(key));
                }

                // then the new element with a modified name
                let newKey = `${key}--${meta.category}`;
                
                // handling duplicates withing categories
                if (this.duplicates[key].dupes.has(newKey)) {
                    // console.log('category dupe found!')
                    newKey = `${newKey}--${++this.duplicates[key].categoryCount + 1}`;
                }

                // add a property showing that the name has been modified
                meta.rebased = newKey;

                // proceed mapping operations
                this.duplicates[key].dupes.set(newKey,meta);
                this.all.set(newKey,meta);
                this.categories[meta.category].set(newKey,meta);
                
                // update count
                this.duplicates[key].count = this.duplicates[key].count + 1;
                this.dupeCount++;
            } else {
                // ...otherwise
                this.all.set(key,meta);
                this.categories[meta.category].set(key,meta);
            }
        }

        // set property indicating if svgs of the same name exist
        if (this.dupeCount > 0) {
            for (let name in this.duplicates) {
                this.duplicates[name].dupes.forEach(value => {
                    // setting a reference back to all the icons of the same name
                    value.others = this.duplicates[name]
                    if (this.duplicates[name].categoryCount > 0)
                        value.othersInSameCategory = this.duplicates[name].categoryCount;
                })
            }
            function log_duplicates()
            { 
                // console.log('found',this.dupeCount,'duplicates');
                // console.log('here they are', this.duplicates);
            }
        }

        // generate a index set of keys for each collection for navigating through the application
        for (const category in this.categories) {
            let i = 0;
            this.categories[category].forEach(value => {
                value.category_id = ++i;
            })
        }
        // same for all

    }
    // Populating Collections with deep copies
    createCollection(name) {
        if (this.collectionSet.includes(name) || name == 'Favorites' || name == 'Recently Added')
            return console.error('collection',name,'already exist, choose a different name');

        this.collectionSet.push(name);
        this.collections[name] = new Map();
    }

    removeCollection(name) {
        delete this.collections[name]
    }

    addToCollection(name, meta) {
        if (this.collections[name].has(name))
            return console.error(name,'this name already exist in the collection and was not added')

        this.collections[name].set(name,meta);
    }

    removeFromCollection(name, collection, areYouSure) {
        this.collections[collection].delete(name);
    }
}
/* previous implimentation
    initially there where functions scattered everywhere pulling data directly from the model
    although it worked for all intents and purposes there was no intuitive or coherent structure

    this is an attempt to mitigate some confusion while preparing for real database interactions

    starting with an app that attempts that delegate responsibilities

        user inputs => buttons & text fields

           request to update data => verify within the app => then notify database of changes requested
                on message of successful transaction from database => update application state => then render approriate elements

                    using arrays/cursors to manage state on the "client side" i.e within the app object
*/
const app = {
        version: "2.0",
        rootElement: document.querySelector('#app'),
        model: undefined,
        // notifies the database of any changes requested
        // calls appropriate methods on success/error
        view: {

        },
        state: {
            current: {
                cursor: undefined,
                icon: undefined,
                props: undefined,
                name: undefined,
                tab: undefined,
                bench: undefined,
                set icon(key) {
                    // set preview interface
                    this.updateProps(key);
                    this.updateCursor();
                    app.preview.update();
                    return
                },
                get element() {
                    return document.querySelector('.interface--preview .display svg')
                },

                togglePrev() {
                    this.updateProps(this.cursor.prv());
                    app.preview.update();
                    return;
                },
                toggleNext() {
                    this.updateProps(this.cursor.nxt());
                    app.preview.update();
                    return;
                },
                updateProps(key) {
                    this.props = app.getProps(key);
                    return;
                },
                updateCursor() {
                    if (this.tab == "all")
                        this.cursor.skipTo(this.props.main_id);
                    else
                        this.cursor.skipTo(this.props.category_id);
                    return;
                }
            },
        },
        // observes it's own state
        // notifies the app of any request changes to state
        // passing the appropriate callback along the way
        menu: {
            element: document.querySelector('.side-menu[data-tab="categories"] .menu-links'),
        },
        preview: {
            btn_save: document.querySelector('.toRefs'),
            btn_bucket: document.querySelector('.toBench'),
            header: {
                elements: {
                    get icon() {
                        return document.querySelector('.interface--preview .display svg');
                    },
                    get name() {
                        return document.querySelector('.interface--description .name');
                    },
                    get category() {
                        return document.querySelector('.interface--description .category');
                    },

                    set icon(val) {
                        this.icon.outerHTML = val;
                    },
                    set name(val) {
                        this.name.innerText = val
                            .toString().replaceAll('_', ' ').toLowerCase();
                    },
                    set category(val) {
                        this.category.innerText = val
                            .toString().replaceAll('_', ' ');
                    },

                    get viewBox() {
                        let vb = this.icon.getAttribute('viewBox')
                        if (vb)
                            return vb.split(/\s+|,/);
                        else
                            return false;
                    },
                    set viewBox(array) {
                        this.icon.setAttribute('viewBox',array);
                    },
                    set pos(args) {
                        let [index,val] = args;
                        let vb = this.viewBox;
                        vb[index] = val;
                        this.icon.setAttribute('viewBox',vb);
                        this.update(vb);
                    },
                    set vbx(x) {
                        this.pos = [0,x];
                    },
                    set vby(y) {
                        this.pos = [1,y]
                    },
                    set vbw(w) {
                        this.pos = [2,w]
                    },
                    set vbh(h) {
                        this.pos = [3,h]
                    },
                    hasViewBox() {
                        return this.icon.viewBox;
                    },
                },
                buttons: {
                    fix: document.querySelector('.fix'),
                    copy: document.querySelector('.copy'),
                    border: document.querySelector('.border'),
                    next: document.querySelector('.interface .next'),
                    prev: document.querySelector('.interface .prev'),
                    bench: document.querySelector('.btn-bench')
                },
            },
            tabs: new TabHandler({
                tabs: [...document.querySelectorAll('.js-tabber--tab-interface')],
                wrappers: [...document.querySelectorAll('.js-tabber--window-interface')],
                initial: 'position',
                modals: ['bench'],
            }),
            viewBox: {
                buttons: {
                    vbx: document.querySelector('.input-field.x .label'),
                    vby: document.querySelector('.input-field.y .label'),
                    vbh: document.querySelector('.input-field.h .label'),
                    vbw: document.querySelector('.input-field.w .label'),
                },
                inputs: {
                    vbx: document.querySelector('.input-field.x .inp'),
                    vby: document.querySelector('.input-field.y .inp'),
                    vbh: document.querySelector('.input-field.h .inp'),
                    vbw: document.querySelector('.input-field.w .inp'),
                    update(vb) {
                            this.vbx.value = vb[0];
                            this.vby.value = vb[1];
                            this.vbw.value = vb[2];
                            this.vbh.value = vb[3];
                        },
                    }
            },
            sliders: {
                values: {
                    rotation: undefined,
                    stretchX: undefined,
                    stretchY: undefined,
                    zoom: undefined,
                },
                rotate: {
                    button: document.querySelector('.rotate .label'),
                    slider: new SlidingTracker(document.querySelector('.rotate')),
                    state: {
                        px: undefined,
                        pct: undefined,
                        deg: undefined,
                    },
                    get target() {
                        return document.querySelector('.interface--preview .display svg');
                    },
                    init() {
                        this.slider.init(this);
                    },
                    reset() {
                        this.slider.reset();
                    },
                    disable() {
                        this.slider.disable();
                    },
                    setState(obj) {
                        this.state = obj;
                        this.update(obj);
                    },
                    setIntial(deg) {
                        this.slider.setState('deg',deg);
                    },
                    setTarget(values) {
                        this.target.setAttribute('transform',`rotate(${values.deg})`);
                    },

                },
                zoom: {
                    button: document.querySelector('.zoom .label'),
                    slider: new SlidingTracker(document.querySelector('.zoom')),
                    initial: undefined,
                    state: {
                        px: undefined,
                        pct: undefined,
                        deg: undefined,
                    },
                    get target() {
                        return document.querySelector('.interface--preview .display svg');
                    },
                    init() {
                        this.slider.init(this);
                        this.slider.setState('pct',50)
                    },
                    reset() {
                        this.slider.setState('pct',50)
                    },
                    disable() {
                        this.slider.disable();
                    },
                    setState(obj) {
                        this.state = obj;
                    },
                    setTarget(values) {
                        let pct = values.pct;
                        let zoom;
                        let factor;
                        let x;
                        // console.log('moving')
                        if (this.initial) {
                            x = Number(this.initial[2]);
                            // console.log(x)
                            if (pct > 50) {
                                factor = (pct - 50) * 2;
                                zoom = Math.trunc(x * (factor/100) + x)
                            }
                            if (pct < 50) {
                                factor = Math.abs((pct * 2) - 100);
                                zoom = Math.trunc(x * (factor/100) - x)
                            }
                        }
                        if (zoom) {
                            zoom = Math.abs(zoom).toString();
                            let arr = [...this.initial];
                            arr[2] = zoom;
                            arr[3] = zoom;
                            // console.log(arr)
                            this.update(arr)
                        } else if (this.update) {
                           this.update(this.initial)
                        }

                        // multiply the current viewbox by factor determined by percent of sliding range
                        // if (this.update)
                        //     this.update(this.initial)
                    },

                },
            },
            bench: {
                element: document.querySelector('.bench'),
                wrapper: document.querySelector('.bench--wrapper'),
                menu: {
                    element: document.querySelector('.bench--toggle-menu'),
                    select: document.querySelector('.bench--toggle-menu .select'),
                    delete: document.querySelector('.bench--toggle-menu .wipe'),
                    export: document.querySelector('.bench--toggle-menu .export')
                },
                state:'empty',
                bucket: new Bucket(),
                selected: new Map(),
                add(props) {
                    console.log(app.preview.benchPreview(props))
                    let binding = this._bind(props.main_id);
                    binding.classList.contains('benched')
                    ? console.log('here')
                    : binding.classList.add('benched')
                    this.element.appendChild(app.preview.benchPreview(props))
                },
                remove(id) {
                    let binding = this._bind(id)
                    binding.classList.contains('benched')
                    ? binding.classList.remove('benched')
                    : console.log('not here')
                    this.element.removeChild(this.element.querySelector(`[data-id="${id}"]`))
                },
                _bind(id) {
                    const binding = app.dashboard.element.querySelector(`[data-id="${id}"]`)
                    console.log(binding);
                    return binding;
                }
            },
            observer: {
                get markup() {
                    return this.getMarkup()
                },
                // rotation: undefined,
                viewBox: [],
                x: undefined,
                y: undefined,
                w: undefined,
                h: undefined,
                get props() {
                    let {markup,rotation,viewBox,x,y,w,h} = this
                    return {
                        markup,
                        rotation,
                        viewBox,
                        x,
                        y,
                        w,
                        h,
                    }
                },
                set props(obj) {
                    this.props = obj;
                },
                getProps() {
                    let {markup,rotation,viewBox,x,y,w,h} = this
                    return {
                        markup,
                        rotation,
                        viewBox,
                        x,
                        y,
                        w,
                        h,
                    }
                },
                getMarkup() {
                    let markup = document.querySelector('.interface--preview .display svg').outerHTML;
                    return markup;
                },
                updateViewBox(array) {
                    this.viewBox = array
                    this.x = Number(array[0]);
                    this.y = Number(array[1]);
                    this.w = Number(array[2]);
                    this.h = Number(array[3]);
                },
                updateTransformations(prop,value) {
                    Object.defineProperty(this.transformations,prop,value);
                }
            },

            get icon() {
                let element = document.querySelector('.interface--preview .display svg');
                let update = (values) => {
                    let deg = values.deg;
                    this.setRotation(deg);
                }
                return {
                    element,
                    update,
                }
            },
            get props() {
                return app.getProps();
            },
            showcase(props){
                let element = this.createWrapper(props);
                element.dataset.role = 'svg_wrapper';
                element.classList.add('svg-wrapper');
                return element
            },
            benchPreview(props){
                let element = this.createWrapper(props);
                element.dataset.role = 'bench_preview';
                element.classList.add('comp--bench', 'button--sm');
                return element
            },
            previews(txt){
                let markup = txt || this.props.markup;
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
            },
            createWrapper(props){
                let {name,category,main_id,category_id,markup} = props || this.props;
                let el = document.createElement('div');
                el.dataset.category = category;
                el.dataset.name = name;
                el.dataset.cid = category_id;
                el.dataset.id = main_id;
            
                el.innerHTML = markup;
                return el;
            },
            onCopy() {
                window.navigator.clipboard.writeText(this.observer.markup);
                console.log('copied')
                return;
            },
            onQuickFix() {
                const element = document.querySelector('.interface--preview .display svg')
                if (element.getAttribute('viewBox') == '0 0 16 16'){
                    element.setAttribute('viewBox','0 0 8 8');
                    this.setViewBoxInputs([0, 0, 8, 8])
                }
                else if (element.getAttribute('viewBox') == '0 0 24 24'){
                    element.setAttribute('viewBox', '0 0 16 16')
                    this.setViewBoxInputs([0, 0, 16, 16])
                }
                else if (!element.getAttribute('viewBox')) {
                    element.setAttribute('viewBox', '0 0 24 24')
                    this.setViewBoxInputs([0, 0, 24, 24])
                }
                else if (element.getAttribute('viewBox') == '0 0 8 8') {
                    element.setAttribute('viewBox', '0 0 24 24')
                    this.setViewBoxInputs([0, 0, 24, 24])
                }
                // console.log(element.getAttribute('viewBox'));
            },
            onBorder() {
                let element = this.icon.element;
                if (!this.icon.element.style.border)
                    this.icon.element.style.border = '1px dotted red'
                else
                    this.icon.element.style.border = ''
            },

            setVBX(val) {
                if (this.observer.x)
                    val = val + this.observer.x;
                this.viewBox.inputs.vbx.value = val;
                this.header.elements.vbx = val;
            },
            resetVBX(initial) {
                this.viewBox.inputs.vbx.value = initial;
                this.header.elements.vbx = initial;
            },

            setVBY(val) {
                if (this.observer.y)
                    val = val + this.observer.y;
                this.viewBox.inputs.vby.value = val;
                this.header.elements.vby = val;
            },
            resetVBY(initial) {
                this.viewBox.inputs.vby.value = initial;
                this.header.elements.vby = initial;
            },

            setVBW(val) {
                if (this.observer.w)
                    val = val + this.observer.w;
                this.viewBox.inputs.vbw.value = val;
                this.header.elements.vbw = val;
            },
            resetVBW(initial) {
                this.viewBox.inputs.vbw.value = initial;
                this.header.elements.vbw = initial;
            },

            setVBH(val) {
                if (this.observer.h)
                    val = val + this.observer.h;
                this.viewBox.inputs.vbh.value = val;
                this.header.elements.vbh = val;
            },
            resetVBH(initial) {
                this.viewBox.inputs.vbh.value = initial;
                this.header.elements.vbh = initial;
            },

            setRotation90() {
                this.icon.element.setAttribute('transform',`rotate(${this.rotatation + 90})`)
                this.rotatation += 90;
            },
            setRotation(val) {
                this.icon.element.setAttribute('transform',`rotate(${val})`);
                this.rotatation = val;
            },

            getPosX(event) {
                if (!this.xPosInitial)
                    this.xPosInitial = event.pageX;

                let zeroed = event.clientX - this.xPosInitial;
                let value = Math.floor(zeroed/3);
                // console.log('starting from',this.xPosInitial);
                // console.log('value is',value,zeroed)
                return Number(value);
                // this.icon.setXpos(calced);
            },
            track(event,setter,initial) {
                // console.log('tracking',event.target)
                // console.log(event.pageX);
                event.target.onpointermove = (event) => setter(this.getPosX(event));
                event.target.setPointerCapture(event.pointerId);
            },
            stop(event) {
                // console.log('tracking stopped')
                this.xPosInitial = null;
                event.target.onpointermove = null;
                event.target.releasePointerCapture(event.pointerId);
                // console.log(this.xPosInitial);
            },

            logResults(event) {
                // console.log(zeroed,this.xPosIntial,event.clientX);
            },

            // updateRecievers() {
            //     this.sliders.forEach(slider => slider.setReciever(this.icon));
            //     // console.log('sliders hydrated');
            //     return;
            // },
            updateHeader(obj) {
                let {name,category,markup} = obj;
                
                this.header.elements.name = name
                this.header.elements.category = category
                this.header.elements.icon = markup;
            },

            setViewBoxInputs(vb) {
                this.viewBox.inputs.vbx.value = vb[0];
                this.viewBox.inputs.vby.value = vb[1];
                this.viewBox.inputs.vbw.value = vb[2];
                this.viewBox.inputs.vbh.value = vb[3];
            },
            setViewBoxInitial(vb) {
                this.observer.x = Number(vb[0]);
                this.observer.y = Number(vb[1]);
                this.observer.h = Number(vb[2]);
                this.observer.w = Number(vb[3]);
            },
            updateViewBox(array) {
                this.header.elements.viewBox = array;
                this.observer.updateViewBox(array);
                this.viewBox.inputs.update(array);
                this.sliders.zoom.initial = array;
            },
            updatePreviews(markup) {
                document.querySelectorAll('.interface .comp svg').forEach(icon => icon.outerHTML = markup || this.observer.getMarkup())
            },
            updateProps() {
                this.observer = {
                    ...this.observer,
                    ...this.props,
                }
            },
            update() {

                let {name,category,markup,viewBox,rotation} = this.props;
                this.updateHeader({name,category,markup});

                let currentHasViewBox = this.header.elements.viewBox;
                let currentViewBox;
                let transform;

                if (viewBox)
                    currentViewBox = viewBox
                else if (currentHasViewBox)
                    currentViewBox = currentHasViewBox;
                else
                    currentViewBox = ["0", "0", "24", "24"];

                if (!rotation)
                    transform = 0;
                else
                    transform = rotation;

                this.updateViewBox(currentViewBox);
                this.sliders.rotate.setIntial(transform);
                this.sliders.zoom.reset();

                this.observer = {
                    ...this.observer,
                    ...this.props,
                }
                this.updatePreviews()

            },
            onSave() {
                let {markup,rotation,viewBox,x,y,w,h} = this.observer
                let saved = {
                    ...this.props,
                    ...{markup,rotation,viewBox,x,y,w,h}
                }
                app.saveProps(saved)
                this.updateProps()
                this.updatePreviews()
            },
            addToBench(props) {
                let status = this.getStatus(props.main_id);
                if (!status) {
                    this.bench.bucket.push(props)
                    this.bench.add(props);
                    this.bench.state = 'ready';
                }
                    console.log(this.bench.selected);
                    return this.getStatus(props.main_id);
            },
            pluckFromBench(id) {
                let status = this.getStatus(id);
                if (status) {
                    this.bench.bucket.pluck(id);
                    if (this.bench.bucket.size === 0)
                        this.bench.state = 'empty'
                    this.bench.remove(id);
                }

                return this.getStatus(id);
            },
            toggleSelected(id,element) {
                console.log(this.bench.bucket.selected)
                let selected = this.bench.bucket.use(id);
                let flag = selected.isSelected;
                if (flag) {
                    selected.isSelected = false;
                    this.bench.selected.delete(id);
                    this.unselectFromBench(element);
                } else {
                    selected.isSelected = true;
                    this.bench.selected.set(id,selected)
                    this.selectFromBench(element)
                }
                console.log(this.bench.selected)
            },
            selectFromBench(element) {
                element.classList.add('selected')
            },
            unselectFromBench(element) {
                element.classList.remove('selected');
            },
            deleteSelected() {
                let selected = Array.from(this.bench.selected.keys())
                if (selected.length > 0)
                    console.log(selected,this.bench.selected)
                    selected.forEach(id => {
                        this.bench.selected.get(id).isSelected = false;
                        this.bench.selected.delete(id);
                        this.bench.bucket.pluck(id);
                        this.bench.remove(id);
                    })
            },
            toggleSelectAll() {
                console.log(this.bench.state)
                if (this.bench.state !== 'empty') {
                    if (this.bench.state == 'selectAll') {
                        this.bench.state = 'ready'
                        this.unselectAllInBench();
                    } else {
                        this.bench.state = 'selectAll'
                        this.selectAllInBench();
                    }
                }
            },
            selectAllInBench() {
                let targets = Array.from(this.bench.element.children);
                let group = this.bench.bucket.useAll();
                group.forEach(value => value.isSelected = true)
                targets.forEach(child => child.classList.add('selected'))
                this.bench.selected = this.bench.bucket.refs;
            },
            unselectAllInBench() {
                let targets = Array.from(this.bench.element.children);
                let group = this.bench.bucket.useAll();
                group.forEach(value => value.isSelected = false);
                targets.forEach(child => child.classList.remove('selected'))
                this.bench.selected = new Map()
            },
            toggleBench(props) {
                console.log('here',props)
                let status = this.getStatus(props.main_id);
                console.log(status)
                if (status) {
                    this.pluckFromBench(props.main_id)
                } else if (!status) {
                    this.addToBench(props)
                }
            },
            getStatus(id) {
                return this.bench.bucket.has(id);
            },
            toggleExportMenu() {
                document.querySelector('.interface').classList.add('passive')
                document.querySelector('.interface--menu').classList.add('active')
                // this.bench.wrapper.style.transform = 'translateY(-250px)'
            },
            toggleNext() {
                app.state.current.toggleNext();
                // this.updateRecievers();
            },
            togglePrev() {
                app.state.current.togglePrev();
                // this.updateRecievers();
            },
            init() {
                // navigators
                this.header.buttons.next.addEventListener('click', () => this.toggleNext());
                this.header.buttons.prev.addEventListener('click', () => this.togglePrev());
                // quick toggles
                this.header.buttons.fix.addEventListener('click', () => this.onQuickFix());
                this.header.buttons.copy.addEventListener('click', () => this.onCopy());
                this.header.buttons.border.addEventListener('click', () => this.onBorder());
                // viewbox methods
                this.viewBox.buttons.vbx.onpointerdown = (e) => this.track(e,this.setVBX.bind(this));
                this.viewBox.buttons.vbx.addEventListener('dblclick',() => this.resetVBX(this.observer.x));
                this.viewBox.buttons.vbx.onpointerup = this.stop.bind(this);

                this.viewBox.buttons.vby.onpointerdown = (e) => this.track(e,this.setVBY.bind(this));
                this.viewBox.buttons.vby.addEventListener('dblclick', () => this.resetVBY(this.observer.y));
                this.viewBox.buttons.vby.onpointerup = this.stop.bind(this);

                this.viewBox.buttons.vbw.onpointerdown = (e) => this.track(e,this.setVBW.bind(this));
                this.viewBox.buttons.vbw.addEventListener('dblclick', () => this.resetVBW(this.observer.w));
                this.viewBox.buttons.vbw.onpointerup = this.stop.bind(this);
                
                this.viewBox.buttons.vbh.onpointerdown = (e) => this.track(e,this.setVBH.bind(this),24);
                this.viewBox.buttons.vbh.addEventListener('dblclick', () => this.resetVBH(this.observer.h));
                this.viewBox.buttons.vbh.onpointerup = this.stop.bind(this);

                this.viewBox.inputs.vbx.addEventListener('input', (e) => {
                    this.header.elements.vbx = e.target.value;
                });
                this.viewBox.inputs.vby.addEventListener('input', (e) => {
                    this.header.elements.vby= e.target.value;
                });
                this.viewBox.inputs.vbw.addEventListener('input',(e) => {
                    this.header.elements.vbw = e.target.value;
                });
                this.viewBox.inputs.vbh.addEventListener('input', (e) => {
                    this.header.elements.vbh = e.target.value;
                });

                // tranform methods
                this.header.elements.update = (viewBox) => {
                    this.observer.viewBox = viewBox;
                    // console.log(this.observer)
                }

                this.sliders.rotate.button.addEventListener('click', () => this.sliders.rotate.reset());
                this.sliders.rotate.init();
                this.sliders.rotate.update = (values) => {
                    this.observer.rotation = values.deg;
                }

                this.sliders.zoom.button.addEventListener('click',() => this.sliders.zoom.reset())
                this.sliders.zoom.init();
                this.sliders.zoom.update = (array) => {
                    this.header.elements.viewBox = array;
                    this.observer.updateViewBox(array);
                    this.viewBox.inputs.update(array);
                }
                // this.slider.rotate.slider_rotate.init(this.icon);

                this.btn_save.addEventListener('click', () => this.onSave())
                this.header.buttons.copy.addEventListener('click', () => this.onCopy())
                this.header.buttons.bench.addEventListener('click', () => this.toggleBench(this.props))
                this.bench.element.addEventListener('click', (e) => {
                    let el = e.target.closest('.comp--bench')
                    let key;
                    if (el)
                        key = Number(el.dataset.id);
                    else 
                        return;
                        
                    if (el && key)
                        this.toggleSelected(key,el);
                })
                this.bench.menu.select.addEventListener('click',() => {
                    this.toggleSelectAll();
                })
                this.bench.menu.delete.addEventListener('click',() => {
                    this.deleteSelected();
                })

                this.bench.menu.export.addEventListener('click',() => {
                    this.toggleExportMenu();
                })
                // document.querySelector('.tab-link[data-window="preview"]').addEventListener('click', () => this.updatePreviews())
                this.tabs.init();
            },

        },
        dashboard: {
            // MAIN
            element: document.querySelector('.svg-dashboard'),
            // HEADER
            header: document.querySelector('.dashboard__header'),
                // navigator
            current_title: document.querySelector('.page-navigator .current-title'),
            btn_next: document.querySelector('.page-navigator .next'),
            btn_prev: document.querySelector('.page-navigator .prev'),
                // search
            btn_search: document.querySelector('.search-icon'),
            input_search: document.querySelector('.search-input'),
            title: document.querySelector('.dashboard__header .tab'),
            mode: 'click',
            state: {
                current: {
                    tab: 'all',
                },
                set currentTab(val) {

                },
                set currentSection(val) {

                }
            },

            tabs: {
                all: {},
                categories: {
                    // ...Element Refs
                },
                collections: {
                    // ...Element Refs
                },
            },

            header: {

            },

            show(container) {
                container.dataset.state='active';
            },
            hide(container) {
                container.dataset.state='inactive';
            },
            render(container) { // returns a function that inserts the fragment passed into a given container
                return function(frag) {
                    container.innerHTML = '';
                    container.append(frag);
                }
            },
            build(map) {// returns a document fragment built from a Map
                const frag = document.createDocumentFragment();
                map.forEach(value => frag.appendChild(app.createIcon(value)));
                return frag;
            },
            handleClick(e) {
                switch (this.mode) {
                    case 'click' : this.onClick(e)
                        break;
                    case 'select' : this.onSelect(e)
                        break;
                    // default : console.log('error in dashboard click handler')
                        break;
                }
            },
            onClick(e) {
                let wrapper = e.target.closest('.svg-wrapper');
                if (wrapper) {
                    let icon = wrapper.querySelector('svg');
                    if (icon)
                        console.log(icon.getAttributeNames());
                    'rebased' in wrapper.dataset
                    ? app.state.current.icon = wrapper.dataset.rebased
                    : app.state.current.icon = wrapper.dataset.name;
                } else
                    return null;
            },
            onDblClick(e) {
                let wrapper = e.target.closest('.svg-wrapper');
                if (wrapper) {
                    app.copy();
                    return;
                } else
                    return null;
            },
            onSelect(e) {
                e.stopImmediatePropagation()
                let wrapper = e.target.closest('.svg-wrapper');
                let key;
                if (wrapper) {
                    'rebased' in wrapper.dataset
                    ? key = wrapper.dataset.rebased
                    : key = wrapper.dataset.name;

                    this.toggleBench(key,wrapper);
                    console.log(key)
                    // app.bench;
                } else {
                    key = null;
                }
            },
            toggleBench(key,wrapper) {
                let props = app.getProps(key);
                let id = props.main_id;
                
                // returns false if props exist && true on successful push
                let status = app.preview.bench.bucket.has(id)
                console.log(status)
                // returns true on arr.filter
                // let pluck = () => app.preview.pluckFromBench(id);

                if (props && !status) {
                    app.preview.addToBench(props);
                    wrapper.classList.add('benched')
                }
                else if (id && status) {
                    app.preview.pluckFromBench(id);
                    wrapper.classList.remove('benched')
                }
                // else console.log('something went wrong in the bench')
            },
            onNextSection(e) {
                let nextSection = this.state.current.tabCursor.nxt();
                let nextSectionName = toUpper(nextSection);
                let next = document.querySelector(`[data-tab="${nextSection}"]`);

                this.element.scrollBy(0,next.getBoundingClientRect().top - 120);
                app.updateDashboardHeader(nextSectionName)
            },
            onPrevSection(e) {
                let prevSection = this.state.current.tabCursor.prv();
                let prevSectionName = toUpper(prevSection);
                let previous = document.querySelector(`[data-tab="${prevSection}"]`)

                this.element.scrollBy(0,previous.getBoundingClientRect().top - 120);
                app.updateDashboardHeader(prevSectionName);
            },
            scrollToTop() {
                // console.log(this.element,this.current_title)
                this.element.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                })
                let currentTab = this.state.current.tabCursor[0];
                let cursorIndex = this.state.current.tabKeys.indexOf(currentTab) + 1;
                this.state.current.tabCursor.skipTo(cursorIndex);
                app.updateDashboardHeader(toUpper(this.state.current.tabKeys[0]))
            },
            init() {
                // call rendering method for each tab
                    // ..

                // init handlers
                window.addEventListener('keydown', (e) => {
                    if (e.key == 'Control' && this.mode !== 'select') {
                        this.mode = 'select'
                        // console.log('changed mode to ',this.mode);
                    }
                });
                window.addEventListener('keyup', () => {
                    if (this.mode !== 'click')
                        this.mode = 'click'
                });
                this.element.addEventListener('click',(e) => this.handleClick(e));
                this.element.addEventListener('dblclick',(e) => this.onDblClick(e));
                this.btn_next.addEventListener('click', () => this.onNextSection());
                this.btn_prev.addEventListener('click', () => this.onPrevSection());
                this.current_title.onclick = this.scrollToTop.bind(this);
                this.btn_search.addEventListener('click', () => {
                    this.btn_search.style.transform = `translateX(-5ch)`;
                    this.title.style.opacity = 0;
                    this.input_search.style.display = 'flex'
                    this.input_search.style.opacity = 1;
                })
                this.scrollToTop();
                // app.updateDashboardHeader(toUpper(this.state.current.tabKeys[0]))
            },
        },

        getProps(key) {
            if (key)
                return this.model.all.get(key)
            else
                return this.state.current.props;
        },
        saveProps(obj) {
            console.log(this.state.current.cursor)
            this.state.current.props = obj;
            if (obj.rebased)
                this.model.all.set(obj.rebased,obj)
            else
                this.model.all.set(obj.name,obj)
            return this.state.current.props;
        },
        getKeyNameFromAtribute(svgWrapper) {
            if (svgWrapper.dataset.includes('rebased'))
                return app.getProps(svgWrapper.dataset.rebased);
            else
                return app.getProps(svgWrapper.dataset.name);
        },
        // vuln
        copy() {
            if (this.mode == 'click') {
                // console.log('text copied')
                return window.navigator.clipboard.writeText(app.state.current.props.markup);
            }
        },
        updateDashboardHeader(name) {
            document.querySelector('.page-navigator .current-title').innerText = name;
        },

        // dashboard methods
        createCollection(name) {
            // collect user input
            // update model
            // render elements on response
        },
        removeCollection(name) {
            // drop data
            // drop corresponding nodes
        },
        addToCollection(name, meta) {
            // collect user input
            // update model
            // render elements on response
        },
        removeFromCollection(name, collection, areYouSure) {
            // collect user input
            // update model
            // render elements on repsonse
        },

        // create element then set html attributes
        createIcon(props) { // => returns dom element
            let el = document.createElement('div');
            el.dataset.category = props.category;
            el.dataset.name = props.name;
            el.dataset.role = 'svg_wrapper';
            el.classList.add('svg-wrapper');
            el.innerHTML = props.markup;
            console.log(el,el.querySelector('svg').getAttributeNames())
            console.log('yo')
            return el;
        },
        // render all elements from compiled data
        build_all_tab(map) {
            const dashboard = document.querySelector('[data-role="dashboard_tab"][data-tab="all"]');
            const frag = document.createDocumentFragment();
            const renderElements = map.forEach(value => frag.appendChild(createIcon(value)));
                dashboard.innerHTML = '';
                dashboard.append(frag);
                dashboard.dataset.state='active';
        },
        // render menu from set of existing property names
        build_category_menu() {
            this.menu.element.innerHTML = '';
            const menuFrag = document.createDocumentFragment();

            model.categorySet.forEach(
                category => {
                    const tab = category[0].toUpperCase() + category.substring(1);
                    const li = document.createElement('li');
                    li.dataset.tab = category;
                    li.dataset.role = 'tab_link';
                    li.innerText = tab;
                    menuFrag.appendChild(li);
                }
            )
            category_menu.append(menuFrag);

            const category_tabs = [...document.querySelectorAll('.side-menu[data-tab="collections"] .menu-links li')];
        },
        build_collections_menu() {
            const collections_menu = document.querySelector('.side-menu[data-tab="collections"] .menu-links');
            const collections_interface = document.querySelector('.collections_interface');
            const collection_set = model.collectionSet;
            collections_menu.innerHTML = '';
            const collectionsFrag = document.createDocumentFragment();
            const collectionsFrag2 = document.createDocumentFragment();

            if (collection_set.length === 0) {
                const noDice = document.createElement('div');
                noDice.classList.add('no-known-collections');
                noDice.innerText = "You Have No Collections!";
                menuFrag.append(noDice);
                collections_menu.append(menuFrag);
            } else {
                model.collectionSet.forEach(
                        collection => {
                            const str = collection.toString();
                            const tab = str[0].toUpperCase() + str.substring(1);
                            const li = document.createElement('li');
                            li.innerText = tab;
                            collectionsFrag.appendChild(li);
                            collectionsFrag2.appendChild(li);
                        }
                    )
            }
            collections_menu.append(collectionsFrag);
            collections_interface.append(collectionsFrag2);
        },
        // render div with elements of existing bucket
        build_dashboard_tab(map,tab) {
            const dashboard = document.querySelector('.svg-dashboard');
            const dashFrag = document.createDocumentFragment();
            const dash = document.createElement('div');
            const header = document.createElement('div');
            
            header.classList.add(header);
            header.innerText = toUpper(tab);

            dash.dataset.tab = tab;
            dash.dataset.type = 'categories';
            dash.dataset.role = 'dashboard_tab';
            dash.dataset.state = 'inactive';

            dash.appendChild(header);
            map.forEach(value => dash.appendChild(createIcon(value)));

            dashFrag.append(dash);

            dashboard.appendChild(dashFrag);
        },
        // initial build for every tab
        build_dashboard() {
            model.categorySet.forEach(category => {
                build_dashboard_tab(model.categories[category],category);
            })
        },

        init(model) {
            this.state.current["keyset"] = Array.from(model.all.keys());
            this.state.current["cursor"] = Cursor(Array.from(model.all.keys()));
            this.dashboard.state.current["tabKeys"] = Array.from(model.categorySet);

            this.state.current.tab = "all";
            this.model = model;
            console.log(model)
            // buildHomeTab()
            
            buildDashBoardAndLinks();
            this.dashboard.init();
            this.preview.init();
            // console.log(this.props)


            function buildDashBoardAndLinks() {

                app.dashboard.state.current["tabCursor"] = Cursor(Array.from(model.categorySet));

                const dashboard = app.dashboard.element;
                const dashFrag = document.createDocumentFragment();
    
                const category_menu = app.menu.element;
                const menuFrag = document.createDocumentFragment();
                category_menu.innerHTML = '';

                // vuln
                let scrollObserverOptions = {
                    root: dashboard,
                    rootMargin: '-15% 0% -55% 0%',
                    threshold: 1,
                };
                let scrollFunc = (entries) => {
                    entries.forEach(entry => {
                        let currentTab;
                        let navigatorState;
                        if (entry.isIntersecting) {
                            currentTab = entry.target.parentElement.dataset.tab
                            navigatorState = document.querySelector('.page-navigator .current-title').innerText
                        }
                        if (entry.isIntersecting &&  navigatorState !== currentTab) {
                            let cursorIndex = app.dashboard.state.current.tabKeys.indexOf(currentTab) + 1;
                            app.dashboard.state.current.tabCursor.skipTo(cursorIndex);
                            app.updateDashboardHeader(toUpper(entry.target.parentElement.dataset.tab));
                        
                        }
                    })
                }
                let scrollObserver = new IntersectionObserver(scrollFunc,scrollObserverOptions);


                model.categorySet.forEach(category => {
                    // create elements
                    const dash = document.createElement('div');
                    const link = document.createElement('li');
                    const collectionHeader = document.createElement('div');
                    // set attrubutes
                    dash.dataset.tab = category;
                    dash.dataset.type = 'categories';
                    dash.dataset.role = 'dashboard_tab';
                    dash.dataset.state = 'active';

                    collectionHeader.classList.add('collection-header');
                    collectionHeader.innerText = toUpper(category);

                    link.dataset.tab = category;
                    link.dataset.role = 'tab_link';
                    
                        // populate dashboard
                    dash.appendChild(collectionHeader)
                    model.categories[category].forEach(value => dash.appendChild(createIcon(value)));
                    dashFrag.append(dash);
                    dashboard.appendChild(dashFrag);
                        // menu links
                    link.innerText = toUpper(category);
                    menuFrag.appendChild(link);
                        // dashboard header
                    scrollObserver.observe(dash.lastElementChild);
                    scrollObserver.observe(collectionHeader);
            })
            }
        },
}

function Cursor( arr, opts = { startingIndex: 1 }) {

    let cursor = opts.startingIndex;
    let elements =  ["last",...arr,"first"];

    function validateCursor()
    {
        if(!Array.isArray(arr)) {
            // console.log(`Cursor instance canceled... was expecting an array you passed ${arr}`);
            return false;
        }
        if ( !isNaN(opts.startingIndex) && opts.startingIndex !== 0 && opts.startingIndex < arr[arr.length - 1] ) {
            cursor = opts.startingIndex;
        }
        if (arr.length < 2 && arr.length > 0) {
            cursor = 1;
        }
        else if (isNaN(opts.startingIndex)) {
            // return console.log(`expecting a number for startingIndex you passed ${opts.startingIndex}`);
        }
        return cursor;
    }

    // if type array is not passed throw error
    if (validateCursor())
        return {
            cursor,
            elements,
            first: elements[1],
            last: elements[elements.length - 2],
            next: undefined,
            prev: undefined,
            current: undefined,

            // get next cursor value before changing state
            get toggleNext() {
                console.log(this.elements)
                let next = this.elements[this.cursor + 1];
                // console.log(`\ncurrent state: ${this.cursor}\nnext element: ${next}\n`);
                if (next == "first")
                    next = this.element[this.firstIndex];
                return next;
            },
            // get previous cursor value before changing state
            get togglePrev() {
                let prev = this.elements[this.cursor - 1];
                // console.log(`\ncurrent state: ${this.cursor}\nnext element: ${prev}\n`);
                if (prev == "last")
                    prev = this.elements[this.lastIndex];
                return prev;
            },
            // get current cursor value
            get current() {
                // console.log(`\ncurrent element is ${this.elements[this.cursor]}`)
                return this.elements[this.cursor];
            },
            // get all elements in the array
            get all() {
                return this.elements.filter(index => index !== 'first' && index !== 'last');
            },
            get lastIndex() {
                return Number.parseInt(this.elements.indexOf(this.last));
            },
            get firstIndex() {
                return Number.parseInt(this.elements.indexOf(this.first));
            },
            // set next cursor value
            nxt() {
                console.log(this.elements)
                let next = this.elements[this.cursor + 1];
                if (next === "first") {
                    // console.log('\nskipping to first');
                    this.cursor = 1;
                    return this.first;
                }
                this.cursor += 1;
                console.log('\niterating next... current value is:')
                return next;
            },
            // set previous cursor value
            prv() {
                let prev = this.elements[this.cursor - 1];
                if (prev === "last") {
                    // console.log('\nskipping to last');
                    this.cursor = this.elements.length - 2;
                    return this.last;
                }
                console.log('\niterating back... current value is:');
                this.cursor -= 1; 
                return prev
            },
            // jump to index number in array
            skipTo(index) {
                // this.all returns array without the first and second "null byte"
                // so I use a zeroed index for this.all
                // and a regular index for the cursor
                if (isNaN(index)) {
                    // console.log(`\nskip function was expecting a number... you passed ${index}`)
                    return NaN;
                }
                else if (!this.all[index - 1]) {
                    // console.log(`\nuh oh....index of ${index} doesn\'t exist\ntry a number from 1 to ${this.all.length}\n`);
                    return undefined;
                }
                // console.log(`\nskipping to the ${this.nthSuffix(index)} index`);
                this.cursor = index;
                return this.all[index - 1];
            },
            skipToLast() {
                this.skipTo(this.lastIndex);
            },
            skipToFirst() {
                this.skipTo(this.firstIndex);
            },
            // add element to back of the list
            push(element) {
                // console.log(`\nadding ${element} to the list`);
                this.elements = ["last",...this.all,element,"first"];
                // console.log(`list updated... we\'re still on the ${this.nthSuffix(this.cursor)} index\n`);
            },
            // replace all elements in the array
            update(elements) {
                this.elements = ["last",...elements,"first"];
            },
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
            },
        }
}
// set icon properties
function createIcon(props) { // => returns dom element
        let el = document.createElement('div');
        el.dataset.category = props.category;
        el.dataset.name = props.name;
        el.dataset.id = props.main_id;
        el.dataset.role = 'svg_wrapper';
        el.classList.add('svg-wrapper');
        el.innerHTML = props.markup;
        return el;
}
function toUpper(string) {
    return string[0].toUpperCase() + string.substring(1);
}

// OBSERVE
let list = [];
let model;
// ------------------------------------------------------------- //
// BUILD STEP //
// ------------------------------------------------------------- //
(function loadData() {
    fetch('./data/icons.json')
        .then((res) => { return res.json()})
        .then((data) => {
            data.forEach(el => {
                list.push(el)
            })
            model = new SvgModel(list);
            app.init(model)
        })
})()