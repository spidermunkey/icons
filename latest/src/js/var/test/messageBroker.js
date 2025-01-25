import { ClientSideSocketServer } from "./socket_server";
import { EventEmitterClass } from "../../utils/EventEmitter";

export class ClientSideSocketServer extends EventEmitterClass {
  constructor(){
    super();
    this.shouldReconnect = true;
    this.max_retry_attempts = 5;
    this.retry_attempts = 0;
    this.reconnecting = false;
    this.socket = this.createWebSocket();
  }
  createWebSocket() {
    this.cancelReconnect()
    try {
      let sock = new WebSocket('ws://localhost:1279');
      sock.onopen = this.handleConnection.bind(this);
      sock.onmessage = this.parseMessage.bind(this);
      sock.onclose = this.handleDisconnect.bind(this);
      sock.onerror = (err) => {
        console.error('WebSocket error:', err);
        this.handleDisconnect();
      };
      this.notify('connection')
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
  parseMessage(event){
    const notification = event.data;
    this.notify('message',event);
  }
  handleConnection(){
    // this.sendMessage('ready');
    this.reconnecting = false;
    this.retry_attemps = 0;
    this.notify('connection');
  }
  handleDisconnect(){
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.close();
    }
    this.notify('disconnected',this.socket)
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
        // console.log(`Attempting to reconnect in ${timeout / 1000} seconds...`);
        this.notify('retry',timeout)
        setTimeout(this.createWebSocket.bind(this), timeout);
        this.retry_attempts++;
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
    this.notify('interupt')
  }
}

