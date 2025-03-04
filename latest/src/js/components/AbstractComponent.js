import { EventEmitterClass } from "../utils/EventEmitter";
export class AbstractComponent extends EventEmitterClass {
  constructor({ tag , classList , html, properties, events }){
    super();
    this.html = html ? html : ''
    this.element = document.createElement(tag ? tag : 'div');
    this.classList = classList ? classList : [];
    this.props = properties ? properties : {};
    this.events = events ? events : new Map();
    this.element.classList.add(...this.classList);
    this.element.innerHTML = this.html;
    this.on('ready', data => this.element.innerHTML = this.parseData(data))
    this.on('loading',() => this.element.innerHTML = this.getLoader())
    for (const event in this.events)
      this.on(event,events[event].bind(this))
  }
  parseData(data) {
    console.log('data parsed', data)
  }
  getLoader() {
    return '<div class="loader">...loading</div>'
  }
  insert(destination) {
    destination.appendChild(Node.cloneNode(this.element));
    return destination;
  }
  render(destination){
    destination.appendChild(this.element);
    this.notify('render')
  }
  renderHTML(destination){
    destination.innerHTML = this.getHTML();
    this.notify('render')
  }
  getHTML(){
    return this.element.outerHTML
  }
}
