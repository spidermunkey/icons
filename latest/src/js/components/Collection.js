import { Icon } from './Icon.js';
import { Color } from './Color.js'
import { EventEmitter } from 'events';

export class Collection {
  constructor(data){
    const { 
      icons = [], 
      meta = { name:'empty', cid:'1' ,sub_collections:[] ,subtypes:[], }
    } = data

    const validIcons = []
    this.skipped = []
    this.sub_collections = []
    this.subtypes = []
    icons.forEach( icon => {
        const i = new Icon(icon);
        // quick patch
        // fixing issue with bad data from the server
        const sub_collections = this.sub_collections
        const subtypes = this.subtypes
        const sub_collection = icon.sub_collection
        const subtype = icons.subtype
        if (i.isValid) {
          validIcons.push(i)
          if (sub_collection && !sub_collections.includes(sub_collection)) 
            sub_collections.push(sub_collection)
          if (subtype && !subtypes.includes(subtype)) 
            subtypes.push(subtype)
        }
        else this.skipped.push(i)
    })
    this.filters = {
      sub_collections:[],
      subtypes:[],
    }
    this.meta = meta
    this.name = meta.name
    this.cid = meta.cid
    this.icons = validIcons
    this.sample = icons.slice(0,20)
    this.cursor = new Cursor(validIcons)
    this.ready = true

    this.collection_type = meta.collection_type
    this.size = meta.size
    this.created_at = meta.created_at
    this.synced = meta.synced
    this.presets = meta?.presets || {}
    this.presets.original = this.presets.original ? this.presets.original : this.findMatchingViewbox(validIcons)
    this.preset = meta?.preset || {}
    this.colors = meta?.colors || {}
    this.colors.original = this.colors.original ? this.colors.original : {
      csid:'original',
      colorset_type:'global',
      name: 'original',
      ...this.findMatchingColors(validIcons)
    }
    this.color = meta?.color || {}

  }
  
  find(id){
    return (this.icons.find(icon => icon.id == id))
  }
  update(props){
    console.log('updating...', this.meta.name)
    let index = this.icons.findIndex(icon => icon.id == props.id)
    if (index == -1) return null
    this.icons[index] = new Icon(props)
  }

  currentIcon(){
    return this.cursor.current;
  }

  findMatchingViewbox(icons){
    // return null if all viewboxes are not the same
    let viewbox
    let original
    for (let i = 0; i < icons.length; i++){
      let icon = icons[i]
      let og = icon.presets.original.viewbox
      let originalViewbox = og.join(' ')
      original = icon.presets.original;
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
      fill: parsed.elements.matchingFill ? parsed.elements.fill.values().toArray()[0] : null,
      stroke: parsed.elements.matchingStroke ? parsed.elements.stroke.values().toArray()[0] : null,
      matchingFill: parsed.elements.matchingFill,
      matchingStroke: parsed.elements.matchingStroke
    }
    let shapeResult = {
      fill: parsed.shapes.matchingFill ? parsed.shapes.fill.values().toArray()[0] : null,
      stroke: parsed.shapes.matchingStroke ? parsed.shapes.stroke.values().toArray()[0] : null,
      matchingFill: parsed.shapes.matchingFill,
      matchingStroke: parsed.shapes.matchingStroke
    }
    return { shapes: shapeResult, elements: elementResult}
  }

  render(){
    const menuDestination = $('.widget-main .collection-menu')
    const dashboardTab = $('.info-bar .current-tab')
    const infoWidget = $('.current-collection-widget .widget-content')
    const destination = $('#DASHBOARD .db-res')
    this.renderIcons(destination)
    dashboardTab.textContent = this.name
    menuDestination.innerHTML = this.menu()
    infoWidget.innerHTML = this.info()
  }
  renderIcons(destination){
    destination.innerHTML = `...loading ${this.name}`
    const frag = document.createDocumentFragment();
    const {sub_collections,subtypes} = this.filters
    let icons = this.icons;
    if (sub_collections.length > 0){
      icons = icons.filter(i => sub_collections.includes(i.sub_collection))
    }
    if (subtypes.length > 0) {
      icons = icons.filter(i => subtypes.includes(i.subtype))
    }
    icons.forEach(prop => {
       const { name , collection , markup , id , cid , benched } = prop
       const el = document.createElement('div');
            el.dataset.collection = collection;
            el.dataset.name = name;
            el.dataset.cid = cid;
            el.dataset.id = id;
            el.innerHTML = markup;
            el.classList.add('svg-wrapper');
            if (benched) {
              el.classList.add('benched')
            }
       frag.append(el);
    })
    destination.innerHTML = ''
    destination.append(frag)
  }

