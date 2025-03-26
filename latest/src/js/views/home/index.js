import { RecentDownloads } from "../../components/recentIconWidget.js";
import { UploadSection } from "../../components/uploadedIconWidget.js";
import { StatusWidget } from "../../components/statusWidget.js";
import { API } from "../../api.js";
import { ColorSettingsInterface } from "./SettingsInterface.js";
export class Home extends EventEmitter {
  constructor(store) {
    super()
    this.store = store
    this.appStatus = new StatusWidget(store);
    this.localCollections = new RecentDownloads();
    this.state = {
      collections: [],
      collection:null,
      query:'',
    }
    this.localCollections.on('preview', (collection) => {
      const render = (collection) => {
        this.state.collection = collection;
        this.cancelSearch();
        collection.render();
        $('.c-data .nxt.tggle').onclick = () => next();
        $('.c-data .prv.tggle').onclick = () => prev();
        // close
        $('.local-preview .modal-ctrl').addEventListener('click',() => this.state.collection = null)
      this.colorSettingsInterface = new ColorSettingsInterface()
      this.colorSettingsInterface.update(collection)
      }
      const next = () => {
        const current = this.state.collections.skipToNext()
        render(current)
      }
      const prev = () => {
        const current = this.state.collections.skipToPrev()
        render(current)
      }
      render(collection);
      this.state.collections.skipToElement(collection)
    })
    this.localCollections.on('upload',(collection,element)=> this.handleUpload(collection,element))
    this.localCollections.on('data',(collections) => {
      this.state.collections = new Cursor(collections)
    })
    this.uploadedCollections = new UploadSection()
    this.uploadingQue = new Set()
    this.on('active',() => this.active = true)
    this.on('inactive',() => {
      this.localCollections.active = false;
      this.uploadedCollections.active = false;
      this.active = false;
    })
  }

  async render(){
    $('#app').innerHTML = ''
    $('#app').innerHTML = await this.getHTML();
    this.localCollections.render($('.col-2.recent-activity'));
    this.appStatus.render($('.info-panels'))
    $('.db-res').classList.add('active');
    this.hydrate()

  }

