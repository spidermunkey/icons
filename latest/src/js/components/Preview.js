import { ColorPicker } from "./ColorPicker";

export class Preview {

    constructor() {
        this.icon = undefined;
        this.viewBoxScale = [];
        this.startingViewbox = [0,0,20,20];
        this.colorPicker = new ColorPicker({});
        this.currentTab = 'position';
        this.tabs = $$('.preview__modals--modal')
        this.tabNames = this.tabs.map(modal => modal.dataset.tab);

        this.miniPreviewElement = $('.widget-preview-icon__wrapper');
        this.miniPreviewElementName = $('.widget-preview-info .widget--icon-title > div');
        this.miniPreviewElementCollection = $('.widget-preview-info .widget--icon-category > div');
        this.element = $('#PREVIEW');
        this.components = $('.preview__modals--modal[data-tab="components"]');
        this.nameField = $('.title-group__name .label.name');
        this.categoryField = $('.title-group__category .label.category');
        this.btnCopy = $('.btn-copy'),
        this.btnBorder = $('.btn-border'),
        this.btnFavorite = $('.btn-favit');

        this.vbxInput = $('.input-field.x .input');
        this.vbyInput = $('.input-field.y .input');
        this.vbhInput = $('.input-field.h .input');
        this.vbwInput = $('.input-field.w .input');
        
        this.svgHeightInput = $('.input.input-height');
        this.svgWidthInput = $('.input.input-width');

        this.svgStrokeContainer = $('.field-stroke');
        this.svgStrokeInput = $('.input.inp-stroke');

        this.svgFillContainer = $('.field-fill');
        this.svgFillInput = $('.input.inp-fill');
        
        this.vbhLabel = $('.input-field.h .label');
        this.vbwLabel = $('.input-field.w .label');
        this.defaultHeight = '24';
        this.defaultWidth = '24';
        this.width = '';
        this.height = '';
        this.openTab(this.currentTab)
        $(`.preview__tabber--tab[data-tab="${this.currentTab}"]`).classList.add('active')
        this.vbxLabel = new MouseTrackingSlider( $('.input-field.x .label') , {
            onMouseMove:({x}) => this.updateWithMouseTracker(0,x),
            onMouseUp:() => this.startingViewbox = this.viewBox,
            reset: () => this.resetMouseTrackingSlider(0)
        })

        this.vbyLabel = new MouseTrackingSlider( $('.input-field.y .label') , {
            onMouseMove:({x}) => this.updateWithMouseTracker(1,x),
            onMouseUp:() => this.startingViewbox = this.viewBox,
            reset: () => this.resetMouseTrackingSlider(1)
    
        })
        
        this.zoomSlider = new Slider( $('#zoomSlider') , {
            onMouseMove: ({pct}) => this.updateWithSlider(pct),
            onMouseDown: ({pct}) => this.updateWithSlider(pct),
            onMouseUp: () => this.startingViewbox = this.viewBox
        })

        this.rotationSlider = new Slider( $('#rotationSlider'),{
            onMouseMove: ({deg}) => {
                this.updateRotation(deg);
                this.targetElement.dataset.rotation = deg.deg;
                this.icon.rotation = deg.deg;
            },
            onMouseUp: () => this.updatePreviews()
            
        })

        this.vbxInput.addEventListener('keydown',handleViewBoxInput(0))
        this.vbyInput.addEventListener('keydown',handleViewBoxInput(1))
        this.svgHeightInput.addEventListener('keydown',(e) => {
            const height = handleHeightWidthInput(e)
            this.height = height;
            // this.targetElement.setAttribute('height',`${height}px`)
            // if (this.icon) this.icon.height = height
        })
        this.svgHeightInput.addEventListener('select',(e) => {
            const selection = e.target.value.substring(
                e.target.selectionStart,
                e.target.selectionEnd,
              );
            this.svgHeightInput.setAttribute('selected','true')
        })
        this.svgHeightInput.addEventListener('blur',(e) => {
            this.svgHeightInput.setAttribute('selected','')
        });
        this.svgWidthInput.addEventListener('keydown',(e) => {
            const width = handleHeightWidthInput(e)
            this.width = width;
            // if (this.icon) this.icon.width = width
        })
        this.btnBorder.onclick = () => this.toggleBorder();
        this.btnCopy.onclick = () => this.copyToClipboard();
        $$('.preview__tabber--tab').forEach(tab => {
            tab.addEventListener('click',(e) => {
                $$('.preview__tabber--tab').forEach(tab => tab.classList.remove('active'))
                tab.classList.add('active');
                this.openTab(tab.dataset.tab)
            })
        })
        function handleHeightWidthInput(e) {

            e.preventDefault()
            let value = e.target.value;
            let selected = false;
            let selection = '';

                if (e.target.getAttribute('selected') === 'true'){
                    selection = e.target.value.substring(
                        e.target.selectionStart,
                        e.target.selectionEnd,
                      );
                      console.log(selection)
                    selected = true;
                }

                let k = e.key;
                let construct = e.target.value.toString();

                console.log(value)
                const leadingZero = /^0+/
                const keyIsNumber = /^\d$/.test(k)
                const backspace = 8;
                const hasNonNumbers = /\D/

                if (k === 'Backspace'){
                    construct = '';
                    e.target.value = '';
                }

                if (keyIsNumber && value.length < 2){
                    console.log('here')
                    e.target.value += k;
                }
    
                return e.target.value;
        }
        function handleViewBoxInput(index) {
            return function(e) {
                e.preventDefault();

                let value = e.target.value;
                let k = e.key;
                let construct = e.target.value.toString();
                console.log(value);
                console.log(k);
    
                const leadingZero = /^0+/
                const keyIsNumber = /^\d$/.test(k);
                const backspace = 8;
                const validLength = 3
                const hasNonNumbers = /\D/
                let prefix = false;
                if (e.keyCode == backspace) {
                    console.log('back')
                    console.log(value,value.length)
                    construct = 0
                    e.target.value = 0
                    console.log(construct.toString().length <= 3)
                }
                if (k === '-' && value == 0 || value == ''){
                    console.log('prefixing')
                    prefix = true
                    construct = '-'
                    e.target.value = '-'
                }
                if (keyIsNumber) {
                    console.log('key is number')
                    construct = value.toString() + k.toString()
                    construct = construct.toString().replace(leadingZero,'')
                }
    
                if ((construct.toString()[0] === '-' && construct.toString().length <= 4) || construct.toString().length <= 3 ){
                    console.log('setting val',construct)
                    e.target.value = construct
                }
                // value = value.replace(leadingZero,'');
                if (!isNaN(construct) && (((construct.toString()[0] === '-' && construct.toString().length <= 4)) || construct.toString().length <= 3))
                    this.updateWithInput(index,prefix ? -(Number(construct)) : Number(construct))
                
            }
        }
    }

