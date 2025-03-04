import { AbstractComponent } from "../../../components/AbstractComponent"
import { API } from "../../../api";
import { Icon } from "../../../components/Icon";
import { Task } from "../../../utils/Task";

const recentDownloadsElementProperties = {
  tag: 'div',
  classList: ['recent-downloads'],
  html: `<div class="title-header">
  <span class="tab rt-downloads active">Downloads</span>
  <span class="tab rt-uploads">Uploads</span>
  <span class="tab rt-projects">Projects</span>
  </div>

  <div class="test-area">
    ...loading recent collections
  </div>`
}

export class RecentDownloads extends AbstractComponent {
  constructor(props){
    super(recentDownloadsElementProperties) 
    this.active = false;
    this.store = new Task( API.getDownloads.bind(API, 20), {name: 'get recent data'})
    this.store.ondata( (data) => this.parseData.call(this,data))
    this.on('render', () => {
      this.active = true;
      this.store.getData()
    })
  }

  handlePreview(data){
    console.log('preview requested',data);
    data.icons = data.icons.map(icon => {
      try {
        return new Icon(icon)
      } catch(e) {
        console.warn('icon skipped')
      }
    })
    this.notify('preview',data)
    this.renderPreview(data)
  }
  
  renderPreview(collection){
    const validIcons = [];
    const icons = collection.icons
    icons.forEach( icon => {
        const i = new Icon(icon);
        if (i.isValid) validIcons.push(i)
        // else console.warn('skipping',i)
    })
    $('.db-res').classList.remove('active');
    $('.collection-preview').classList.add('active');
    $('.collection-preview').innerHTML = `
    <div class="modal-ctrl">
    <div class="icon">
    </div>
    <div class="txt back">close</div>
    </div>
    <div class="cp-modal">

      <div class="col-1 control-column">
        <div class="meta-row">
          <div class="info-column">
              <div class="c-data">

              
                <div class="prop name">
                <div class="nxt tggle"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="prv tggle"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></div>
                    <span class="c-prop c-name">${collection.name}</span>
                </div>
                <div class="block">
                  <div class="prop size">
                    <span class="c-prop c-size">total icons : ${collection.size}</span>
                  </div>
                  <div class="prop date">
                    <span class="c-prop c-date">updated : ${(DateTime.from(new Date(collection.created_at))).string}</span>
                  </div>
                </div>
                <div class="ctrl">upload</div>
                <div class="ctrl">ignore</div>
                <div class="ctrl">settings</div>
              </div>

              <div class="c-settings">
              <div class="title-header">Collection Settings</div>
                <div class="pallete">
                  <span class="setting-label">pallete</span>
                  <span class="box"></span>
                  <span class="box"></span>
                  <span class="box"></span>
                  <span class="box"></span>
                  <span class="box"></span>
                  <span class="box"></span>
                  <span class="box"></span>
                </div>

                
                <div class="row position">
                  <div class="viewbox">
                    <span class="setting-label">viewbox</span><span class="setting vb">none</span>
                  </div>
                  <div class="x">
                    <span class="setting-label">x</span><span class="setting">none</span>
                  </div>
                  <div class="y">
                    <span class="setting-label width">y</span><span class="setting">none</span>
                  </div>
                </div>

                <div class="row dimensions">
                  <div class="height">
                    <span class="setting-label">height</span><span class="setting">none</span>
                  </div>
                  <div class="width">
                    <span class="setting-label width">width</span><span class="setting">none</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="sub-collections">
              <div class="title-header">Filters</div>
              <div class="title-header">Sub Collections</div>
              <div class="sub-list">
                <div class="sc-name all">All</div>
                ${collection.sub_collections?.reduce((acc,red)=>{
                  acc += `<div class="sc-name">${red}</div>`
                  return acc
                },'')}
              </div>
          </div>
        </div>  


        <div class="control-row">
          <div class="icon-preview">
          </div>
        </div>
      </div>

      <div class="preview-column">
        <div class="preview-icons">${validIcons.reduce((acc,red)=> {
          acc += `<div class="preview-icon">${red.markup}</div>`;
          return acc;
        },'')}</div>
      </div>
    </div>
      `

      $('.collection-preview .modal-ctrl').onclick = () => {
        $('.db-res').classList.add('active');
        $('.collection-preview').classList.remove('active');
      }
  }

  createWidget(collection){
    let c = collection;
    let widget = document.createElement('div');
    widget.classList.add('sync-widget')
    const validIcons = []
    const icons = c.icons.slice(0,20)
    icons.forEach( icon => {
        const i = new Icon(icon);
        if (i.isValid) validIcons.push(i)
        // else console.warn('skipping',i)
    })
    let widgetHTML = `

      <div class="recent-collection" cid=${collection.cid}>
      <div class="sync-success">
        <div class="txt">Collection Synced</div>
      </div>
        <div class="collection-info">
        <span class="name">${c.name}</span>
        <span class="divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px">
        <path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>
        <span class="size">${c.size}</span>
        ${c.synced ?'<span class="divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span><span class="isSyncedIcon"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m7urv9x3-01H8YSVTVHCQ"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.38002 7.19402C9.34177 5.69973 11.0205 4.70831 12.9319 4.70831C15.8124 4.70831 18.1671 6.95976 18.3321 9.79889C18.3955 9.79622 18.4592 9.79487 18.5233 9.79487C20.9961 9.79487 23.0008 11.7995 23.0008 14.2724C23.0008 16.7453 20.9961 18.75 18.5233 18.75H6.87461C3.62971 18.75 0.999207 16.1195 0.999207 12.8746C0.999207 9.6297 3.62971 6.99919 6.87461 6.99919C7.39427 6.99919 7.89899 7.06684 8.38002 7.19402ZM15.0303 11.5303C15.3232 11.2374 15.3232 10.7626 15.0303 10.4697C14.7374 10.1768 14.2626 10.1768 13.9697 10.4697L11 13.4393L9.53033 11.9697C9.23744 11.6768 8.76256 11.6768 8.46967 11.9697C8.17678 12.2626 8.17678 12.7374 8.46967 13.0303L10.4697 15.0303C10.7626 15.3232 11.2374 15.3232 11.5303 15.0303L15.0303 11.5303Z" fill="#338ce6" pid="m7urv9x3-0153Z96GWVL8"></path></svg></span>' :'<span class="isSyncedIcon"></span>'}
        
      </div>

        <div class="sample">${
          validIcons.reduce((html,icon) => {
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
          ${c.synced ? '<div class="opt opt-view">view</div><div class="opt opt-remove">remove</div>': '<div class="opt option-accept">Upload</div><div class="opt option-ignore">Ignore</div>'}
        </div>
      </div>
    `
    widget.innerHTML = widgetHTML;
    $('.collection-info',widget).addEventListener('click',this.handlePreview.bind(this,c))

    return widget;
  }
  parseData(collections){
    if (this.active) {
      let sorted = collections.sort((a,b) => a.synced - b.synced)
      $('.test-area').innerHTML = '';
      for (const cname in collections)
        $('.test-area').appendChild(this.createWidget(collections[cname]))
    }
    
  }
  hydrate(){
    // $('.test-area').innerHTML = '... loading recent collections';
  }
}
