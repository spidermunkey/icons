import { Notifier } from "../var/notify.js";
import { ClientSideSocketServer } from "./client_server.js";

export class Scanner {
  constructor() {
    this.socket = new ClientSideSocketServer();
    this.notifier = new Notifier();
    this.socket.notifier.on('new entry', (...args) => this.notifier.notify('new entry', args));
    
  }
  async getStatus(){
    const status = await axios.get('http://localhost:1279/icons/local/status');
    console.log('[[status]]', status.data);
  }
}
