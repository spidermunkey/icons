import {Observer} from './Observer.js'

export class Observable {
  constructor(targetThis, ...fns) {
    this.observer = new Observer(targetThis);
    if (fns)
      fns.forEach(fn => this.observer.subscribe(fn))
  }


  set() {
    this.notify();
    console.log('observer triggered',console.log(this))
  }

  subscribe(...fns) {
    this.observer.subscribe(...fns);
    return this;
  }

  unsubscribe(fn) {
    this.observer.unsubscribe(fn);
    return this;
  }

  prioritize(fn) {
    this.observer.prioritize(fn);
    return this;
  }

  unprioritize(fn) {
    this.observer.unprioritize(fn);
    return this;
  }

  notify(...values) {
    this.observer.notify(...values);
    return this;
  }

  get isEmpty() {
    return this.observer.isEmpty;
  }

  get hasPriorities() {
    return this.observer.hasPriorities;
  }

  get listeners() {
    return this.observer.listeners;
  }
  get priorities() {
    return this.observer.priorities;
  }

  static create(target) {
    return new Observable(target);
  }

  static observe(obj) {
    if (obj != null) {
      Object.assign(obj, {
        subscribe: this.subscribe.bind(obj),
        unsubscribe: this.unsubscribe.bind(obj),
        prioritize: this.prioritize.bind(obj),
        unprioritize: this.unprioritize.bind(obj),
        notify: this.notify.bind(obj),
        subscribe: this.subscribe.bind(obj),
        get isEmpty() {
          return this.observer.isEmpty;
        },
        get hasPriorities() {
          return this.observer.hasPriorities;
        },
      });
      return obj;
    }
  }
}