  info(){
      const getAgo = msDate => ago(msDate).string;
      let {
        collection_type,
        size,
        name,
        uploaded_at = undefined,
        created_at = null,
        updated_on = null
      } = this.meta;
      
      if (collection_type == 'auto') collection_type = 'default'
      let lastUpdate = 
          updated_on ? getAgo(new Date(updated_on))
          : uploaded_at ? getAgo(new Date(uploaded_at))
          : created_at ? getAgo(new Date(created_at))
          : 'never'
      return`
            <div class="content-title">${name} <span class="footnote">Last Updated ${lastUpdate ? lastUpdate : 'unknown'}</span></div>
            <div class="widget-data">
                <div class="data-field collection-size">Saved Icons: <span class="data-set"> ${size}</span></div>
                <div class="data-field sub-cols"><span class="data-set">Sub-collections: ${this.sub_collections.length}</span></div>
                <div class="data-field sub-types"><span class="data-set">Sub-types: ${this.subtypes.length}</span> </span></div>
                <div class="data-field col-type"><span></span><span class="data-set">Collection Type: ${collection_type}</span></div>
            </div>
            <div class="btn-open">show more</div>
    `
  }
  renderInfo(){
    const destination = $('.current-collection-widget .widget-content')
    destination.innerHTML = this.info();
  }
  menu(){
    return `
        <div class="menu-controls">
            <div class="close-menu">close</div>
        </div>
        <div class="menu-header">Sub-Filters</div>
        <div class="sc-filters c-menu">
            <div class="list-label" tab="subcollections"> Sub Collections 
            <span class="c-num sc-num">${this.sub_collections.length}</span>
        </div>
        <div class="sc-list">${!this.sub_collections || this.sub_collections.length == 0 ? 'none' : this.sub_collections.reduce((a,b)=>{
            return a + `<div class="list-item sc-item" ftype="sc" filter="${b}">${b}</div>`;
            },'')}
        </div>
        </div>
        <div class="st-filters c-menu">
            <div class="list-label" tab="subtypes">Sub Types<span class="c-num st-num">${this.subtypes.length}</span></div>
            <div class="sc-list">${!this.subtypes || this.subtypes.length == 0 ? 'none' : this.subtypes.reduce((a,b)=>{
                return a + `<div class="list-item st-item" ftype="st" filter="${b}">${b}</div>`
                },'')}
            </div>
        </div>
    `
  }
}
export class LocalCollection extends Collection {
  constructor(data) {
    super({ meta:data, icons:data?.icons || []})
  }
}
export class Pocket extends Collection {
  constructor(data){
    super(data)
  }

  updateSize(n){
    this.meta.size = n;
    $('.bench-count').textContent = this.meta.size;
  }

  iconExists({id}){
    return !!(this.find(id))
  }

  toggle(icon){
    if (!this.iconExists(icon)){
      this.add(icon)
    } else {
      this.remove(icon)
    }
  }

  async add(icon){
    this.icons.push(icon);
    this.updateSize(++this.meta.size)
    $(`.svg-wrapper[data-id=${icon.id}]`).classList.add('benched')
    icon.benched = true;
    const response = await app.store.updatePocket(icon);
    console.log(response)
  }

  async remove(icon){
    this.icons = this.icons.filter(item => item.id !== icon.id)
    this.updateSize(--this.meta.size)
    $(`.svg-wrapper[data-id=${icon.id}]`).classList.remove('benched')
    icon.benched = false;
    const response = await app.store.updatePocket(icon);
    console.log(response)
  }

}
export class CollectionWidget extends Collection {
  constructor(data){
    super(data)
      this.limit = 39
      this.pages = data?.pages || Math.floor(this.size/this.limit)
      this.currentPage = data?.currentPage || 1
      this.pageNumbers = []
      for (let i = 1; i <= this.pages; i++){
        this.pageNumbers.push(i)
      }
  }

