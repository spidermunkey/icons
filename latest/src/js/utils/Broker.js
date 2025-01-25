import { Task } from "../utils/Task";
import { EventEmitterClass } from "../utils/EventEmitter";
export class Broker extends EventEmitterClass {
  constructor(task, {
    name,
    min,
    max, 
  }){
    super();
    
    this.name = name;
    this.min = min || 3000;
    this.max = max || null;

    this.task = new Task(task,this.min,this.max)
    this.status = null;
    this.data = null;
    this.onload(() => this.ready = false)
    this.onready(() => this.ready = true)
  }
  getData = async () => {
    console.log('running task',this.name)
    this.task.run();
  }
  onload(listener){
    this.task.onPending(listener)
  }
  onready(listener){
    this.task.onReady(listener)
  }
  ondata(listener){
    this.task.onReady(listener)
    if (this.data !== null)
      listener(this.data)
  }

}
