import { Color } from "./Color";
import { EventEmitterClass } from "../utils/EventEmitter";
import { Canvas } from "./Canvas";
import { COSM } from "../utils/Cosm";

const ColorState = (originalColor = '#000') => ({
  original: originalColor,
  currentColor: originalColor, 
  history: new Cursor([originalColor]),
})
const ShapeModeHtml = () => {
  return `
  <div class="default-colors">
    <div class="color-group-label">All Shapes</div>
    <div class="color-group">
      <div class="default-fill editor-value-container" container="shapes" sVal="fill">
        <div class="cEdit-label selector" selector="shapes" sVal="fill">Fill</div>
        <div class="cEdit-icon reflector" selector="shapes" sVal="fill"></div>
      </div>
      <div class="default-stroke editor-value-container" container="shapes" sVal="stroke">
        <div class="cEdit-label selector" selector="shapes" sVal="stroke">Stroke</div>
        <div class="cEdit-icon reflector" selector="shapes" sVal="stroke"></div>
      </div>
    </div>
  </div>

  <div class="element-colors">
    <div class="color-group-label">Svg Element</div>
    <div class="color-group">
      <div class="element-fill editor-value-container" container="element" sVal="fill">
        <div class="cEdit-label selector" selector="element" sVal="fill">Fill</div>
        <div div class="cEdit-icon reflector" selector="element" sVal="fill"></div>
      </div>
      <div class="element-stroke editor-value-container" container="element" sVal="stroke">
        <div class="cEdit-label selector" selector="element" sVal="stroke">Stroke</div>
        <div class="cEdit-icon reflector" selector="element" sVal="stroke"></div>
      </div>
      </div>
    </div>

  <div class="colors-found">
    <div class="color-group-label">Colors Found</div>
    <div class="current-palette color-group">
      <div class="cEdit-icon"></div>
      <div class="cEdit-icon"></div>
      <div class="cEdit-icon"></div>
      <div class="cEdit-icon"></div>
    </div>
  </div>

  `
}
const InverterState = (colorsFound = ['#000']) => colorsFound.map(ColorState)
export class CollectionPreview extends EventEmitterClass {
  constructor() {
    super()
    this.on('close',() => this.revertIconToOriginalHTML())
    this.previewModeActive = false
    this.bordersActive = false
    this.icons = []
    this.element = $('.settings-interface')
    this.colorInput = $('.collection-color-picker .input input')
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

    this.mode = {
      currentMode: 'shapes',
      currentType: 'fill',
      shapes: {
        stroke: ColorState(),
        fill: ColorState(),
      },
      element: {
        stroke: ColorState(),
        fill: ColorState(),
      },
      inverter: {
        stroke: InverterState(),
        fill: InverterState(),
      },
      selector: {
        stroke: ColorState(),
        fill: ColorState(),
        icons:[],
      },
    }

    this.collectionPreset = this.defaultSetting
    this.iconPreset = this.defaultSetting
    this.original = this.defaultSetting
    this.preset = this.defaultSetting
    this.vbx = this.preset['vbx']
    this.vby = this.preset['vby']
    this.vbw = this.preset['vbw']
    this.vbh = this.preset['vbh']

    this.canvasPreviewColor = $('.preview-color',this.element)

    this.hueSlider = new Slider($('.collection-color-picker .hue-bar'), {
      onMouseMove: (state) => this.updateCurrentHue(state),
      onMouseDown: (state) => this.updateCurrentHue(state),
      onMouseUp: () => this.handleColorChange(this.canvas.color.hex)
    }, 'vertical' )

    this.canvas = new Canvas({
      canvas: $('.canvas',this.element),
      pointer: $('.canvas-pointer',this.element),
      hueBar: this.hueSlider,
      state: this.state,
      actions: {
          mouseMove: color => this.updateSelected(color.hex),
          onClick: color => this.updateSelected(color.hex),
          mouseUp: color => this.handleColorChange(color.hex)
      }
    })


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
    $('.editor-action[action="undo"]').addEventListener('click',() => this.undoPreviousAction())
    $('.editor-action[action="redo"]').addEventListener('click',() => this.redoPreviousAction())
    $('.editor-action[action="reset"]').addEventListener('click',() => this.resetAction())
    
    // fill -- stroke selectors
    const initialMode = $(`[container=${this.mode.currentMode}][sVal=${this.mode.currentType}]`)
    initialMode.classList.add('active')
    $$('.selector').forEach(selector => selector.addEventListener('click',() => this.handleModeChange(selector)))
    $$('.bg-toggle').forEach(toggler => toggler.addEventListener('click',() => this.handleBackgroundChange(toggler)))
    $('.save-colorset').addEventListener('click',() => this.toggleSaveMenu())
    this.colorInput.addEventListener('input',(event) => this.handleInput(event))
    $('.collection-color-picker .canvas-copy').addEventListener('click',() => this.handleCopy())
    this.cosm = new COSM({
      selectors: ['.settings-interface'],
      exceptions: ['.settings-tab[tab="viewbox"]'],
      handler: this.hideSaveMenu.bind(this)
    })
  }

