import * as _ from './js/utils/DOM-helpers.js'
import { Slider , MouseTrackingSlider } from './js/utils/slider.js'

export const preview = {
    currentIcon: undefined,
    currentProps: undefined,
    previews: undefined,
    state: {},
    viewBoxScale: [],
    startingViewbox: [],
    // INTERFACE WRAPPER
    get element() {
        return $('#PREVIEW')
    },
    // SVG WRAPPER
    get display() {
        return $('.current-icon',this.element)
    },

    get markup() {
        return this.targetElement.outerHTML;
    },
    set markup(html) {
        if (this.currentProps) this.currentProps.markup = this.markup;
    },
    get viewBox() {
        return this.currentIcon.viewBox;
    },
    set viewBox(string) {
        this.currentIcon.viewBox = string;
    },
    // CURRENT ICON NAME
    name: $('.title-group__name .label.name'),
    // CURRENT ICON CATEGORY
    category: $('.title-group__category .label.category'),

    // X POSITION
    vbxLabel: new MouseTrackingSlider($('.input-field.x .label'), {
        onMouseMove:({x}) => {
            preview.updateWithMouseTrackingValuesFromCurrent.call(preview,0,x)
        },
        onMouseUp:() => {
            preview.startingViewbox = parseViewBoxString(preview.viewBox)
            preview.updatePreviews.call(preview)
    },
    }),
    vbxInput: $('.input-field.x .input'),
    get VBX() {
        return this.viewBox[0]
    },
    set VBX(number) {
        // update assoc input
        // console.log(number)
        this.vbxInput.value = `${number}`
        this.currentIcon.vbx = number
    },
    // Y POSITION
    vbyLabel: new MouseTrackingSlider($('.input-field.y .label'), {
        onMouseMove:({x}) => {
            // preview.justMoveTheDangThingBy(x)
            preview.updateWithMouseTrackingValuesFromCurrent.call(preview,1,x)
        },
        onMouseUp:() => {
            // preview.justSaveTheDangProgressForNextTime(x);
            preview.startingViewbox = parseViewBoxString(preview.viewBox)
            preview.updatePreviews.call(preview)
    },
    }),
    vbyInput: $('.input-field.y .input'),
    set VBY(number) {
        // update assoc input
        this.vbyInput.value = `${number}`
        this.currentIcon.vby = number
    },

    // HEIGHT POSITION
    vbhLabel: $('.input-field.h .label'),
    vbhInput: $('.input-field.h .input'),
    set VBH(number) {
        // console.log(number,`${number}`)
        // update assoc input
        this.vbhInput.value = `${number}`;
        this.currentIcon.vbh = number
    },

    // WIDTH POSITION
    vbwLabel: $('.input-field.w .label'),
    vbwInput: $('.input-field.w .input'),
    set VBW(number) {
        // update assoc input
        this.vbwInput.value = `${number}`;
        this.currentIcon.vbw = number
    },

    // ZOOM SLIDING ELEMENT
    zoomSlider: new Slider( $('#zoomSlider'),{
        onMouseMove: (state) => {
            preview.updateWithSlidingValues(state)
        },
        onMouseUp: () => {
            preview.updatePreviews();
            preview.startingViewbox = parseViewBoxString(preview.viewBox)
        },
        onMouseDown: (state) => {
            preview.updateWithSlidingValues(state)
        }
    }),

    // ROTATION SLIDING ELEMENT
    rotationSlider: new Slider( $('#rotationSlider'),{
        onMouseMove: (state) => {
            preview.updateRotation.call(preview,state)
        },
        onMouseUp: (state) => {
            preview.updateRotation.call(preview,state,true)
        }
    } ),
    
    // SVG INSIDE OF "CURRENT-ICON"
    get targetElement() {
        return $('svg',this.display);
    },






    showBorder() {
        this.display.style.border = '1px dotted red';
    },

    hideBorder() {
        this.display.style.border = '';
    },

    toggleBorder() {
        if (!this.display.style.border)
            this.showBorder();
        else
            this.hideBorder();
    },
    copyToClipboard() {
        alert(this.markup);
    },

    updateName(string) {
        this.name.textContent = string;
        string;
    },

    updateCategory(string) {
        this.category.textContent = string;
        return string;
    },

    updateDisplayElement(html) {
        this.display.innerHTML = html;
        return html;
    },

    updateStartingViewBox(array) {
        this.startingViewbox = array;
        this.updateViewboxInputs(array)
    },

    updateTargetViewbox(string) {
        this.targetElement.setAttribute('viewBox',string);
        this.currentIcon.viewBox = string;
        this.updateObserverMarkup();
        return string;
    },
    
    updateViewboxInputs(array) {
        this.VBX = array[0];
        this.VBY = array[1];
        this.VBH = array[2];
        this.VBW = array[3];
        return array;
    },

    updateViewboxPosition(index,value) {
    
        let viewbox = parseViewBoxString(this.startingViewbox);
        viewbox[index] = value;
        this.updateViewboxInputs(viewbox)
        let stringValue = parseViewBoxArray(viewbox);
        console.log('updating display element viewbox position')
        this.updateTargetViewbox(stringValue);
        this.viewBox = stringValue;
        return viewbox;
    
    },

    updateWithMouseTrackingValuesFromCurrent(index,value,setState=false) {
        // grab the initial values to grow by
        let values = [...this.startingViewbox];
        
        let x = values[index];

        // hold on to the number values
        let xi = Number(x);

        let adjusted = xi + value;

        values[index] = adjusted;

        this.updateViewboxInputs(values);
        this.updateTargetViewbox(values.join(' '));
        if (setState) this.startingViewbox = viewbox

    },

    updateWithSlidingValues({pct}) {
        if (!this.startingViewbox) {
            console.warn('no initial viewbox value to update');
            return
        }
        
        // grab initial values to grow by
        let values = [...this.viewBoxScale];
        console.dir('PRE-ADJUUSTMENTS STARTING VIEWBOX PRE-ADJUSTMENT');
        let x = values[2];
        console.log('x',x)
        let y = values[3];
        console.log('y',y);
        // hold on to the number values
        let xi = Number(x);        
        let yi = Number(y);
        // grow/shrink by adding that base value to the growth/shrinkage expressed as a percentage;
        let grow = (factor,...nums) => nums.map(num => Math.trunc(num * (factor/100) + num));
        let shrink = (factor,...nums) => nums.map(num => Math.abs(Math.trunc(num * (factor/100) - num)));
        if (pct >= 50) {
            // console.log('pct',pct)
            // console.log(values,'initial');
            // slider starts at 50% so 50 = 0;
            let factor = (pct - 50) * 2;
            console.log('factor',factor)
            let adjustedValues = shrink(factor,xi,yi)
            console.log('shrinking to',adjustedValues)
            // set current viewbox height & width to the adjusted values
            let [h,w] = adjustedValues

            // reject negative values
            if (h < 0 || w < 0) return
            // transform current viewbox
            values[2] = h;
            console.log('x POST-ADJUSTMENTS',h)
            console.log('ref',values[2])
            values[3] = w;
            // console.log(values,'adjusted');
            this.updateViewboxInputs(values)
            this.updateTargetViewbox(values.join(' '))
            // return values
        }
        else if (pct < 50) {
            let factor = Math.abs((pct * 2) - 100);
            let adjustedValues = grow(factor,xi,yi)
            let [h,w] = adjustedValues
            values[2] = h;
            values[3] = w;
            // console.log(values,'adjusted');
            this.updateViewboxInputs(values)
            this.updateTargetViewbox(values.join(' '))
            // return values;
        } else if (!pct)
            console.log('pct undefined, skipping unset')
            // return 'idek';
            // console.log(this.startingViewbox)
        if(setState)
            this.startingViewbox = values
        return values;
    },

    updateRotation({deg}) {
        if (deg || deg === 0) {
            this.targetElement.setAttribute('transform',`rotate(${deg})`);
            this.targetElement.dataset.rotation = deg;
            this.currentIcon.rotation = deg;
            this.markup = '';
        }
        if (this.setState) {
            this.targetElement.dataset.rotation = deg;
            this.currentIcon.rotation = deg;
        }
        return deg;
    },

    updatePreviews() {
        if (this.currentIcon) {
            $('.preview__modals--modal[data-tab="preview"]').innerHTML = this.currentIcon.previews.all
        }
    },

    updateObserverMarkup() {
        if (this.currentProps) this.currentProps.markup = this.markup;
    },

    save() {
        let node = this.currentIcon.save();

    },

    update(props) {
        // console.log(props)
        this.currentIcon = props
        this.currentProps = props.observer;

        let {name,category,markup,values} = props;
        console.log('updating preview field name to',name)
        this.updateName(name);
        console.log('updating preview field category to',category)
        this.updateCategory(category);

        let viewbox = parseViewBoxString(values.get('viewBox'));
        let rotation = values.get('rotation')
        this.updateDisplayElement(markup);
        this.startingViewbox = array;
        this.updateViewboxInputs(array)
        this.viewBoxScale = viewbox
        this.updatePreviews()
        // console.log(props,values)

        this.zoomSlider.setPercent(50);
        if (rotation) {
            console.log('rotation for this icon is set',rotation,'updating slider to', rotation)
            this.rotationSlider.setDegrees(rotation);
        } else { 
            this.rotationSlider.setDegrees(0) 
        }
        console.log(viewbox)

        
    },

    init() {
        preview.startingViewbox = [0,0,20,20]
        // preview.zoomSlider.setPercent(50)
        $('.btn-border').onclick = () => this.toggleBorder();

    }
};

// convert string to array of numbers
function parseViewBoxString(string) {
    if (Array.isArray(string)) {
        // console.log('trying to convert',string,'to array')
        // console.warn('I think you trying to parse an array... try a string next time')
        return string.map(value => Number(value));
    }

    return string.split(/\s+|,/).map(value => Number(value));
};

// convert array of values into one string
function parseViewBoxArray(array) {
    if (!Array.isArray(array)) {
        console.trace('I think your trying to format a string... try an array next time')
        return array;
    }

    return array.join(' ');
};