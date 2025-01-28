import { EventEmitterClass } from "../utils/EventEmitter"
const defaultSetting = {
    viewBox: [0,0,20,20],
     vbh:20, 
     vbw:20, 
     vby:0, 
     vbx:0, 
     width:'24', 
     height:'24'
}
const htmlController = {
    async copyToClipboard() {
        if(this.targetElement) {
            await window.navigator.clipboard.writeText(this.targetElement.outerHTML)
            const notificationElement = $('#INTERFACE .notification-copy.success')
            notificationElement.animate([
                { transform: "translateY(-30px)"},
                { transform: "translateY(0)", offset: 0.03},
                { transform: "translateY(0)", offset:0.9},
                { transform: "translateY(-30px)",easing: "ease-out",offset: 1}
            ],{
                duration: 3500,
            })
        }
    },
    updateNameField(string) {
        this.nameField.textContent = string;
        this.miniPreviewElementName.textContent = string;
    },
    updateCategoryField(string) {
        this.categoryField.textContent = string;
        this.miniPreviewElementCollection.textContent = string;
    },
    updateDisplayElement(html) {
        this.display.innerHTML = html;
        this.miniPreviewElement.innerHTML = html;
    },
    updatePreviews() {
        this.components.innerHTML = this.previews.all;
    },
    setLoading() {
        this.element.classList.add('loading');
        this.active = false;
    },
    setReady() {
        this.element.classList.remove('loading');
    },
    openTab(name){
        this.currentModal = $(`.preview__modals--modal[data-tab="${name}"]`)
        $$('.preview__modals--modal[data-role="tab"]').forEach(modal => modal.classList.remove('active'))
        this.currentModal.classList.add('active')
        this.closeWindows()
    },
    toggleWindow(name) {
        const win = $(`.preview__modals--modal[data-tab="${name}"][data-role="window"]`)
        if (win == undefined){
            console.warn(`${name} window is invalid`)
            return;
        }
            if (!this.currentWindow) {
                this.currentWindow = win;
                this.currentWindow.classList.add('active')
                this.currentModal.classList.remove('active')
            } else {
                this.currentWindow = null;
                win.classList.remove('active')
                this.currentModal.classList.add('active')
            }
    },
    closeWindow(name){
        const win = $(`.preview__modals--modal[data-tab="${name}"][data-role="window"]`)
        if (win == undefined){
            console.warn(`${name} window is invalid`)
            return;
        }
        this.currentWindow = null;
        win.classList.remove('active')
        this.currentModal.classList.add('active');
    },
    closeWindows(){
        $$(`.preview__modals--modal[data-role="window"]`).forEach(modal => {
            modal.classList.remove('active')
            this.currentWindow = null;
        })
    },
    open(tabName){
        $('.widget-pre').classList.remove('active');
        $('.widget-main').classList.add('active');
        if (tabName && this.tabNames.includes(tabName))
            this.currentModal = this.tabs.filter(tab => tab.dataset.tab == tabName)[0];
        // if no name opens previously opened tab
        if (this.currentModal){
            let tabName = this.currentModal.dataset.tab
            this.currentModal.classList.add('active');
            if (tabName) {
                console.log('tabname',tabName)
             $$('.preview__tabber--tab').forEach(tab => tab?.classList.remove('active'))
             $(`.preview__tabber--tab[data-tab=${tabName}]`)?.classList.add('active');
            }
        }
        this.active = true;
        $('.interface-window.preview').classList.add('active')
        
    },
    close(){
        // close active modal or disable pointer events
        if (this.currentModal)
            this.currentModal.classList.remove('active');
        if (this.currentWindow)
            this.currentWindow.classList.remove('active');
        this.notify('close')
        this.active = false;
    },
    openSettings(){
        $('.color-editor').classList.remove('active')
        $('.settings-editor').classList.add('active')
        this.settingsActive = true
    },
    closeSettings(){
        $('.settings-editor').classList.remove('active')
        this.settingsActive = false
    },
    toggleSettings(){
        if ($('.settings-editor').classList.contains('active')){
            this.closeSettings();
        } else {
            console.log('here')
            this.openSettings();
        }
    },
    hydrate(){
        this.openTab(this.currentTab)

        const handleViewBoxInput = (index) => {
            return (e) => {
                let value = Number(e.target.value);
                if (!isNaN(value)) {
                    let values = this.startingViewbox.slice();
                    values[index] = value;
                    this.setViewboxValues(values);
                }
            }
        }
        const handleHeightWidthInput = (dimension) => {
            return (event) => {
                let value = Number(event.target.value);
                if (!isNaN(value) && value >= 0) this[dimension] = value
            }
        }
        const resetOnViewBoxInputOnDoubleClick = (index,prop) => {
            if (this.original[prop] !== undefined){
                console.trace('reseting',prop,' to ', this.original[prop])
                let value = this.original[prop]
                if (!isNaN(value)) {
                    let values = this.startingViewbox.slice();
                    values[index] = value;
                    this.setViewboxValues(values);
                }
            }
        }
        const handleRotation = (deg) => {
            if (deg || deg === 0) {
                this.icon.rotation = deg;
                this.targetElement.setAttribute('transform',`rotate(${deg})`);
                this.targetElement.style.transform = `rotate(${deg}deg)`
                this.targetElement.dataset.rotation = deg;
            }
            this.targetElement.dataset.rotation = deg.deg
            this.icon.rotation = deg
        }
        const resetRotation = () => {
            handleRotation(0)
        }
        const updateWithSlider = (pct) => {
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
        const resetWithSlider = () => {
            let values = this.startingViewbox.slice();
            values[2] = this.original.vbw;
            values[3] = this.original.vbh;
            this.setViewboxValues(values);
            this.resetViewBoxScale(values)
        }
        const updateWithMouseTracker = (index,value) => {
            let values = this.startingViewbox.slice();
            let x = values[index];
            let xi = Number(x);
            let adjusted = Math.min(xi + value, 999);
            values[index] = adjusted;
            this.setViewboxValues(values);
        }
        const resetMouseTrackingSlider = (index) => {
            let values = this.startingViewbox.slice();
            values[index] = 0;
            this.setViewboxValues(values);
            this.startingViewbox = values;
        }
        const viewBoxEditorConfig = (viewBoxIndex,prop) => {
            return {
                onMouseMove:({x}) => updateWithMouseTracker(viewBoxIndex,x),
                onMouseUp:() => this.resetViewBoxScale(this.viewBox),
                onDblClick:(event) => resetOnViewBoxInputOnDoubleClick(viewBoxIndex,prop),
                reset: () => resetMouseTrackingSlider(viewBoxIndex)
            }
        }
        const zoomSliderConfig = {
            onMouseMove: ({pct}) => updateWithSlider(pct),
            onMouseDown: ({pct}) => updateWithSlider(pct),
            onMouseUp: () => this.resetViewBoxScale(this.viewBox),
            onReset: () => resetWithSlider()
        }
        const rotationSliderConfig = {
            onMouseMove: ({deg}) => handleRotation(deg),
            onMouseUp: () => this.updatePreviews(),
            onReset: () => resetRotation(),
            start: 0,
        }

        this.vbxLabel = new MouseTrackingSlider( $('.input-field.x .label') , viewBoxEditorConfig(0,'vbx'))
        this.vbyLabel = new MouseTrackingSlider( $('.input-field.y .label') , viewBoxEditorConfig(1),'vby')
        this.vbwLabel = new MouseTrackingSlider( $('.input-field.w .label') , viewBoxEditorConfig(2),'vbh')
        this.vbhLabel = new MouseTrackingSlider( $('.input-field.h .label') , viewBoxEditorConfig(3),'vbw')
        
        this.zoomSlider = new Slider( $('.input-field.zoom') , zoomSliderConfig)
        this.rotationSlider = new Slider( $('.input-field.rotate'), rotationSliderConfig)

        this.vbxInput.addEventListener('input',handleViewBoxInput(0))
        this.vbyInput.addEventListener('input',handleViewBoxInput(1))
        this.vbwInput.addEventListener('input',handleViewBoxInput(2))
        this.vbhInput.addEventListener('input',handleViewBoxInput(3))

        this.svgHeightInput.addEventListener('select',(e) => this.svgHeightInput.setAttribute('selected','true'))
        this.svgHeightInput.addEventListener('blur',(e) => this.svgHeightInput.setAttribute('selected',''))
        this.svgHeightInput.addEventListener('input',handleHeightWidthInput('height'))
        this.svgWidthInput.addEventListener('input',handleHeightWidthInput('width'))

        this.btnBorder.onclick = () => { 
            if (!this.display.style.border) this.display.style.border = '1px dotted red'
            else this.display.style.border = ''
        }
        this.btnCopy.onclick = () => this.copyToClipboard()

        $('.preview-settings').addEventListener('click', () => this.toggleSettings());
        $('.preset-header .current-preset').addEventListener('click', () => this.toggleSettings());
        const rto = $('.revert-to-original',this.element)
        this.rto = rto
        const rtoActiveHTML = '<svg width="24px" height="24px" viewBox="-3 -3 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m69ycrek-00D6BEOOQAMB"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12ZM12 9.75C10.7574 9.75 9.75 10.7574 9.75 12C9.75 13.2426 10.7574 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 10.7574 13.2426 9.75 12 9.75Z" fill="black" pid="m69ycrek-01TJ7BDYXS7T" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.32343 10.6464C3.90431 11.2503 3.75 11.7227 3.75 12C3.75 12.2773 3.90431 12.7497 4.32343 13.3536C4.72857 13.9374 5.33078 14.5703 6.09267 15.155C7.61978 16.3271 9.71345 17.25 12 17.25C14.2865 17.25 16.3802 16.3271 17.9073 15.155C18.6692 14.5703 19.2714 13.9374 19.6766 13.3536C20.0957 12.7497 20.25 12.2773 20.25 12C20.25 11.7227 20.0957 11.2503 19.6766 10.6464C19.2714 10.0626 18.6692 9.42972 17.9073 8.84497C16.3802 7.67292 14.2865 6.75 12 6.75C9.71345 6.75 7.61978 7.67292 6.09267 8.84497C5.33078 9.42972 4.72857 10.0626 4.32343 10.6464ZM5.17941 7.65503C6.90965 6.32708 9.31598 5.25 12 5.25C14.684 5.25 17.0903 6.32708 18.8206 7.65503C19.6874 8.32028 20.4032 9.06244 20.9089 9.79115C21.4006 10.4997 21.75 11.2773 21.75 12C21.75 12.7227 21.4006 13.5003 20.9089 14.2089C20.4032 14.9376 19.6874 15.6797 18.8206 16.345C17.0903 17.6729 14.684 18.75 12 18.75C9.31598 18.75 6.90965 17.6729 5.17941 16.345C4.31262 15.6797 3.59681 14.9376 3.0911 14.2089C2.59937 13.5003 2.25 12.7227 2.25 12C2.25 11.2773 2.59937 10.4997 3.0911 9.79115C3.59681 9.06244 4.31262 8.32028 5.17941 7.65503Z" fill="black" pid="m69ycrek-00Y5D0BFOELD" stroke="null"></path></svg>'
        const rtoInactiveHTML = '<svg width="24px" height="24px" viewBox="-3 -3 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lo5rs8-00OP23ZTDXMN"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M20.5303 4.53033C20.8232 4.23744 20.8232 3.76256 20.5303 3.46967C20.2374 3.17678 19.7626 3.17678 19.4697 3.46967L3.46967 19.4697C3.17678 19.7626 3.17678 20.2374 3.46967 20.5303C3.76256 20.8232 4.23744 20.8232 4.53033 20.5303L7.37723 17.6834C8.74353 18.3266 10.3172 18.75 12 18.75C14.684 18.75 17.0903 17.6729 18.8206 16.345C19.6874 15.6797 20.4032 14.9376 20.9089 14.2089C21.4006 13.5003 21.75 12.7227 21.75 12C21.75 11.2773 21.4006 10.4997 20.9089 9.79115C20.4032 9.06244 19.6874 8.32028 18.8206 7.65503C18.5585 7.45385 18.2808 7.25842 17.989 7.07163L20.5303 4.53033ZM16.8995 8.16113L15.1287 9.93196C15.5213 10.5248 15.75 11.2357 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C11.2357 15.75 10.5248 15.5213 9.93196 15.1287L8.51524 16.5454C9.58077 16.9795 10.7621 17.25 12 17.25C14.2865 17.25 16.3802 16.3271 17.9073 15.155C18.6692 14.5703 19.2714 13.9374 19.6766 13.3536C20.0957 12.7497 20.25 12.2773 20.25 12C20.25 11.7227 20.0957 11.2503 19.6766 10.6464C19.2714 10.0626 18.6692 9.42972 17.9073 8.84497C17.5941 8.60461 17.2571 8.37472 16.8995 8.16113ZM11.0299 14.0307C11.3237 14.1713 11.6526 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 11.6526 14.1713 11.3237 14.0307 11.0299L11.0299 14.0307Z" pid="m4lo5rs8-00F4LH2DZYNA" stroke="null"></path><path fill="currentColor" d="M12 5.25C13.0323 5.25 14.0236 5.40934 14.9511 5.68101C15.1296 5.73328 15.1827 5.95662 15.0513 6.0881L14.2267 6.91265C14.1648 6.97451 14.0752 6.99928 13.99 6.97967C13.3506 6.83257 12.6839 6.75 12 6.75C9.71345 6.75 7.61978 7.67292 6.09267 8.84497C5.33078 9.42972 4.72857 10.0626 4.32343 10.6464C3.90431 11.2503 3.75 11.7227 3.75 12C3.75 12.2773 3.90431 12.7497 4.32343 13.3536C4.67725 13.8635 5.18138 14.4107 5.81091 14.9307C5.92677 15.0264 5.93781 15.2015 5.83156 15.3078L5.12265 16.0167C5.03234 16.107 4.88823 16.1149 4.79037 16.0329C4.09739 15.4517 3.51902 14.8255 3.0911 14.2089C2.59937 13.5003 2.25 12.7227 2.25 12C2.25 11.2773 2.59937 10.4997 3.0911 9.79115C3.59681 9.06244 4.31262 8.32028 5.17941 7.65503C6.90965 6.32708 9.31598 5.25 12 5.25Z" pid="m4lo5rs8-02CT5B0Y3UOA" stroke="null"></path><path fill="currentColor" d="M12 8.25C12.1185 8.25 12.2357 8.25549 12.3513 8.26624C12.5482 8.28453 12.6194 8.51991 12.4796 8.6597L11.2674 9.87196C10.6141 10.0968 10.0968 10.6141 9.87196 11.2674L8.6597 12.4796C8.51991 12.6194 8.28453 12.5482 8.26624 12.3513C8.25549 12.2357 8.25 12.1185 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25Z" pid="m4lo5rs8-028MI5K4V6ZL" stroke="null"></path></svg>'
        this.rtoInactiveHTML = rtoInactiveHTML
        rto.addEventListener('click', () => {
            if (rto.getAttribute('active') === 'true'){
                this.applySetting(this.currentPreset)
                rto.setAttribute('active','false')
                rto.innerHTML = rtoInactiveHTML
                console.log('HERE FOO',this.currentPreset)
            } else {
                this.applyTempSetting(this.original)
                rto.setAttribute('active','true')
                rto.innerHTML = rtoActiveHTML
            }
        })
    }
}

export class Preview extends EventEmitterClass {
    constructor() {
        super()
        this.tabs = $$('.preview__modals--modal')
        this.tabNames = this.tabs.map(modal => modal.dataset.tab)
        this.miniPreviewElement = $('.widget-preview-icon__wrapper')
        this.miniPreviewElementName = $('.widget-preview-info .widget--icon-title > div')
        this.miniPreviewElementCollection = $('.widget-preview-info .widget--icon-category > div')
        this.element = $('#PREVIEW')
        this.components = $('.preview__modals--modal[data-tab="components"]')
        this.nameField = $('.title-group__name .label.name')
        this.categoryField = $('.title-group__category .label.category')
        this.btnCopy = $('.btn-copy')
        this.btnBorder = $('.btn-border')
        this.btnFavorite = $('.btn-favit')

        this.vbxInput = $('.input-field.x .input')
        this.vbyInput = $('.input-field.y .input')
        this.vbhInput = $('.input-field.h .input')
        this.vbwInput = $('.input-field.w .input')
        
        this.svgHeightInput = $('.input.input-height')
        this.svgWidthInput = $('.input.input-width')
        this.svgStrokeContainer = $('.field-stroke')
        this.svgStrokeInput = $('.input.inp-stroke')
        this.svgFillContainer = $('.field-fill')
        this.svgFillInput = $('.input.inp-fill')

        this.active = false
        this.presetType = 'icon'
        this.icon = undefined
        this.viewBoxScale = []
        this.startingViewbox = [0,0,20,20]
        this.currentTab = 'position'
        
        this.defaultHeight = '24'
        this.defaultWidth = '24'
        this.width = ''
        this.height = ''

        this.collectionPreset = defaultSetting
        this.original = defaultSetting
        this.tmp = defaultSetting

        for (const [key, handler] of Object.entries(htmlController)) 
            this[key] = handler.bind(this)

        this.hydrate()

    }

    get currentPreset(){
        return {
            viewbox: this.viewbox,
            vbh: this.vbh,
            vbw: this.vbw,
            vby: this.vby,
            vbx: this.vbx,
            width: this.currentWidth,
            height: this.currentHeight,
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
    get height() {
        return this.targetElement.getAttribute('height');
    }
    set height(number) {
        this.targetElement.setAttribute('height',`${number}px`);
        if (this.icon) this.icon.height = number
        this.currentHeight = number
        this.svgHeightInput.value = number
    }
    get width() {
        return this.targetElement.getAttribute('width');
    }
    set width(number) {
        this.targetElement.setAttribute('width',`${number}px`)
        if (this.icon) this.icon.width = number
        this.currentWidth = number
        this.svgWidthInput.value = number
    }

    resetViewBoxScale(currentViewBox){
        this.startingViewbox = currentViewBox.slice()
        this.viewBoxScale = currentViewBox.slice()
    }
    setViewboxValues(array) {
        if (!this.icon) return
        let stringValue = array.join(' '),
            vbx = Number(array[0]),
            vby = Number(array[1]),
            vbw = Number(array[2]),
            vbh = Number(array[3])
            if (this.rto.getAttribute('active') === 'true'){
                this.rto.setAttribute('active','false')
                this.rto.innerHTML = this.rtoInactiveHTML
            }
        this.vbx = vbx
        this.vbxInput.value = `${vbx}`
        this.icon.vbx = vbx

        this.vby = vby
        this.vbyInput.value = `${vby}`
        this.icon.vby = vby

        this.vbw = vbw
        this.vbwInput.value = `${vbw}`
        this.icon.vbw = vbw

        this.vbh = vbh
        this.vbhInput.value = `${vbh}`
        this.icon.vbh = vbh
        
        this.targetElement.setAttribute('viewBox',stringValue)
        this.icon.viewBox = stringValue
        this.viewbox = stringValue
        this.icon.markup = this.markup
        this.notify('viewbox changed')
    }
    applySetting(preset){
        let { viewbox = '', vbh = 20, vbw = 20, vby = 0, vbx = 0, width = '24', height = '24'} = preset
        let vb = [vbx,vby,vbw,vbh]
        this.height = height
        this.width = width
        this.viewbox = viewbox
        this.vbx = vbx
        this.vby = vby
        this.vbh = vbh
        this.vbw = vbw
        this.resetViewBoxScale(vb)
        this.setViewboxValues(vb)
    }
    applyTempSetting(preset){
        let {vbh = 20, vbw = 20, vby = 0, vbx = 0, width = '24', height = '24'} = preset
        let vb = [vbx,vby,vbw,vbh]
        let stringValue = vb.join(' ')
        this.vbxInput.value = `${vbx}`
        this.vbyInput.value = `${vby}`
        this.vbwInput.value = `${vbw}`
        this.vbhInput.value = `${vbh}`
        this.targetElement.setAttribute('viewBox',stringValue)

    }
    setCollectionPreset(preset){
        this.collectionPreset = {
            ...defaultSetting,
            ...preset
        }
    }
    handlePreset(icon){
        (icon?.preset && this.presetType === 'icon') 
          ? this.applySetting(icon.preset)
          : this.applySetting(this.collectionPreset)
        this.original = icon.settings.original
    }
    update(icon) {
        if (!icon) return this.setLoading();
        this.icon = icon.save();
        let { name , collection , rotation } = icon
        this.updateDisplayElement(icon.markup)
        this.handlePreset(icon)
        this.updateCategoryField(collection)
        this.updateNameField(name)
        this.updatePreviews()
        if (rotation) this.rotationSlider.setDegrees(rotation)
        this.notify('icon updated',icon,this.targetElement)
    }

}