  async getPage(n = 1){
    const { icons, currentPage, pages } = await app.store.getCollectionSample(this.name,n,this.limit)
    this.icons = icons;
    this.currentPage = Number(currentPage);
    this.pages = Number(pages);
    return {
      icons:this.icons,
      currentPage: this.currentPage,
      pages: this.pages,
    }
  }
  async getElement(){
    const name = this.name;
    const cid = this.cid;

    const db_panel = document.createElement('div');
    const db_container = document.createElement('div');
    const panel_header = document.createElement('div');
    const panel_preview = document.createElement('div');
    const panel_footer = document.createElement('div');
    const panel_menu = document.createElement('div');

    db_panel.classList.add('collection-summary');
    db_container.classList.add('db-container');
    panel_header.classList.add('panel-header');
    panel_preview.classList.add('panel-preview');
    panel_footer.classList.add('panel-footer');
    panel_menu.classList.add('panel-menu');
    db_panel.setAttribute('collection',name);
    db_panel.setAttribute('cid',cid)
    db_panel.appendChild(panel_header);
    db_panel.appendChild(db_container);
    db_container.appendChild(panel_preview);
    db_panel.appendChild(panel_footer);

    panel_header.innerHTML = `
    <div class="panel-name" cid=${cid} collection=${name}>${name}</div>
    <div class="panel-options">
      <div class="dropdown-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m85vg8jg-01S9PHENZ0PX">
          <path d="M6 10.5C5.17157 10.5 4.5 11.1716 4.5 12C4.5 12.8284 5.17157 13.5 6 13.5C6.82843 13.5 7.5 12.8284 7.5 12C7.5 11.1716 6.82843 10.5 6 10.5Z" fill="black" pid="m85vg8jg-00JREAP4XC8Z"></path>
          <path d="M10.5 12C10.5 11.1716 11.1716 10.5 12 10.5C12.8284 10.5 13.5 11.1716 13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12Z" fill="black" pid="m85vg8jg-01U1OM0YNVHN"></path>
          <path d="M16.5 12C16.5 11.1716 17.1716 10.5 18 10.5C18.8284 10.5 19.5 11.1716 19.5 12C19.5 12.8284 18.8284 13.5 18 13.5C17.1716 13.5 16.5 12.8284 16.5 12Z" fill="black" pid="m85vg8jg-00MIE1K9JHJQ"></path>
        </svg>
      </div>
      <div class="dropdown-menu">
        <span class="dropdown-option" opt="delete-collection" cid="${cid}">delete collection</span>
        <span class="dropdown-option" opt="open-settings" cid="${cid}">open settings</span>
      </div>
    </div>
    `
    panel_footer.innerHTML = `
    <div class="paginator">
        <div class="page-prev page-tggler">
          <div class="icon">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m7no30hj-00143G09SR07"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0303 7.46967C14.3232 7.76256 14.3232 8.23744 14.0303 8.53033L10.5607 12L14.0303 15.4697C14.3232 15.7626 14.3232 16.2374 14.0303 16.5303C13.7374 16.8232 13.2626 16.8232 12.9697 16.5303L8.96967 12.5303C8.67678 12.2374 8.67678 11.7626 8.96967 11.4697L12.9697 7.46967C13.2626 7.17678 13.7374 7.17678 14.0303 7.46967Z" fill="black" pid="m7no30hj-00B9J71AF3II"></path></svg>
          </div>
        </div>
        <div class="page-container">
          ${ this.pageNumbers.reduce((a,b) => {
            return a + `
                <div class="page" 
                    page= ${b} 
                    current= ${ b === this.currentPage ? 'true' : ''} >
                <div class="page-icon">
                    ${b}
                </div>
                </div>`
            },'')}
        </div>

          <div class="page-next page-tggler">
            <div class="icon">
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m7no2mec-01NZUOGOVPFT"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.96967 7.46967C10.2626 7.17678 10.7374 7.17678 11.0303 7.46967L15.0303 11.4697C15.3232 11.7626 15.3232 12.2374 15.0303 12.5303L11.0303 16.5303C10.7374 16.8232 10.2626 16.8232 9.96967 16.5303C9.67678 16.2374 9.67678 15.7626 9.96967 15.4697L13.4393 12L9.96967 8.53033C9.67678 8.23744 9.67678 7.76256 9.96967 7.46967Z" fill="black" pid="m7no2mec-00QN77HWIAUI"></path></svg>
            </div>
          </div>
    </div>
    `
    panel_header.addEventListener('click', this.handleDropdown.bind(this))
    panel_footer.addEventListener('click', this.handlePagination.bind(this))
    this.element = db_panel;
    this.preview_panel = panel_preview;
    this.renderIcons(this.icons)
    return db_panel;
  }
  async handlePagination(event){
    const pageRequestButton = event.target.closest('.page')
    const pageNext = event.target.closest('.page-next')
    const pageLeft = event.target.closest('.page-prev')
    let pageNumberRequested;

    if (pageRequestButton){
      pageNumberRequested = pageRequestButton.getAttribute('page')
    } else if (pageNext){
      let next = Number(this.currentPage) + 1;
      pageNumberRequested = next > this.pages ? 1 : next
    } else if (pageLeft){
      let prev = this.currentPage - 1;
      pageNumberRequested = prev < 1 ? this.pages : prev
    }
    const {icons,page} = await handlePageRequest.call(this,pageNumberRequested)
    this.currentPage = page
    this.icons = icons
    this.renderIcons(icons)
    handleShiftDirection.call(this,page)

    async function handlePageRequest(page){
      const { icons } = (await this.getPage(page))
      const currentPageElement = $('[current="true"]', this.element )
      const correspondingPageElement = $(`.page[page="${page}"]`,this.element)
      currentPageElement.setAttribute('current','')
      correspondingPageElement.setAttribute('current','true')
      return {
        icons,
        page:Number(page)
      }
    }

    function handleShiftDirection(page){

      const maxVisiblePageNum = 9;
      const shiftLength = 36;

      const element = $('.page-container',this.element)
      const pages = this.pages;
      const boundaryNum = (page - 1) + maxVisiblePageNum;
      const elementWidth = element.scrollWidth;
      const windowEnd = $('.paginator',this.element).offsetWidth
      const rightShift = maxVisiblePageNum - boundaryNum
      const padding = 44;
      const maxShiftLen = windowEnd - elementWidth - padding;

      if((boundaryNum) >= maxVisiblePageNum && boundaryNum <= pages){
        element.style.transform = `translateX(${shiftLength * (rightShift)}px)`
      } else if (boundaryNum > pages){
        element.style.transform = `translateX(${maxShiftLen}px)`
      } else {
        element.style.transform = `translateX(0px)`
      }
    }
  }
  async handleDropdown(event){
    if (event.target.closest('.dropdown-icon')){
      $('.dropdown-menu',this.element).classList.toggle('active')
    }
    else if (event.target.closest('[opt="delete-collection"]')){
      console.log('deleting collection')
      const result = await app.store.dropCollection(this.cid)
      if (result){
        console.log('API RESPONSE: DELETE', result)
        this.element.remove();
      }
    }
  }
  createIcon(props){
    const {name,category,markup,id,cid,isBenched} = props
    const el = document.createElement('div');
        el.dataset.category = category;
        el.dataset.name = name;
        el.dataset.cid = cid;
        el.dataset.id = id;
        el.classList.add('svg-wrapper');
        el.setAttribute('icon-type','preview')
        el.innerHTML = markup;
    return el
  }
  renderIcons(icons){
    this.preview_panel.innerHTML =''
    icons.forEach(icon => this.preview_panel.appendChild(this.createIcon(icon)))
  }

  static getSkeleton(){
    const db_panel = document.createElement('div');
    const db_container = document.createElement('div');
    const panel_header = document.createElement('div');
    const panel_preview = document.createElement('div');
    const panel_footer = document.createElement('div');
    const panel_menu = document.createElement('div');
    db_panel.classList.add('collection-summary','collection-summary-skeleton');
    db_container.classList.add('db-container');
    panel_header.classList.add('panel-header');
    panel_preview.classList.add('panel-preview');
    panel_footer.classList.add('panel-footer');
    panel_menu.classList.add('panel-menu');
    db_panel.setAttribute('collection',name);
    db_panel.appendChild(panel_header);
    db_panel.appendChild(db_container);
    db_container.appendChild(panel_preview);
    db_panel.appendChild(panel_footer);
    return db_panel;
  }

}
export class CollectionStore extends EventEmitter {
  constructor(data){
    updateNeeded = true;
  }
  getData(){

  }
}
