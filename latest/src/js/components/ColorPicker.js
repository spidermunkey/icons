import { Canvas } from "./Canvas.js";
import { Color } from './Color.js';

export class ColorPicker extends EventEmitter {
    constructor({handleUpdate}) {
        super();
        this.selected = []
        this.elements = []
        this.targets = []
        this.propsToUpdate = []
        this.fsActive = false
        this.active = false
        this.currentIcon = undefined
        this.handleUpdate = handleUpdate
        this.targetListElement = $('.path-extractor')
        this.canvasPreviewColor = $('.preview-color')
        this.previewColor = $('.pv-preview-color')
        this.previewInput = $('.hex-input input')
        this.hexInput = $('.pv-inp input')
        this.currentDrop = ''

        this.state = {
            selected: [],
            currentValue: '',
            values: new Cursor([]),
            _color: {},
            get color() {
                return this._color
            },
            set color(val) {
                this._color = val
            }

        }

        this.updateCurrentHue = (state) => {
            this.canvas.updateHue(state.deg);
            this.updateAll(this.canvas.color.hex);
        }

        this.hueSlider = new Slider($('.color-picker .hue-bar'), {
            onMouseMove: this.updateCurrentHue.bind(this),
            onMouseDown: this.updateCurrentHue.bind(this),
            onMouseUp: () => this.notify('colorchange')
        }, 'vertical' )

        this.canvas = new Canvas({
            canvas: $('.canvas'),
            pointer: $('.canvas-pointer'),
            hueBar: this.hueSlider,
            state: this.state,
            actions: {
                mouseMove: color => {
                    const hex = color.hex
                    this.updateAll(hex)
                    this.state.currentValue = hex
                },
                onClick: color => {
                    const hex = color.hex
                    this.updateAll(hex)
                    this.state.currentValue = hex
                },
                mouseUp: color => {
                    this.notify('colorchange',color)
                }
            }
        })
        this.hydrate()
    }
    
    get iconColors(){
        return this.targets.reduce((colorset,currentPath) => {
            const {pid,stroke,fill} = currentPath 
            colorset[pid] = [stroke,fill]
            return colorset
        },{})
    }
    get currentColorset() {
        return this.state.color
    }
    setCollectionColor(colorset){
        this.state.color = colorset
    }
    setPresetColorMode(mode){

    }
    applyColor(colorset){
        this.applyColors(colorset)
    }
    getTarget(pid) {
        return this.targets.find(target => target.pid === pid)
    }
    setInputValid() {
        this.previewInput.classList.remove('invalid')
        this.hexInput.classList.remove('invalid')
    }
    setInputInvalid() {
        this.previewInput.classList.add('invalid')
        this.hexInput.classList.add('invalid')
    }
    setCanvasIfSingleColor() {
        const singleUpdate = this.state.selected.length == 1 && this.state.selected[0].selected.length == 1;
        if (singleUpdate) {
            let state = this.state.selected[0]
            let target = state.selected[0]
            let strProp = `current${capitalize(target)}`
            this.updateCanvas(state[strProp])
        }
    }
    updateCanvasWithSingleColor(target,type) {
        let propertyToUpdate = type === 'fill' ? target.currentFill : type === 'stroke' ? target.currentStroke : null
        let colorIfNone = '#000000'
        this.updateCanvas(!Color.isValidHex(propertyToUpdate) ? colorIfNone : propertyToUpdate)
    }
    bindToCanvas(target) {
        this.state.selected.push(target)
    }
    unbindFromCanvas(target,type) {
        this.state.selected = this.state.selected.filter(index => {
            const targetFound = index.pid == target.pid
            const isBoundType = index.type == type
            if (!targetFound) return true
            if (isBoundType) return false
        })
    }
    select(target,type) {
        this.state.selected.forEach(target => this.removeSelection(target,'stroke'))
        this.state.selected.forEach(target => this.removeSelection(target,'fill'))
        this.state.selected = []
        this.addSelection(target,type)
    }
    addSelection(target,type) {
        target.select(type)
        this.bindToCanvas(target,type)
    }
    removeSelection(target,type) {
        let targetIsSelected = target.unselect(type)
        if (targetIsSelected == false) this.unbindFromCanvas(target,type)
    }

