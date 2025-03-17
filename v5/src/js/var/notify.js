export class Notifier {
  constructor(events) {
    this.events = events || new Map();
  }

  on(event, ...listeners) {
    if (!this.events.has(event)) this.events.set(event, new Observable());
    listeners.forEach((listener) => this.events.get(event).subscribe(listener));
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
}

class Task {
  constructor(promiseFn) {
    this.state = undefined; // [undefined || pending || ready ]
    this.result = undefined;
    this.task = promiseFn;
    this.emitter = new EventEmitter();
  }

  async run(...args) {
    try {
      this.state = "pending";
      this.emit("pending");
      this.result = await promiseFn.call(...args);
      this.state = "ready";
      this.emit("ready", this.result);
    } catch (error) {
      console.error(error);
      this.state = "error";
      this.result = error;
      this.emit("error", error);
    }
  }

  register(event, listener) {
    this.emitter.on(event, listener);
    return this;
  }

  remove(event, listener) {
    this.emitter.off(event, listener);
    return this;
  }

  emit(event, ...args) {
    this.emitter.emit(event, ...args);
    return this;
  }
}
