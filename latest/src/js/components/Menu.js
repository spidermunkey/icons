import { API } from "../api.js";
import { ago, DateTime } from "../utils/DateTime.js";
export class Menu {
  constructor(){
    this.collectionsMenu = $('.collections-list')
    this.collectionsModal = $('.menu-modal[type="modal"][modal="collections"]')

    this.defaultMenu = $('.icons-list')
    this.defaultModal = $('.menu-modal[type="modal"][modal="icons"]')

    this.projectMenu = $('.project-list')
    this.projectModal = $('.menu-modal[type="modal"][modal="projects"]')

    this.pinnedPreview = $('.pinned-preview')
    this.menuTabber = $('.logo')
    this.menu = $('.menu')
    this.cosm = $('.menu-cosm')
    this.navtabs =  $$('.menu-label[role="tab"][type="nav"]')
    this.navmodals = $$('.menu-modals .menu-modal[type="modal"]')
    this.state = 'inactive'
    listen(this.menuTabber,this.toggle.bind(this))
    this.navtabs.forEach(tab => listen(tab, this.toggleMenu.bind(this,tab) ,'click'))
    this.ready = this.init()
    this.current = null;
  }
  openMenu(tab) {
    const modal = $(`.menu-modal[modal='${tab.getAttribute('modal')}']`);
    this.closeAll();
    modal.classList.add('active');
    tab.classList.add('active');
  }
  toggleMenu(tab) {
    const modal = $(`.menu-modal[modal='${tab.getAttribute('modal')}']`);
    this.closeAll();
    if (this.current === modal) {
      modal.classList.remove('active');
      tab.classList.remove('active');
      this.current = null;
      return; 
    }
    this.current = modal;
    modal.classList.add('active');
    tab.classList.add('active');
  }
  toggle() {
    if (this.state === 'active') this.close();
    else if (this.state === 'inactive') this.open();
  }
  open() {
      this.state = 'active';
      this.cosm.classList.add('active');
      this.menu.classList.add('active');
  }
  close() {
    this.state = 'inactive';
    this.cosm.classList.remove('active');
    this.menu.classList.remove('active');
    this.closeAll();
    this.current = null;
  }
  async getMeta() {
    const data = await API.getCollectionData();
    let meta = this.meta = {
        uploads: data?.uploads,
        auto: data?.auto,
        projects: data?.projects,
    }
    return meta
  }
  closeAll() {
    this.navmodals.forEach(modal => modal.classList.remove('active'));
    $$('.item-menu-window.active').forEach(tooltip => tooltip.classList.remove('active'))
  }
  async init() {
    this.meta = await this.getMeta();
    let uploads = [];
    let auto = [];
    let projects = [];
    for (const x in this.meta.uploads){
      uploads.push(this.meta.uploads[x]);
    }
    for (const x in this.meta.auto){
      auto.push(this.meta.auto[x]);
    }
    for (const x in this.meta.projects){
      projects.push(this.meta.projects[x]);
    }
    this.collectionsMenu.innerHTML = CollectionMenu(uploads);
    this.collectionsModal.appendChild(MenuList(uploads));
    this.defaultMenu.innerHTML = CollectionMenu(auto);
    this.defaultModal.appendChild(MenuList(auto));
    this.projectMenu.innerHTML = CollectionMenu(projects);
    this.projectModal.appendChild(MenuList(projects));

    this.ready = true;
  }
  
}

