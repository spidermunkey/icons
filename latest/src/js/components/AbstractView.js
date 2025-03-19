export class AbstractView extends EventEmitter {
  constructor(store) {
    super()
    this.store = store
    this.active = false
    this.on('inactive',() => this.active = false)
    this.on('active',() => this.active = true)
  }

  setTitle(title){
    document.title = title;
    $(".app-header .current-tab .label").textContent = title;
    $('#app').setAttribute("location",title);
  }

  getLoader() {
    return `<div class="loader">loading...</div>`;
  }
  async hydrate() {
    console.log("hydrating");
  }
  async getHTML() {
    return "";
  }
}
