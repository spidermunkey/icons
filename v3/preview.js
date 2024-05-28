const PreviewController = {
    observer: undefined,
    set target(reference) {
        this.observer = structuredClone(reference)
    },
    get target() {
        return this.observer
    },

    updateValues() {

    }


}

function setTarget(value) {
    PreviewController.target = value;
}

function getAllCollections() {
    return SvgModel.collections
}
function findCollection(dest) {
    let destination = SvgModel.collections[dest]
    if (destination)
        return destination
    else 
        return false;
}

function saveTo(dest,data) {
    let collection = findCollection(dest);
    if (collection) {
        destination.addOne(data)
        return true;
    }
    else {
        console.error('collection by the name of',dest,'does not exist')
        return false;
    }
}

function getUpdatedValues() {
    return PreviewController.target;
}
function getBenchedValues() {
    return app.bench.bucket.useValues();
}

const brb = {
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
                // this.sliders.rotate.update = (values) => {
                //     this.observer.rotation = values.deg;
                // }
        
                // this.update(vb);
                return vb;
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
                this.update(obj)
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
        bucket: new Bucket(),
        add(props) {
            this.element.appendChild(this.createIcon(props))
        },
        createIcon(props) {
            let el = document.createElement('div');
            el.dataset.category = props.category;
            el.dataset.name = props.name;
            el.dataset.id = props.main_id;
            el.dataset.role = 'svg_wrapper';
            el.classList.add('comp--bench','button--sm');
            el.innerHTML = props.markup;
            return el;
        },
        remove(id) {
            this.element.removeChild(this.element.querySelector(`[data-id="${id}"]`))
        }
        
    },
    observer: {
        get markup() {
            return document.querySelector('.interface--preview .display svg').outerHTML;
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
        document.querySelectorAll('.interface .comp svg').forEach(icon => icon.outerHTML = markup || this.observer.markup)
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
        app.saveProps(saved);
        this.updatePreviews()
    },
    addToBench(props) {
        let isQued = this.bench.bucket.push(props)
        if (isQued) {
            this.bench.add(props)
        }
            return isQued;
    },
    pluckFromBench(id) {
        let gone = this.bench.bucket.pluck(id);
        if (gone)
            this.bench.remove(id);
        return gone
    },
    toggleBench(props) {
        let status = this.addToBench(props);
        if (!status) {
            this.pluckFromBench(props.main_id)
        }
    },
    toggleNext() {
        app.state.current.toggleNext();
        this.updateRecievers();
    },
    togglePrev() {
        app.state.current.togglePrev();
        this.updateRecievers();
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
            console.log(el);
            if (el)
                this.pluckFromBench(Number(el.dataset.id))
        })
        // document.querySelector('.tab-link[data-window="preview"]').addEventListener('click', () => this.updatePreviews())
        this.tabs.init();
    }
    
}