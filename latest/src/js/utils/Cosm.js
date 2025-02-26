  /*
    selectors -- registered modal class
    -- > clicked out side of modal => close()/handleClose() => notify()

    exceptions -- clicked inside of parent modal but should still notify()
    (closeButton, sibling tab, ...etc)
  */
import { EventEmitterClass } from "./EventEmitter"

export function cosm({selectors,exceptions}){
  return (handler) => {
    document.addEventListener('click',(event) => {
      const clickOutsideRegistered = selectors && Array.isArray(selectors) && !selectors.some(query => event.target.closest(query))
      const clickedException = exceptions && Array.isArray(exceptions) && exceptions.some(query => event.target.closest(query))
      if (clickOutsideRegistered || clickedException) {
          return handler()
      }
  })}
}

export class COSM extends EventEmitterClass {
  constructor({selectors = [], exceptions = [], handler = null} = {}){
    super()
    this.selectors = selectors;
    this.exceptions = exceptions;
    this.handler = handler;
    this.eventHandler = this.eventHandler.bind(this);
    document.addEventListener('click', this.eventHandler);
  }

  eventHandler(event) {
    const clickOutsideRegistered = this.selectors.length > 0 && 
        !this.selectors.some(query => event.target.closest(query));

    const clickedException = this.exceptions.length > 0 ?
        this.exceptions.find(query => event.target.closest(query)) : false

    if (clickOutsideRegistered || clickedException) {
        this.handler && this.handler();
        this.notify('cosm',event,clickedException)
    }
  }
  setHandler(fun){
    this.on('cosm',fun)
  }
  addSelectors(...newSelectors) {
      this.selectors.push(...newSelectors);
  }
  addExceptions(...newExceptions) {
      this.exceptions.push(...newExceptions);
  }
  removeSelectors(...selectors){
      this.selectors = this.selectors.filter(query => !selectors.includes(query))
  }
  removeExceptions(...selectors){
      this.exceptions = this.exceptions.filter(query => !selectors.includes(query))
  }
  remove() {
      document.removeEventListener('click', this.eventListener);
  }
}