  async hydrate() {
    $('.search.passive-search').addEventListener('input',this.search())
    // $('.search.passive-search input').addEventListener('blur',(e) => {
    //   // if (!e.target.value || e.target.value == '')
    //     this.searchReset()
    // })
    // $('.search.passive-search input').addEventListener('focus', (e) => {
    //   if (e.target.value && e.target.value !== '')
    //     this.handleSearch(e)
    // })
    $('.btn-cancel').addEventListener('click',() => this.searchReset())
    $$('.control-panels .control-tab .tab').forEach(tabber => {
      const tab = tabber.getAttribute('tab');
      tabber.addEventListener('click',(event) => {
        $$('.control-panels .control-tab .tab').forEach(tabber => tabber.classList.remove('active'))
        $$('.control-panels .control-panel .panel').forEach(panel => panel.classList.remove('active'))
        tabber.classList.add('active')
        $(`.control-panels .control-panel .panel[panel=${tab}]`).classList.add('active')
      })
    })

    $('#app').addEventListener('click',async (e) => {
      if (!this.active){
        return;
      }
        // handle upload
        let collectionPreview = e.target.closest('.collection-info');
        let upload = e.target.closest('.recent-collection .option-accept');
        let ignore = e.target.closest('.recent-collection .option-ignore');
        let drop = e.target.closest('.recent-collection .opt-remove');
        let view = e.target.closest('.opt.opt-view')
        let downloadsTab = e.target.closest('.rt-downloads');
        let uploadedTab = e.target.closest('.rt-uploads');
        if (upload){
          // let collection = e.target.closest('.recent-collection')
          // console.trace('uploading collection',collection)
          // let id = $('.collection-info',collection).getAttribute('cid');
          // this.handleUpload(id,collection)
        }
        else if (ignore) {
          let collection = e.target.closest('.recent-collection');
          console.log('ignoring collection',collection);
          let id = collection.getAttribute('cid');
          const stat = await API.requestIgnore({cid:id});
          console.log('IGNORE PROCESS COMPLETE', stat);
        } else if (drop) {
          let collection = e.target.closest('.recent-collection')
          let id = collection.getAttribute('cid');
          console.warn('droping collection',id)
          this.handleDrop(id,collection)
        } else if (view){
          console.log(app)
        }
        
        // handle tabs 
        else if (downloadsTab){
          this.renderLocalCollections()
        } else if (uploadedTab){
          this.renderUploadedCollections()
        }
    })

  }
  handleSearch = (event) => {
    const query = event.target.value;
    console.log('searching....',query)
    this.state.query = query;
    if (query === '') {
      this.searchReset();
      return;
    }
    $('.btn-cancel').classList.add('active');
    if (this.state?.collection){

      const activeCollection = this.state.collection;
      console.log('searching in....',activeCollection)
      activeCollection.filters.query = query;
      activeCollection.renderIcons()
    }
  }
  search(){
    const inputThrottler = () => {
      let timeoutId;
      return (event) => {
        this.state.query = event.target.value
        clearTimeout(timeoutId)
        timeoutId = setTimeout( this.handleSearch.bind(this,event), 400)
      }
    }
    return inputThrottler();
  }
  cancelSearch(){
    $('.passive-search input').value = ''
    $('.btn-cancel').classList.remove('active')
    if (this?.state?.collection){
      this.state.collection.filters.query = ''
    }
  }
  searchReset(){
    this.cancelSearch();
    if (this.state.collection){
      this.state.collection.filters.query = ''
      this.state.collection.renderIcons();
    }
  }
  renderPreview(collection){
    const icons = collection.icons
    $('.db-res').classList.remove('active');
    $('.collection-preview').classList.add('active');
    $('.collection-preview').innerHTML = `
    <div class="modal-ctrl">
      <div class="icon"></div>
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
                        <span class="c-prop c-date">updated : ${(ago(new Date(collection.created_at))).string}</span>
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
        <div class="preview-icons">${icons.reduce((acc,red)=> {
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
  async handleUpload(collection,element){
    console.log(element,'upload triggered')
    console.log('uploading...',collection)
    const id = collection.id;
      if (this.uploadingQue.has(id)){
        console.warn('upload already in process',id)
        return;
      }
      // animate here
      $('.loading-overlay',element).classList.add('active')
      try {
        this.uploadingQue.add(id);
        const stat = await API.requestSync({
          cid:collection.cid,
          color:collection.color,
          colors:collection.colors,
          preset: collection.preset,
          presets:collection.presests,
          icons: collection.icons,
        });
        if (stat.success){
          console.log('COLLECTION SYNCED',stat);
          this.uploadingQue.delete(id);
          $('.loading-overlay',element).classList.remove('active')
          $('.sync-success',element).classList.add('active')
          setTimeout(() => {
            element.classList.add('destroy')
            setTimeout(() => {
              element.remove()
            },200)
          },1500)
        }

      } catch(e){
        console.log('error uploading collection')
      }

  }
  async handleDrop(id,element){
      // console.log(id)
      const result = await this.store.dropCollection(id);
      if (result.success){
        console.log('collection dropped!')
        $('.isSyncedContainer',element).remove()
        $('.isSyncedControl').outerHTML = '<div class="opt option-accept">Upload</div><div class="opt option-ignore">Ignore</div>'
      }
  }
  renderLocalCollections(){
    this.uploadedCollections.active = false;
    this.localCollections.render($('.col-2.recent-activity'))
  }
  renderUploadedCollections(){
    this.localCollections.active = false;
    this.uploadedCollections.render($('.col-2.recent-activity'))
  }
  async getHTML() {
    return `<div class="home" location="home">
      <div class="dashboard__header">
        <div class="info-bar">Home</div>
        <div class="tool-bar">
          <a class="home" href="/browse" data-link>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewbox="-3 -2 28 28" height="40px" width="40px" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path d="M19.871 12.165l-8.829-9.758c-0.274-0.303-0.644-0.47-1.042-0.47-0 0 0 0 0 0-0.397 0-0.767 0.167-1.042 0.47l-8.829 9.758c-0.185 0.205-0.169 0.521 0.035 0.706 0.096 0.087 0.216 0.129 0.335 0.129 0.136 0 0.272-0.055 0.371-0.165l2.129-2.353v8.018c0 0.827 0.673 1.5 1.5 1.5h11c0.827 0 1.5-0.673 1.5-1.5v-8.018l2.129 2.353c0.185 0.205 0.501 0.221 0.706 0.035s0.221-0.501 0.035-0.706zM12 19h-4v-4.5c0-0.276 0.224-0.5 0.5-0.5h3c0.276 0 0.5 0.224 0.5 0.5v4.5zM16 18.5c0 0.276-0.224 0.5-0.5 0.5h-2.5v-4.5c0-0.827-0.673-1.5-1.5-1.5h-3c-0.827 0-1.5 0.673-1.5 1.5v4.5h-2.5c-0.276 0-0.5-0.224-0.5-0.5v-9.123l5.7-6.3c0.082-0.091 0.189-0.141 0.3-0.141s0.218 0.050 0.3 0.141l5.7 6.3v9.123z">
                  </path>
              </svg>
          </a>
          <!-- MAIN LOGO -->
            <div class="logo">
                <!--?xml version="1.0" encoding="utf-8"?-->
                <!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve" height="64px" width="64px">
                    <path d="M8.667,15h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,15,8.667,15z"></path>
                    <path d="M8.667,37h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,37,8.667,37z"></path>
                    <path d="M8.667,26h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,26,8.667,26z"></path>
                    </svg>
            </div>
            <div class="search passive-search active">
                <div class="search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" height="16px" width="16px">
                        <path fill-rule="evenodd" d="M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z"></path></svg>
                </div>
                <input class="active" type="text" placeholder="Search">
            </div>
            <div class="filter filter-modal">
            <div class="btn-cancel">
                <span class="icon">
                    <svg width="24px" height="24px" viewBox="4 5 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lw6ve6-01IHH09U9UOO">
                        <path d="M8.46447 15.5355L15.5355 8.46446" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" pid="m4lw6ve6-01JPIXJRA2BQ" fill="null"></path>
                        <path d="M8.46447 8.46447L15.5355 15.5355" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" pid="m4lw6ve6-00079WQ8XYP0" fill="null"></path>
                    </svg>
                </span>
                <span class="label">cancel search</span>
            </div>
        </div>
          </div>
        </div>
        <div class="dashboard__modal">
          <div class="cosm search-cosm"></div>
          <div class="local-preview"></div>
          <div class="db-res">
          <div class="col">
            <div class="info-panels">
              <div class="m-stat stat-widget local-status-widget">
                <div class="status-widget panel stat-container">
                  <div class="db-stat panel-stat">
                    <span class="label">database status : </span>
                    <span class="stat">...loading</span>
                  </div>
                  <div class="local-stat panel-stat">
                    <span class="label">local collection status : </span>
                    <span class="stat">...loading</span>
                  </div>
                </div>

              </div>
              <div class="l-stat stat-widget local-sync-widget">
                <div class="last-sync panel stat-container">
                  <div class="task-data panel-stat">
                    <span class="label">Last Sync: </span>
                    <span class="stat">...Loading</span>
                  </div>
                </div>
              </div>
              <div class="t-stat stat-widget icon-data-widget">
                <div class="collections-found stat-container panel">
                  <div class="total">
                    <span class="label">Total Icons</span>
                    <span class="stat">... checking local size</span>
                  </div>
                  <div class="collections-found">
                    <span class="label">Collections Found</span>
                    <span class="stat">... compiling collections</span>
                  </div>
                </div>

              </div>
              <div class="c-stat stat-widget connection-widget">
                <div class="connection-element stat-container panel">
                  <div class="test-connection">
                    <div class="conn-stat">
                      <span class="label">Internet Connection</span>
                      <span class="stat"> ... checking connection</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div class="control-panels">
              <div class="control-tab">
                  <span class="tab" tab="messages">Messages</span>
                  <span class="tab active" tab="settings">Settings</span>
              </div>
              <div class="control-panel">

                <div class="panel server-messages" panel="messages">
                  <div class="message">Not yet configured</div>
                </div>
              
                <div class="panel app-settings active" panel="settings">
                  <div class="app-setting">
                    <div class="setting setting-label">Target Directories:</div>
                    <div class="setting setting-value">< default path ></div>
                    <div class="setting setting-action btn-add-target">add</div>
                  </div>
                  <div class="app-setting">
                    <div class="setting setting-label">Monitor Status : </div>
                    <div class="setting setting-value">on</div>
                    <div class="setting setting-valeu">off</div>
                  </div>
                  <div class="app-setting">
                    <div class="setting setting-label">Monitor Paths : </div>
                    <div class="setting setting-value">all < targets > | </div>
                    <div class="setting setting-value">select < targets > | </div>
                    <div class="setting setting-value">none</div>
                  </div>

                  <div class="app-directive">Delete Downloads</div>
                  <div class="app-directive">Delete Uploads</div>
                  <div class="app-directive">Delete Projects</div>
                  <div class="app-directive">Delete All Data</div>
                  
                </div>
              </div>



            </div>
          </div>

          <div class="col col-2 recent-activity">

          </div>

          </div>
        </div>
      </div>

    </div>
    `
  }
}
