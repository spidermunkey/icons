import { API } from "../api";
import { Icon } from "./Icon";
export class UploadSection {
  constructor(){
    this.store = new Task(API.getUploads.bind(API,20))
    this.store.ondata( (data) => this.parseData.call(this,data));
  }

  parseData(collections){
    if (this.active) {
      $('.test-area').innerHTML = '';
      for (const cname in collections)
        $('.test-area').appendChild(this.createWidget(collections[cname]))
    }
  }
  createWidget(collection){
    let c = collection;
    let widget = document.createElement('div');
    console.log(c)
    const validIcons = []
    const icons = c.icons.slice(0,20)
    icons.forEach( icon => {
        const i = new Icon(icon);
        if (i.isValid) validIcons.push(i)
        // else console.warn('skipping',i)
    })
    let widgetHTML = `
    
        <div class="recent-collection" cid=${collection.cid} data-link="" href="/browse/${collection.cid}">
          <div class="collection-info">
          <span class="name">${c.name}</span>
          <span class="divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px">
          <path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>
          <span class="size">${c.size}</span>
        </div>

        <div class="sample">${
          icons.reduce((html,icon) => {
            return html + `
            <div class="sample-icon">
            ${icon.markup}
            </div>`
          },'')
        }</div>

        <div class="control">
          <div class="loading-overlay">
            uploading collection ...
          </div>
          <div class="opt option-view" data-link="" href="/browse/${collection.name}">View All</div>
          <div class="opt option-settings">Settings</div>
        </div>
      </div>
    `
    widget.innerHTML = widgetHTML;
    // $('.collection-info',widget).addEventListener('click',this.handlePreview.bind(this,c))

    return widget;
  }
  render(destination){
    destination.innerHTML = this.getHTML();
    this.active = true
    this.store.getData(true)
  }
  load(destination){
    destination.innerHTML = this.getLoader();
  }
  getLoader(){
      return '<div class="loader">...loading</div>'
  }
  getHTML(){
    return `
    <div class="recent-uploads">
      <div class="title-header">
        <span class="tab rt-downloads">Downloads</span>
        <span class="tab rt-uploads active">Uploads</span>
        <span class="tab rt-projects">Projects</span>
      </div>

      <div class="test-area">
        ...loading uploaded collections
      </div>
    </div>`
  }
}
