import { AppStatus } from "../statusBroker.js";
import { AbstractComponent } from "../../../components/AbstractComponent.js"; 

const appStatusWidgetElementProperties = {
    tag: 'div',
    classList: ['status-widget','panel'],
}

const lastSyncElementProperties = {
    tag: 'div',
    classList: ['last-sync','panel'],
}

const collectionsFoundElementProperties = {
  tag: 'div',
  classList: ['collections-found','panel'],
  html: `<div class="load">...loading</div>`
}

const connectionElementProperties = {
  tag: 'div',
  classList: ['connection-element', 'panel'],
  html: '<div class="connection-status"><span class="label">internet connection</span><span class="stat">...checking connection</span></div>'
}

class StatusComponent extends AbstractComponent {
  constructor(props) {
    super(props)
    if (AppStatus.data == null)
      AppStatus.getStatus();
    AppStatus.onload(this.notify.bind(this,'loading'));
    AppStatus.onready(this.notify.bind(this,'ready'));
    this.task = AppStatus.task;
  }

  reload() {
    if (!this.destination || !this.once)
      return;
    this.task.run();
  }
}

export class AppStatusWidgetElement extends StatusComponent {
  constructor(destination) {
    super(appStatusWidgetElementProperties)
    this.destination = destination;
    if (this.destination)
      this.render(this.destination)
  }

  parseData(data) {
    const status = data
    const { db_status, local_status, last_change, local_size, message , local_collections} = status;
    const html = `
    <div class="db-stat">
      <span class="label">database status</span>
      <span class="stat">${db_status}</span>


      </div>
    <div class="local-stat">
      <span class="label">local collection status</span>
      <span class="stat">${local_status}</span>
    </div>
  <div class="last-sync">
    <span class="label">last sync</span>
    <span class="stat">${last_change}</span>
  </div>
  <div class="local-size">
    <span class="label">local icons found</span>
    <span class="stat">${local_size}</span>
  </div>
  <div class="local-collections">
    <span class="label">local collections found</span>
    <span class="stat">${local_collections}</span>
  </div>
  <div class="connection-status">
    <span class="label">internet connection</span>
    <span class="stat">${navigator.onLine ? 'online' : 'offline' }</span>
    </div>`
    // this.element.innerHTML = html;
    return html
  }
}

export class LastSyncElement extends StatusComponent {
  constructor(destination){
    super(lastSyncElementProperties);
    this.destination = destination;
    if (this.destination)
      this.render(this.destination)
  }

  getLoader() {
    return `
      <div class="task-data">
        <span class="label">Last Sync : </span>
        <span class="stat">...loading</span>
      </div>
    `
  }
  parseData(data){
    return `
        <div class="task-data">
          <span class="label">Last Sync</span>
          <span class="stat">${data.last_change}</span>
        </div>
        <div class="btn-sync">Sync Local Updates</div>
    `
  }
}

export class TotalIconsElement extends StatusComponent {
  constructor(destination) {
    super(collectionsFoundElementProperties);
    this.destination = destination;
    if (this.destination)
      this.render(this.destination)
  }

  getLoader(arg) {
    return `<div class="load">
    ...loading
    </div>`;
  }
  
  parseData(data){
    const {local_size,local_collections} = data;
    return `
        <div class="total">
          <span class="label">Total Icons</span>
          <span class="stat">${local_size}</span>
        </div>
        <div class="collections-found">
          <span class="label">Collections Found</span>
          <span class="stat">${local_collections}</span>
        </div>
        <div class="btn-update">
          <span>Upload</span>
        </div>
    `
  }
}

export class TestConnectionElement extends StatusComponent {
  constructor(destination){
    super(connectionElementProperties)
    this.destination = destination;
    if (this.destination)
      this.render(destination);
  }
  parseData(data){
    return `<div class="test-connection"><div class="conn-stat"><span class="label">Internet Connection</span><span class="stat">${data.connection ? 'online' : 'offline'}${data.connection
      ? '<span class="divider stat-sym isSync"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
      : '<span class="divider stat-sym"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
    }</span></div></div>`
  }
}

export class AppStatusElement extends StatusComponent {
  constructor(destination){
    super({
      tag:'div',
      classList:['app-status','panel']
    })
  }

  parseData(data) {
    return `
      <div class="db-stat">
        <span class="label">database status</span>
        <span class="stat">${data.db_status}${data.db_status === 'online'
          ? '<span class="divider stat-sym isSync"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
          : '<span class="divider stat-sym"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
        }</span>
      </div>
      <div class="local-stat">
        <span class="label">local collection status</span>
        <span class="stat">${data.local_status}${data.local_status === 'online'
          ? '<span class="divider stat-sym isSync"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
          : '<span class="divider stat-sym"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
        }</span>

    </div>`
  }
    getLoader() {
      return `
        <div class="db-stat">
        <span class="label">database status : </span>
        <span class="stat">...loading</span>
      </div>
      <div class="local-stat">
        <span class="label">local collection status : </span>
        <span class="stat">...loading</span>
      </div>

      `
    }
}


