import { AbstractView } from "./AbstractView";

export default class Home extends AbstractView {
  constructor(){
    super();
  }

  async render(destination){
    this.setTitle("Home");
    this.element = document.createElement("div");
    destination.innerHTML = "";
    destination.appendChild(element);
    this.element = element;
    this.element = setBlank(destination);
    this.element.innerHTML = this.getLoader();
    this.element.innerHTML = await this.getHTML();
  }
  async getHTML(){
    return "";
  }
}
