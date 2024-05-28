export class IconNode {
    constructor(props) {
        this.name = props.name;
        this.category = props.category;
        this.markup = props.markup;
        this.isFavorite = props.isFavorite || false;
        this.knownCollections = props.knownCollections || [];
        this.id = props.id || undefined;
        this.cid = props.cid || undefined;
        this.values = this.parseElement(this.createWrapper(props));
        this.versions = new Map();
        this.observer = structuredClone({
            ...props,
            isFavorite: this.isFavorite,
            knownCollections: Array.from(this.knownCollections),
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
    get bench(){
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
            logo: {
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
            button: {
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
    get html() {
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
    set viewBox(string) {
        if (Array.isArray(string))
            string = this.formatViewBoxArray(string);
        // make sure its a string
        this.observer.values.set('viewBox',string);
        // console.log('viewbox set to',string, this.observer.values.get('viewBox'));
    }

    set pos(args) {
        let [index,val] = args;
        let viewbox = this.observer.values.get('viewBox');
        // convert to array
        let vb = this.parseViewBoxString(viewbox);
        // swap values
        vb[index] = val;
        // convert back to a string
        viewbox = this.formatViewBoxArray(vb);
        return;
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
        this.observer.values.set('rotation',deg)
        return deg;
    }
    get rotation() {
        return this.observer.values.rotation
    }

    save(value) {
        // this.props = value;
        // this.versions.push(value);
        // console.dir('saving current observer as a new icon',this.observer,this.props)

        let cpy = new IconNode(this.observer)
        // console.dir('heres the copy',cpy)
        // return new IconNode(props)
        return cpy;
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
        if (!element) {
            console.log('invalid operation')
            return;
        }
        let icon = element.querySelector('svg');

        let values = new Map([
            ['height',icon.getAttribute('height')],
            ['width',icon.getAttribute('width')],
            ['x',icon.getAttribute('x')],
            ['y',icon.getAttribute('y')],
            ['viewBox',icon.getAttribute('viewBox')],
            ['transform',{value: icon.getAttribute('transform')}],
            ['rotation',icon.dataset.rotation]
        ]);
        return values;
    }
    parseViewBoxString(string) {
        if (Array.isArray(string)) {
            console.log('I think you trying to parse an array... try a string next time')
            return string
        }
    
        return string.split(/\s+|,/).map(value => Number(value));
    }
    formatViewBoxArray(array) {
        if (!Array.isArray(array)) {
            console.log('I think your trying to format a string... try an array next time')
            return array;
        }
    
        return array.join(' ');
    }

    createWrapper(props,opts = {useValues: false}){
        let {name,category,markup,values} = props || this;
        // console.log(props)
            
        let el = document.createElement('div');
        el.dataset.category = category;
        el.dataset.name = name;
        el.dataset.cid = this.cid;
        el.dataset.id = this.id;
        el.innerHTML = markup;
        // console.log(el)
        let icon = el.querySelector('svg');
        if (!icon) {
            console.log(props._id,'is an invalid object')
            return undefined
        }
        if (!icon.getAttribute('viewBox')) {
            console.warn('setting default viewbox in',category)
            icon.setAttribute('viewBox','0 0 24 24');
            this.markup = icon.outerHTML
        }
        else if (values && opts.useValues) {
            return this.getUpdatedClone(el,values);
        }
        return el;
    }

    getComponent(type,size) {
        if ( !this.previews[type] || type == 'all' ) 
            return `type ${type} not found`;
        if ( !this.previews[type][size] || size == 'all' ) 
            return `type ${type} found but not component ${size}`;

        return this.previews[type][size]
        
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