  get iconElements() {
    return $$('.db-res .svg-wrapper')
  }
  get currentHex() {
    return this.canvas.color.hex;
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
  get currentColorSet() {
    return {
      colorset_type: 'global',
      shapes: {
        fill: this.mode.shapes.fill.currentColor,
        stroke: this.mode.shapes.stroke.currentColor,
      },
      element: {
        fill: this.mode.element.fill.currentColor,
        stroke: this.mode.element.stroke.currentColor,
      }
    }
  }
  get currentMode(){
    let mode = this.mode.currentMode
    let targetType = this.mode.currentType
    return this.mode[mode][targetType]
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
  getElement({id}){
    return $(`.db-res .svg-wrapper[data-id=${id}] svg`)
  }
  eachElement(callback) {
    this.iconElements.forEach(element => callback(element))
  }
  getIcon(id){
    return this.icons.filter(id => icon.id !== id)
  }
  eachIcon(callback){
    this.icons.forEach(icon => callback(icon))
  }
  pickupColor(hex){
    this.currentDrop = hex;
  }
  setPreviewColor(hex){
    this.canvasPreviewColor.style.setProperty('background',hex)
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
  showSaveMenu(){
    $('.color-save-menu').classList.add('active')
    this.saveMenuActive = true
  }
  hideSaveMenu(){
    if (this.saveMenuActive){
      $('.color-save-menu').classList.remove('active')
      this.saveMenuActive = false;
    }
  }
  toggleSaveMenu(){
    if (this.saveMenuActive) this.hideSaveMenu()
    else this.showSaveMenu()
  }
  applyPreviewBackground(style){
    this.iconElements.forEach(element => {
      element.classList.remove('bg-neutral','bg-dark','bg-default')
      element.classList.add(style)
    })
  }
  handleInput(event){
    let hex = event.target.value
    if (Color.isValidHex(hex)){
      this.canvas.update({hex:hex})
      this.updateSelected(hex)
      this.colorInput.classList.remove('invalid')
      this.updateColorState(hex)
    } else if (hex === 'none'){
      console.warn('setting value to none')
      this.canvas.update({hex:'#fff'})
      this.updateSelected(hex)
      this.updateColorState('none')
      this.colorInput.classList.remove('invalid')
    } else {
      console.warn('invalid color')
      this.colorInput.classList.add('invalid')
    }
  }
  handleColorChange(hex){
    this.updateColorState(hex)
    this.colorInput.value = hex
    this.colorInput.classList.remove('invalid')
    const shapeFillReflector = $('.shape-reflector[reflector="fill"]'),
          shapeStrokeReflector = $('.shape-reflector[reflector="stroke"]'),
          shapeFill = this.mode.shapes.fill.currentColor,
          shapeStroke = this.mode.shapes.stroke.currentColor
          shapeFillReflector.style.backgroundColor = shapeFill
          shapeStrokeReflector.style.backgroundColor = shapeStroke
  }
  handleBackgroundChange(elementClicked){
    const cls = elementClicked.getAttribute('cls')
    if (cls) this.applyPreviewBackground(cls)
  }
  handleModeChange(selectorClicked){
    const target = selectorClicked.getAttribute('selector')
    const type = selectorClicked.getAttribute('sVal')
    const highlightSelector = () => {
      $$('.editor-value-container').forEach(selector => selector.classList.remove('active'))
      $(`[container=${target}][sVal=${type}]`).classList.add('active')
    }
    this.mode.currentMode = target
    this.mode.currentType = type
    let mode = this.currentMode
    let currentColor = mode.currentColor
    if (isValidHex(currentColor)){
      this.canvas.update({hex:currentColor})
    } else {
      console.warn('current color invalid using #000',currentColor)
      this.canvas.update({hex:'#000'})
    }
    highlightSelector()
  }
  handleCopy(){
    let input = this.colorInput
    toClipboard(input.value)
  }
  updateColorPicker(parsedColorSet){
    const {elements,shapes} = parsedColorSet;
    const shapeFill = shapes.matchingFill && shapes.fill[0] !== 'none' ? shapes.fill[0] : null;
    const shapeStroke = shapes.matchingStroke && shapes.stroke[0] !== 'none' ? shapes.stroke[0] : null;
    const svgFill = elements.matchingFill && elements.fill[0] !== 'none' ? elements.fill[0] : null;
    const svgStroke = elements.matchingStroke ? elements.stroke[0] : null;
    if (shapeFill != null) $('.default-fill .cEdit-icon').style.backgroundColor = shapeFill
    else $('.default-fill .cEdit-icon').style.backgroundColor = '#f9f9f9'
    if (shapeStroke != null) $('.default-stroke .cEdit-icon').style.backgroundColor = shapeFill
    else $('.default-stroke .cEdit-icon').style.backgroundColor = '#f9f9f9'
  }
  updateAllShapes(hex,attr = 'fill'){
      this.eachIcon(icon =>
          icon.crawl(this.getElement(icon)).forEach(child => child.tagName !== 'svg' ? child.setAttribute(attr,hex) : '' )
      )
  }
  updateAllSvgElements(hex,attr='fill'){
    this.eachElement(element => element.setAttribute(attr,hex))
  }
  updateColorState(hex){
    let state = this.currentMode
    state.history.addOneAndSkipTo(hex)
    state.currentColor = hex
  }
  refreshColorState(parsedColorSet){
    const {elements,shapes} = parsedColorSet;
    const shapeFill = shapes.matchingFill ? shapes.fill[0] : null;
    const shapeStroke = shapes.matchingStroke ? shapes.stroke[0] : null;
    const svgFill = elements.matchingFill ? elements.fill[0] : null;
    const svgStroke = elements.matchingStroke ? elements.stroke[0] : null;
      this.mode['shapes']['fill'] = ColorState(shapeFill ? shapeFill : 'none')
      this.mode['shapes']['stroke'] = ColorState(shapeStroke ? shapeStroke : 'none')
      this.mode['element']['fill'] = ColorState(svgFill ? svgFill : 'none')
      this.mode['element']['stroke'] = ColorState(svgStroke ? svgStroke : 'none')
  }
  updateSelected(hex){
    this.setPreviewColor(hex)
    let mode = this.mode.currentMode
    let targetType = this.mode.currentType
    let noneHex = '#f9f9f9';
    let shapeReflector = $(`.reflector[selector="shapes"][sVal=${targetType}]`)
    let elementReflector = $(`.reflector[selector="element"][sVal=${targetType}]`)
    if (mode === 'shapes'){
      this.updateAllShapes(hex,targetType)
      if (hex === 'none') shapeReflector.style.backgroundColor = noneHex
      else shapeReflector.style.backgroundColor = hex
    }
    if (mode === 'element'){
      this.updateAllSvgElements(hex,targetType)
      if (hex === 'none') elementReflector.style.backgroundColor = noneHex
      else elementReflector.style.backgroundColor = hex
    }
  }
  updateCurrentHue = (state) => {
    this.canvas.updateHue(state.deg)
    this.setPreviewColor(this.currentHex)
    this.updateSelected(this.currentHex)
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
  revertIconToOriginalHTML(){
    const {height,width,viewbox} = this.original;
    this.setIconViewboxHTML(viewbox)
    this.setIconDimensions({ height:height, width:width })
    this.iconElements.forEach(element => {
      element.classList.remove('bg-neutral','bg-dark','bg-default')
    })
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
  findMatchingColors(icons){
    let parsed = {
      'elements':{
        fill: new Set(),
        stroke: new Set(),
        get matchingFill() {
          return this.fill.size === 1
        },
        get matchingStroke() {
          return this.stroke.size === 1
        }
      },
      'shapes':{
        fill: new Set(),
        stroke: new Set(),
        get matchingFill() {
          return this.fill.size === 1
        },
        get matchingStroke() {
          return this.stroke.size === 1
        }
      },
    }
    for (let i = 0; i < icons.length; i++){
      let icon = icons[i];
      let colorSet = icon.colors.original;
      const normalize = (hex)=> {
        if (hex === 'none') {
          return hex
        }
        else if (!hex.startsWith('#')) {
          let convertedName = Color.isValidNamedColor(hex)
          let validName = convertedName && Color.isValidHex(convertedName)
          return validName ? convertedName : false
        }
        else {
          return Color.toSixDigitHex(hex)
        }
      }
      const parseFill = (colorSet) => {
        for(const id in colorSet){
          let iconFill = normalize(colorSet[id][1])
          let tagName = colorSet[id][2]
          if (iconFill != undefined || iconFill != false) {
            if (tagName === 'svg') parsed.elements.fill.add(iconFill)
            else parsed.shapes.fill.add(iconFill)
          } else console.warn('something wrong with this hex', this.colorSet[id][1])
        }
      }
      const parseStroke = (colorSet) => {
        for(const id in colorSet){
          if (colorSet[id][0] == null) continue
          let iconStroke = normalize(colorSet[id][0])
          let tagName = colorSet[id][2]
          if (iconStroke != undefined || iconStroke != false) {
            if (tagName === 'svg') parsed.elements.stroke.add(iconStroke)
            else parsed.shapes.stroke.add(iconStroke)
          } else console.warn('something wrong with this hex', this.colorSet[id][0])
        }
      }
      parseFill(colorSet)
      parseStroke(colorSet)
    }
    let elementResult = {
      fill: parsed.elements.fill.values().toArray(),
      stroke: parsed.elements.stroke.values().toArray(),
      matchingFill: parsed.elements.matchingFill,
      matchingStroke: parsed.elements.matchingStroke
    }
    let shapeResult = {
      fill: parsed.shapes.fill.values().toArray(),
      stroke: parsed.shapes.stroke.values().toArray(),
      matchingFill: parsed.shapes.matchingFill,
      matchingStroke: parsed.shapes.matchingStroke
    }
    return { shapes: shapeResult, elements: elementResult}
  }
  undoPreviousAction(){
    console.log('REDOING')
    const state = this.currentMode;
    let previousColor = state.history.skipToPrev()
    state.currentColor = previousColor
    this.updateSelected(previousColor)
    if (isValidHex(previousColor)) {
      this.canvas.update({hex:previousColor})
    } else{ // handle none
      console.warn('setting preview color to none')
      this.canvas.update({hex:'#fff'})
    }
  }
  redoPreviousAction(){
    const state = this.currentMode;
    let nextColor = state.history.skipToNext();
    state.currentColor = nextColor
    this.updateSelected(nextColor)
    if (isValidHex(nextColor)) {
      this.canvas.update({hex:nextColor})
    } else { // handle none
      this.canvas.update({hex:'#fff'})
    }
  }
  resetAction(){
    const state = this.currentMode;
    const original = state.original;
    let mode = this.mode.currentMode
    let targetType = this.mode.currentType
    this.mode[mode][targetType] = ColorState(original)
    this.updateSelected(original)
    if (isValidHex(original)){
      this.canvas.update({hex:original})
    } else if (original === 'none'){
      console.warn('setting preview color to none')
      this.canvas.update({hex:'#fff'})
    }
  }
  update(collection){
    this.icons = collection.icons;
    this.collection = collection;
    const matchingViewbox = this.findMatchingViewbox(this.icons)
    const matchingColors = this.findMatchingColors(this.icons)
    this.updateColorPicker(matchingColors)
    this.refreshColorState(matchingColors)
    this.original = matchingViewbox
    this.preset = matchingViewbox
    this.colors = collection.colors
    const { viewbox } = matchingViewbox
    this.setViewbox(viewbox)
    this.resetViewBoxScale(viewbox)
  }
}
