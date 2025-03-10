import { EventEmitter } from "./EventEmitter.js";
export class Task {
  constructor(promiseFn,{ 
    name = '',
    min = 1500,
    max = null,
    onData = [],
    onLoading = [],
    onReady = [],
    poll = null,
  } = {}) {
    this.name = name;
    this.min = min;
    this.max = max;
    this.promise = promiseFn;
    this.state = undefined; // [undefined || loading || ready ]
    this.data = null;
    this.running = false;
    this.task = promiseFn;
    this.emitter = new EventEmitter();
    this.updateNeeded = true;
    onLoading.forEach(listener => this.onload(listener))
    onData.forEach(listener => this.ondata(listener))
    onReady.forEach(listener => this.onready(listener))
    if (poll) setInterval(this.run,poll)
  }
  getData = async (updateNeeded = this.updateNeeded) => {
    if (updateNeeded) this.run()
    else {
      this.emit("ready", this.data);
      return this.data
    }
  }
  run = async (...args) => {
    // handle minimum task interval
    if (this.running === true) return this.data;
    try {
      const minimum_interval_timer = this.min ? new Promise((resolve,reject) => {setTimeout(() => resolve(true),this.min)}) : 0 ;
      this.running = true
      this.state = "loading";
      this.emit("loading");
      this.data = await this.promise(...args);
      if (minimum_interval_timer != 0) await minimum_interval_timer;
      this.state = "ready";
      this.emit("ready", this.data);
      this.updateNeeded = false;
  } catch (error) {
      console.trace(`error running task: ${error}`);
      this.state = "error";
      this.data = null;
      this.emit("error", error);
    } finally {
      this.running = false;
    }
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
    this.on('ready',listener)
  }
  onload(listener){
    this.on('loading',listener);
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
