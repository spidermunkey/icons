import { Home } from "./views/home/index.js";
import { Dashboard } from "./views/dashboard/index.js";
import { EventEmitterClass } from "./utils/EventEmitter.js";
import { SvgModel } from "./store.js";
export class App extends EventEmitterClass {
    constructor() {
        super();
        this.store = new SvgModel();
        this.routes = [
            {path: '/home', view: new Home(this.store)},
            {path: '/browse', view: new Dashboard(this.store)
            }];
        this.activeView = null;
        window.addEventListener('popstate',this.route.bind(this));
    }
    route() {
        let path = window.location.pathname;
        let target = this.routes.find(route => path === route.path);
        if (!target) target = this.routes[0] // home
        let view = target.view;
        view.ready = this.ready;
        if (this.activeView) this.activeView.notify('inactive')
        this.activeView = view;
        this.activeView.notify('active');
        view.render();
        return view;
      }
    navigateTo(url){
        history.pushState(null,null,url);
        console.trace('routing')
        this.route();
    }
    async init() {
        document.body.addEventListener("click", (e) => {
            if (e.target.closest("[data-link]")) {
              e.preventDefault();
              this.navigateTo(e.target.closest("[data-link]").href);
            }
          })
        console.trace('routing')
        this.route();
    }
    async render() {

    }
}
