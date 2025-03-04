import { EventEmitter } from "./EventEmitter.js";
export class Task {
  constructor(promiseFn,{ 
    name = '',
    min = 3000,
    max = null,
    onData = [],
    onPending = [],
    onReady = [],
  }) {
    this.name = name;
    this.min = min;
    this.max = max;
    this.promise = promiseFn;
    this.state = undefined; // [undefined || pending || ready ]
    this.data = null;
    this.task = promiseFn;
    this.emitter = new EventEmitter();
    this.ready = false;
    this.updateNeeded = true;
    onPending.forEach(listener => this.onload(listener))
    onData.forEach(listener => this.ondata(listener))
    onReady.forEach(listener => this.onready(listener))
    this.onload(() => this.ready = false)
    this.onready(() => this.ready = true)
  }
  get loading(){
    return !this.ready
  }
  getData = async () => {
    console.log('running task',this.name)
    if (this.data == null)
      this.run();
    else this.emit('ready',this.data)
  }
  onload(listener){
    this.onPending(listener)
  }
  ondata(listener){
    this.onready(listener)
    if (this.data !== null)
      listener(this.data)
  }

  async run(...args) {
      // console.log('running stat')
      let ready = null;
      if (this.min)
        ready = new Promise((resolve,reject) => {setTimeout(() => resolve(true),this.min)})
      this.state = "pending";
      this.emit("pending");
      this.data = await this.promise(...args);
      this.state = "ready";
      if (ready != null)
        await ready;
      this.emit("ready", this.data);
  } catch (error) {
      console.log('error');
      this.state = "error";
      this.data = null;
      this.emit("error", error);
    // }
  }

  on(event, listener) {
    this.emitter.on(event, listener);
    return this;
  }
  ondata(listener){
    this.onready(listener)
    if (this.data !== null)
      listener(this.data)
  }
  onready(listener){
    // console.log('adding to ready')
    this.on('ready',listener)
  }
  onload(listener){
    // console.log('adding to pending')
    this.on('pending',listener);
  }
  remove(event, listener) {
    this.emitter.off(event, listener);
    return this;
  }
  emit(event, ...args) {
    // console.log(event,args)
    this.emitter.notify(event, ...args);
    return this;
  }
}
