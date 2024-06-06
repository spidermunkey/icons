export class Icon {

    constructor(props) {

        this.name = props.name;
        this.category = props.category;
        this.markup = props.markup;

        this.id = uuid();
        this.trace = props.id;
        this.vid = props.vid;
        this.cid = props.cid;
        
        this.isFavorite = props.isFavorite;
        this.isBenched = props.isBenched;

        this.rebased = props.rebased;
        this.type = props.type || 'default';
        this.colors = props.colors;
        this.styles = props.styles;
        this.created_at = props.created_at;

        this.element = this.createWrapper(props);
        this.values = Icon.parse(this.element);
    }

    get props() {
        return {
            name: this.name,
            category: this.category,
            markup: this.markup,
            rebased: this.rebased,

            isFavorite: this.isFavorite,
            isBenched: this.isBenched,

            type: this.type,
            colors: this.colors,
            styles: this.styles,

            id: this.id,
            vid: this.vid,
            cid: this.cid,
            trace: this.trace,
            values: this.values,
            created_at: this.created_at,
        }
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
        if (this.values.viewBox)
            return this.parseViewBoxString(this.values['viewBox'])
        else return false;
    }
    set viewBox(string) {
        if (Array.isArray(string))
            string = this.formatViewBoxArray(string);
        this.values['viewBox'] = string;
        this.element.setAttribute('viewBox',stringValue);
    }
    set pos(args) {
        let [index,val] = args;
        let vb = this.parseViewBoxString(this.values['viewBox']);
        vb[index] = val;
        this.viewBox = this.formatViewBoxArray(vb);
    }

    set vbx(x) {
        this.pos = [0,x]
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

    get height() {
        if (this.values['height'])
            return this.values.get('height').split('p')[0]
        return null;
    }
    set height(value) {
        this.values.height = value;
    }
    get width() {
        if (this.values['width'])
            return this.values['width'].split('p')[0];
        return null;
    }

    set width(value) {
        this.values.width = value;
    }

    get stroke() {
        return this.values['stroke'];
    }

    get fill() {
        return this.values['fill'];
    }

    set rotation(deg) {

        this.values['rotation'] = deg
        return deg;
    }

    get rotation() {
        return this.values.rotation
    }

    save() {
        let cpy = new IconNode(this.use())
        cpy.created_at = DateTime.stamp();
        return cpy;
    }

    copy() {
        window.navigator.clipboard.writeText(this.markup)
        console.log('copied');
        return true;
    }

    use() {
        return structuredClone(this.props);
    }

    mark(children) {
        children.forEach(child => {
            child.setAttribute('pid',uuid())
        })
    }

    clearMark() {
        children.forEach(child => {
            child.removeAttribute('pid');
        })
    }

    static parse(element) {
        let icon = element.querySelector('svg');
        return {
            'height':icon.getAttribute('height'),
            'width': icon.getAttribute('width'),
            'stroke': icon.getAttribute('stroke'),
            'fill': icon.getAttribute('fill'),
            'x': icon.getAttribute('x'),
            'y': icon.getAttribute('y'),
            'viewBox': icon.getAttribute('viewBox'),
            'rotation': icon.dataset.rotation,
            // 'children': this.crawl(icon)
        }
    }

    static crawl(element) {
        let children = [];
        for (let child of element.childNodes) {
            if (child.nodeType === Node.TEXT_NODE)
                continue;
            if (child.tagName === 'g' || child.tagName === 'G') 
                children = children.concat(this.crawl(child))
            else
                children.push(child);
        }
        return children;
    }

    parseViewBoxString(string) {
        if (Array.isArray(string)) 
            return console.error('I think you trying to parse an array... try a string next time')

        return string.split(/\s+|,/).map(value => Number(value));
    }

    formatViewBoxArray(array) {
        if (!Array.isArray(array))
            return console.log('I think your trying to format a string... try an array next time');
    
        return array.join(' ');
    }

    createWrapper(props,opts = {useValues: false}){
        let {name,category,markup,values} = props || this;

        let el = document.createElement('div');
        el.dataset.category = category;
        el.dataset.name = name;
        el.dataset.cid = this.cid;
        el.dataset.id = this.id;
        el.innerHTML = markup;

        // console.log(el)
        let icon = el.querySelector('svg');

        if (!icon) 
            return console.log(`${props._id} : ${props.name} is an invalid object`)

        if (!icon.getAttribute('viewBox')) {
            console.warn('setting default viewbox in',category);
            icon.setAttribute('viewBox','0 0 24 24');
            this.markup = icon.outerHTML;
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
    get previews(){ // name html
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