    copy(){
        console.log('COPY', this.state.currentValue)
    }
    open(){
        $('.color-picker').classList.add('active')
        this.active = true
        if (this.fsActive){
            $('.cp-fs').classList.remove('active')
            this.fsActive = false
        }
        const saveColorModal = $('.save-colorset-modal')
        if (saveColorModal.classList.contains('active'))
            saveColorModal.classList.remove('active')
    }
    close(){
        $('.color-picker').classList.remove('active')
        this.active = false
        if (this.fsActive) {
            $('.cp-fs').classList.remove('active')
            this.fsActive = false
        }

    }
    toggle(){
        if (this.active) this.close()
        else this.open()
    }
    openFS(){
        this.close();
        $('.cp-fs').classList.add('active')
        this.fsActive = true
        const saveColorModal = $('.save-colorset-modal')
        if (saveColorModal.classList.contains('active'))
            saveColorModal.classList.remove('active')
            
    }
    closeFS(){
        $('.cp-fs').classList.remove('active')
        this.fsActive = false
    }
    toggleFS(){
        if (this.fsActive = true) this.closeFS()
        else this.openFS()
    }
    hydrate() {
        if (Color.isValidHex(this.previewInput.value)) this.updatePreviewColor(this.previewInput.value)
        $('.canvas-copy').addEventListener('click',() => this.copy())
        $('.open-palette').addEventListener('click',() => this.toggle())
        // $('.pv-preview-color').addEventListener('click',()=> this.toggle());
        $('.cp-header .cp-close').addEventListener('click', () => this.close())
        $('.updater .btn-reset').addEventListener('click',() => this.handleReset())
        $('.pv-updater .btn-reset').addEventListener('click',() => this.handleReset())
        $('.hex-input .canvas-undo').addEventListener('click',() => this.handleUndo())
        $('.hex-input .canvas-redo').addEventListener('click',() => this.handleRedo())
        this.previewInput.addEventListener('input',(e) => this.handleInput(e.target.value))
        this.hexInput.addEventListener('input',(e) => this.handleInput(e.target.value))
        $('.updater .btn-update').addEventListener('click', () => {
            const errorAnimation = () => {
                const animation = [
                    {transform: "translateX(2px)"},
                    {transform: "translateX(0)"}
                ]
                const animeTiming = {
                    duration: 200,
                    iterations: 2,
                }
                this.previewInput.animate(animation,animeTiming)
                this.hexInput.animate(animation,animeTiming)
            }
            const hex = this.previewInput.value
            if (!Color.isValidHex(hex)) return errorAnimation()
            this.canvas.update({hex:hex})
            this.updatePreviewColor(hex)
            this.setInputValid()
            this.updateElements(hex)
        })
        $('.pv-updater .btn-update').addEventListener('click',() => {
            const hex = this.previewInput.value
            const errorAnimation = () => {
                const animation = [
                    {transform: "translateX(2px)"},
                    {transform: "translateX(0)"}
                ]
                const animeTiming = {
                    duration: 200,
                    iterations: 2,
                }
                this.previewInput.animate(animation,animeTiming)
                this.hexInput.animate(animation,animeTiming)
            }
            if (!Color.isValidHex(hex)) return errorAnimation()
            this.canvas.update({hex:hex})
            this.updateAll(hex)
        })
        const colorModal = $('.preview__modals--modal[data-tab="color"]')
        colorModal.addEventListener('contextmenu',(e) => {
            // eye dropper action
            e.preventDefault();
            let pickerElement = e.target.closest('.picker-element')
            if (pickerElement && Color.isValidHex(this.currentDrop)) {
                let pathElement = e.target.closest('.path-element')
                let id = pathElement.getAttribute('pid')
                let targetType = pickerElement.getAttribute('target')
                this.dropColor(id,targetType)
            }
       })
        colorModal.addEventListener('click', (e) => {
            const mapper = mapEvents(e)
            if (mapper.rightClick()) return
            // UNDO
            let clickedUndo = e.target.closest('.canvas-undo')
                if (clickedUndo) this.handleUndo()
            // REDO
            let clickedRedo = e.target.closest('.canvas-redo')
                if (clickedRedo) this.handleRedo()
            // EDITOR ELEMENT     
            let clickedPath = e.target.closest('.path-element')
                if (!clickedPath) return;
                // HANDLE DROPPER
            let pickerElement = mapper.clicked('.picker-element')
            if (pickerElement){
                const color = pickerElement.getAttribute('color')
                this.pickupColor(color)
            }
            let id = clickedPath.getAttribute('pid')
            let pathExists = clickedPath && this.getTarget(id)
                if (!pathExists) return
            let clickedStrokeLabel = e.target.closest('.path-element .stroke-icon .picker-label')
                if (clickedStrokeLabel) this.handleStrokeLabel(id)
            let clickedStrokeIcon = e.target.closest('.path-element .stroke-icon .picker-element')
                if (clickedStrokeIcon) this.handleStrokeIcon(id)
            let clickedFillLabel = e.target.closest('.path-element .fill-icon .picker-label')
                if (clickedFillLabel) this.handleFillLabel(id)
            let clickedFillIcon = e.target.closest('.path-element .fill-icon .picker-element')
                if (clickedFillIcon) this.handleFillIcon(id)
            let clickedPathLabel = e.target.closest('.path-element .attr-label')
                if (clickedPathLabel) this.handlePathLabel(id)
        })
    }
    pickupColor(hex) {
        this.currentDrop = hex
    }
    dropColor(pathId,targetType,hex = this.currentDrop){
        let target = this.getTarget(pathId)
        if ((targetType === 'stroke' || targetType === 'fill') && hex !== undefined){
            // set(type) should be a function for clarity
            target[targetType] = this.currentDrop
        }
    }
    handleInput(hex) {
        this.updateInputText(hex)
        if (!Color.isValidHex(hex)) return this.setInputInvalid()
        this.canvas.update({hex:hex})
        this.updatePreviewColor(hex)
        this.updateElements(hex)
        this.setInputValid()
        this.state.currentValue = hex
        return hex
    }
    handleReset() {
        const setOriginStrokeOrFill = target => {
            const selecedType = target.selected;
            // targetPath.selected : ['stroke','fill']
            // target['fill'] = target['originFill']
            selecedType.forEach(type => target[type] = target[`origin${capitalize(type)}`])
        }
        if (this.state.selected.length > 0) this.state.selected.forEach(setOriginStrokeOrFill)
        this.setCanvasIfSingleColor()
        this.updateColor()
    }
    handleUndo() {
        this.state.selected.forEach(index => {
            let type = index.selected
            index.undo(type)
        })
        this.setCanvasIfSingleColor()
        this.updateColor()
    }
    handleRedo() {
        this.state.selected.forEach(index => {
            let target = index[0]
            let type = index[1]
            target.redo(type)
        })
        this.setCanvasIfSingleColor()
        this.updateColor()
    }
    handleStrokeLabel(pid) {
        const target = this.getTarget(pid)
        if (!target) return
        const strokeIsSelected = target.selected.find(val => val === 'stroke')
        if (strokeIsSelected) this.removeSelection(target,'stroke')
        else this.addSelection(target,'stroke')
    }
    handleStrokeIcon(pid) {
        const target = this.getTarget(pid)
        if (!target) return
        this.select(target,'stroke')
        this.updateCanvasWithSingleColor(target,'stroke')
    }
    applyStrokeIcon(pid,hex){
        const target = this.getTarget(pid)
        if (!target) return
        this.select(target,stroke)
    }
    handleFillLabel(pid) {
        const target = this.getTarget(pid)
        if (!target) return
        const fillIsSelected = target.selected.find(val => val === 'fill')
        if (fillIsSelected) this.removeSelection(target,'fill')
        else  this.addSelection(target,'fill')
    }
    handleFillIcon(pid) {
        const target = this.getTarget(pid)
        if (!target) return
        this.select(target,'fill')
        this.updateCanvasWithSingleColor(target,'fill')
    }
    handlePathLabel(pid) {

    }
    updateColor() {
        if (this.handleUpdate) this.handleUpdate(this.icon)
    }
    updateHue(color) {
        this.canvas.setCanvasHue()
    }
    updatePreviewColor(hex) {
        this.canvasPreviewColor.style.setProperty('background',hex)
        this.previewColor.style.setProperty('background',hex)
        return hex
    }
    updateCanvas(hex) {
        this.canvas.update({hex:hex})
        this.updateInputText(hex)
        this.updatePreviewColor(hex)
        return hex;
    }
    updateElements(hex) {
        const setStrokeOrFill = target => {
            target.selected.forEach(stype => target[stype] = hex)
        }
        if (this.state.selected.length > 0) this.state.selected.forEach(setStrokeOrFill)
        this.updateColor();
        return hex;
    }
    updateFillGroup(hex){
        this.targets.forEach(target => {
            if (target.tag !== 'svg'){
                target['fill'] = hex
            }
        })
    }
    updateStrokeGroup(hex){ 
        this.targets.forEach(target => {
            if (target.tag !== 'svg'){
                target['stroke'] = hex
            }
        })
    }
    updateAll(hex) {
        this.updateElements(hex)
        this.updatePreviewColor(hex)
        this.updateInputText(hex)
        this.state.values.addOneAndSkipTo(this.currentValue)
        this.updateColor()
    }
    updateInputText(hex) {
        !Color.isValidHex(hex) ? this.setInputInvalid() :this.setInputValid()
        this.previewInput.value = hex
        this.hexInput.value = hex
        return hex
    }
    applyColors(colorset, target = this.target){
        // THIS FUNCTION COULD PROBABLY BE APPLIED IN CREATE ELEMENT PAIR FUNCTION
        if (colorset.colorset_type === 'global'){
            const elements = this.state.icon.crawl(target);
            let {fill,stroke} = colorset.shapes
            elements.forEach(element => {
                if (stroke && stroke !== 'none') element.setAttribute('stroke',stroke)
                if (fill && fill !== 'none') element.setAttribute('fill',fill)
            })
        }
        else if (colorset.colorset_type === 'variable') {
            for (const pid in colorset.paths){
                let path = target.querySelector(`[pid="${pid}"]`)
                let stroke = colorset.paths[pid][0]
                let fill = colorset.paths[pid][1]
                if (!path) continue
                if (stroke && stroke !== 'none') path.setAttribute('stroke',stroke)
                if (fill && fill !== 'none') path.setAttribute('fill',fill)
            }
        } else {
            console.warn('error applying global colorset....',colorset)
            console.warn('preset type not supported', colorset.colorset_type)
        }

    }
    applyFromColorset(colorset,target = this.target){

        this.applyColors(colorset,target)
        this.elements = [ target, ...this.state.icon.crawl(target) ]
        this.targets = this.elements.map(createElementPair.bind(this))
        const elements = this.targets.map(pair => pair.editorElement.element)
        const destination = this.targetListElement
        let targetListElement = $('.markup-data')
        if (targetListElement) targetListElement.innerHTML = ''
        else {
            targetListElement = document.createElement('div')
            targetListElement.classList.add('markup-data')
            destination.appendChild(targetListElement)
        }
        elements.forEach(element => targetListElement.appendChild(element))
    }
    useState(){
        return {
            selected: this.state.selected,
            currentValue: this.state.currentValue,
            values: this.state.values,
            color: this.canvas.color,
        }
    }
    handleState(state){
        this.selected = []
        this.state.selected = state?.selected || []
        this.state.currentValue = state?.currentValue || ''
        this.state.values = state?.values || new Cursor([])
    }
    update(icon,target){
        // if (this.state.icon) this.state.icon.colors.temp = this.iconColors
        let colorset;
        let defaultColors = icon.color
        let useCollectionDefault = !objectIsEmpty(this.currentColorset) && this.currentColorset && this.currentColorset.colorset_type === 'global'
        if (useCollectionDefault){
            colorset = this.currentColorset
        } else {
            colorset = !objectIsEmpty(defaultColors) ? defaultColors : icon.colors.original;
        }
        this.state.icon = icon
        this.target = target
        this.applyFromColorset( colorset, target )
        this.handleState( icon?.colors || {})
    }
}