function CollectionMenu(props) { // get list of names from db
  return props
      .sort((a,b) => a.name > b.name )
      .map(props => {
        const {name,collection_type = '',size, uploaded_at = undefined, sample = [], created_at = null, updated_on = null} = props
        const getAgo = msDate => ago(new Date(msDate)).string;
        return `
        <div class="menu-list-item md" role="tab" modal=${name}>
        ${collection_type !== 'auto' ? `<div class="item-header">
          <div class="item-menu">
            <div class="btn-menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m1grjzmg-01MKTQZTQE6Y">
                <path d="M6 10.5C5.17157 10.5 4.5 11.1716 4.5 12C4.5 12.8284 5.17157 13.5 6 13.5C6.82843 13.5 7.5 12.8284 7.5 12C7.5 11.1716 6.82843 10.5 6 10.5Z" fill="black" pid="m1grjzmg-00JKHYCR2TOO"></path>
                <path d="M10.5 12C10.5 11.1716 11.1716 10.5 12 10.5C12.8284 10.5 13.5 11.1716 13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12Z" fill="black" pid="m1grjzmg-0116CZ8R720N"></path>
                <path d="M16.5 12C16.5 11.1716 17.1716 10.5 18 10.5C18.8284 10.5 19.5 11.1716 19.5 12C19.5 12.8284 18.8284 13.5 18 13.5C17.1716 13.5 16.5 12.8284 16.5 12Z" fill="black" pid="m1grjzmg-00RDOKP0EOPM"></path>
              </svg>
            </div>
            <div class="item-menu-window" modal=${name}>
    
              <div class="option-delete">
                <div class="option-label">
                  ${ collection_type == 'project' ? 'delete project' : collection_type == 'upload' ? 'remove from uploads' : ''}
                </div>
                <div class="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m1gwi4v5-01N853XU935N">
                <path d="M10 2.25C9.58579 2.25 9.25 2.58579 9.25 3V3.75H5C4.58579 3.75 4.25 4.08579 4.25 4.5C4.25 4.91421 4.58579 5.25 5 5.25H19C19.4142 5.25 19.75 4.91421 19.75 4.5C19.75 4.08579 19.4142 3.75 19 3.75H14.75V3C14.75 2.58579 14.4142 2.25 14 2.25H10Z" fill="black" pid="m1gwi4v5-01G3NB3KBBSM"></path>
                <path d="M10 10.65C10.4142 10.65 10.75 10.9858 10.75 11.4L10.75 18.4C10.75 18.8142 10.4142 19.15 10 19.15C9.58579 19.15 9.25 18.8142 9.25 18.4L9.25 11.4C9.25 10.9858 9.58579 10.65 10 10.65Z" fill="black" pid="m1gwi4v5-015R7Q72UCJ3"></path>
                <path d="M14.75 11.4C14.75 10.9858 14.4142 10.65 14 10.65C13.5858 10.65 13.25 10.9858 13.25 11.4V18.4C13.25 18.8142 13.5858 19.15 14 19.15C14.4142 19.15 14.75 18.8142 14.75 18.4V11.4Z" fill="black" pid="m1gwi4v5-01AE006BOUG4"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99142 7.91718C6.03363 7.53735 6.35468 7.25 6.73684 7.25H17.2632C17.6453 7.25 17.9664 7.53735 18.0086 7.91718L18.2087 9.71852C18.5715 12.9838 18.5715 16.2793 18.2087 19.5446L18.189 19.722C18.045 21.0181 17.0404 22.0517 15.7489 22.2325C13.2618 22.5807 10.7382 22.5807 8.25108 22.2325C6.95954 22.0517 5.955 21.0181 5.81098 19.722L5.79128 19.5446C5.42846 16.2793 5.42846 12.9838 5.79128 9.71852L5.99142 7.91718ZM7.40812 8.75L7.2821 9.88417C6.93152 13.0394 6.93152 16.2238 7.2821 19.379L7.3018 19.5563C7.37011 20.171 7.84652 20.6612 8.45905 20.747C10.8082 21.0758 13.1918 21.0758 15.5409 20.747C16.1535 20.6612 16.6299 20.171 16.6982 19.5563L16.7179 19.379C17.0685 16.2238 17.0685 13.0394 16.7179 9.88417L16.5919 8.75H7.40812Z" fill="black" pid="m1gwi4v5-029HZD8WIJVF"></path>
                </svg></div>
              </div>
            </div>
          </div>
        </div>` : '<div class="divider"></div>' }
        
        <div class="sample-window">
          ${sample.slice(0,20).reduce((a,b)=> {
            return a + `${b.markup}`
          },'')}
        </div>
          <div class="label title">${name}</div>
          <div class="label count">saved icons: ${size}</div>
          <div class="label updated_on"> last updated: ${
            updated_on ? getAgo(updated_on)
            : uploaded_at ? getAgo(uploaded_at)
            : created_at ? getAgo(created_at)
            : 'never'
          }</div>
          <div class="label dashboard-link">open preview</div>
        </div>
        
        `})
      // .map(props => `
      //   <div class="menu-list-item" role="tab" modal="${props.name}">${props.name}</div>
      //   `)
      .join('')
}
function MenuList(proplist){
  const names = proplist.map(props => props.name)
  const element = document.createElement('div');
  element.innerHTML = `
      ${names.reduce((a,b)=> {
        return a + `
          <div class="quick-list-item" role="quick-link" modal=${b}>${b}</div>
        `
      },'')}
  `;
  element.classList.add('quick-list')
  return element;
}
function CollectionMenuPreviewModal(document) {
    const updated_at = document.updated_at,
            size = document.size,
            sampleElements = document.sample,
            name = document.name,
            menuItem = $(`.menu-list-item[modal="${name}"]`),
            menuModal = $('.peek-modal[modal="icons"]');

    menuItem.addEventListener('mouseenter', () => {
        const modal = menuModal,
                labels = $('.peek-modal-labels',modal),
                prev = $('.peek-modal-icons',modal);
        labels.innerHTML = PreviewCollectionHeader(name,size,updated_at);
        prev.innerHTML = PreviewSampleElements(sampleElements);
    });
}

function PreviewCollectionHeader(name,size,updated_at){
  return `
  <div class="peek-label-title">${name}</div>
  <div class="peek-label count">saved icons: ${size}</div>
  <div class="peek-label updated_on"> last updated: ${updated_at ? updated_at : 'never'}</div>
`
}
function PreviewSampleElements(icons) {
  return icons.map(value => `<div class="pk-icon">${value.markup}</div>`).join('')
}
