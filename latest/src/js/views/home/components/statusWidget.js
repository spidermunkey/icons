import { API } from "../../../api"
import { Task } from "../../../utils/Task"
export class StatusWidget {
  constructor(){
    this.store = new Task(API.getStatus.bind(API))
    this.store.ondata((data) => {
      this.parseData.call(this,data)
    })
    this.store.getData()
  }
  parseData(data){
    this.updateAll(data)
  }
  updateAll(data){
    const {local_size,local_collections,last_change,db_status,local_status,connection} = data;
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
  }
}
