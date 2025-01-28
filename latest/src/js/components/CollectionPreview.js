import { EventEmitterClass } from "../utils/EventEmitter";
import { Canvas } from "./Canvas";

export class CollectionPreview extends EventEmitterClass {
  constructor() {
    super()

    this.on('close',() => this.revertIconToOriginalHTML())

    this.previewModeActive = false;
    this.bordersActive = false;
    this.icons = [];
    this.element = $('.settings-interface')
    this.vbxInput = $('.input-field.x .input',this.element)
    this.vbyInput = $('.input-field.y .input',this.element)
    this.vbhInput = $('.input-field.h .input',this.element)
    this.vbwInput = $('.input-field.w .input',this.element)
    this.svgHeightInput = $('.input.input-height',this.element)
    this.svgWidthInput = $('.input.input-width',this.element)
    this.viewBoxScale = []
    this.startingViewbox = [0,0,20,20]
    this.defaultHeight = '24'
    this.defaultWidth = '24'
    this.defaultSetting = {
      viewbox: [0,0,20,20],
      vbh:20, 
      vbw:20, 
      vby:0, 
      vbx:0, 
      width:'24', 
      height:'24'
    }
    this.originalColor = {}
    this.collectionPreset = this.defaultSetting
    this.iconPreset = this.defaultSetting
    this.original = this.defaultSetting
    this.preset = this.defaultSetting
    this.vbx = this.preset['vbx']
    this.vby = this.preset['vby']
    this.vbw = this.preset['vbw']
    this.vbh = this.preset['vbh']
    this.state = {}
    this.canvasPreviewColor = $('.preview-color',this.element);
    this.canvas = new Canvas({
      canvas: $('.canvas',this.element),
      pointer: $('.canvas-pointer',this.element),
      hueBar: this.hueSlider,
      state: this.state,
      actions: {
          handleColor: color => {
              const hex = color.hex;
              this.updateSelected(hex);
              this.state.currentValue = hex;
          },
      }
    })
    this.hueSlider = new Slider($('.collection-color-picker .hue-bar'), {
      onMouseMove: (state) => this.updateCurrentHue(state),
      onMouseDown: (state) => this.updateCurrentHue(state),
      onMouseUp: (state) => console.log(state),
    }, 'vertical' )

    const handleViewBoxInput = (index) => {
      return (e) => {
          let value = Number(e.target.value);
          if (!isNaN(value)) {
              let values = this.startingViewbox.slice();
              values[index] = value;
              this.setViewbox(values);
              this.resetViewBoxScale(values);
          }
          console.log(this.viewbox)
          this.setIconViewboxHTML(this.viewbox)
      }
  }
    const handleHeightWidthInput = (dimension) => {
      return (event) => {
          let value = Number(event.target.value);
          if (!isNaN(value) && value >= 0) this[dimension] = value
      }
  }
    const updateWithMouseTracker = (index,value) => {
      let values = this.startingViewbox.slice();
      let x = values[index];
      let xi = Number(x);
      let adjusted = Math.min(xi + value, 999);
      values[index] = adjusted;
      this.setViewbox(values);
    }
    const resetOnViewBoxInputOnDoubleClick = (index,prop) => {
      if (this.original[prop] !== undefined){
          let value = this.original[prop]
          if (!isNaN(value)) {
              let values = this.startingViewbox.slice();
              values[index] = value;
              this.setViewbox(values);
          }
      }
  }
    const resetMouseTrackingSlider = (index) => {
        let values = this.startingViewbox.slice();
        values[index] = 0;
        this.setViewbox(values);
        this.startingViewbox = values;
    }
    const viewBoxEditorConfig = (viewBoxIndex,prop) => {
      return {
          onMouseMove:({x}) => {
            updateWithMouseTracker(viewBoxIndex,x)
            this.setIconViewboxHTML(this.viewbox)
          },
          onMouseUp:() => this.resetViewBoxScale(this.viewbox),
          onDblClick:(event) => resetOnViewBoxInputOnDoubleClick(viewBoxIndex,prop),
          reset: () => resetMouseTrackingSlider(viewBoxIndex)
      }
    }

    this.vbxLabel = new MouseTrackingSlider( $('.input-field.x .label',this.element) , viewBoxEditorConfig(0,'vbx'))
    this.vbyLabel = new MouseTrackingSlider( $('.input-field.y .label',this.element) , viewBoxEditorConfig(1),'vby')
    this.vbwLabel = new MouseTrackingSlider( $('.input-field.w .label',this.element) , viewBoxEditorConfig(2),'vbh')
    this.vbhLabel = new MouseTrackingSlider( $('.input-field.h .label',this.element) , viewBoxEditorConfig(3),'vbw')
    this.vbxInput.addEventListener('input',handleViewBoxInput(0))
    this.vbyInput.addEventListener('input',handleViewBoxInput(1))
    this.vbwInput.addEventListener('input',handleViewBoxInput(2))
    this.vbhInput.addEventListener('input',handleViewBoxInput(3))
    this.svgHeightInput.addEventListener('input',handleHeightWidthInput('height'))
    this.svgWidthInput.addEventListener('input',handleHeightWidthInput('width'))
    $('.icon-borders.action',this.element).addEventListener('click',() => this.toggleBorder())
    $$('.selector').forEach(selector => {
      let target = selector.getAttribute('selector');
      let type = selector.getAttribute('sVal')
      selector.addEventListener('click',() => this.selection = [target,type])
    })
  }

