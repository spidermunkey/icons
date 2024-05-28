import { Canvas } from "./Canvas.js";
import { Color } from './Color.js';

export class ColorPicker {

    constructor({handleUpdate}) {
        this.selected = [];
        this.elements = [];
        this.targets = [];
        this.propsToUpdate = [];
        this.currentIcon = undefined;
        this.handleUpdate = handleUpdate;
        this.targetListElement = $('.path-extractor');
        this.canvasPreviewColor = $('.preview-color');
        this.previewColor = $('.pv-preview-color');
        this.previewInput = $('.hex-input input');
        this.hexInput = $('.pv-inp input');

        this.updateCurrentHue = (state) => {
            this.canvas.setHue(state.deg);
            this.updateAll(this.canvas.color.hex);
        }

        this.hueSlider = new Slider($('.color-picker .hue-bar'), {
            onMouseMove: this.updateCurrentHue.bind(this),
            onMouseDown: this.updateCurrentHue.bind(this),
            // onMouseUp: self.updateColor.bind(self)
        }, 'vertical' )

        this.canvas = new Canvas({
            canvas: $('.canvas'),
            pointer: $('.canvas-pointer'),
            hueBar: this.hueSlider,
            actions: {
                handleColor: color => {
                    const hex = color.hex;
                    this.updateAll(hex);
                }
            }
        })

        this.hydrate();

    }

    crawl(element) {

        let children = [];

        for (var i = 0; i < element.childNodes.length; i++) {
            var child = element.childNodes[i];
            // Skip text nodes
            if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.COMMENT_NODE) 
                continue;
            

            if (child.tagName === 'g' || child.tagName === 'G') {
                var groupChildren = this.crawl(child);
                children = children.concat(groupChildren)
            } else
                children.push(child);

        }

