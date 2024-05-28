import { Slider , MouseTrackingSlider } from '../utils/slider.js'

export const preview = {
    
    currentIcon: undefined,
    currentProps: undefined,

    viewBoxScale: [],
    startingViewbox: [0,0,20,20],
    observer: {},

    element: $('#PREVIEW'),
    components: $('.preview__modals--modal[data-tab="preview"]'),
    nameField: $('.title-group__name .label.name'),
    categoryField: $('.title-group__category .label.category'),

    vbxInput: $('.input-field.x .input'),
    vbyInput: $('.input-field.y .input'),
    vbhInput: $('.input-field.h .input'),
    vbwInput: $('.input-field.w .input'),

    vbhLabel: $('.input-field.h .label'),
    vbwLabel: $('.input-field.w .label'),

    get display() {
        return $('.current-icon',this.element);
    },
    get targetElement() {
        return $('svg',this.display);
    },
    get markup() {
        return this.targetElement.outerHTML;
    },
    set markup(html) {
        if (this.currentProps) this.currentProps.markup = this.markup;
        return;
    },
    get previews() {
        return this.currentIcon.previews;
    },
    set previews(html) {
        this.components.innerHTML = this.previews.all;
    },
    get viewBox() {
        return this.currentIcon.viewBox;
    },
    set viewBox(string) {
        this.currentIcon.viewBox = string;
        return;
    },
    get VBX() {
        return Number(this.viewBox[0]);
    },
    get VBY() {
        return Number(this.viewBox[1]);
    },
    get VBH() {
        return Number(this.viewBox[2]);
    },
    get VBW() {
        return Number(this.viewBox[3]);
    },

    vbxLabel: new MouseTrackingSlider( $('.input-field.x .label') , {
        onMouseMove:({x}) => preview.updateWithMouseTracker.call(preview,0,x),
        onMouseUp:() => {
            preview.startingViewbox = preview.viewBox;
            preview.updatePreviews();
        }
    }),
    vbyLabel: new MouseTrackingSlider( $('.input-field.y .label') , {
        onMouseMove:({x}) => preview.updateWithMouseTracker.call(preview,1,x),
        onMouseUp:() => {
            preview.startingViewbox = preview.viewBox;
            preview.updatePreviews();
        }
    }),
    
    zoomSlider: new Slider( $('#zoomSlider') , {
        onMouseMove: ({pct}) => preview.updateWithSlider(pct),
        onMouseDown: ({pct}) => preview.updateWithSlider(pct),
        onMouseUp: () => {
            preview.startingViewbox = preview.viewBox;
            preview.updatePreviews();
        }
    }),
    rotationSlider: new Slider( $('#rotationSlider'),{
        onMouseMove: ({deg}) => {
            preview.updateRotation.call(preview,deg);
            preview.targetElement.dataset.rotation = deg.deg;
            preview.currentIcon.rotation = deg.deg;
        },
        onMouseUp: () => {
            preview.updatePreviews();
        }
    }),
    
    showBorder() {
        this.display.style.border = '1px dotted red';
        return this;
    },
    hideBorder() {
        this.display.style.border = '';
        return this;
    },
    toggleBorder() {
        if (!this.display.style.border) this.showBorder();
        else this.hideBorder();
        return this;
    },
    async copyToClipboard() {
        try {
            await window.navigator.clipboard.writeText(this.markup);
            alert('element copied');
        } catch(err) {
            console.error('Failed to copy',err);
        }
    },

    updateNameField(string) {
        this.nameField.textContent = string;
        return this;
    },
    updateCategoryField(string) {
        this.categoryField.textContent = string;
        return this;
    },
    updateDisplayElement(html) {
        this.display.innerHTML = html;
        return this;
    },

    setViewboxValues(array) {

        let stringValue = array.join(' ')
        this.vbxInput.value = `${array[0]}`;
        this.currentIcon.vbx = Number(array[0]);

        this.vbyInput.value = `${array[1]}`;
        this.currentIcon.vby = Number(array[1]);

        this.vbhInput.value = `${array[2]}`;
        this.currentIcon.vbh = Number(array[2]);

        this.vbwInput.value = `${array[3]}`;
        this.currentIcon.vbw = Number(array[3]);
        
        this.targetElement.setAttribute('viewBox',stringValue);

        this.currentIcon.viewBox = stringValue;
        this.currentProps.markup = this.markup;

        return this;
    },

    updateWithMouseTracker(index,value) {
        let values = [...this.startingViewbox];
        
        let x = values[index];
        let xi = Number(x);
        let adjusted = xi + value;

        values[index] = adjusted;

        this.setViewboxValues(values);

        return this;
    },

    updateWithSlider(pct) {

        if (!this.startingViewbox) {
            console.warn('no initial viewbox value to update');
            return
        }
        
        let valuesToScaleFrom = [...this.viewBoxScale],
            values = [...this.startingViewbox],
        
            x = valuesToScaleFrom[2],
            y = valuesToScaleFrom[3],

            xi = Number(x),
            yi = Number(y),

            grow = (factor,...nums) => nums.map(num => Math.trunc(num * (factor/100) + num));
            shrink = (factor,...nums) => nums.map(num => Math.abs(Math.trunc(num * (factor/100) - num)));
        
        if (pct >= 50) {

            let factor = (pct - 50) * 2,
                adjustedValues = shrink(factor,xi,yi),
                [h,w] = adjustedValues;
                
            if (h < 0 || w < 0) return
            
            values[2] = h;
            values[3] = w;

        }
        else if (pct < 50) {
            
            let factor = Math.abs((pct * 2) - 100),
                adjustedValues = grow(factor,xi,yi),
                [h,w] = adjustedValues;

            values[2] = h;
            values[3] = w;

        } 
        else if (!pct || isNaN(pct)) { 
        
            console.error('invalid percent value, skipping unset')

        }
        
        this.setViewboxValues(values)
        return this;

    },

    updateRotation(deg) {
        // let degrees = values.deg;
        if (deg || deg === 0) {
            this.targetElement.setAttribute('transform',`rotate(${deg})`);
            this.targetElement.dataset.rotation = deg;
            this.currentIcon.rotation = deg;
            if (this.currentProps) this.currentProps.markup = this.markup;
        }

        return this;
    },

    updatePreviews() {
        this.previews = 'updated';
        return this;
    },

    getComponent(type,size) {
        if (!this.currentIcon) return
        return this.currentIcon.getComponent(type,size)
    },

    save() {
        let node = this.currentIcon.save();
        return node;
    },

    update(icon) {
        this.currentIcon = icon;
        this.currentProps = icon.observer;

        let { name , category , markup , viewBox , rotation, isFavorite } = icon;

        if (isFavorite) $('.btn-favit').classList.add('icon-is-favorite');
        else $('.btn-favit').classList.remove('icon-is-favorite');
        
        this.startingViewbox = viewBox;
        this.viewBoxScale = viewBox;

        this.updateDisplayElement(markup);
        this.updateCategoryField(category);
        this.setViewboxValues(viewBox);
        this.updateNameField(name);
        this.updatePreviews();

        this.zoomSlider.setPercent(50);

        if (rotation) this.rotationSlider.setDegrees(rotation);
        else this.rotationSlider.setDegrees(0);

    },
};