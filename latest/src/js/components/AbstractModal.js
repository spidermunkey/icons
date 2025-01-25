   export class Modal {
    // basic modal class that handles open / close / toggle / methods
    // also hooks into the tabber interface to ensure only one modal of a group is open at once
    constructor(element) {
      this.element = element;
      this.openTimeLine = Observable.create(this);
      this.closeTimeLine = Observable.create(this);
      this.togglers = new Set();
      this.openers = new Set();
      this.closers = new Set();
      this.cosm = undefined;
      this.status = "inactive";
    }
  
    set state({ status, event }) {
      if (status == "inactive") this.close(event)
      else this.open(event);
    }
    get state() {
      return this.status;
    }
    open(e) {
      this.element.classList.add('active');
      if (!this.openTimeLine.isEmpty && this.state !== "active")
        this.openTimeLine.notify(e);
      this.status = "active";
    }
    close(e) {
      this.element.classList.remove('active');
      if (!this.closeTimeLine.isEmpty && this.state !== "inactive")
        this.closeTimeLine.notify(e);
      this.status = "inactive";
    }
    toggle(event) {
      if (this.state == "inactive") this.state = { status: "active", event };
      else if (this.state == "active") this.state = { status: "inactive", event };
      else console.log("err something went wrong with the modal toggler");
      return this;
    }
    bindToggler(...elements) {
      // console.dir('BINDING toggle element(s)', elements)
      elements.forEach((element) => {
        if (this.togglers.has(element))
          return `${element} is already bound as a toggler`;
        this.togglers.add(element);
        element.addEventListener("click", (e) => this.toggle.call(this, e));
      });
      return this;
    }
    bindOpener(...elements) {
      elements.forEach((element) => {
        // console.log(element)
        if (this.openers.has(element))
          return `${element} is already bound as a opener`;
        this.openers.add(element);
        element.addEventListener("click", (e) => this.open.call(this, e, true));
      });
      return this;
    }
    bindCloser(...elements) {
      elements.forEach((element) => {
        // console.log(element)
        if (this.closers.has(element))
          return `${element} is already bound as a closer`;
  
        this.closers.add(element);
        element.addEventListener("click", (e) => this.close.call(this, e));
      });
      return this;
    }
    // registers a common Tab Interface between modals of a group
    bindTabber(reference) {
      this.Tabber = reference;
      this.openTimeLine.prioritize(() => this.Tabber.setActive(this));
      return this;
    }
    onOpen(...fns) {
      this.openTimeLine.subscribe(...fns);
      return this;
    }
    onClose(...fns) {
      this.closeTimeLine.subscribe(...fns);
      return this;
    }
  }