function createElementPair(element) {
    let 
        stroke = element.getAttribute('stroke'),
        fill = element.getAttribute('fill'),
        tag = element.tagName,
        pid = element.getAttribute('pid'),
        displayElement = element,
        pathElement = createPathElement({ stroke , fill , tag , pid }),
        statefulPair = {
            displayElement,
            editorElement: {
                correspondingPath: displayElement,
                element: pathElement,
                label: $('.attr-label',pathElement),
                strokeElement: $('.stroke-icon',pathElement),
                strokeIcon: $('.stroke-icon .picker-element',pathElement),
                strokeLabel: $('.stroke-icon .picker-label',pathElement),
                fillElement: $('.fill-icon',pathElement),
                fillIcon: $('.fill-icon .picker-element',pathElement),
                fillLabel: $('.fill-icon .picker-label',pathElement)
            },
            currentFill: fill,
            currentStroke: stroke,
            originFill: fill,
            originStroke: stroke,
            previousFill: new Cursor([fill]),
            previousStroke: new Cursor([stroke]),
            isSelected: false,
            selected: [],
            pid,
            tag,
            get stroke() {
                return this.currentStroke
            },
            setStroke(hex) {
                if (hex == null) {
                    this.displayElement.removeAttribute('stroke')
                    this.editorElement.strokeIcon.style.setProperty('--background','none')
                    this.editorElement.strokeIcon.setAttribute('color','')
                    this.editorElement.strokeIcon.classList.remove('hasCol')
                } else if (hex == undefined) {
                    this.displayElement.setAttribute('stroke','none')
                    this.editorElement.strokeIcon.style.setProperty('--background','transparent')
                    this.editorElement.strokeIcon.setAttribute('color','')
                    this.editorElement.strokeIcon.classList.remove('hasCol')
                } else {
                    if (first(hex) !== '#')
                        hex = '#' + hex;
                    this.editorElement.strokeIcon.classList.add('hasCol')
                    this.displayElement.setAttribute('stroke',hex)
                    this.editorElement.strokeIcon.setAttribute('color',hex)
                    this.editorElement.strokeIcon.style.setProperty('--background',hex)
                }
            },
            set stroke(hex) {
                this.setStroke(hex)
                this.previousStroke.addOneAndSkipTo(hex)
                this.currentStroke = hex
            },
            get fill() {
                return this.currentFill
            },
            setFill(hex) {
                if (hex == null) {
                    this.displayElement.removeAttribute('stroke')
                    this.editorElement.fillIcon.style.setProperty('--background','none')
                    this.editorElement.fillIcon.setAttribute('color','')
                    this.editorElement.fillIcon.classList.remove('hasCol')
                } else if (hex == 'none') {
                    this.displayElement.setAttribute('fill','none')
                    this.editorElement.fillIcon.style.setProperty('--background','transparent');
                    this.editorElement.fillIcon.setAttribute('color','')
                    this.editorElement.fillIcon.classList.remove('hasCol')
                } else {
                    if (first(hex) !== '#')
                        hex = '#' + hex;
                    this.editorElement.fillIcon.classList.add('hasCol')
                    this.displayElement.setAttribute('fill',hex)
                    this.editorElement.fillIcon.setAttribute('color',hex)
                    this.editorElement.fillIcon.style.setProperty('--background',hex)
                }
            },
            set fill(hex) {
                this.setFill(hex)
                this.previousStroke.addOneAndSkipTo(hex)
                this.currentFill = hex
            },
            set selectedTypes(val) {
                if (!this.selected.find(val => val === val) && (val === 'stroke' || val === 'fill'))
                    this.selected.push(val)
            },
            resetStroke() {
                this.stroke = this.originStroke
            },
            resetFill() {
                this.fill = this.originFill
            },
            reset(type) {
                if (type === 'stroke') this.resetStroke()
                else if (type === 'fill') this.resetFill()
            },
            select(type) {
                if (type == 'stroke') {
                    this.isSelected = true
                    this.editorElement.strokeElement.classList.add('selected')
                    if (!this.selected.find(val => val === 'stroke'))
                        this.selected.push('stroke')
                }
                else if (type == 'fill') {
                    this.isSelected = true
                    // this.selectedTypes = 'fill'
                    this.editorElement.fillElement.classList.add('selected')
                    if (!this.selected.find(val => val === 'fill'))
                        this.selected.push('fill')
                }
            },
            unselect(type) {
                if (type == 'stroke') {
                    this.editorElement.strokeElement.classList.remove('selected')
                    this.selected = this.selected.filter(val => val !== 'stroke')
                    if (this.selected.length == 0) 
                        this.isSelected = false
                    return this.isSelected
                }
                else if (type == 'fill') {
                    this.editorElement.fillElement.classList.remove('selected')
                    this.selected = this.selected.filter(val => val !== 'fill')
                    if (this.selected.length == 0) 
                        this.isSelected = false
                    return this.isSelected
                }
            },
            updateAll(hex) {
                this.selected.forEach(type => this[type] = hex)
            },
            update(type,hex) {
                if (type == 'stroke') this.setStroke(hex)
                else if (type == 'fill') this.setFill(hex)
            },
            undo(targetType) {
                if (targetType === 'stroke' || targetType === 'fill') {
                    let str = `previous${capitalize(targetType)}`
                    let strProp = `current${capitalize(targetType)}`
                    let cursor = this[str];
                    const prevState = cursor.skipToPrev()
                    this.update(targetType,prevState)
                    this[strProp] = prevState
                    return prevState
                }
            },
            redo(type) {
                if (type == 'stroke' || type == 'fill') {
                    let str = `previous${capitalize(type)}`
                    let strProp = `current${capitalize(type)}`
                    let cursor = this[str]
                    const nextState = cursor.skipToNext()
                    this.update(type,nextState)
                    this[strProp] = nextState
                    return nextState
                }
            }
       }
    return statefulPair
}
function createPathElement({tag,fill,stroke,pid}) {
    const pathElement = document.createElement('div')
    pathElement.classList.add('path-element')
    pathElement.setAttribute('pid',pid)
    pathElement.appendChild(pathLabel(tag))
    pathElement.appendChild(fillElement(fill))
    pathElement.appendChild(strokeElement(stroke))
    return pathElement
}
function pathLabel(tag) {
    const elementLabel = document.createElement('div')
    elementLabel.classList.add('label','attr-label')
    elementLabel.textContent = tag
    return elementLabel
}
function fillElement(fill) {
    const elementFillIcon = document.createElement('div'),
          elementFillLabel = document.createElement('div'),
          elementFillDataElement = document.createElement('div')
    elementFillIcon.classList.add('fill-icon','color-picker-icon')
    elementFillLabel.classList.add('picker-label'),
    elementFillLabel.textContent = 'Fill',
    elementFillDataElement.classList.add('picker-element')
    if (fill == null) {
        elementFillDataElement.innerHTML = noAttrIcon()
        elementFillDataElement.setAttribute('color','')
    }
    else if (fill === 'none') {
        elementFillDataElement.innerHTML = noColorIcon()
        elementFillDataElement.setAttribute('color','')
    }
    else if (Color.isValidHex(fill)) {
        elementFillDataElement.style.setProperty('--background',fill)
        elementFillDataElement.classList.add('hasCol')
        elementFillDataElement.setAttribute('color',fill)
    }
    elementFillDataElement.setAttribute('target','fill')
    elementFillIcon.appendChild(elementFillLabel)
    elementFillIcon.appendChild(elementFillDataElement)
    return elementFillIcon
}
function strokeElement(stroke) {
    const elementStrokeIcon = document.createElement('div'),
          elementStrokeLabel = document.createElement('div'),
          elementStrokeDataElement = document.createElement('div')
    elementStrokeIcon.classList.add('stroke-icon','color-picker-icon')
    elementStrokeLabel.classList.add('picker-label')
    elementStrokeLabel.textContent = 'Stroke'
    elementStrokeDataElement.classList.add('picker-element')
    if (stroke == null) {
        elementStrokeDataElement.innerHTML = noAttrIcon()
        elementStrokeDataElement.setAttribute('color','')
    }
    else if (stroke === 'none') {
        elementStrokeDataElement.innerHTML = noColorIcon()
        elementStrokeDataElement.setAttribute('color','')
    }
    else if (Color.isValidHex(stroke)) {
        elementStrokeDataElement.style.setProperty('--background', stroke)
        elementStrokeDataElement.classList.add('hasCol')
        elementStrokeDataElement.setAttribute('color',stroke)
    }
    elementStrokeIcon.appendChild(elementStrokeLabel)
    elementStrokeIcon.appendChild(elementStrokeDataElement)
    elementStrokeDataElement.setAttribute('target','stroke')

    return elementStrokeIcon
}
function noAttrIcon(){
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
    <path fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" d="M53.919,10.08c12.108,12.106,12.108,31.733,0,43.84
        c-12.105,12.107-31.732,12.107-43.838,0c-12.108-12.106-12.108-31.733,0-43.84C22.187-2.027,41.813-2.027,53.919,10.08z"></path>
    <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="10.08" y1="10.08" x2="53.92" y2="53.92"></line>
    </svg>`
}
function noColorIcon(){
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve" height="40px" width="40px">
    <path d="M40,23.99H10c-0.552,0-1,0.447-1,1s0.448,1,1,1h30c0.552,0,1-0.447,1-1S40.552,23.99,40,23.99z"></path>
    </svg>`
}
