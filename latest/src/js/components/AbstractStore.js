import { Task } from "../utils/Task";
import { EventEmitterClass } from "../utils/EventEmitter";
export class AbstractStore extends EventEmitterClass {
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
    if (this.data == null)
      this.task.run();
    else this.task.emit('ready',this.task.data)
  }
  onload(listener){
    this.task.onload(listener)
  }
  onready(listener){
    this.task.onready(listener)
  }
  ondata(listener){
    this.task.onready(listener)
    if (this.data !== null)
      listener(this.data)
  }

}
