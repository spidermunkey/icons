export default class Icon {
    constructor(props) {
        this._props = props;
        this.element = document.createElement('svg');
        this.element.outerHTML = props.markup;
        let getViewBox = () => {
            let vb = this.element.getAttribute('viewBox')
            if (vb)
                this._props.viewBox = vb.split('/\s+|,/');
            else 
                this._props.viewBox = ["0","0","24","24"]
        }
        let getColors = () => {
            let fill = this.element.getAttribute('fill')
            let stroke = this.element.getAttribute('stroke')
            if (fill)
                this._props.fill = fill
            if (stroke)
                this._props.stroke = stroke
        }
        let getRotation = () => {
            let rotation = this.element.getAttribute('rotate')
            if (rotation)
                this._props.rotation = rotation;
        }
        let formatProps = () => {
            getViewBox();
            getColors();
            getRotation();
        }
        this.clone = structuredClone(props);
    }
    get props() {
        return this.clone
    }
    get svg() {
        let element = document.createElement('svg');
        element.outerHTML = this._props.markup;
        return element;
    }
    get showcase() {
        let element = this.createWrapper();
        element.dataset.role = 'svg_wrapper';
        element.classList.add('svg-wrapper');
        return element
    }
    get benchPreview() {
        let element = this.createWrapper();
        element.dataset.role = 'bench_preview';
        element.classList.add('comp--bench', 'btn--sm');
        return element
    }
    get previews() {
        let markup = this._props.markup;
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
    save() {
        this._props = {
            ...this._props,
            ...this.clone,
        }
        this.clone = structuredClone(this._props)
    }
    createWrapper() {
        let {name,category,main_id,category_id,markup} = this._props;
        let el = document.createElement('div');
        el.dataset.category = category;
        el.dataset.name = name;
        el.dataset.cid = category_id;
        el.dataset.id = main_id;
    
        el.innerHTML = markup;
        return el;
    }
}