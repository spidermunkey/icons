import { API } from "../api";
export class Menu {
  constructor(){
    this.collectionsMenu = $('.collections-list')
    this.pinnedPreview = $('.pinned-preview')
    this.menuTabber = $('.logo')
    this.menu = $('.menu')
    this.cosm = $('.menu-cosm')
    this.navtabs =  $$('.menu-label[role="tab"][type="nav"]')
    this.navmodals = $$('.menu-modals .menu-modal[type="modal"]')

    listen(this.menuTabber,this.open.bind(this))
    this.navtabs.forEach(tab => listen(tab, this.openMenu.bind(this,tab) ,'mouseenter'));
    this.ready = this.init()
  }
  openMenu(tab) {
    const modal = $(`.menu-modal[modal='${tab.getAttribute('modal')}']`)
    this.closeAll();
    // removeAllTags();
    modal.classList.add('active');
    tab.classList.add('active');
  }
  open() {
      this.cosm.classList.toggle('active')
      this.menu.classList.toggle('active')
      if (!this.menu.classList.contains('active')) 
              this.closeAll();
  }
  async getMeta() {
    const data = await API.getCollectionData();
    let meta = {
        collectionNames: await this.getCollectionNames(),
        documents: {},
    }
    for (const document of data) 
        meta.documents[document.name] = document;
    return meta
  }
  async getCollectionNames() {
    return API.getCollectionNames();
  }
  closeAll() {
    this.navmodals.forEach(modal => modal.classList.remove('active'));
  }
  async init() {
    this.meta = await this.getMeta();
    const { collectionNames , documents } = this.meta

    this.collectionsMenu.innerHTML = CollectionMenu(collectionNames);

    for (const collection in documents)
        if (collectionNames.includes(collection))
            CollectionMenuPreviewModal(documents[collection])
  
    this.ready = true;

  }
}

function CollectionMenu(names) { // get list of names from db
  return names
      .sort()
      .map(name => `<div class="menu-list-item" type="preview" modal="${name}">${name}</div>`)
      .join('')
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
