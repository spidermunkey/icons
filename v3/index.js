/* previous implimentation
    Now that the data structure is easier to reason about and the responsibilities are somewhat carved out by separate interfaces
    I think it would be easier to maintain and further develop if the interfaces are then abstracted into seperate working modules
*/
import {Slider} from './sliders.js'
import {MouseTrackingSlider} from './trackers.js'
import {ModalHandler,Accordian} from './DOM.js'
// import Bucket from './bucket.js'
import TabHandler from './tabber.js'
import {Node,Collection,Bench,Cursor,Model,IconNode} from './structs.js'
const SvgModel = new Model();

/* previous implimentation
    initially there where functions scattered everywhere pulling data directly from the model
    although it worked for all intents and purposes there was no intuitive or coherent structure

    this is an attempt to mitigate some confusion while preparing for real database interactions

    starting with an app interface that attempts to clearly delegate responsibilities

*/

const app = {
        version: "3.0",
        rootElement: document.querySelector('#app'),
        model: undefined,
        mode: 'click',
        state: {
        },


        menu: {
            tabs: new Accordian({
                tabs: [...document.querySelectorAll('.js-tabber--menu-tab')],
                wrappers: [...document.querySelectorAll('.js-tabber--menu-modal')],
            }),
        },


        dashboard: {
            // MAIN
            element: document.querySelector('.svg-dashboard'),
            // HEADER
            header: document.querySelector('.dashboard__header'),
            // NAVIGATOR
            title: document.querySelector('.page-navigator .current-title'),
            next: document.querySelector('.page-navigator .next'),
            prev: document.querySelector('.page-navigator .prev'),
            // SEARCH
            searchTitle: document.querySelector('.dashboard__header .tab'),
        },





        preview: {
            icon: undefined,

            next: document.querySelector('.interface .next'),
            prev: document.querySelector('.interface .prev'),

            tabs: new TabHandler({
                tabs: [...document.querySelectorAll('.js-tabber--tab-interface')],
                wrappers: [...document.querySelectorAll('.js-tabber--window-interface')],
                initial: 'position',
                // modals: ['bench'],
            }),
            header: {
                element: document.querySelector('.interface--preview .display'),
                name: document.querySelector('.interface--description .name'),
                category: document.querySelector('.interface--description .category'),
                update(values) {
                    let {name,category,markup} = values;

                    this.updateName(name);
                    this.updateCategory(category);
                    this.updateMarkup(markup);

                    return values;
                },
                updateName(value) {
                    if (value)
                        this.name.textContent = value.toString().replaceAll('_', ' ').toLowerCase();
                    else
                        console.log('could not set name to',value,'try a valid string');
                    return value;
                },
                updateCategory(value) {
                    if (value)
                        this.category.textContent = value.toString().replaceAll('_', ' ');
                    else
                        console.log('could not set category to',value,'try a valid string');
                    return value;
                },
                updateMarkup(value) {
                    if (value)
                        this.element.innerHTML = value;
                    else
                        console.log('could not set markup to',value,'try a valid string');
                    return value; 
                },
            },
            trackers: {
                viewBox: {
                    initial: undefined,
                    state: undefined,
                    vbx: document.querySelector('.input-field.x .label'),
                    vby: document.querySelector('.input-field.y .label'),
                    vbh: document.querySelector('.input-field.h .label'),
                    vbw: document.querySelector('.input-field.w .label'),
                    zoom: document.querySelector('.zoom .label'),
                    slider: new Slider(document.querySelector('.zoom'),{useEffect:true}),

                    inputs: {
                        vbx: document.querySelector('.input-field.x .inp'),
                        vby: document.querySelector('.input-field.y .inp'),
                        vbh: document.querySelector('.input-field.h .inp'),
                        vbw: document.querySelector('.input-field.w .inp'),
                        
                        update(viewBoxArray) {
                            this.vbx.value = viewBoxArray[0];
                            this.vby.value = viewBoxArray[1];
                            this.vbw.value = viewBoxArray[2];
                            this.vbh.value = viewBoxArray[3];
                            return viewBoxArray;
                        },
                    },

                    get target() {
                        return document.querySelector('.interface--preview .display svg');
                    },
                    get viewBox() { // returns array
                        return this.target.getAttribute('viewBox')
                    },
                    set viewBox(value) {
                        this.target.setAttribute('viewBox',value)
                        // console.log(value)
                    },
                    get value() {
                        return ['viewbox',this.viewBox]
                    },


                    setState(initial) {
                        this.reset();
                        this.initial = initial;
                    },
                    reset(value = 50) {
                        this.slider.setPercent(value)
                    },
                    disable() {
                        this.slider.disable();
                    },

                    setPosition(args) {
                        let [ index , value ] = args;

                        let viewbox = parseViewBoxString(this.viewBox);
                        viewbox[index] = value;

                        let newValue = parseViewBoxArray(viewbox);
                        this.target.setAttribute( 'viewBox', newValue );
                        
                        return viewbox;
                    },
                    setTarget(values) {
                        // console.log(values)
                        let pct = values.pct;
                        let zoom;
                        let factor;
                        let x;
                        if (this.initial) {
                            x = Number(this.initial[2]);
                            if (pct >= 50) {
                                factor = (pct - 50) * 2;
                                zoom = Math.trunc(x * (factor/100) + x);
                                // console.log(factor,zoom);
                            }
                            if (pct < 50) {
                                factor = Math.abs((pct * 2) - 100);
                                zoom = Math.trunc(x * (factor/100) - x);
                                // console.log(factor,zoom);
                            }
                            zoom = Math.abs(zoom).toString();
                            return this.setZoom({x: zoom},true)
                        } else
                            console.log('no initial viewbox value to update');
                    },

                    setZoom({x},useState=false) {
                        if (this.initial && !useState)
                            x = x + Number(this.initial[3]);
                        if (x <= 0)
                            return;
                        let values = [...this.initial];
                        values[2] = x;
                        values[3] = x;
                        return this.update(values)
                    },
                    setVBX({x}) {
                        x = x.toString();
                        let viewbox = this.setPosition([0,x]);
                        if (viewbox)
                            this.inputs.vbx.value = viewbox[0]
                    },
                    resetVBX(initial) {
                        this.viewBox.inputs.vbx.value = initial;
                        this.header.elements.vbx = initial;
                    },

                    setVBY({x}) {
                        let y = x.toString();
                        let viewbox = this.setPosition([1,y]);
                        if (viewbox)
                            this.inputs.vby.value = viewbox[1];
                    },
                    resetVBY(initial) {
                        this.viewBox.inputs.vby.value = initial;
                        this.header.elements.vby = initial;
                    },

                    setVBW({x}) {
                        if (this.initial)
                            x = x + Number(this.initial[3]);
                        if (x <= 0)
                            return;
                        let w = x.toString();
                        let viewbox = this.setPosition([2,w]);
                        if (viewbox)
                            this.inputs.vbw.value = viewbox[2];
                    },
                    resetVBW(initial) {
                        this.viewBox.inputs.vbw.value = initial;
                        this.header.elements.vbw = initial;
                    },

                    setVBH({x}) {
                        if (this.initial)
                            x = x + Number(this.initial[3]);
                        if (x <= 0)
                            return;
                        let h = x.toString();
                        let viewbox = this.setPosition([3,h]);
                        if (viewbox)
                            this.inputs.vbh.value = viewbox[3];

                    },
                    resetVBH(initial) {
                        this.viewBox.inputs.vbh.value = initial;
                        this.header.elements.vbh = initial;
                    },

                    update(array) {
                        let stringValue;
                        let arrayValue;
                        if (!Array.isArray(array)) {
                            arrayValue = parseViewBoxString(array);
                            stringValue = array;
                        } else {
                            arrayValue = array;
                            stringValue = parseViewBoxArray(array);
                        }
                        this.inputs.update(arrayValue);
                        this.viewBox = stringValue;
                        return arrayValue;
                    },
                    init() {
                        this.vbxs = new MouseTrackingSlider(this.vbx,this.setVBX.bind(this)).init();
                        this.vbys = new MouseTrackingSlider(this.vby,this.setVBY.bind(this)).init();
                        this.vbhs = new MouseTrackingSlider(this.vbh,this.setZoom.bind(this)).init();
                        this.vbws = new MouseTrackingSlider(this.vbw,this.setZoom.bind(this)).init();

                        this.slider.init(this.setTarget.bind(this));
                        this.slider.setPercent(50);
                        this.zoom.addEventListener('dblclick',() => this.reset())
                        this.vbh.addEventListener('dblclick',() => this.reset())
                        this.vbw.addEventListener('dblclick',() => this.reset())
                    }
                },
                rotate: {
                    button: document.querySelector('.rotate .label'),
                    slider: new Slider(document.querySelector('.rotate'),{ useEffect:true }),
                    state: {
                        px: undefined,
                        pct: undefined,
                        deg: undefined,
                        get value() {
                            return ['transform',`rotate(${this.deg})`]
                        },
                    },
                    get target() {
                        return document.querySelector('.interface--preview .display svg');
                    },
                    get value() {
                        return this.state.value;
                    },
                    init() {
                        this.slider.init(this.update.bind(this));
                        this.button.addEventListener('dblclick', () => this.reset());
                    },
                    reset() {
                        this.slider.reset();
                    },
                    disable() {
                        this.slider.disable();
                    },
                    update(values) {
                        let degrees = values.deg;
                        if (degrees || degrees === 0) {
                            this.target.setAttribute('transform',`rotate(${degrees})`);
                            this.setState(values);
                        }
                        return values;
                    },
                    setState(values) {
                        this.state = values;
                        return values;
                    },
                    setTarget(value) {
                        let values = this.slider.setDegrees(value);
                        this.setState(values);
                        return values;
                    },
                },

                update(values) {
                    console.log(values)
                    let {rotation,viewBox} = values;
                    this.rotate.update(rotation);
                    this.viewBox.update(viewBox)
                },
                reset() {
                    this.rotate.reset();
                },
                init() {
                    this.rotate.init();
                    this.viewBox.init();
                }
            },
            buttons: {
                fix: document.querySelector('.fix'),
                copy: document.querySelector('.copy'),
                border: document.querySelector('.border'),
                bench: document.querySelector('.btn-bench'),
            },
            target: {
                value: undefined,
                initial: new Map(),
                observer: {
                    name: undefined,
                    category: undefined,
                    id: undefined,
                    cid: undefined,
                    values: new Map(),
                },
                get target() {
                    return this.icon;
                },
                set target(val) {
                    this.icon = val;
                },
                get element() {
                    return document.querySelector('.interface--preview .display svg');
                },
                get benchElement() {
                    return this.target.benchPreview
                },
                get components() {
                    return this.target.previews;
                },
                get clone() {
                    return new IconNode(this.observer);
                },
                get index() {
                    return {
                        id: this.observer.id,
                        cid: this.observer.cid,
                    }
                },
                get viewBox() {
                    let viewbox = this.element.getAttribute('viewBox')
                    if (viewbox) {
                        let values = parseViewBoxString(viewbox)
                        return values;
                    } else
                        return false;
                },
                set viewBox(string) {
                    this.element.setAttribute('viewBox',string);
                    this.observer.values.set('viewBox',string);
                },

                updateViewbox(values) {
                    let val;
                    if (Array.isArray(values))
                        val = this.formatViewBoxArray(values);

                    this.observer.values.set('viewBox', val);

                    return val;
                },
                setPosition(args) {
                    let [ index , value ] = args;

                    let viewbox = parseViewBoxString(this.viewBox);
                    viewbox[index] = value;
                    let newValue = parseViewBoxArray(viewbox);

                    this.element.viewBox = newValue;

                    return viewbox;
                },
                setRotation(string) {
                    this.observer.values.set('transform',`rotate(${string})`);
                },

                copy() {
                    window.navigator.clipboard.writeText(this.element.outerHTML);
                    console.log('copied')
                    return;
                },
                update() {
                    return this.target.save(this.observer)
                }
            },
            components: {
                element: document.querySelector('.tab-window.preview'),
                update(value) {
                    this.element.innerHTML = value;
                }
            },
            get targetElement() {
                return document.querySelector('.interface--preview .display svg');
            },

            showBorder() {
                this.targetElement.style.border = '1px dotted red';
            },
            hideBorder() {
                this.targetElement.style.border = '';
            },
            toggleBorder() {
                if (!this.targetElement.style.border)
                    this.showBorder();
                else
                    this.hideBorder();
            },


            update(icon) {
                this.icon = icon;
                this.target.value = icon;
                this.target.observer = icon.observer;
                this.target.initial = new Map(icon.observer.values.entries());
                this.header.update(icon.header);
                this.trackers.viewBox.update(icon.viewBox);
                this.components.update(icon.previews.all);

                let rotation = icon.observer.values.get('transform');
                let viewBox = icon.observer.values.get('viewBox');
                console.log(viewBox)
                if (rotation.value)
                    this.trackers.rotate.update(rotation)
                else
                    this.trackers.rotate.reset();
                if (viewBox) {
                    this.trackers.viewBox.setState(parseViewBoxString(viewBox))
                    this.trackers.viewBox.update(viewBox)
                }
        
                return icon;
            },
            save() {
                let rotation = this.trackers.rotate.value;
                let viewBox = this.trackers.viewBox.value;

                this.target.observer.values.set(rotation);
                this.target.observer.values.set(viewBox);

                let props = this.target.update();
                this.components.update(props.previews);

                console.log(props.values);
                return this.icon;
            },
            init() {
                let buttons = this.buttons;

                this.trackers.init();
                buttons.border.onclick = () => this.toggleBorder();
                buttons.bench.onclick = () => app.bench.toggle(this.icon);
            }
        },


        bench: {
            element: document.querySelector('.bench'),
            menu: {
                element: document.querySelector('.bench--toggle-menu'),
                select: document.querySelector('.bench--toggle-menu .select'),
                delete: document.querySelector('.bench--toggle-menu .wipe'),
                export: document.querySelector('.bench--toggle-menu .export')
            },
            wrapper: new ModalHandler(document.querySelector('.bench--wrapper'), {
                onClose: function() {
                    app.preview.tabs.toggleActiveState()
                },
                onOpen: function() {
                    app.preview.tabs.togglePendingState()
                },
                closers: [document.querySelector('.btn.btn-alternate')],
                togglers: [document.querySelector('.btn.toBench')],
            }).init(),

            state:'empty',
            bucket: new Bench(),
            selected: new Map(),


            add(icon) {
                let key = icon.id;
                let value = icon;
                let pushSuccessful = this.bucket.push(key,value);
                if (pushSuccessful) {
                    this.highlightDasboardElement(key)
                    this.addSelectedToBench(value)
                    return this.updateStatus();
                } else {
                    console.log('err something went wrong adding to your bench')
                }
            },
            remove(id) {
                let pluckSuccessful = this.bucket.pluck(id);
                if (pluckSuccessful) {
                    this.removeHighlightFromDashboardElement(id);
                    this.removeSelectedFromBench(id);
                    return this.updateStatus()
                } else {
                    console.log('err something went wrong with plucking from your bench')
                }
            },
            toggle(icon) {
                console.log(icon)
                let status = this.getIconStatus(icon.id);
                console.log(status)
                if (status) {
                    this.remove(icon.id)
                } else if (!status) {
                    this.add(icon)
                }
            },
            _bind(id) {
                const dashboard = app.dashboard.element;
                const binding = dashboard.querySelector(`[data-id="${id}"]`)
                return binding;
            },
            _find(id) {
                return this.element.querySelector(`[data-id="${id}"]`)
            },


            getIconStatus(id) {
                return this.bucket.has(id);
            },
            updateStatus() {
                if (this.bucket.size > 0 && this.state !== 'ready' && this.state !== 'selectAll') {
                    this.state = 'ready'
                    return this.state;
                }
                else if (this.bucket.size === 0 && this.state !== 'empty') {
                    this.state = 'empty'
                    return this.state;
                }
                return this.state;
            },


            addSelectedToBench(icon) {
                this.element.appendChild(icon.benchPreview)
            },
            highlightDasboardElement(id) {
                let binding = this._bind(id);
                if (!binding.classList.contains('benched'))
                    binding.classList.add('benched')
                else
                    console.log('something went wrong finding an element with the id of',id)
            },

            removeSelectedFromBench(id) {
                let element = this._find(id);
                this.element.removeChild(element)
            },
            removeHighlightFromDashboardElement(id) {
                let binding = this._bind(id)
                if (binding.classList.contains('benched'))
                    binding.classList.remove('benched')
                else
                    console.log('cant find dashboard element by the id of',id)
            },


            toggleSelected(id,element) {
                let selected = this.bucket.use(id);
                let flag = selected.isSelected;
                if (flag) {
                    selected.isSelected = false;
                    this.selected.delete(id);
                    this.unselectFromBench(element);
                } else {
                    selected.isSelected = true;
                    this.selected.set(id,selected);
                    this.selectFromBench(element)
                }
            },
            selectFromBench(element) {
                element.classList.add('selected')
            },
            unselectFromBench(element) {
                element.classList.remove('selected');
            },
            deleteSelected() {
                let selected = Array.from(this.selected.keys())
                if (selected.length > 0)
                    selected.forEach(id => {
                        this.selected.get(id).isSelected = false;
                        this.selected.delete(id);
                        this.remove(id);
                    })
            },
            toggleSelectAll() {
                if (this.state !== 'empty') {
                    console.log('yo')
                    if (this.state == 'selectAll') {
                        console.log('yo yo')
                        this.state = 'ready'
                        this.unselectAllInBench();
                    } else {
                        console.log('yo yo')
                        this.state = 'selectAll'
                        this.selectAllInBench();
                    }
                }
            },
            selectAllInBench() {
                console.log('yo yo yo')
                let targets = Array.from(this.element.children);
                let group = this.bucket.useValues();
                group.forEach(value => value.isSelected = true)
                targets.forEach(child => child.classList.add('selected'))
                this.selected = new Map(this.bucket.useEntries());
            },
            unselectAllInBench() {
                let targets = Array.from(this.element.children);
                let group = this.bucket.useValues();
                group.forEach(value => value.isSelected = false);
                targets.forEach(child => child.classList.remove('selected'))
                this.selected = new Map()
            },


            toggleExportMenu() {
                document.querySelector('.interface').classList.add('passive')
                document.querySelector('.interface--menu').classList.add('active')
                // this.bench.wrapper.style.transform = 'translateY(-250px)'
            },

            init() {
                this.element.addEventListener('click', (e) => {
                    console.log('yo')
                    let el = e.target.closest('.comp--bench')
                    let key;
                    console.log(key,el)
                    if (el)
                        key = Number(el.dataset.id);
                    else 
                        return;
                        
                    if (el && key)
                        this.toggleSelected(key,el);
                })

                this.menu.select.addEventListener('click',() => {
                    console.log('yoooo')
                    this.toggleSelectAll();
                })
                this.menu.delete.addEventListener('click',() => {
                    this.deleteSelected();
                })
                this.menu.export.addEventListener('click',() => {
                    this.toggleExportMenu();
                })
            }
        },


        keyBindings: {
            alt: {
                up() { // scroll to previous section
                    // ...
                },
                down() { // scroll to next section
                    // ...
                },
                left() { // skip next element
                    // ...
                },
                right() { // skip next element
                    // ...
                },
                enter() { // toggle search modal
                    // ...
                },
                b() { // bench selected
                    // ...
                },
                p() { // copy selected
                    // ...
                },
                f() { // add selected to favorites
                    // ...
                },
                slash() { // open export modal
                    // ...
                },
                one() { // open component modal
                    // ...
                },

            }
        },


        getIcon(key) {
            let icon = this.model.all.items.get(key)
            return icon
        },
        getProps(key) {
            let props = this.getIcon(key).props;
            return props
        },

        updateDashboardHeader(name) {
            document.querySelector('.page-navigator .current-title').textContent = name;
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
        handleKeyBind(e) {

        },
        onClick(e) {
            let wrapper = e.target.closest('.svg-wrapper');
            let icon;
            if (wrapper) {
                if ('rebased' in wrapper.dataset)
                    icon = this.getIcon(wrapper.dataset.rebased)
                else if ('name' in wrapper.dataset)
                    icon = this.getIcon(wrapper.dataset.name);
                else {
                    console.log('couldn\'t find the refernce name on the element')
                    return null
                }
                this.preview.update(icon);
            } else
                return null;
        },
        onDblClick(e) {
            let wrapper = e.target.closest('.svg-wrapper');
            if (wrapper) {
                'rebased' in wrapper.dataset
                ? this.copy(wrapper.dataset.name)
                : this.copy(wrapper.dataset.rebased);
                return;
            } else if (key) {
                this.copy(key)
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
                this.bench.toggle(this.getIcon(key));
            } else {
                return null;
            }
        },
        onNextSection(e) {
            let nextSection = this.tabCursor.skipToNext();
            let nextSectionName = toUpper(nextSection);
            let next = document.querySelector(`[data-tab="${nextSection}"]`);

            this.dashboard.element.scrollBy(0,next.getBoundingClientRect().top - 120);

            this.updateDashboardHeader(nextSectionName)
        },
        onPrevSection(e) {
            let prevSection = this.tabCursor.skipToPrev();
            let prevSectionName = toUpper(prevSection);
            let previous = document.querySelector(`[data-tab="${prevSection}"]`)

            this.dashboard.element.scrollBy(0,previous.getBoundingClientRect().top - 120);

            this.updateDashboardHeader(prevSectionName);
        },
        scrollToTop() {
            // console.log(this.element,this.title)
            this.dashboard.element.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            })
            let currentTab = this.tabKeys[0];
            this.tabCursor.skipToIndex(0);
            if (this.dashboard.title.textContent !== toUpper(currentTab))
                this.updateDashboardHeader(toUpper(currentTab))
        },

        init(model) {
            this.model = model;
            // MAIN INDEX KEYS
            this.currentTab = "all";
            this.currentKeyset = model.all.useKeys();
            this.currentCursor = model.all.cursor;
            // DASHBOARD NAVIGATOR
            this.tabKeys = Array.from(model.categorySet.values());
            this.tabCursor = new Cursor(this.tabKeys)

            let dashboard = this.dashboard;
            let scrollObserverOptions = {
                root: dashboard.element,
                rootMargin: '-5% 0% -55% 0%',
                threshold: 1,
            };
            let scrollFunc = (entries) => {
                entries.forEach(entry => {
                    let currentTab;
                    let navigatorState;
                    if (entry.isIntersecting) {
                        currentTab = entry.target.parentElement.dataset.tab
                        navigatorState = document.querySelector('.page-navigator .current-title').textContent
                    }
                    if (entry.isIntersecting && navigatorState !== currentTab) {
                        let cursorIndex = app.tabKeys.indexOf(currentTab);
                        app.tabCursor.skipToIndex(cursorIndex);
                        app.updateDashboardHeader(toUpper(entry.target.parentElement.dataset.tab));
                    }
                })
            }
            let scrollObserver = new IntersectionObserver(scrollFunc,scrollObserverOptions);

            buildDashBoardAndLinks();
            hydrateListeners()
            this.preview.tabs.init();
            this.menu.tabs.init();
            this.preview.init();
            this.bench.init();

            function buildDashBoardAndLinks() {
                const dashboard = document.querySelector('.svg-dashboard');
                const dashFrag = document.createDocumentFragment();
    
                const category_menu = document.querySelector('.side-menu[data-tab="categories"] .menu-links');
                const menuFrag = document.createDocumentFragment();
                category_menu.innerHTML = '';

                model.categorySet.forEach(category => {
                    // create elements
                    // console.log(model.categories[category].bucket)
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
                    model.categories[category].items.forEach(value => dash.appendChild(value.showcase));
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
            function hydrateListeners(){
                window.addEventListener('keydown', (e) => {
                    if (e.key == 'Control' && app.mode !== 'select') {
                        app.mode = 'select'
                        // console.log('changed mode to ',app.mode);
                    }
                });
                window.addEventListener('keyup', () => {
                    if (app.mode !== 'click')
                        app.mode = 'click'
                });
                dashboard.element.addEventListener('mousedown',(e) => app.handleClick(e));
                dashboard.element.addEventListener('dblclick',(e) => app.onDblClick(e));
                dashboard.next.addEventListener('click', () => app.onNextSection());
                dashboard.prev.addEventListener('click', () => app.onPrevSection());
                dashboard.title.addEventListener('click',() => app.scrollToTop());
                app.scrollToTop();
            }

        },
}

function toUpper(string) {
    return string[0].toUpperCase() + string.substring(1);
}

function parseViewBoxString(string) {
    if (Array.isArray(string)) {
        console.log('I think you trying to parse an array... try a string next time')
        return string
    }
    return string.split(/\s+|,/);
}

function parseViewBoxArray(array) {
    if (!Array.isArray(array)) {
        console.log('I think your trying to format a string... try an array next time')
        return array;
    }
    return array.slice().join(' ');
}

function parseJSON(data) {
    let backpack = data[2];
    let key = backpack.name
    let meta = new IconNode(backpack)
    SvgModel.addOne(key,meta,{quiet:true});
}

function compileData(data) {
    data.forEach(parseJSON);
    app.init(SvgModel)
}

// ------------------------------------------------------------- //
// BUILD STEP //
// ------------------------------------------------------------- //
(function loadData() {
    fetch('./data/icons.json')
        .then((res) => { return res.json()})
        .then(compileData)
})()