    get display() {
        return $('.current-icon',this.element);
    }
    get targetElement() {
        return $('svg',this.display);
    }
    get markup() {
        return this.targetElement.outerHTML;
    }
    set markup(html) {
        this.icon.markup = this.markup;
    }
    get previews() {
        return this.icon.previews;
    }
    get viewBox() {
        return this.icon.viewBox;
    }
    set viewBox(string) {
        this.icon.viewBox = string;
    }
    get VBX() {
        return Number(this.viewBox[0]);
    }
    get VBY() {
        return Number(this.viewBox[1]);
    }
    get VBH() {
        return Number(this.viewBox[2]);
    }
    get VBW() {
        return Number(this.viewBox[3]);
    }
    get height() {
        return this.targetElement.getAttribute('height');
    }
    set height(number) {
        this.targetElement.setAttribute('height',`${number}px`)
        if (this.icon) this.icon.height = number
        this.svgHeightInput.value = number
    }
    get width() {
        return this.targetElement.getAttribute('width');
    }
    set width(number) {
        this.targetElement.setAttribute('width',`${number}px`)
        if (this.icon) this.icon.width = number
        this.svgWidthInput.value = number
    }
    showBorder() {
        this.display.style.border = '1px dotted red';
        return this;
    }
    hideBorder() {
        this.display.style.border = '';
        return this;
    }
    toggleBorder() {
        if (!this.display.style.border) this.showBorder();
        else this.hideBorder();
        return this;
    }
    async copyToClipboard() {
        console.log(this.targetElement)
        if(this.targetElement) {
            const element = this.targetElement.cloneNode(true);
            this.colorPicker.clearMarkAll([element,...this.colorPicker.crawl(element)])
            const status = await window.navigator.clipboard.writeText(this.targetElement.outerHTML);
                this.showCopySuccess()

        }
    }    
    showCopySuccess() {
        const notification = $('#INTERFACE .notification-copy.success');
        console.log(notification)
        const showNote = [
            { transform: "translateY(-30px)"},
            { transform: "translateY(0)", offset: 0.03},
            { transform: "translateY(0)", offset:0.9},
            { transform: "translateY(-30px)",easing: "ease-out",offset: 1}
        ]
        
        const timing = {
            duration: 3500,
        }
        notification.animate(showNote,timing)
    }

     showCopyError() {
        alert('copy failed')
}

    updateNameField(string) {
        this.nameField.textContent = string;
        this.miniPreviewElementName.textContent = string;
        return this;
    }

    updateCategoryField(string) {
        this.categoryField.textContent = string;
        this.miniPreviewElementCollection.textContent = string;
        return this;
    }

    updateDisplayElement(html) {
        this.display.innerHTML = html;
        this.miniPreviewElement.innerHTML = html;
        console.log(html)
        return this;
    }

    setViewboxValues(array) {
        if (!this.icon) return
        let stringValue = array.join(' ')
        this.vbxInput.value = `${array[0]}`;
        this.icon.vbx = Number(array[0]);

        this.vbyInput.value = `${array[1]}`;
        this.icon.vby = Number(array[1]);

        this.vbhInput.value = `${array[2]}`;
        this.icon.vbh = Number(array[2]);

        this.vbwInput.value = `${array[3]}`;
        this.icon.vbw = Number(array[3]);
        
        this.targetElement.setAttribute('viewBox',stringValue);
        this.icon.viewBox = stringValue;
        this.icon.markup = this.markup;

        return this;
    }