        return children;

    }

    mark( child , pid = uuid() ) {
        child.setAttribute('pid',pid);
        return child;
    }
    
    markAll(children) {
        return children.map(this.mark);
    }

    clearMark(child) {
        child.removeAttribute('pid');
        return child;
    }

    clearMarkAll(children) {
        return children.map(this.clearMark);
    }

    createPathElement({tag,fill,stroke,pid}) {
        console.log(tag,fill,stroke,pid)

        const pathLabel = tag => {

            const elementLabel = document.createElement('div');
            elementLabel.classList.add('label','attr-label');
            elementLabel.textContent = tag;

            return elementLabel
        }

        const fillElement = fill => {

            const elementFillIcon = document.createElement('div'),
                  elementFillLabel = document.createElement('div'),
                  elementFillDataElement = document.createElement('div');

            elementFillIcon.classList.add('fill-icon','color-picker-icon');
            elementFillLabel.classList.add('picker-label'),
            elementFillLabel.textContent = 'Fill',
            elementFillDataElement.classList.add('picker-element');

            console.log(fill)
            if (fill == null) 
                elementFillDataElement.innerHTML = this.noAttrIcon
            else if (fill === 'none') 
                elementFillDataElement.innerHTML = this.noColorIcon
            else if (Color.isValidHex(fill)) {
                console.log(Color.isValidHex(fill))
                elementFillDataElement.style.setProperty('--background',fill);
                elementFillDataElement.classList.add('hasCol')
            }
            
            elementFillIcon.appendChild(elementFillLabel);
            elementFillIcon.appendChild(elementFillDataElement);

            return elementFillIcon
        }

        const strokeElement = stroke => {

            const elementStrokeIcon = document.createElement('div'),
                  elementStrokeLabel = document.createElement('div'),
                  elementStrokeDataElement = document.createElement('div');


            elementStrokeIcon.classList.add('stroke-icon','color-picker-icon');
            elementStrokeLabel.classList.add('picker-label');
            elementStrokeLabel.textContent = 'Stroke';
            elementStrokeDataElement.classList.add('picker-element')

            if (stroke == null) 
                elementStrokeDataElement.innerHTML = this.noAttrIcon
            else if (stroke === 'none') 
                elementStrokeDataElement.innerHTML = this.noColorIcon
            else if (Color.isValidHex(stroke)) {
                elementStrokeDataElement.style.setProperty('--background', stroke);
                elementStrokeDataElement.classList.add('hasCol')
            }
        
            elementStrokeIcon.appendChild(elementStrokeLabel);
            elementStrokeIcon.appendChild(elementStrokeDataElement);

            return elementStrokeIcon
        }

        const pathElement = document.createElement('div');
        pathElement.classList.add('path-element');
        pathElement.setAttribute('pid',pid);

        pathElement.appendChild(pathLabel(tag));
    
        pathElement.appendChild(fillElement(fill));
        
        pathElement.appendChild(strokeElement(stroke));

        return pathElement
    }

    createListElement(elements){

        let targetListElement = $('.markup-data');

        if (targetListElement) 
            targetListElement.innerHTML = '';
        else {
            targetListElement = document.createElement('div');
            targetListElement.classList.add('markup-data');
            this.targetListElement.appendChild(targetListElement);
        }

        if (elements) 
            elements.forEach(element => targetListElement.appendChild(element))

        return targetListElement;
    }

    createElementPair(element) {

        let 
            stroke = element.getAttribute('stroke'),
            fill = element.getAttribute('fill'),
            tag = element.tagName,
            pid = uuid(),
        
           displayElement = this.mark(element,pid),
           pathElement = this.createPathElement({ stroke , fill , tag , pid }),

           statefulPair = {

                pid,
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

                get stroke() {
                    return this.currentStroke
                },

                setStroke(hex) {
                    if (hex == null) {
                        this.displayElement.removeAttribute('stroke')
                        this.editorElement.strokeIcon.style.setProperty('--background','none');
                        this.editorElement.strokeIcon.classList.remove('hasCol')

                    } else if (hex == undefined) {
                        this.displayElement.setAttribute('stroke','none')
                        this.editorElement.strokeIcon.style.setProperty('--background','transparent');
                        this.editorElement.strokeIcon.classList.remove('hasCol')
                    } else {
                        if (first(hex) !== '#')
                            hex = '#' + hex;
                        this.editorElement.strokeIcon.classList.add('hasCol')
                        this.displayElement.setAttribute('stroke',hex);
                        this.editorElement.strokeIcon.style.setProperty('--background',hex);
                    }
                },

                set stroke(hex) {
                    this.setStroke(hex)
                    this.previousStroke.addOneAndSkipTo(hex);
                    this.currentStroke = hex;
                },

                get fill() {
                    return this.currentFill
                },

                setFill(hex) {
                    if (hex == null) {
                        this.displayElement.removeAttribute('stroke')
                        this.editorElement.fillIcon.style.setProperty('--background','none');
                        this.editorElement.fillIcon.classList.remove('hasCol')

                    } else if (hex == 'none') {
                        this.displayElement.setAttribute('fill','none')
                        this.editorElement.fillIcon.style.setProperty('--background','transparent');
                        this.editorElement.fillIcon.classList.remove('hasCol')
                    } else {

                        if (first(hex) !== '#')
                            hex = '#' + hex;

                        this.editorElement.fillIcon.classList.add('hasCol')
                        this.displayElement.setAttribute('fill',hex);
                        this.editorElement.fillIcon.style.setProperty('--background',hex);
                    }
                },

                set fill(hex) {

                    this.setFill(hex);
                    this.previousStroke.addOneAndSkipTo(hex);
                    this.currentFill = hex;
                },

                set selectedTypes(val) {

                    if (!this.selected.find(val => val === val) && (val === 'stroke' || val === 'fill'))
                        this.selected.push(val);

                    console.log(this.selected)

                },

                resetStroke() {
                    this.stroke = this.originStroke;
                },

                resetFill() {
                    this.fill = this.originFill;
                },

                reset(type) {
                    if (type === 'stroke') this.resetStroke()
                    else if (type === 'fill') this.resetFill()
                },

                select(type) {
                    if (type == 'stroke') {
                        this.isSelected = true;
                        this.editorElement.strokeElement.classList.add('selected')
                        if (!this.selected.find(val => val === 'stroke'))
                            this.selected.push('stroke');
                        console.log(this.selected);
                    }
                    else if (type == 'fill') {
                        this.isSelected = true;
                        this.selectedTypes = 'fill';
                        this.editorElement.fillElement.classList.add('selected');
                        if (!this.selected.find(val => val === 'fill'))
                            this.selected.push('fill');
                        console.log(this.selected);
                    }
                },

                unselect(type) {
                    if (type == 'stroke') {
                        this.editorElement.strokeElement.classList.remove('selected');
                        this.selected = this.selected.filter(val => val !== 'stroke');
                        if (this.selected.length == 0) 
                            this.isSelected = false;
                        console.log('TARGET SELECTIONS',this.selected)
                        return this.isSelected
                    }
                    else if (type == 'fill') {
                        this.editorElement.fillElement.classList.remove('selected');
                        this.selected = this.selected.filter(val => val !== 'fill');
                        if (this.selected.length == 0) 
                            this.isSelected = false;
                        console.log('TARGET SELECTIONS',this.selected)
                        return this.isSelected

                    }
                },

                updateAll(hex) {
                    this.selected.forEach(type => this[type] = hex)
                },

                update(type,hex) {
                    if (type == 'stroke') this.setStroke(hex);
                    else if (type == 'fill') this.setFill(hex);
                },

                undo(type) {
                    if (type == 'stroke' || type == 'fill') {
                        let str = `previous${uppercase(type)}`;
                        let strProp = `current${uppercase(type)}`;

                        let cursor = this[str];
                        const prevState = cursor.skipToPrev();
                        this.update(type,prevState);
                        this[strProp] = prevState
                        return prevState;
                    }
                },

                redo(type) {
                    console.log('redoey')
                    if (type == 'stroke' || type == 'fill') {
                        let str = `previous${uppercase(type)}`;
                        let strProp = `current${uppercase(type)}`;
                        let cursor = this[str];
                        const nextState = cursor.skipToNext();
                        this.update(type,nextState);
                        this[strProp] = nextState
                        return nextState
                    }
                }

           }

        return statefulPair
    }

    generatePairs(elements) {
        return elements.map(this.createElementPair.bind(this));
    }
    
    getTarget(pid) {
        return this.targets.find(target => target.pid == pid)
    }

    update(svg) {

        this.selected = [];
        this.elements = [svg, ...this.crawl(svg)];
        console.log(this.elements)
        this.targets = this.generatePairs(this.elements);
        this.currentIcon = svg;

        this.createListElement(this.targets.map(pair => pair.editorElement.element));
        
    }

    updateColor() {
        if (this.handleUpdate) this.handleUpdate(this.currentIcon)
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

        const setStrokeOrFill = targetTypePair => {
            const target = targetTypePair[0];
            const type = targetTypePair[1];
            target[type] = hex;
        }

        if (this.propsToUpdate.length > 0) this.propsToUpdate.forEach(setStrokeOrFill)
        this.updateColor();

        return hex;
    }

    updateAll(hex) {
        this.updateElements(hex);
        this.updatePreviewColor(hex);
        this.updateInputText(hex);
        this.updateColor();
    }

    updateInputText(hex) {
        this.previewInput.value = hex;
        this.hexInput.value = hex;

        if (!Color.isValidHex(hex)) 
            this.setInputInvalid()
        else 
            this.setInputValid()

        return hex;
    }

    setInputValid() {
        this.previewInput.classList.remove('invalid');
        this.hexInput.classList.remove('invalid');
    }

    setInputInvalid() {
        this.previewInput.classList.add('invalid')
        this.hexInput.classList.add('invalid');
    }

    setCanvasIfSingleColor() {

        const singleUpdate = this.propsToUpdate.length == 1;

        const setCanvasIfSingleColor = () => {
            let index = this.propsToUpdate[0];
            let target = index[0];
            let type = index[1];
            let strProp = `current${uppercase(type)}`;
            this.updateCanvas(target[strProp]);
        }

        if (singleUpdate) 
            setCanvasIfSingleColor();

    }

    updateCanvasWithSingleColor(target) {

        let color;
        if (!Color.isValidHex(target.currentStroke)) 
            color = '#000000'
        else 
            color = target.currentStroke;

        this.updateCanvas(color)

    }

    bindToCanvas(target,type) {
        this.propsToUpdate.push([target,type]);
    }

    unbindFromCanvas(target,type) {
        this.propsToUpdate = this.propsToUpdate.filter(index => {
            const targetFound = index[0].pid == target.pid
            const isBoundType = index[1] == type
            if (!targetFound) return true;
            if (isBoundType) return false;
        });
    }

    updateSelected(children) {
        this.selected = [];
        children.forEach(child => this.selected.push(child));
    }

    clearselection() {
        this.selected.forEach(target => this.removeSelection(target,'stroke'));
        this.selected.forEach(target => this.removeSelection(target,'fill'))
        this.selected = [];
    }

    select(target,type) {
        this.clearselection();
        this.addSelection(target,type);
    }

    addSelection(target,type) {
        this.selected.push(target);
        target.select(type);
        this.bindToCanvas(target,type);
    }

    removeSelection(target,type) {
        let targetIsSelected = target.unselect(type)
        if (targetIsSelected == false)
            this.selected = this.selected.filter(targetPair => targetPair.pid !== target.pid)
        this.unbindFromCanvas(target,type)
    }


    hydrate() {

        if (Color.isValidHex(this.previewInput.value))
            this.updatePreviewColor(this.previewInput.value);

        $('.open-palette').addEventListener('click',() => {
            $('.color-picker').classList.toggle('active')
        })

        $('.updater .btn-update').addEventListener('click',() => {

            const hex = this.previewInput.value;

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

            if (!Color.isValidHex(hex)) 
                return errorAnimation()
            
            this.canvas.update({hex:hex})
            this.updatePreviewColor(hex)
            this.setInputValid()
            this.updateElements(hex);

        })

        $('.pv-updater .btn-update').addEventListener('click',() => {
            const hex = this.previewInput.value;

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

        $('.updater .btn-reset').addEventListener('click',() => this.handleReset())

        $('.pv-updater .btn-reset').addEventListener('click',() => this.handleReset())

        this.previewInput.addEventListener('input',(e) => this.handleInput(e.target.value));

        this.hexInput.addEventListener('input',(e) => this.handleInput(e.target.value));

        $('.preview__modals--modal[data-tab="color"]').addEventListener('click', (e) => {

            // UNDO
            let clickedUndo = e.target.closest('.canvas-undo');
                if (clickedUndo) this.handleUndo()
            
            // REDO
            let clickedRedo = e.target.closest('.canvas-redo');
                if (clickedRedo) this.handleRedo()

            // EDITOR ELEMENT     
            let clickedPath = e.target.closest('.path-element');
                if (!clickedPath)
                    return;

            let id = clickedPath.getAttribute('pid');
            let pathExists = clickedPath && this.getTarget(id);
            
                if (!pathExists)
                    return;

            let clickedStrokeLabel = e.target.closest('.path-element .stroke-icon .picker-label');
                if (clickedStrokeLabel) this.handleStrokeLabel(id);

            let clickedStrokeIcon = e.target.closest('.path-element .stroke-icon .picker-element');
                if (clickedStrokeIcon) this.handleStrokeIcon(id);

            let clickedFillLabel = e.target.closest('.path-element .fill-icon .picker-label');
                if (clickedFillLabel) this.handleFillLabel(id);

            let clickedFillIcon = e.target.closest('.path-element .fill-icon .picker-element');
                if (clickedFillIcon) this.handleFillIcon(id);
                
            let clickedPathLabel = e.target.closest('.path-element .attr-label');
                if (clickedPathLabel) this.handlePathLabel(id);

        })

    }

    
    handleInput(hex) {

        this.updateInputText(hex)

        if (!Color.isValidHex(hex))
            return this.setInputInvalid()

        this.canvas.update({hex:hex});
        this.updatePreviewColor(hex);
        this.updateElements(hex);
        this.setInputValid();
        return hex;        
    }

    handleReset() {
        const setOriginStrokeOrFill = targetTypePair => {
            const target = targetTypePair[0];
            const type = targetTypePair[1];
            const strProp = `${'origin' + uppercase(type)}`;
            target[type] = target[strProp];
        }

        if (this.propsToUpdate.length > 0) this.propsToUpdate.forEach(setOriginStrokeOrFill)
        
        this.setCanvasIfSingleColor();
        this.updateColor();
    }

    
    handleUndo() {

        this.propsToUpdate.forEach(index => {
            let target = index[0]
            let type = index[1]
            target.undo(type);
        })

        this.setCanvasIfSingleColor()
        this.updateColor();
    }

    handleRedo() {

        this.propsToUpdate.forEach(index => {
            let target = index[0];
            let type = index[1];
            target.redo(type);
        })

        this.setCanvasIfSingleColor();
        this.updateColor();

    }

    handleStrokeLabel(pid) {

        const target = this.getTarget(pid);

        if (!target) return

        const strokeIsSelected = target.selected.find(val => val === 'stroke')
        if (strokeIsSelected) this.removeSelection(target,'stroke')
        else this.addSelection(target,'stroke')

        this.setCanvasIfSingleColor();
        
    }

    handleStrokeIcon(pid) {

        const target = this.getTarget(pid)

        if (!target) return

        this.select(target,'stroke')
        this.updateCanvasWithSingleColor(target);

    }

    handleFillLabel(pid) {

        const target = this.getTarget(pid)
        
        if (!target) return;

        const fillIsSelected = target.selected.find(val => val === 'fill');
        if (fillIsSelected) this.removeSelection(target,'fill');
        else  this.addSelection(target,'fill');

        this.setCanvasIfSingleColor()

    }

    handleFillIcon(pid) {

        const target = this.getTarget(pid)

        if (!target) return;

        this.select(target,'fill');
        this.updateCanvasWithSingleColor(target);

    }

    handlePathLabel(pid) {

    }

    get noAttrIcon() {
        return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
        
        <path fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" d="M53.919,10.08c12.108,12.106,12.108,31.733,0,43.84
            c-12.105,12.107-31.732,12.107-43.838,0c-12.108-12.106-12.108-31.733,0-43.84C22.187-2.027,41.813-2.027,53.919,10.08z"></path>
        
        <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="10.08" y1="10.08" x2="53.92" y2="53.92"></line>
        
        </svg>`
    }

    get noColorIcon() {
        return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve" height="40px" width="40px">
        
        <path d="M40,23.99H10c-0.552,0-1,0.447-1,1s0.448,1,1,1h30c0.552,0,1-0.447,1-1S40.552,23.99,40,23.99z"></path>
        
        </svg>`
    }
}