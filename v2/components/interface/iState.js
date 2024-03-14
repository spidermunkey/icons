export default class Icon {
    constructor(props) { // => returns dom element
        this.props = this.deepClone(props);
        this.static = props;
        let element = this.createElement(props);
        function setDefaultViewBox() {
            let vb = element.getAttribute('viewBox');
            if (vb) {
                this.static.viewBox = vb.split(/\s+|,/)
            } else {
                this.static.viewBox = ["0", "0", "24", "24"];
                element.setAttribute('viewBox',"0 0 24 24");
            }
        }
        function setDefaultDimensions() {
            let height = element.getAttribute('height');
            let width = element.getAttribute('width');
            if (height)
                this.props.height = height;
            else {
                this.props.height = "24px"
                element.setAttribute('height',"24px")
            }
            if (width)
                this.props.width = width;
            else {
                this.props.width = "24px"
                element.setAttribute('width',"24px")
            }
        }
        function getColors() {
            let fill = element.getAttribute('fill')
            let stroke = element.getAttribute('stroke')
            if (fill)
                this.props.fill = fill;
            else if (fill === 'none' || !fill)
                this.props.fill = 'none'
            if (stroke)
                this.props.stroke = stroke;
            else if (stroke === 'none' || !stroke)
                this.props.stroke = 'none'
        }
        function getPaths() {

        }
        function preFormat() {
            setDefaultViewBox();
            setDefaultDimensions();
            this.props.markup = element.outerHTML;
        }
        preFormat();
    }

    deepClone(obj, hash = new WeakMap()) {
        if (Object(obj) !== obj) return obj; // primitives
        if (hash.has(obj)) return hash.get(obj); // cyclic reference
        const result = obj instanceof Set ? new Set(obj) // See note about this!
                     : obj instanceof Map ? new Map(Array.from(obj, ([key, val]) => 
                                            [key, this.deepClone(val, hash)])) 
                     : obj instanceof Date ? new Date(obj)
                     : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
                     // ... add here any specific treatment for other classes ...
                     // and finally a catch-all:
                     : obj.constructor ? new obj.constructor() 
                     : Object.create(null);
        hash.set(obj, result);
        return Object.assign(result, ...Object.keys(obj).map(
            key => ({ [key]: this.deepClone(obj[key], hash) }) ));
    }
    update() {
        this.static = {
            ...this.static,
            ...this.props,
        }
        this.props = this.deepClone(this.static);
        console.log('overwriting!')
        return this;
    }
    createElement(props) {
        let el = document.createElement('div');
        el.dataset.category = props.category;
        el.dataset.id = props.id;
        el.dataset.cid = props.cid;
        el.dataset.name = props.name;
        el.innerHTML = props.markup;
        // console.dir(el)
        return el;
    }
    hasViewBox() {
        let vb = this.element.getAttribute('viewBox')
        if (vb)
            return true
        else
            return false;
    }
    log() {
        console.log(this.element,this.svg)
        console.dir(this.element,this.svg);
    }
    // get () {
    //     return this.element;
    // }
    get head() {
        return {
            markup: this.svg,
            name: this.name,
            category: this.category
        }
    }
    get svg() {
        let currentMarkup = this.static.markup;
        let svg = document.createElement('svg');
        svg.outerHTML = currentMarkup;

        return svg;
    }
    get name() {
        return this.key.toString().replaceAll('_',' ').toLowerCase();
    }
    get key() {
        if (this.static.rebased)
            return this.static.rebased;
        else if (this.static.name)
            return this.static.name;
    }
    get cKey() {
        return this.static.category;
    }
    get category() {
        return this.static.cKey.toString().replaceAll('_',' ');
    }
    get id() {
        return this.static.main_id;
    }
    set id(val) {
        if (!this.static.main_id)
            this.static.main_id = val;
    }
    get cid() {
        return this.static.category_id;
    }
    set cid(val) {
        if (!this.static.category_id)
            this.static.category_id = val;
    }

    get markup() {
        return this.static.markup;
    }
    get viewBox() {
        return this.static.viewBox;
    }
    get fill() {
        return this.static.fill;
    }
    get stroke() {
        return this.static.stroke;
    }
    get colors() {
        return {
            fill: this.fill,
            stroke: this.stroke,
        }
    }
    get tranformations() {
        let t = this.static.tranformations;
        if (t)
            return t;
        else 
            return false;
    }
    get height() {
        return this.static.height;
    }
    set height(h) {
        this.static.height = h;
    }
    get width() {
        return this.static.width;
    }
    set width(w) {
        this.static.width = w;
    }

    // edit viewBox
    set viewBox(array) {
        this.static.viewBox = array;
    }
    set vbx(x) {
        this.viewBox[0] = x;
    }
    set vby(y) {
        this.viewBox[1] = y;
    }
    set vbw(w) {
        this.viewBox[2] = w;
    }
    set vbh(h) {
        this.viewBox[3] = h;
    }

    // get elements
    get element() {
        return this.createElement(this.static)
    }
    get showcase() {
        let showcase = this.element;
        showcase.dataset.role = 'svg_wrapper';
        showcase.classList.add('svg-wrapper');
        return showcase;
    }
    get benchPreview() {
        let benchButton = this.element;
        benchButton.classList.add('.comp--bench','button--sm');
        benchButton.dataset.role = 'bench_preview';
        benchButton.dataset.id = this.props.id;
        return benchButton;
    }
}