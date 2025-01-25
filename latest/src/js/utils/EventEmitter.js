import { Observable } from "./Observable";

export function EventEmitter(events){

  this.events = events || new Map();

  this.on = (event, ...listeners) => {
    if (!this.events.has(event)) this.events.set(event, new Observable());
    listeners.forEach((listener) => this.events.get(event).subscribe(listener));
  };

  this.once = (event, listener) => {
    const singleton = (...args) => {
      listener(...args);
      this.off(event, singleton);
    };
    this.on(event, singleton);
  };
  this.off = (event, listener) => {
    if (!this.events.has(event)) return;
    this.events.get(event).unsubscribe(listener);
  };
  this.clear = (event) => {
    if (this.events.has(event)) return;
    this.events.set(event, new Observable());
  };

  this.notify = (event, ...args) => {
    if (!this.events.has(event)) return;
    this.events.get(event).notify(...args);
  }
}
export class EventEmitterClass {
    constructor(events) {
      this.events = events || new Map();
    }
    on(event, ...listeners) {
      if (!this.events.has(event)) this.events.set(event, new Observable());
  
      listeners.forEach((listener) => {
        this.events.get(event).subscribe(listener);
      });
    }
    once(event, listener) {
      const singleton = (...args) => {
        listener(...args);
        this.off(event, singleton);
      };
      this.on(event, singleton);
    }
    off(event, listener) {
      if (!this.events.has(event)) return;
      this.events.get(event).unsubscribe(listener);
    }
    clear(event) {
      if (this.events.has(event)) return;
      this.events.set(event, new Observable());
    }
    notify(event, ...args) {
      if (!this.events.has(event)) return;
      this.events.get(event).notify(...args);
    }
    static create(object,events){
      object.events = events || new Map();
      object.on = this.on.bind(object);
      object.once = this.once.bind(object);
      object.off = this.off.bind(object);
      object.clear = this.clear.bind(object);
      object.emit = this.emit.bind(object);
      return object;
    }
  }
