import { API } from "../../../api";
import { LocalCollection } from "../../../components/Collection";
import { Task } from "../../../utils/Task";
import { EventEmitterClass } from "../../../utils/EventEmitter";
export class RecentDownloads extends EventEmitterClass {
  constructor(){
    super()
    this.active = false;
    this.store = new Task( API.getDownloads.bind(API,20) )
    this.store.ondata( (data) => {
      this.parseData.call(this,data)
      console.log('recent downloads...')
      console.dir(data)
  })
  }
  createWidget(collection){
    let c = collection;
    let widget = document.createElement('div');
    widget.classList.add('sync-widget')
    const sampleIcons = collection.sample
    let widgetHTML = `
      <div class="recent-collection">
        <div class="sync-success">
          <div class="txt">Collection Synced</div>
        </div>
        <div class="collection-info" name=${collection.name} cid=${collection.cid}>
        <span class="name">${c.name}</span>
        <span class="divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px">
        <path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>
        <span class="size">${c.size}</span>
        ${c.synced ?'<span class="isSyncedContainer"><span class="divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span><span class="isSyncedIcon"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m7urv9x3-01H8YSVTVHCQ"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.38002 7.19402C9.34177 5.69973 11.0205 4.70831 12.9319 4.70831C15.8124 4.70831 18.1671 6.95976 18.3321 9.79889C18.3955 9.79622 18.4592 9.79487 18.5233 9.79487C20.9961 9.79487 23.0008 11.7995 23.0008 14.2724C23.0008 16.7453 20.9961 18.75 18.5233 18.75H6.87461C3.62971 18.75 0.999207 16.1195 0.999207 12.8746C0.999207 9.6297 3.62971 6.99919 6.87461 6.99919C7.39427 6.99919 7.89899 7.06684 8.38002 7.19402ZM15.0303 11.5303C15.3232 11.2374 15.3232 10.7626 15.0303 10.4697C14.7374 10.1768 14.2626 10.1768 13.9697 10.4697L11 13.4393L9.53033 11.9697C9.23744 11.6768 8.76256 11.6768 8.46967 11.9697C8.17678 12.2626 8.17678 12.7374 8.46967 13.0303L10.4697 15.0303C10.7626 15.3232 11.2374 15.3232 11.5303 15.0303L15.0303 11.5303Z" fill="#338ce6" pid="m7urv9x3-0153Z96GWVL8"></path></svg></span>' :'<span class="isSyncedIcon"></span></span>'}
      </div>
        <div class="sample">${
          sampleIcons.reduce((html,icon) => {
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
          ${c.synced ? '<div class="isSyncedControl"><div class="opt opt-view">view</div><div class="opt opt-remove">remove</div></div>': '<div class="opt option-accept">Upload</div><div class="opt option-ignore">Ignore</div>'}
        </div>
      </div>
    `
    widget.innerHTML = widgetHTML;
    $('.collection-info',widget).addEventListener('click',() => this.notify('preview',c))
    return widget;
  }
  parseData(collections){
    if (this.active) {
      let sorted = collections.sort((a,b) => a.synced - b.synced)
      $('.test-area').innerHTML = '';
      for (const cname in collections){
        const collection = new LocalCollection(collections[cname])
        $('.test-area').appendChild(this.createWidget(collection))
      }
    }
    
  }
  render(destination){
    destination.innerHTML = this.getHTML();
    this.active = true;
    this.store.getData(true)
  }
  getHTML(){
    return `
    <div class="recent-downloads">
      <div class="title-header">
        <span class="tab rt-downloads active">Downloads</span>
        <span class="tab rt-uploads">Uploads</span>
        <span class="tab rt-projects">Projects</span>
      </div>
      <div class="test-area">
        ...loading recent collections
      </div>
    </div>
    `
  }
}