    resetMouseTrackingSlider(index) {
        let values = this.startingViewbox.slice();
        values[index] = 0;
        this.setViewboxValues(values);
        this.startingViewbox = values;
    }

    updateWithMouseTracker(index,value) {
        let values = this.startingViewbox.slice();
        let x = values[index];
        let xi = Number(x);
        let adjusted = Math.min(xi + value, 999);
        console.log(value,xi,adjusted)
        values[index] = adjusted;
        this.setViewboxValues(values);
    }

    updateWithInput(index,value) {
        console.log('updating with input',value)
        let values = this.startingViewbox.slice();
        let x = values[index];
        let xi = Number(x);
        let adjusted = Math.min(value,999);
        values[index] = adjusted;
        this.setViewboxValues(values);
        this.startingViewbox = this.viewBox;
    }

    updateWithSlider(pct) {

        if (!this.startingViewbox) {
            console.warn('no initial viewbox value to update');
            return
        }
        
        let valuesToScaleFrom = this.viewBoxScale.slice(),
            values = this.startingViewbox.slice(),
        
            x = valuesToScaleFrom[2],
            y = valuesToScaleFrom[3],

            xi = Number(x),
            yi = Number(y),

            grow = (factor,...nums) => nums.map(num => Math.trunc(num * (factor/100) + num)),
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

        else if (!pct || isNaN(pct))
            console.error('invalid percent value, skipping unset')
        
        this.setViewboxValues(values)
    }

    updateRotation(deg) {
        if (deg || deg === 0) {
            this.icon.rotation = deg;
            this.element.setAttribute('transform',`rotate(${deg})`);
            this.element.dataset.rotation = deg;
        }
    }

    updatePreviews() {
        this.components.innerHTML = this.previews.all;
    }

    getComponent(type,size) {
        if (!this.icon) return
        return this.icon.getComponent(type,size)
    }

    save() {
        let node = this.icon.save();
        return node;
    }

    setLoading() {
        this.element.classList.add('loading');
    }
    setReady() {
        this.element.classList.remove('loading');
    }

    setCursor(icons,index) {
        
    }

    openTab(name){
        this.currentModal = $(`.preview__modals--modal[data-tab="${name}"]`)
        console.log(this.currentModal)
        $$('.preview__modals--modal[data-role="tab"]').forEach(modal => modal.classList.remove('active'))
        this.currentModal.classList.add('active')
        this.closeWindows()
    }
    toggleWindow(name) {
        const win =  $(`.preview__modals--modal[data-tab="${name}"][data-role="window"]`)
        console.log('WIN',win)
            if (!this.currentWindow) {
                console.log('here')
                this.currentWindow = win;
                this.currentWindow.classList.add('active')
                this.currentModal.classList.remove('active')
            } else {
                console.log('here now')
                this.currentWindow = null;
                win.classList.remove('active')
                this.currentModal.classList.add('active')
            }
    }

    closeWindows(){
        $$(`.preview__modals--modal[data-role="window"]`).forEach(modal => {
            modal.classList.remove('active')
            this.currentWindow = null;
        })
    }
    open = (tabName) => {

        $('.widget-pre').classList.remove('active');
        $('.widget-main').classList.add('active');

        if (tabName && this.tabNames.includes(tabName))
            [this.currentModal] = this.tabs.filter(tab => tab.dataset.tab == tabName);
        else 
            [this.currentModal] = this.tabs.filter(tab => tab.dataset.tab == 'position')

        if (this.currentModal)
            this.currentModal.classList.add('active');

    }

    close = () => {
        // close active modal or disable pointer events
        if (this.currentModal)
            this.currentModal.classList.remove('active');
        if (this.currentWindow)
            this.currentWindow.classList.remove('active');
    }

    update(icon) {
        if (!icon) {
          this.setLoading();
          return;
        }
        this.icon = icon.save();
        let { name , category , markup , viewBox , rotation,isBenched, isFavorite, height, width, stroke, fill } = icon;
        console.log('updating',name,category)
        // pathExtractor(markup)      
        if (isFavorite) $('.btn-favit').classList.add('icon-is-favorite');
        else $('.btn-favit').classList.remove('icon-is-favorite');
        if (isBenched) $('.btn-bench').classList.add('icon-is-benched');
        else $('.btn-bench').classList.remove('icon-is-benched');
        
        this.startingViewbox = viewBox.slice();
        this.viewBoxScale = viewBox.slice();

        if (height) this.height = height;
        else this.height = this.defaultHeight

        if (width) this.width = width
        else this.width = this.defaultWidth

        this.updateDisplayElement(markup);
        this.updateCategoryField(category);
        this.setViewboxValues(viewBox);
        this.updateNameField(name);
        this.updatePreviews();
        this.colorPicker.update(this.targetElement)
        this.zoomSlider.setPercent(50);

        if (rotation) this.rotationSlider.setDegrees(rotation);
        else this.rotationSlider.setDegrees(0);

    }

}
