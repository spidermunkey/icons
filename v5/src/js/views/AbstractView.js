export class AbstractView {
  constructor() {
    this.once = false;
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
