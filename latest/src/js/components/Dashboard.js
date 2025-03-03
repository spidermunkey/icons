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
  setLoading(){
    this.panel.innerHTML = `loading...`
  }
  setReady(){
    this.panel.classList.add('active')
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
