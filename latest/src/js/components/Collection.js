import { Icon } from './Icon.js';
import { Cursor } from '../utils/Cursor';

export class Collection {
  constructor(data){
    const { 
      icons = [], 
      meta = { name:'empty', cid:'1' ,sub_collections:[] ,subtypes:[] }, 
    } 
      = data
    const validIcons = []
    const skipped = []
    this.sub_collections = []
    this.subtypes = []
    icons.forEach( icon => {
        const i = new Icon(icon);
        // quick patch
        // fixing issue with bad data from the server
        const sub_collections = this.sub_collections
        const subtypes = this.subtypes;
        const sub_collection = icon.sub_collection
        const subtype = icons.subtype
        if (i.isValid) {
          validIcons.push(i)
          if (sub_collection && !sub_collections.includes(sub_collection)) 
            sub_collections.push(sub_collection)
          if (subtype && !subtypes.includes(subtype)) 
            subtypes.push(subtype)
        }
        else skipped.push(i)
    })
    console.warn('skipped: ', skipped.length,' icons')
    console.warn(`found ${this.subtypes.length} subtypes`)
    console.warn(`found ${this.sub_collections.length} subcollections`)
    this.filters = {
      sub_collections:[],
      subtypes:[],
    };
    this.icons = validIcons
    this.cursor = new Cursor(validIcons)
    this.meta = meta
    this.ready = true
    this.collection_type = meta.collection_type
    this.setting = meta?.settings || {}
    this.usePreset = meta?.usePreset || false
    this.colors = meta?.colors || {}
    this.state = {
    }
    console.dir(`CREATING COLLECTION FROM DATA: `, data)
  }
  get name(){
      return this.meta.name
  }
  get settings(){
    return this.meta?.settings || {}
  }
  get recentSettings() {
    return this.meta.recent_settings
  }
  get color(){
    return this.meta.color
  }
  get preset(){
    return this.meta.preset
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
  renderWidget(destination){

  }
  renderPreview(destination){

  }
  infoHTML(){
      const getAgo = msDate => DateTime.from(msDate).string;
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
