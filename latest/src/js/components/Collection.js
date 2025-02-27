import { Icon } from './Icon.js';
import { Cursor } from '../utils/Cursor';

export class Collection {
  constructor(data){
    const { 
      icons = [], 
      meta = { name:'empty', cid:'1' ,sub_collections:[] ,subtypes:[] }, 
      state = {},
      settings = {},  
      filters = { subtypes:[], sub_collections:[]} } 
      = data
    const validIcons = []
    const skipped = []
    icons.forEach( icon => {
        const i = new Icon(icon);
        if (i.isValid) validIcons.push(i)
        else skipped.push(i)
    })
    console.warn('skipped: ', skipped.length,' icons')
    this.icons = validIcons
    this.cursor = new Cursor(validIcons)
    this.meta = meta
    this.ready = true
    this.filters = filters
    this.preset = meta?.preset || null,
    this.usePreset = meta?.usePreset || false,
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
    const destination = $('#DASHBOARD .db-res');
    destination.innerHTML = `...loading ${this.name}`
    const frag = document.createDocumentFragment();
    this.icons.forEach(prop => {
      let { name , collection , markup , id , cid , isBenched } = prop
      let el = document.createElement('div');
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
    destination.innerHTML = '';
    destination.append(frag);
  }

  renderWidget(destination){

  }
  
  renderPreview(destination){

  }
}
