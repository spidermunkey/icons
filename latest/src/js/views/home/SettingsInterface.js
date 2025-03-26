import { EventEmitter } from "events";
import { Canvas } from "../../components/Canvas";

const StatefulColor = (originalColor = '#000') => ({
  original: originalColor,
  currentColor: originalColor, 
  history: new Cursor([originalColor]),
})

export class ColorSettingsInterface extends EventEmitter {
  constructor(){
    super()

    this.element = $('.local-settings');
    this.canvasContainer = $('.color-editor',this.element);
    this.colorInput = $('.cp-input input',this.element);
    this.previewColor = $('.cp-preview',this.element);
    
    this.undoElement = $('.c-action.action-undo',this.element);
    this.redoElement = $('.c-action.action-redo',this.element);
    this.resetElement = $('.c-action.action-reset',this.element);
    this.fillSelector = $('.default-fill',this.element);
    this.strokeSelector = $('.default-stroke',this.element);
    this.fillReflector = $('.box',this.fillSelector)
    this.strokeReflector = $('.box',this.strokeSelector)

    this.canvasElement = $('.canvas',this.element);
    this.canvasPointer = $('.canvas-pointer',this.element);
    this.huebarElement = $('.hue-bar',this.element);

    this.state = {
      selected:'fill',
      stroke: StatefulColor(),
      fill: StatefulColor(),
      get current_colorset(){
        return {
          csid:'default',
          colorset_type:'global',
          name: 'default',
          shapes: {
            fill:this.stroke,
            stroke:this.fill,
          }
        }
      }
    };

    this.huebar = new Slider(this.huebarElement,{
      onMouseMove: state => this.updateCurrentHue(state),
      onMouseDown: state => this.updateCurrentHue(state),
      onMouseUp: () => handleColorChange(this.canvasElement.color)
    },'vertical');

    // too much jank > 1k items
    this.canvas = new Canvas({
      canvas:this.canvasElement,
      pointer: this.canvasPointer,
      hueBar: this.huebar,
      actions: {
        mouseMove: color => this.updateSelected(color.hex),
        onClick: color => this.updateSelected(color.hex),
        mouseUp: color => this.handleColorChange(color.hex)
      }
    });

    this.undoElement.addEventListener('click',() => this.undoPreviousAction());
    this.redoElement.addEventListener('click',() => this.redoPreviousAction());
    this.resetElement.addEventListener('click',() => this.resetAction());
    
    [this.fillSelector,this.strokeSelector].forEach(selector => {
      $('.box',selector).addEventListener('click', () => this.toggleColorPicker())
      selector.addEventListener('click',() => this.handleModeChange(selector.getAttribute('mode')))
    });
    
    this.colorInput.addEventListener('input',(event) => this.handleInput(event));
    
    this.cosm = new COSM({
      selectors: ['.local-settings'],
      handler: this.hideColorPicker.bind(this)
    });
  }

  eachIcon(callback){
    this.collection.icons.forEach(icon => callback(icon))
  }
  getElement({id}){
    return $(`.preview-column .preview-icon[id=${id}] svg`)
  }
  updateAllShapes(hex,attr = 'fill'){
    this.eachIcon(icon => {
        icon.crawl(this.getElement(icon)).forEach(child => child.tagName !== 'svg' ? child.setAttribute(attr,hex) : '' )
  })
}
  handleModeChange(selectorType){
    if (selectorType === 'fill'){
      this.state.selected = 'fill'
      this.canvasContainer.classList.add('filler')
      this.canvasContainer.classList.remove('stroker')

    }
    else if (selectorType === 'stroke'){
      this.state.selected = 'stroke'
      this.canvasContainer.classList.add('stroker')
      this.canvasContainer.classList.remove('filler')
    }
    console.log('mode updated',selectorType)
  }
  hideColorPicker(){
    this.canvasContainer.classList.remove('active');
  }
  showColorPicker(){
    this.canvasContainer.classList.add('active');
  }
  toggleColorPicker(){
    this.canvasContainer.classList.toggle('active');
  }

  undoPreviousAction(){}
  redoPreviousAction(){}
  resetAction(){}

  updateCurrentHue(){}
  updateSelected(hex){
    if (this.state.selected === 'fill'){
      this.updateFillSelector(hex)
      this.updateAllShapes(hex,'fill')
      this.state.fill.currentColor = hex
      this.state.fill.history.addOneAndSkipTo(hex)
    }
    else if (this.state.selected === 'stroke'){
      this.updateStrokeSelector(hex)
      this.updateAllShapes(hex,'stroke')
      this.state.stroke.currentColor = hex
      this.state.stroke.history.addOneAndSkipTo(hex)
    }

  }
  handleColorChange(){
    console.log(this.state.current_colorset,this.collection.colors['default']);
    this.collection.colors['default'] = this.state.current_colorset
  }

  updateFillSelector(hex){
    if (hex === null || hex === 'none'){
      // handle null || none
      console.warn('must properly handle color if (null || none)')
      this.fillSelector.classList.add('invalid')
    } else {
      console.log('fill reflector',hex)
      this.fillSelector.classList.remove('invalid')
      this.fillReflector.style.setProperty('background',hex)
    }
  }
  updateStrokeSelector(hex){
    if (hex === null || hex === 'none'){
        // handle null || none
        console.warn('must properly handle color if (null || none)')
        this.strokeSelector.classList.add('invalid')
      } else {
        console.log('stroke reflector',hex)
        this.strokeSelector.classList.remove('invalid')
        this.strokeReflector.style.setProperty('background',hex)
    }
  }
  handleInput(){

  }

  handleState(state){
    const {fill,stroke} = state;
    const currentFill = fill.currentColor;
    const currentStroke = stroke.currentColor;
    this.updateFillSelector(currentFill);
    this.updateStrokeSelector(currentStroke);
  }

  update(collection){
    console.log(collection.colors.original);
    this.collection = collection;
    const {original} = collection.colors;
    const {fill,stroke} = original.shapes;
    this.state = {
      selected: this.state.selected,
      stroke: StatefulColor(stroke),
      fill: StatefulColor(fill),
      get current_colorset(){
        return {
          csid:'default',
          colorset_type:'global',
          name: 'default',
          elements: {
            // no change yet
            fill:original.elements.fill,
            stroke: original.elements.stroke,
          },
          shapes: {
            fill:this.fill.currentColor,
            stroke:this.stroke.currentColor,
          }
        }
      }
    };
    this.handleState(this.state)
    console.log(fill,stroke,collection.colors.original)
  }
}

export class ViewboxSettingsInterface extends EventEmitter {
  constructor(){
    super()
  }

}
