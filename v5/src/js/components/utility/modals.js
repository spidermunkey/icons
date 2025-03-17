class EventEmitter {
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

  emit(event, ...args) {
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
class Modal extends EventEmitter {
  constructor(element) {
    this.togglers = new Set();
    this.openers = new Set();
    this.closers = new Set();
    this.cosm = undefined;
    this.state = "inactive";

    this.on('open', () => {
      this.element.classList.add('active');
      this.state = "active";
    })
    this.on('close',() => {
      this.element.classList.remove('active');
      this.state = "active";
    })
  }
  notify(event) {
    this.emit(event)
  }
  open() {
    this.notify('open')
  }
  close() {
    this.notify('close');
  }
  toggle() {
    if (this.state == "inactive") this.open();
    else if (this.state == "active") this.close();
    else console.log("err something went wrong with the modal toggler");
  }
  bindToggler(...elements){
    elements.forEach((element) => {
      if (this.togglers.has(element))
        return `${element} is already bound as a toggler`;
      this.togglers.add(element);
      element.addEventListener("click", (e) => this.toggle.call(this, e));
    })
  }
  bindOpener(...elements) {
    elements.forEach((element) => {
      if (this.openers.has(element))
        return `${element} is already bound as a opener`;
      this.openers.add(element);
      element.addEventListener("click", (e) => this.open.call(this, e, true));
    });
  }
  bindCloser(...elements) {
    elements.forEach((element) => {
      // console.log(element)
      if (this.closers.has(element))
        return `${element} is already bound as a closer`;

      this.closers.add(element);
      element.addEventListener("click", (e) => this.close.call(this, e));
    });
  }
}
class DynamicModal extends Modal {
  constructor( {
    element,
    suspense = `<div class="loading-container"><span class="loader"></span></div>`,
    error = `<div>Error Fetching Resources</div>`,
  } ) {
    super(element);
    this.suspense = suspense;
    this.errRes = error;

    this.ready = false;
    this.pending = false;
    this.hasChanged = false;
    this.initial = true;
    this.value = "";
  }
  setReady() {
    this.pending = false;
    this.ready = true;
    if (this.initial) this.inital = false;
    return;
  }
  setPending() {
    this.pending = true;
    this.ready = false;
    return;
  }
  async update() {
    this.value = this.suspense;
    this.setPending();
    this.renderSuspense();
    if (res) {
      console.log(res)
      this.renderComponent(res);
      this.setReady();
    } else {
      this.renderError();
      this.setReady();
    }
    return this.value;
  }
  getData() {
    if ((this.ready && !this.hasChanged) || this.pending) return this.value;
    this.update();
    return this.value;
  }
  notifyChange() {
    if (this.type === "lazy") {
      console.log("flagging change -- type lazy");
      this.hasChanged = true;
    }
    if (this.type === "eager") {
      console.log("flagging change -- type eager");
      this.update();
    }
  }
  checkForUpdatesToRender() {
    console.log("checking for dynamic modal updates");
    if ((this.ready && !this.hasChanged) || this.pending) {
      console.log("no changes detected in dynamic modal");
      return true;
    }
    if (this.hasChanged) {
      console.log("data has changed fetching changes");
      this.update();
      this.hasChanged = false;
      return false;
    } else if (this.initial) {
      console.log("rendering initial state");
      this.update();
      return false;
    }
  }
  renderSuspense() {
    this.element.innerHTML = this.suspense;
  }
  renderError() {
    this.element.innerHTML = this.errRes;
  }
  renderComponent(data) {
    this.element.innerHTML = this.handleData(data);
    if (this.handleHydration) {
      // console.log('hydrating component')
      this.handleHydration(this.element);
    }
  }
}
