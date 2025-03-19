export class ClientSideSocketServer extends EventEmitter {
  constructor(host = 'ws://localhost:1279') {
    this.shouldReconnect = true;
    this.max_retry_attempts = 5;
    this.retry_attempts = 0;
    this.reconnecting = false;
    this.socket = this.createWebSocket();
    this.notifications = [];
    this.notifier = new EventEmitter();
    this.host = host;
  // emitter 
  }

  createWebSocket() {
    this.cancelReconnect()

    try {
      let sock = new WebSocket(this.host);
      sock.onopen = this.handleConnection.bind(this);
      sock.onmessage = this.parseMessage.bind(this);
      sock.onclose = this.handleDisconnect.bind(this);
      sock.onerror = (err) => {
        console.error('WebSocket error:', err);
        this.handleDisconnect();
      };
      console.log('Scanner Ready For Updates');
      return sock;
    } catch(e) {
      console.warn(e);
    }

  }

  sendMessage(message) {
    if (this.socket)
      try {
        this.socket.send(message); 
      } catch(e){
        console.warn('error sending message: ',e)
      }
  }

  async parseMessage(event) {
    try {
      const notification = JSON.parse(event.data);
      this.notify('message',notification)
      console.log('incomming: ',notification);
      switch (type){
        case 'new entry' : console.log('new entry', data )
        default : console.log('incomming: ',notification);
      }
      this.notifications.push(notification)
      this.notifier.notify('new entry',notification);
    } catch(e) {
        console.error(e);
      }
  }

  cancelReconnect() {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.close();
    }
  }

  handleConnection() {
    this.sendMessage('Client Connected');
    this.reconnecting = false;
    this.retry_attemps = 0;
  }

  handleDisconnect(event){
    if (this.reconnecting) 
      return;
    this.reconnecting = true; // Set the flag to indicate the reconnection logic is running

    // event.wasClean 
    //   ? console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`)
    //   : console.log('WebSocket connection closed abruptly');

    if (this.shouldReconnect && this.retry_attempts < this.max_retry_attempts) {
        const timeout = Math.min(1000 * Math.pow(2, this.retry_attemps), 30000); // Exponential backoff
        console.log(`Attempting to reconnect in ${timeout / 1000} seconds...`);
        setTimeout(this.createWebSocket.bind(this), timeout);
        this.retry_attempts++;
    }
  }
}
