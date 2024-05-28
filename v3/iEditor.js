class PreviewInterface {
    constructor(target) {
        this.observer = undefined;
        this.concrete = undefined;
        this.initial = undefined;

        this.target = target || document.querySelector('[data-role="preview_icon"] svg')
        this.previews = document.querySelectorAll('.interface .comp svg')
        this.vbx = document.querySelector('.input-field.x .inp')
        this.vby = document.querySelector('.input-field.y .inp')
        this.vbh = document.querySelector('.input-field.h .inp')
        this.vbw = document.querySelector('.input-field.w .inp')
        this.buttons = {
            fix: document.querySelector('.fix'),
            copy: document.querySelector('.copy'),
            border: document.querySelector('.border'),
            next: document.querySelector('.interface .next'),
            prev: document.querySelector('.interface .prev'),
            save: document.querySelector('.toRefs'),
            bench: document.querySelector('.toBench'),
            vbx: document.querySelector('.input-field.x .label'),
            vby: document.querySelector('.input-field.y .label'),
            vbh: document.querySelector('.input-field.h .label'),
            vbw: document.querySelector('.input-field.w .label'),
        }
        this.sliders = {
            rotate: {
                target,
                button: document.querySelector('.rotate .label'),
                slider: new SlidingTracker(document.querySelector('.rotate')),
                state: {
                    px: undefined,
                    pct: undefined,
                    deg: undefined,
                },
                init() {
                    this.slider.init(this);
                },
                disable() {
                    this.slider.disable();
                },
                reset() {
                    this.slider.reset();
                },
                setState(obj) {
                    this.state = obj;
                    if (this.update)
                        this.update(obj.deg);
                },
                setIntial(deg) {
                    this.slider.setState('deg',deg);
                },
                setTarget(values) {
                    this.target.setAttribute('rotate',`${values.deg}`);
                },
            },
            zoom: {
                target,
                button: document.querySelector('.zoom .label'),
                slider: new SlidingTracker(document.querySelector('.zoom')),
            }
        }
        this.bench = {
            element: document.querySelector('.bench'),
            bucket: new Bucket(),
            add(icon) {
                let isQued = this.bucket.push(icon.static);
                if (isQued)
                    this.element.appendChild(icon.benchPreview);
                return isQued;
            },
            pluck(id) {
                let gone = this.bucket.pluck(id);
                if (gone)
                    this.element.removeChild(this.element.querySelector(`[data-id="${id}"]`));
                return gone;
            },
        }
        this.tabs = new TabHandler({
            tabs: [...document.querySelectorAll('.js-tabber--tab-interface')],
            wrappers: [...document.querySelectorAll('.js-tabber--window-interface')],
            initial: 'preview',
            modals: ['bench'],
        })
    }

    get target() {
        return document.querySelector('[data-role="preview_icon"] svg')
    }
    set target(icon) {
        let {name,markup,category,viewBox} = icon.props;
        this.header = {name,markup,category};
        this.obsever = icon.props;
        this.concrete = icon;
        this.viewBox = viewBox;
    }

    get name() {
        return document.querySelector('.interface--description .name');
    }
    set name(val) {
        this.name.textContent = val
            .toString().replaceAll('_',' ').toLowerCase();
    }

    get category() {
        return document.querySelector('.interface--description .category');
    }
    set category(val) {
        this.category.textContent = val
            .toString().replaceAll('_',' ');
    }

    get header() {
        return {
            markup: this.target.outerHTML,
            name: this.name,
            category: this.category,
        }
    }
    set header(values) {
        let {markup,name,category} = values
        this.name = name;
        this.target = markup;
        this.category = category;
    }

    set vbx(val) {
        this.vbx.value = val;
    }
    set vby(val) {
        this.vby.value = val;
    }
    set vbh(val) {
        this.vbh.value = val;
    }
    set vbw(val) {
        this.vbw.value = val;
    }

    set viewBoxInputs(array) {
        this.vbx = array[0];
        this.vby = array[1];
        this.vbw = array[2];
        this.vbh = array[3];
    }
    set viewBox(array) {
        this.target.setAttribute('viewBox',array);
        this.observer.viewBox = array;
        this.observer.x = array[0];
        this.observer.y = array[1];
        this.observer.w = array[2];
        this.observer.h = array[3];
    }
    get viewBox() {
        return this.observer.viewBox;
    }

    setX(val) {
        if (this.observer.x)
            val = Number(val) + Number(this.observer.x);
        
        this.observer.x = val;
        this.viewBox[0] = String(val);
        this.vbx = val;
        this.updateViewBox(this.viewBox);
    }
    resetX() {
        let xInitial = this.initial.x;
        this.vbx = xInitial;
        this.setX(xInitial);
    }
    setY(val) {
        if (this.observer.y)
            val = Number(val) + Number(this.observer.y);
        
        this.observer.y = val;
        this.viewBox[1] = String(val);
        this.vby = Number(val);
        this.updateViewBox(this.viewBox);
    }
    resetY() {
        let yInitial = this.initial.y;
        this.vby = yInitial;
        this.setY(yInitial);
    }
    setW(val) {
        if (this.observer.w)
            val = Number(val) + Number(this.observer.w);
        
        this.observer.w = val;
        this.viewBox[2] = String(val);
        this.vbw = Number(val);
        this.updateViewBox(this.viewBox);
    }
    resetW() {
        let wInitial = this.initial.w;
        this.vbx = wInitial;
        this.setW(wInitial);
    }
    setH(val) {
        if (this.observer.h)
            val = Number(val) + Number(this.observer.h);
        
        this.observer.h = val;
        this.viewBox[3] = String(val);
        this.vbh = Number(val);
        this.updateViewBox(this.viewBox);
    }
    resetX() {
        let hInitial = this.initial.h;
        this.vbx = hInitial;
        this.setH(hInitial);
    }
    updateViewBox(array) {
        this.target.setAttribute('viewBox',array);
        return array;
    }
    setViewBox(array) {
        this.observer.viewBox = array;
    }

    rotateTarget(deg) {
        this.target.setAttribute('rotate',`${deg}`);
        return deg;
    }
    setRotation(deg) {
        this.observer.transformations.rotate = deg;
        return this.observer;
    }

    toggleBorder() {
        if (!this.icon.element.style.border)
            this.target.style.border = '1px dotted red'
        else
            this.target.style.border = ''
    }

    updatePreviews() {
        this.previews.forEach(icon => icon.outerHTML = this.observer.markup)
    }
    track(event,setter,initial) {
        // console.log('tracking',event.target)
        // console.log(event.pageX);
        event.target.onpointermove = (event) => setter(this.getPosX(event));
        event.target.setPointerCapture(event.pointerId);
    }
    stop(event) {
        // console.log('tracking stopped')
        this.xPosInitial = null;
        event.target.onpointermove = null;
        event.target.releasePointerCapture(event.pointerId);
        // console.log(this.xPosInitial);
    }
    copy() {
        window.navigator.writeText(this.observer.markup)
    }
    save() {
        this.concrete.update(this.observer);
    }
    bench(element) {
        
    }
    init() {
        this.buttons.vbx.addEventListener('pointerdown', (e) => this.track(e,this.setVBX.bind(this)))
        this.buttons.vbx.addEventListener('dblclick',() => this.resetVBX());
        this.vbx.addEventListener('input', (e) => this.vbx = e.target.value);
        
        this.buttons.vby.addEventListener('pointerdown', (e) => this.track(e,this.setVBY.bind(this)))
        this.buttons.vby.addEventListener('dblclick', () => this.resetVBY());
        this.vby.addEventListener('input', (e) => this.vby = e.target.value);
        
        this.buttons.vbw.addEventListener('pointerdown', (e) => this.track(e,this.setVBW.bind(this)))
        this.buttons.vbw.addEventListener('dblclick', () => this.resetVBW());
        this.vbw.addEventListener('input',(e) => this.vbw = e.target.value);
        
        this.buttons.vbh.addEventListener('pointerdown', (e) => this.track(e,this.setVBH.bind(this)))
        this.vbh.addEventListener('input', (e) => this.vbh = e.target.value);
        this.buttons.vbh.addEventListener('dblclick', () => this.resetVBH());

        this.sliders.rotate.button.addEventListener('click', () => this.sliders.rotate.reset());
        this.sliders.rotate.init();
        this.sliders.rotate.update = (deg) => this.observer.transformations.rotate = deg

        this.sliders.zoom.button.addEventListener('click',() => this.sliders.zoom.reset())
        this.sliders.zoom.init();
        this.sliders.zoom.update = (array) => this.viewbox = array

        this.tabs.init();
        this.buttons.save.addEventListener('click', () => this.save())
        this.buttons.bucket.addEventListener('click', () => this.bench(this.concrete.benchPreview))
    }
}