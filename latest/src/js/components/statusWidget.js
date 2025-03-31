import { API } from "../api"
export class StatusWidget {
  constructor(store){
    this.store = new Task(API.getStatus.bind(API))
    this.store.ondata((data) => {
      this.parseData.call(this,data)
      console.log('application status...')
      console.dir(data)
    })
    this.store.getData()

  }

  parseData(data){
    this.updateAll(data)
  }
  updateAll(data){
    const {local_size,local_collections,last_change,db_status,local_status,connection,targets} = data;
    console.log(targets)
    $('.db-stat .stat').innerHTML = `${db_status}${db_status === 'online'
      ? '<span class="divider stat-sym isSync"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
      : '<span class="divider stat-sym"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
    }`
    $('.local-stat .stat').innerHTML = `${local_status}${local_status === 'online'
      ? '<span class="divider stat-sym isSync"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
      : '<span class="divider stat-sym"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
    }`
    $('.last-sync .stat').innerHTML = last_change
    $('.total .stat').innerHTML = local_size
    $('.stat-container .collections-found .stat').innerHTML = local_collections
    $('.conn-stat .stat').innerHTML = `${connection ? 'online' : 'offline'}${connection
      ? '<span class="divider stat-sym isSync"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
      : '<span class="divider stat-sym"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -16 42 42" height="16px" width="16px"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg></span>'
    }`
    $('.panel .settings-overlay .file-targets').innerHTML = `${targets.reduce((accumulator,reducer) => {
      const html = accumulator + `
      <div class="file-target">
        <div class="file-handle">
          ${reducer} 
        </div>
        <div class="ft-controls">
          <span class="btn-ft btn-scan-target">scan</span>
          <span class="btn-ft btn-watch-target">watch</span>
          <span class="btn-ft btn-delete-target">delete</span>
        </div>
      </div>`
      return html
    },'')}`
  }
  render(destination){
    destination.innerHTML = this.getHTML()
    this.store.getData();
  }
  getHTML(){
    return `
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
                  <div class="btn-scan">Scan Target Directories</div>
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
    `
  }
}
