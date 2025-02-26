import { AbstractView } from "../../components/AbstractView.js";
import { 
  TestConnectionElement, 
  TotalIconsElement,
  AppStatusElement,
  LastSyncElement,
  AppStatusWidgetElement 
} from "./components/statusWidget";
import { RecentDownloads } from "./components/recentIconWidget.js";
import { UploadSection } from "./components/uploadedIconWidget.js";
import { API } from "../../api.js";

export class Home extends AbstractView {
  constructor(){
    super();
    this.statusWidget = new AppStatusWidgetElement();
    this.appstat = new AppStatusElement();
    this.lastSync = new LastSyncElement();
    this.TotalIcons = new TotalIconsElement();
    this.testconnection = new TestConnectionElement();
    this.localCollections = new RecentDownloads();
    this.uploadedCollections = new UploadSection();
    this.uploadingQue = new Set();
    this.on('inactive',() => {
      this.localCollections.active = false;
      this.uploadedCollections.active = false;
    })
    this.on('upload', async (id) => {
      if (this.uploadingQue.has(id)){
        console.warn('upload already in process',id)
        return;
      }
      console.log('uploading.....',id)
      // animate here
      this.uploadingQue.add(id);
      const stat = await API.requestSync({cid:id});
      console.log('COLLECTION SYNCED',stat);
      this.uploadingQue.delete(id);
    })
    this.on('ignore',(data) => {
      this.broker.sendMessage(JSON.stringify({
        type: 'ignore',
        data,
      }))
      console.log('message sent');
    })
    this.hydrate()
  }

  async render(){
    $('#app').innerHTML = ''
    $('#app').innerHTML = await this.getHTML();
    this.lastSync.render($('.l-stat'));
    this.TotalIcons.render($('.t-stat'));
    this.testconnection.render($('.c-stat'));
    this.appstat.render($('.m-stat'));
    this.localCollections.render($('.col-2.recent-activity'));
    $('.db-res').classList.add('active');
    // $('.test-area').addEventListener('click',this.handleSync.bind(this))
  }

  async hydrate() {
    $('#app').addEventListener('click',async (e) => {
      if (!this.active){
        return;
      }
      console.log('CLICK HANDLING')
        // handle upload
        let upload = e.target.closest('.recent-collection .option-accept');
        let ignore = e.target.closest('.recent-collection .option-ignore');
        let downloadsTab = e.target.closest('.rt-downloads');
        let uploadedTab = e.target.closest('.rt-uploads');
        if (upload){
          let collection = e.target.closest('.recent-collection')
          console.trace('uploading collection',collection)
          let id = collection.getAttribute('cid');
          collection.
          this.notify('upload',id)
        }
        else if (ignore) {
          let collection = e.target.closest('.recent-collection');
          console.log('ignoring collection',collection);
          let id = collection.getAttribute('cid');
          const stat = await API.requestIgnore({cid:id});
          console.log('IGNORE PROCESS COMPLETE', stat);
        } // handle tabs 
        else if (downloadsTab){
          this.renderLocalCollections()
        } else if (uploadedTab){
          this.renderUploadedCollections()
        }
    })
  }
  async handleSync(event){
      let target = e.target;
      if (!target.closest('.recent-collection')) return;
      let accept = target.closest('.option-accept');
      let ignore = target.closest('.option-ignore');
      if (accept){
        let collection = e.target.closest('.recent-collection')
        console.trace('uploading collection',collection)
        let id = collection.getAttribute('cid');
        // const stat = await API.requestSync({cid:id});
        console.trace('SYNC PROCESS COMPLETE');
      } else if (ignore) {
        let collection = e.target.closest('.recent-collection');
        console.log('ignoring collection',collection);
        let id = collection.getAttribute('cid');
        const stat = await API.requestIgnore({cid:id});
        console.log('IGNORE PROCESS COMPLETE', stat);
      }
  }
  renderLocalCollections(){
    this.uploadedCollections.active = false;
    this.localCollections.renderHTML($('.col-2.recent-activity'))
  }
  renderUploadedCollections(){
    this.localCollections.active = false;
    this.uploadedCollections.renderHTML($('.col-2.recent-activity'))
  }
  showUploadingAnimation(cid){

  }
  async getHTML() {
    return `<div class="dashboard" location="home">
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
          </div>
        </div>
        <div class="dashboard__modal">
          <div class="search-cosm"></div>
          <div class="collection-preview"></div>
          <div class="db-res">
          <div class="col">
            <div class="info-panels">
              <div class="m-stat">
              </div>
              <div class="l-stat">
              </div>
              <div class="t-stat">
              </div>
              <div class="c-stat">
              </div>
            </div>

            <div class="control-panels">
              <div class="control-tab">
                  <span class="tab active">Messages</span>
                  <span class="tab">Settings</span>
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