  get currentPreset(){
    return {
        viewbox: this.viewbox,
        vbh: this.vbh,
        vbw: this.vbw,
        vby: this.vby,
        vbx: this.vbx,
        width: this.preset.width,
        height: this.preset.height,
    }
  }

  set height(number) {
    this.setHeight(number)
    this.preset.height = number
  }

  set width(number) {
    this.preset.height = number
    this.setWidth(number)
  }

  setHeight(number) {
    // set icons
      this.svgHeightInput.value = number
      this.setIconDimensions(this.preset)
  }

  setWidth(number) {
    // set icons
      this.svgWidthInput.value = number
      this.setIconDimensions(this.preset)
  }
  
  setPreviewColor(hex){
    this.canvasPreviewColor.style.setProperty('background',hex)
  }

  updateAllShapes(hex){
      this.icons.forEach(icon => {
        const element = $(`.db-res .svg-wrapper[data-id=${icon.id}] svg`)
        if (element){
          const children = icon.crawl(element)
          children.forEach(child => child.tagName !== 'svg' ? child.setAttribute('fill',hex) : '' )
        }
      })
  }
  
  updateSelected(hex){
    this.setPreviewColor(hex)
    if (this.selection && this.selection[0] === 'shapes')
      this.updateAllShapes(hex)
  }

  updateCurrentHue = (state) => {
    this.canvas.updateHue(state.deg)
    this.setPreviewColor(hex)
    this.updateSelected(this.canvas.color.hex)
 }

  resetViewBoxScale(currentViewBox){
    this.startingViewbox = currentViewBox.slice()
    this.viewBoxScale = currentViewBox.slice()
  }

  setViewboxBlank(){
    this.setViewbox(this.defaultSetting.viewbox)
    this.resetViewBoxScale(this.defaultSetting.viewbox)
  }

  setViewbox(array) {
    let vbx = Number(array[0]),
        vby = Number(array[1]),
        vbw = Number(array[2]),
        vbh = Number(array[3])
    this.vbx = vbx
    this.vbxInput.value = `${vbx}`

    this.vby = vby
    this.vbyInput.value = `${vby}`

    this.vbw = vbw
    this.vbwInput.value = `${vbw}`

    this.vbh = vbh
    this.vbhInput.value = `${vbh}`

    this.viewbox = [vbx,vby,vbw,vbh]
    this.notify('viewbox changed')
  }

  setIconViewboxHTML(viewbox){
    this.icons.forEach(icon => {
      let iconElement = $(`.db-res .svg-wrapper[data-id=${icon.id}] svg`)
      if (iconElement) iconElement.setAttribute('viewBox',viewbox.join(' '))
    })
  }

