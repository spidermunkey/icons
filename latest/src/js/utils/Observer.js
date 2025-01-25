export class Observer {
  constructor(targetThis) {
    this.Target = targetThis;
    this.subscribers = new Set();
    this.priorities = new Set();
  }

  subscribe(...fns) {
    fns.forEach((fn) => {
      // console.log(fn)
      if (this.Target) fn = fn.bind(this.Target);

      this.subscribers.add(fn);
    });

    return this;
  }

  unsubscribe(fn) {
    this.subscribers.delete(fn);
    return this;
  }

  prioritize(fn) {
    if (this.Target) fn = fn.bind(this.Target);
    this.priorities.add(fn);
  }

  unprioritize(fn) {
    this.priorities.delete(fn);
  }

  notify(...values) {
    for (const fn of this.priorities) {
      if (fn)
        fn(...values);
    }
    for (const fn of this.subscribers) {
      if (fn)
        fn(...values);
    }
  }

  get isEmpty() {
    return this.subscribers.size === 0;
  }

  get hasPriorities() {
    return this.priorities.size > 0;
  }
}
