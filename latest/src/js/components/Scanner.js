import { ClientSideSocketServer } from "../var/socket_server.js";
export class Scanner {
  constructor() {
    this.socket = new ClientSideSocketServer();
    this.notifier = new EventEmitter();
    this.socket.notifier.on('new entry', (...args) => this.notifier.notify('new entry', args));
  }

  async getStatus(){
    const status = await axios.get('http://localhost:1279/icons/local/status');
    console.log('[[status]]', status.data);
  }
}
