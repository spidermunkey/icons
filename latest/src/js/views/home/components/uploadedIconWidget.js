import { AbstractComponent } from "../../../components/AbstractComponent";
import { API } from "../../../api";
import { Task } from "../../../utils/Task";
import { Icon } from "../../../components/Icon";

const uploadSectionProperties = {
  tag: 'div',
  classList: ['recent-uploads'],
  html: `<div class="title-header">
    <span class="tab rt-downloads">Downloads</span>
    <span class="tab rt-uploads active">Uploads</span>
    <span class="tab rt-projects">Projects</span>
  </div>

  <div class="test-area">
    ...loading uploaded collections
  </div>`
}

export class UploadSection extends AbstractComponent {
  constructor(){
    super(uploadSectionProperties);
    this.store = new Task( API.getUploads.bind(API,20), { name:'get uploaded data'})
    this.store.ondata( (data) => {
      console.log(data)
      this.parseData.call(this,data)
  });
    this.on('render',() => {
      this.active = true;
      this.store.getData();
    })
  }
  parseData(collections){
    if (this.active) {
      const {uploads} = collections;
      $('.test-area').innerHTML = '';
      for (const cname in uploads)
        $('.test-area').appendChild(this.createWidget(uploads[cname]))
    }
  }
  createWidget(collection){
    let c = collection;
    let widget = document.createElement('div');
    console.log(c)
    const validIcons = []
    const icons = c.sample.slice(0,20)
    icons.forEach( icon => {
        const i = new Icon(icon);
        if (i.isValid) validIcons.push(i)
        // else console.warn('skipping',i)
    })
    let widgetHTML = `
      <div class="recent-collection" cid=${collection.cid}>
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
          <div class="opt option-view">View All</div>
          <div class="opt option-settings">Settings</div>
        </div>
      </div>
    `
    widget.innerHTML = widgetHTML;
    // $('.collection-info',widget).addEventListener('click',this.handlePreview.bind(this,c))

    return widget;
  }
}
