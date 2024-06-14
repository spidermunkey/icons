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

export class Dashboard {
  constructor() {
    this.element = $('#DASHBOARD');
    this.panel = $('.db-res',this.element);
    this.searchPanel = $('.search-cosm');
    $('.search.passive-search').addEventListener('input',this.throttleInput())
  }

  updateHeader(meta) {

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
  render(icons, sort="default") {
    console.log(icons)
    const frag = document.createDocumentFragment();
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

  async handleClick(event) {
    await modelReady;
    let wrapper = event.target.closest('.svg-wrapper');
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
};

function BenchPreview(icons) {
  return icons
          .slice(-8)
          .map((node => `<div class="bp-icon">${node.markup}</div>`))
          .join('')
}
function PinnedPreview(icons) {
  return icons.map(value => `<div class="bp-icon">${value.markup}</div>`).join('')
}