// export function AppStatusElement(destination) {
//   this.destination = destination;
//   this.element = document.createElement('div');
//   this.element.classList.add('app-status');
//   this.getLoading = getLoading;

//   if (this.destination)
//     this.renderHTML(this.destination)

//   AppStatus.onload(this.events.notify.bind(this,'loading'))
//   AppStatus.onready(this.events.notify.bind(this,'ready'))

//   this.events.on('loading',function onPending(){
//     console.log(this)
//     this.element.innerHTML = this.getLoading();
//   }.bind(this))

//   this.events.on('ready',function onReady(data){
//     this.element.innerHTML = parseData(data);
//     console.log(data,this.element.innerHTML)
//   }.bind(this))

//   function getLoading() {
//     return `
//     <div class="db-stat">
//       <span class="label">database status : </span>
//       <span class="stat">...loading</span>
//     </div>
//     <div class="local-stat">
//       <span class="label">local collection status : </span>
//       <span class="stat">...loading</span>
//     </div>
//     `
//   }

//   this.renderHTML = (destination = this.destination) => destination.appendChild(this.element);

//   function parseData(data) {
//     return `
//     <div class="app-status panel">
//       <div class="db-stat">
//         <span class="label">database status : </span>
//         <span class="stat">${data.db_status}</span>
//       </div>
//       <div class="local-stat">
//         <span class="label">local collection status : </span>
//         <span class="stat">${data.local_status}</span>
//       </div>
//     </div>
//     `

//   }
//   this.renderLoading = () => {
//     this.html = ''
//   }
// }

// export function StatusWidget() {
//     this.element = document.createElement('div');
//     this.element.classList.add('status-widget');
//     this.data = null;
//     this.status = null;

//     AppStatus.onload(renderLoading.bind(this));
//     AppStatus.onready(parseData.bind(this));

//     this.renderLoading = renderLoading;

//     function renderLoading(){
//       console.log('render loading')
//       this.element.innerHTML = '...loading';
//     }

//     this.insert = (destination) => {
//       console.log('insert')
//       destination.append(this.element);
//       return destination;
//     }

//     this.parseData = (data) => {
//       // console.log(resData)
//       console.log('parsing data')
//       const status = data
//       console.log(status);
//       const { db_status, local_status, last_change, local_size, message , local_collections} = status;
      
//       this.element.innerHTML = `
//         <div class="db-stat">
//           <span class="label">database status : </span>
//           <span class="stat">${db_status}</span>
//         </div>
//         <div class="local-stat">
//           <span class="label">local collection status : </span>
//           <span class="stat">${local_status}</span>
//         </div>
//       <div class="last-sync">
//         <span class="label">last sync : </span>
//         <span class="stat">${last_change}</span>
//       </div>
//       <div class="local-size">
//         <span class="label">local icons found : </span>
//         <span class="stat">${local_size}</span>
//       </div>
//       <div class="local-collections">
//         <span class="label">local collections found : </span>
//         <span class="stat">${local_collections}</span>
//       </div>
//       <div class="connection-status">
//         <span class="label">internet connection : </span>
//         <span class="stat">${navigator.onLine ? 'online' : 'offline' }</span>
//       </div>
//       `
//     }

//     this.reload = () => {
//       if (!this.destination || !this.once)
//         return;
//       this.task.run();
//     }

//     this.render = async (destination) => {
//       this.destination = destination;
//       this.insert(destination)
//       await AppStatus.getStatus()
//       if (!this.once)
//         this.once = true;
//       this.destination = destination
//       console.log('element',this.element)
//       return this.element;
//     }
    
//     function renderLoading() {
//         this.element.innerHTML = '...loading';
//     }

//     function parseData(resData) {
//       console.log('parsing data')
//       const status = resData
//       console.log(status);
//       const { db_status, local_status, last_change, local_size, message , local_collections} = status;
//       this.element.innerHTML = `
//         <div class="db-stat">
//           <span class="label">database status : </span>
//           <span class="stat">${db_status}</span>
//         </div>
//         <div class="local-stat">
//           <span class="label">local collection status : </span>
//           <span class="stat">${local_status}</span>
//         </div>
//       <div class="last-sync">
//         <span class="label">last sync : </span>
//         <span class="stat">${last_change}</span>
//       </div>
//       <div class="local-size">
//         <span class="label">local icons found : </span>
//         <span class="stat">${local_size}</span>
//       </div>
//       <div class="local-collections">
//         <span class="label">local collections found : </span>
//         <span class="stat">${local_collections}</span>
//       </div>
//       <div class="connection-status">
//         <span class="label">internet connection : </span>
//         <span class="stat">${navigator.onLine ? 'online' : 'offline' }</span>
//       </div>
//       `
//     }

//     return this;
// }