  setIconDimensions({height,width}){
    document.documentElement.style.setProperty('--variable-height', `${height}px`);
    document.documentElement.style.setProperty('--variable-width', `${width}px`);
    this.icons.forEach(icon => {
      let svgElement = $(`.db-res .svg-wrapper[id=${icon.id}] svg`)
      if (svgElement){
        svgElement.setAttribute('height',height)
        svgElement.setAttribute('width',width)
      } 
    })
  }

  showBorders(){
    $$('.db-res .svg-wrapper svg').forEach(icon => icon.style.border = '1px dotted red')
    this.bordersActive = true
    return this.bordersActive;
  }

  hideBorders(){
    $$('.db-res .svg-wrapper svg').forEach(icon => icon.style.border = '1px dotted transparent')
    this.bordersActive = false
    return this.bordersActive;
  }

  toggleBorder(){
     return this.bordersActive ? this.hideBorders() : this.showBorders()
  }

  revertIconToOriginalHTML(){
    const {height,width,viewbox} = this.original;
    this.setIconViewboxHTML(viewbox)
    this.setIconDimensions({ height:height, width:width })
  }

  findMatchingViewbox(icons){
    // return null if all viewboxes are not the same
    let viewbox
    let original
    for (let i = 0; i < icons.length; i++){
      let icon = icons[i]
      let og = icon.settings.original.viewbox
      let originalViewbox = og.join(' ')
      original = icon.settings.original;
      if (i === 0) {
        viewbox = originalViewbox
        continue
      }
      if (originalViewbox !== viewbox) {
        original = this.defaultSetting;
        return original
      } 
    }
    return original
  }

  findMatchingFill(icons){
    let fill = 'start';
    let svgFill = 'start';
    for (let i = 0; i < icons.length; i++){
      let icon = icons[i];
      let colorSet = icon.colors.original;
      if (fill === null && svgFill === null) return {
        shapeFill: null,
        svgFill: null,
      }
      const checkSvgFill = (colorSet) => {
        if (svgFill === null) return;
        for(const id in colorSet){
          let iconFill = colorSet[id][1]
          let tagName = colorSet[id][2]
          if (tagName !== 'svg') continue;
          if (svgFill === 'start') {
            svgFill = iconFill
            console.log('first value found', iconFill, svgFill)
            continue
          } else if (svgFill !== iconFill){
            console.log('count...',i)
            console.warn('this ones different', tagName ,icon, iconFill, svgFill)
            svgFill = null;
            return fill
          }
        }
      }
      const checkShapeFill = (colorSet) => {
        if (fill === null) return
        for(const id in colorSet){
          let iconFill = colorSet[id][1]
          let tagName = colorSet[id][2]
          if (tagName === 'svg') continue;
          if (fill === 'start') {
            fill = iconFill
            console.log('first value found', fill, iconFill)
            continue
          } else if (iconFill !== fill){
            console.log('count...',i)
            console.warn('this ones different', icon, fill, iconFill)
            fill = null;
            return fill
          }
        }
        return fill;
      }
      checkShapeFill(colorSet)
      checkSvgFill(colorSet)
    }
    return { shapeFill: fill , svgFill }
  }

  update(collection){
    this.icons = collection.icons;
    const matchingViewbox = this.findMatchingViewbox(this.icons)
    const {shapeFill,svgFill} = this.findMatchingFill(this.icons)

    if (shapeFill !== null) $('.default-fill .cEdit-icon').style.backgroundColor = shapeFill
    else $('.default-fill .cEdit-icon').style.backgroundColor = '#f9f9f9'
    
    if (svgFill !== null) $('.element-fill .cEdit-icon').style.backgroundColor = svgFill
    else $('.element-fill .cEdit-icon').style.backgroundColor = '#f9f9f9'

    this.original = matchingViewbox
    this.preset = matchingViewbox
    const { viewbox } = matchingViewbox
    this.setViewbox(viewbox)
    this.resetViewBoxScale(viewbox)
  }
}
