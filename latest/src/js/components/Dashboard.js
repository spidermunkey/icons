import { EventEmitter, EventEmitterClass } from "../utils/EventEmitter";

class Search {
  constructor(){
    this.query = null;
    this.emitter = new EventEmitter();
  }

  async handleSearch(event) {
    const searchQuery = event.target.value;
    this.query = searchQuery;
    if (searchQuery === '') return
    console.log(searchQuery,this.query)
    const res = await axios.post(`http://localhost:${1279}/icons/all`, { query: searchQuery !== undefined ? searchQuery : this.query })
    const { query,data } = res.data;
    const queryIsCurrent = this.query === query || this.query === searchQuery;
    console.log(data)
    if (queryIsCurrent) this.emitter.emit('response',data);
  }
  on(){
    this.emitter.on(...arguments)
  }
  once() {
    this.emitter.once(...arguments)
  }
  off() {
    this.emitter.off(...arguments)
  }
  clear() {
    this.emitter.clear(...arguments)
  }
  emit() {
    this.emitter.emit(...arguments)
  }
}
export class DashboardElement extends EventEmitterClass {
  constructor() {
    super();
    this.element = $('#DASHBOARD');
    this.panel = $('.db-res',this.element);
    this.searchPanel = $('.search-cosm');
    // $('.search.passive-search').addEventListener('input',this.throttleInput());
  }
  throttleInput(){
    let timeoutId;
    // debounced
    return (e) => {
        this.query = e.target.value;
        clearTimeout(timeoutId);
        timeoutId = setTimeout( this.handleSearch.bind(this,e), 400 )
    }
  }
  async handleSearch(event) {
    const searchQuery = event.target.value;
    this.query = searchQuery;
    if (searchQuery === '') return this.hideSearch();
    console.log(searchQuery,this.query)
    const res = await axios.post(`http://localhost:${1279}/icons/all`, { query: searchQuery !== undefined ? searchQuery : this.query })
    const { query,data } = res.data;
    const queryIsCurrent = this.query === query || this.query === searchQuery;
    console.log(data)
    if (queryIsCurrent) this.renderSearch.call(this,data)
  }
  hideSearch(){
    $('.search-cosm').classList.remove('active')
    $('.db-res').classList.add('active')
    $('.search-cosm').innerHTML = '';
  }
  showSearch(){
    $('.search-cosm').classList.add('active')
    $('.db-res').classList.remove('active')
  }
  setLoading(){
    this.panel.innerHTML = `loading...`
  }
  setReady(){
    this.panel.classList.add('active')
  }
  renderSearch(icons){
    if (!icons) return
    const frag = document.createDocumentFragment();
    icons.forEach(prop => {
      let {name,category,markup,id,cid} = prop || this;
      let el = document.createElement('div');
      el.dataset.category = category;
      el.dataset.name = name;
      el.dataset.cid = cid;
      el.dataset.id = id;
      el.classList.add('svg-wrapper')
      el.innerHTML = markup;
      frag.append(el);
    })
    this.searchPanel.innerHTML = ''
    this.searchPanel.append(frag);
    this.showSearch();
  }
  async render(collection={}, filter="none") {
    const frag = document.createDocumentFragment();
    // console.log('RENDER',collection)
    const icons = collection?.icons;
    if (icons) icons.forEach(prop => {
      let {name,category,markup,id,cid,isBenched} = prop || this;
      let el = document.createElement('div');
      el.dataset.category = category;
      el.dataset.name = name;
      el.dataset.cid = cid;
      el.dataset.id = id;
      el.classList.add('svg-wrapper');
      if (isBenched) {
        el.classList.add('benched')
      }
      el.innerHTML = markup;
      frag.append(el);
    })
    this.panel.innerHTML = '';
    this.panel.append(frag);
    this.setReady();
  }
  async renderIcons(icons,destination,settings){

    destination.innerHTML = '';

      let stroke = settings?.stroke || '', 
          fill = settings?.fill || '', 
          height = settings?.height || '', 
          width = settings?.width || '', 
          viewbox = settings?.viewbox || [],
          sattrs = settings?.sttrs || [],
          attrs = settings?.attrs || [], 
          cls = settings?.cls || [];

    icons.forEach(props => {
      let {name,category,markup,id,cid,isBenched} = props || this;
      let el = document.createElement('div');
      el.dataset.category = category;
      el.dataset.name = name;
      el.dataset.cid = cid;
      el.dataset.id = id;
      el.classList.add('svg-wrapper');
      el.innerHTML = markup;
      if (isBenched) {
        el.classList.add('benched')
      }
        if (stroke && stroke != ''){
          $('svg',el).setAttribute('stroke',stroke)
        }
        if (fill && fill != '')
          $('svg',el).setAttribute('fill',fill)
        if (height && height != '')
          $('svg',el).setAttribute('height',height)
        if (width && width != '')
          $('svg',el).setAttribute('width',width)
        if (viewbox && viewbox.length > 0)
          $('svg',el).setAttribute('viewbox',viewbox.join(' '))
        if (sattrs && sattrs.length > 0)
          sattrs.forEach(attr => $('svg',el).setAttribute(attr[0],attr[1]))

        if (attrs && attrs.length > 0)
          attrs.forEach(attr => el.setAttribute(attr[0],attr[1]))
        if (cls && cls.length > 0)
          el.classList.add(...cls)
      destination.appendChild(el);
    })
    
  }
  async handleClick(event) {
    let wrapper = event.target.closest('.svg-wrapper');
    console.log('herefoo')
    if (!wrapper) return console.log('no click on wrapper');
    let id = wrapper.dataset.id;
    if (!id) return console.error('this element doesnt have an id');
    const ctrlClick = event.ctrlKey,
          rightClick = event.buttons === 2,
          leftClick = event.buttons === 1;
    if (leftClick && ctrlClick) return console.log('adding ',id,' to benched icons');
    else if (rightClick) return  console.log('right click');
    else if (leftClick) {
        preview.update(store.all[id]);
        tracker.logClickedIcon(store.all[id]);
        return;
    }
  }
  async renderHome(collections){
    this.setLoading();
    const frag = document.createDocumentFragment();
    const names = collections.map(col => col.name);
    collections.forEach((collection) => {
        const { pages , size , currentPage , name , sub_collections , subtypes , icons } = collection;
        let settings = {cls: ['svg-wrapper'],attrs: [['icon-type','preview']]}
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
        db_panel.appendChild(panel_header);
        db_panel.appendChild(db_container);
        db_container.appendChild(panel_preview);
        db_panel.appendChild(panel_footer);
        panel_header.innerHTML = `
          <div class="panel-name" collection="${name}">${name}</div>
          <div class="panel-settings">
            <div class="settings-label"> collection settings</div>
            <div class="settings-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m1vr1enl-009UGELNY0P0">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.0792L9.7872 5.3687C9.55167 5.61239 9.22729 5.75 8.88839 5.75H5.75V8.88839C5.75 9.2273 5.61239 9.55167 5.3687 9.7872L3.0792 12L5.3687 14.2128C5.61239 14.4483 5.75 14.7727 5.75 15.1116V18.25H8.88839C9.22729 18.25 9.55167 18.3876 9.7872 18.6313L12 20.9208L14.2128 18.6313C14.4483 18.3876 14.7727 18.25 15.1116 18.25H18.25V15.1116C18.25 14.7727 18.3876 14.4483 18.6313 14.2128L20.9208 12L18.6313 9.78721C18.3876 9.55168 18.25 9.2273 18.25 8.8884V5.75H15.1116C14.7727 5.75 14.4483 5.61239 14.2128 5.3687L12 3.0792ZM11.1012 1.85077C11.5926 1.34237 12.4074 1.34237 12.8988 1.85077L15.2177 4.25H18.5C19.1904 4.25 19.75 4.80965 19.75 5.5V8.78234L22.1492 11.1012C22.6576 11.5926 22.6576 12.4074 22.1492 12.8988L19.75 15.2177V18.5C19.75 19.1904 19.1904 19.75 18.5 19.75H15.2177L12.8988 22.1492C12.4074 22.6576 11.5926 22.6576 11.1012 22.1492L8.78233 19.75H5.5C4.80964 19.75 4.25 19.1904 4.25 18.5V15.2177L1.85077 12.8988C1.34237 12.4074 1.34236 11.5926 1.85077 11.1012L4.25 8.78233V5.5C4.25 4.80964 4.80964 4.25 5.5 4.25H8.78233L11.1012 1.85077Z" fill="black" pid="m1vr1enl-02FS7VGI5W4B"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.25 12C7.25 9.37665 9.37665 7.25 12 7.25C14.6234 7.25 16.75 9.37665 16.75 12C16.75 14.6234 14.6234 16.75 12 16.75C9.37665 16.75 7.25 14.6234 7.25 12ZM12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25C13.7949 15.25 15.25 13.7949 15.25 12C15.25 10.2051 13.7949 8.75 12 8.75Z" fill="black" pid="m1vr1enl-02AJOEFIYGW4"></path>
              </svg>
            </div>
          </div>
        `

        let p = [];
        for (let i = 1; i <= pages; i++){
          p.push(i)
        }
        panel_footer.innerHTML = `
                  <div class="paginator">
                    ${ p.reduce(
                      (a,b) => {
                      return a + `
                        <div class="page" 
                              page= ${b} 
                              current= ${ b === currentPage ? 'true' : ''} >
                          <div class="page-icon">
                            ${b}
                          </div>
                        </div>`
                      },
                      '')
                    }
                  </div>
        `
        panel_footer.addEventListener('click',async (event) => {
          const pageRequester = event.target.closest('.page')
          if (pageRequester){
            console.log('requesting page', pageRequester.getAttribute('page'))
            let pageNumber = pageRequester.getAttribute('page')
            const page = (await collection.getPage(pageNumber))[0]
            const {icons} = page;
            this.renderIcons(icons,panel_preview,settings)
            console.log('page retrieved',page)
            const current = $('.panel-footer [current="true"]')
            if (current)
              current.setAttribute('current','');
            pageRequester.setAttribute('current','true')
          }
        })
        // console.log('RENDER',collection)
        this.renderIcons(icons,panel_preview,settings)
        // if (icons) icons.forEach(prop => {
        //     let {name,category,markup,id,cid,isBenched} = prop || this;
        //     let el = document.createElement('div');
        //     el.dataset.category = category;
        //     el.dataset.name = name;
        //     el.dataset.cid = cid;
        //     el.dataset.id = id;
        //     el.classList.add('svg-wrapper');
        //     el.setAttribute('icon-type','preview')
        //     if (isBenched) {
        //       el.classList.add('benched')
        //     }
        //     el.innerHTML = markup;
        //     panel_preview.append(el);
        //   })
        frag.appendChild(db_panel)
      });
    this.panel.innerHTML = '';
    this.panel.append(frag);
    this.setReady();
  }

};
