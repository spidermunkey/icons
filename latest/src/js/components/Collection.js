import { Icon } from './Icon.js';
import { Cursor } from '../utils/Cursor';
import { ago } from '../utils/DateTime.js';
import { API } from '../api.js';
export class Collection {
  constructor(data){
    const { 
      icons = [], 
      meta = { name:'empty', cid:'1' ,sub_collections:[] ,subtypes:[], },
      state = {}
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
    this.cid = meta.cid;
    this.icons = validIcons
    this.sample = icons.slice(0,20)
    this.cursor = new Cursor(validIcons)
    this.ready = true

    this.collection_type = meta.collection_type
    this.size = meta.size
    this.created_at = meta.created_at
    this.synced = meta.synced
    this.preset = meta?.preset || {}
    this.presets = meta?.preset || {}
    this.color = meta?.preset || {}
    this.colors = meta?.colors || {}
    this.state = {}
    console.log(meta.synced,data.synced)
    // console.dir(`CREATING COLLECTION FROM DATA: `, data)
  }
  debugFaultyIcons(){
    console.log(this.skipped)
  }
  debugCollection(id){
    if (this.id === id) console.log(this)
  }
  debugIcon(id){
    console.log(this.find(id))
  }
  get recentSettings() {
    return this.meta.recent_settings
  }
  find(id){
      return (this.icons.find(icon => icon.id == id))
  }
  Icon(id) {
      return this.find(id)
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
  async addIcon(){

  }
  render(){
    const menuDestination = $('.widget-main .collection-menu')
    const dashboardTab = $('.info-bar .current-tab')
    const infoWidget = $('.current-collection-widget .widget-content')
    this.renderIcons()
    dashboardTab.textContent = this.name
    menuDestination.innerHTML = this.menuHTML()
    infoWidget.innerHTML = this.infoHTML()
  }
  renderIcons(){
    const destination = $('#DASHBOARD .db-res')
    destination.innerHTML = `...loading ${this.name}`
    const frag = document.createDocumentFragment();

    // handling sub-filters
    const {sub_collections,subtypes} = this.filters
    const shouldFilterCollection = sub_collections.length > 0;
    const shouldFilterSubtype = subtypes.length > 0;
    let icons = this.icons;
    if (shouldFilterCollection){
      console.log(`filtering for sub_collections ${sub_collections}...`)
      console.log(sub_collections)
      icons = icons.filter(i => sub_collections.includes(i.sub_collection))
      console.log(`found ${icons.length} icons matching sub_collection filters ${sub_collections}`)
    }
    if (shouldFilterSubtype) {
      console.log(`filtering for subtypes ${subtypes}....`)
      icons = icons.filter(i => subtypes.includes(i.subtype))
      console.log(`found ${icons.length} icons matching subtype filters ${subtypes}`)
    }
    icons.forEach(prop => {
       const { name , collection , markup , id , cid , isBenched, subtype, sub_collection } = prop
       const el = document.createElement('div');
            el.dataset.collection = collection;
            el.dataset.name = name;
            el.dataset.cid = cid;
            el.dataset.id = id;
            el.innerHTML = markup;
            el.classList.add('svg-wrapper');
            if (isBenched) {
              el.classList.add('benched')
            }
       frag.append(el);
    })
    destination.innerHTML = ''
    destination.append(frag)

  }
  renderWidget(){

  }
  renderPreview(){

  }
  infoHTML(){
      const getAgo = msDate => ago(msDate).string;
      let {
        collection_type,
        size,
        name,
        uploaded_at = undefined,
        created_at = null,
        updated_on = null} = this.meta;
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
  menuHTML(){
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

export function CollectionWidget(data) {
  let maxVisiblePageNum = 9;
  let currentPage = 1;
  let shiftLength = 36;

    const pages = data.pages;
    const name = data.name;
    const icons = data.icons;
    const getPage = data.getPage;
    const cid = data.cid;
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
    <div class="panel-name" collection=${name}>${name}</div>
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
    let pageNumbers = []
    for (let i = 1; i <= pages; i++){
      pageNumbers.push(i)
    }
    panel_footer.innerHTML = `
    <div class="paginator">
        <div class="page-prev page-tggler">
          <div class="icon">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m7no30hj-00143G09SR07"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0303 7.46967C14.3232 7.76256 14.3232 8.23744 14.0303 8.53033L10.5607 12L14.0303 15.4697C14.3232 15.7626 14.3232 16.2374 14.0303 16.5303C13.7374 16.8232 13.2626 16.8232 12.9697 16.5303L8.96967 12.5303C8.67678 12.2374 8.67678 11.7626 8.96967 11.4697L12.9697 7.46967C13.2626 7.17678 13.7374 7.17678 14.0303 7.46967Z" fill="black" pid="m7no30hj-00B9J71AF3II"></path></svg>
          </div>
        </div>
        <div class="page-container">
          ${ pageNumbers.reduce((a,b) => {
            return a + `
                <div class="page" 
                    page= ${b} 
                    current= ${ b === currentPage ? 'true' : ''} >
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
    panel_header.addEventListener('click', handleDropdown)
    panel_footer.addEventListener('click', handlePagination)
    renderIcons(icons)
    async function handlePagination(event){
        const pageRequestButton = event.target.closest('.page')
        const pageNext = event.target.closest('.page-next')
        const pageLeft = event.target.closest('.page-prev')
  
        const handlePageRequest = async (page) => {
          const pageData = (await getPage(page))
          renderIcons(pageData.icons)
          const current = $('[current="true"]',panel_footer)
          if (current) current.setAttribute('current','');
          $(`.page[page="${page}"]`,panel_footer).setAttribute('current','true')
          currentPage = Number(page);
        }
        const handleShiftDirection = (page) => {
          // probably should be using getBoundingClientRects for accuracy
          const element = $('.page-container',panel_footer)
          const boundaryNum = (page - 1) + maxVisiblePageNum;
          const elementWidth = element.scrollWidth;
          const windowEnd = $('.paginator',panel_footer).offsetWidth
          const rightShift = maxVisiblePageNum - boundaryNum
          const padding = 44;
          const maxShiftLen = windowEnd - elementWidth - padding;
          if((boundaryNum) >= maxVisiblePageNum && boundaryNum <= pages){
            element.style.transform = `translateX(${shiftLength * (rightShift)}px)`
          } else if (boundaryNum > pages){
            console.log('pages',pages)
            element.style.transform = `translateX(${maxShiftLen}px)`
          } else {
            element.style.transform = `translateX(0px)`
          }
        }
        if (pageRequestButton){
          const pageNumber = pageRequestButton.getAttribute('page')
          await handlePageRequest(pageNumber)
          handleShiftDirection(pageNumber)
        } else if (pageNext){
          let next = Number(currentPage) + 1;
          let pageNumber = next > pages ? 1 : next
          console.log('NEXT',pageNumber,next)
          await handlePageRequest(pageNumber)
          handleShiftDirection(pageNumber);
        } else if (pageLeft){
          let prev = currentPage - 1;
          let pageNumber = prev < 1 ? pages : prev
          await handlePageRequest(pageNumber)
          handleShiftDirection(pageNumber)
        }
    }
    async function handleDropdown(event){
      if (event.target.closest('.dropdown-icon')){
        $('.dropdown-menu',panel_header).classList.toggle('active')
      }
      else if (event.target.closest('[opt="delete-collection"]')){
        console.log('deleting collection')
        const result = await API.dropCollection(cid);
        if (result){
          console.log('API RESPONSE: DELETE', result)
          db_panel.remove();
        }
      }
    }
    function renderIcons(icons){
      panel_preview.innerHTML =''
      icons.forEach(icon => {
        const {name,category,markup,id,cid,isBenched} = icon
        const el = document.createElement('div');
            el.dataset.category = category;
            el.dataset.name = name;
            el.dataset.cid = cid;
            el.dataset.id = id;
            el.classList.add('svg-wrapper');
            el.setAttribute('icon-type','preview')
            el.innerHTML = markup;
        panel_preview.appendChild(el)
       })
    }
    return db_panel
}

export function CollectionWidgetSkeleton(){
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
export class LocalCollection extends Collection {
  constructor(data) {
    super({ meta:data, icons:data?.icons || []})
  }
}
