export class Icon {
    constructor(props) {
        this.isValid = true;
        this.name = props.name;
        this.collection = props.collection;
        this.markup = props.markup;
        this.id = props.id;
        // this.trace = props.id;
        this.vid = props.vid;
        this.cid = props.cid;
        this.isFavorite = props.favorite;
        this.benched = props.benched;
        this.rebased = props.rebased;
        this.type = props.type || 'default';
        this.color = props?.color || {}; 
        this.colors = props.colors;
        this.styles = props.styles;
        this.created_at = props.created_at;
        this.sub_collection = props.sub_collection;
        this.subtype = props.subtype;
        this.preset = props?.preset || null;
        this.usePreset = props?.preset && props.usePreset == true ? props.usePreset : false;
        this.element = this.createWrapper(props);
        this.presets = {
            ...props?.presets,

         } || {};
        try {
            const values = this.element ? Icon.parse(this.element) : false;
            if (values){
                const originalPreset = this.createPreset(values)
                this.values = values
                this.presets['original'] = {
                    ...originalPreset,
                    get viewbox() {
                        return [this.vbx,this.vby,this.vbw,this.vbh].map(Number)
                    },
                }
                let defaultPresetExists = !objectIsFalsey(this.preset)
                // invalid/legacy preset generation
                let presetHasId = this.preset?.pid
                if (!defaultPresetExists || !presetHasId) 
                    this.preset = this.presets['original']
            }
            else 
                this.isValid = false;
        } catch(e){
            console.warn(e)
            this.isValid = false;
        }
    }
    get svg(){
        return $('svg',this.element);
    }
    get props() {
        return {
            name: this.name,
            markup: this.markup,
            rebased: this.rebased,
            collection: this.collection,
            favorite: this.favorite,
            benched: this.benched,

            type: this.type,
            color: this.color,
            colors: this.colors,
            styles: this.styles,

            id: this.id,
            vid: this.vid,
            cid: this.cid,
            trace: this.trace,
            values: this.values,
            created_at: this.created_at,
            preset: this.preset,
            usePreset: this.usePreset,
            presets: this.presets,
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
        this.element.setAttribute('viewBox',string);
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
            return this.values['height'].split('p')[0]
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
        let cpy = new Icon(this.use())
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
    mark(element) {
        element.setAttribute('pid',uuid())
        return element;
    }
    markAll(children) {
        return children.map(this.mark);
    }
    clearMarkAll(children) {
        return children.map(this.clearMark);
    }
    clearMark() {
        children.forEach(child => {
            child.removeAttribute('pid');
        })
    }
    crawl(svg){
        return Icon.crawl(svg)
    }
    static parse(element) {
        let icon = element.querySelector('svg');
        if (!icon){
            console.warn('this is not an svg')
            return false
        }
        let viewBox = icon.getAttribute('viewBox');
        let vb = viewBox.split(' ').map(v => Number(v));
        const values = {
            'height': icon.getAttribute('height'),
            'width': icon.getAttribute('width'),
            'stroke': icon.getAttribute('stroke'),
            'fill': icon.getAttribute('fill'),
            'x': icon.getAttribute('x'),
            'y': icon.getAttribute('y'),
            'viewBox': icon.getAttribute('viewBox'),
            'rotation': icon.dataset.rotation,
            vbx:vb[0],
            vby:vb[1],
            vbh:vb[2],
            vbw:vb[3],
            pid: 'original',
            // 'children': this.crawl(icon)
        }
        const allowedTags = ['g', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'ellipse', 'text', 'tspan','use'];
        // invalid icon 
            // has markup ( probably slow )
        const children = Icon.crawl(icon);
        const validTag = child => allowedTags.includes(child.tagName);
        if (!children.some(validTag)){
            // console.warn('error parsing icon [no valid tags]',icon)
            return false;
        }
        return values;
    }
    static crawl(element = this.svg) {
        if (element === null){
            console.log('crawl operation failed... no icon')
            return
        }
        let children = [];
        for (var i = 0; i < element.childNodes.length; i++) {
            var child = element.childNodes[i];
            // Skip text nodes
            if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.COMMENT_NODE) 
                continue;
            if (child.tagName === 'g' || child.tagName === 'G') {
                var groupChildren = this.crawl(child);
                children = children.concat(groupChildren);
            } else
                children.push(child);
        }
        return children;
    }
    updateSVGClosedPaths(color,svgElement) {
        // Select all <path> elements in the SVG
        const paths = svgElement.querySelectorAll("path");
      
        paths.forEach((path) => {
          const dAttr = path.getAttribute("d");
      
          // Check if the path is closed (ends with 'z' or 'Z')
          if (dAttr && /z\s*$/i.test(dAttr)) {
            const styleAttr = path.getAttribute("style");

            if (styleAttr && styleAttr.includes("fill:")) {
              // If there's an inline style with fill, overwrite the fill in the style
              const updatedStyle = styleAttr.replace(/fill:[^;]+/, `fill:${newColor}`);
              path.setAttribute("style", updatedStyle);
            } else {
              // Otherwise, set the `fill` attribute directly
              path.setAttribute("fill", newColor);
            }
          }
        });
    }
    createWrapper(props){
        let {name,markup} = props || this;
        let el = document.createElement('div');
        el.dataset.name = name;
        el.dataset.cid = this.cid;
        el.dataset.id = this.id;
        el.innerHTML = markup;
        // console.log(el)
        let icon = el.querySelector('svg');
        if (!icon) {
            return ''
        }
        if (!icon.getAttribute('viewBox')) {
            icon.setAttribute('viewBox','0 0 24 24');
        }
        this.children = [icon,...Icon.crawl(icon)]
        if (objectIsFalsey(props.colors)){
            // create marked version for colors
            this.colors = {
                original:{
                    csid:'original',
                    colorset_type: 'variable',
                    name: 'original',
                    paths: {},
                },
            }
            /*
                per spec:
                    shapes filled by default #000
                    currentColor defaults to #000
                    lines default to stroke #000
                    if no stroke is specified in svg element no stroke applied even for lines
                    if no fill is specified in svg element and child is not a line fill of #000 is applied

                per algo:
                    explicitly apply defaults for control, visibility, and persistence
                    replace inline styles for attributes for interface compatibility
                    store attribute styles for persistence
            */
            let globalStroke = icon.getAttribute('stroke')
            let globalFill = icon.getAttribute('fill')
            if (globalFill === 'currentColor') globalFill = '#000'
            if (globalStroke === 'currentColor') globalStroke = '#000'
            this.children.forEach((child) => {
                const pid = child.getAttribute('pid')
                const id =  pid ? pid : uuid();
                const styleAttr = child.getAttribute("style");
                let inlineFill;
                let inlineStroke;
                let existingFill = child.getAttribute('fill');
                let tagname = child.tagName;
                let isLine = tagname === 'line'
                let existingStroke = child.getAttribute('stroke');
                let shouldNotFill = icon.getAttribute('fill') === 'none' || $$('g',icon).some(group => group.getAttribute('fill') === 'none')
                if (styleAttr) {
                    inlineFill = styleAttr.match(/fill:\s?([^;\s]+)/);
                    inlineStroke = styleAttr.match(/stroke:\s?([^;\s]+)/);
                    if (tagname == 'svg' && inlineStroke) console.log('INLINE STROKE FOUND',child)
                }
                    // replace inline style for attribute
                if (inlineFill){
                    child.setAttribute('fill',inlineFill[1])
                    const updatedStyle = styleAttr.replace(/\s*fill:[^;]+(;|$)/, '')
                    child.setAttribute("style", updatedStyle);
                } else if (!inlineFill && !existingFill && tagname !== 'svg' && !shouldNotFill){
                    child.setAttribute('fill','#000')
                } else if (existingFill && existingFill === 'currentColor'){
                    child.setAttribute('fill', '#000')
                } else if (globalFill && globalFill !== 'none'){
                    child.setAttribute('fill',globalFill)
                }

                if (inlineStroke){
                    child.setAttribute('stroke',inlineStroke[1])
                    const updatedStyle = styleAttr.replace(/\s*stroke:[^;]+(;|$)/, '')
                    child.setAttribute("style", updatedStyle);
                } else if (!inlineStroke && !existingStroke && isLine && tagname !== 'svg'){
                    child.setAttribute('stroke','#000')
                } else if (existingStroke && existingStroke === 'currentColor'){
                    child.setAttribute('stroke', '#000')
                } else if (globalStroke && globalStroke !== 'none'){
                    child.setAttribute('stroke',globalStroke)
                }
                
                const marked = child.setAttribute('pid',id)
                const cleaned = styleAttr && styleAttr.trim() === '' ? child.removeAttribute('style') : ''
                const stroke = child.getAttribute('stroke') || 'none'
                const fill = child.getAttribute('fill') || 'none'

                this.colors.original.paths[id] = [stroke,fill,tagname]
                return child
            })
        }
        this.markup = icon.outerHTML;
        return el;
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
    createPreset(props){
        return {
            name: props?.name || 'untitled',
            // can be collection or icon preset,
            pid: props?.pid || uuid(),
            viewbox: props?.viewbox || '',
            vbx: props?.vbx || 0,
            vby: props?.vby || 0,
            vbw: props?.vbw || 24,
            vbh: props?.vbh || 24,
            height: props?.height || '',
            width: props?.width || '',
            created_at: props?.created_at || DateTime.stamp().ms,
        }
    }
    addPreset(setting){
        if (!setting.pid){
            console.warn('error updating presets... invalid pid')
            return null
        } else if(Object.hasOwn(this.presets,setting.pid)) {
            console.warn('error updating presets... this id already exists')
            return null
        }
        this.presets[setting.pid] = setting;
        return this;
    }
    setPresetDefault(setting){
        console.log('applying default preset')
        const pid = setting.pid
        const isDefault = this.preset.pid === setting.pid

        if (isDefault && defaultIsActive){
            console.log('preset already active....')
            this.preset = this.presets.original
            console.log('... current default toggled off')
            return false
        }
        else if(Object.hasOwn(this.presets,pid)){
            console.log('... preset is not default.. setting default')
            const settingFound = this.presets[pid]
            this.presets.current = settingFound.pid
            this.preset = settingFound
            return true
        } else {
            console.warn('no preset found.... no action will be taken')
        }
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
    get pocket(){
        let element = this.createWrapper(this.observer);
        element.dataset.role = 'bench_preview';
        element.classList.add('comp--bench', 'button--sm');
        return element;
    }
    get previews(){ // name html
        let markup = this.markup;
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
