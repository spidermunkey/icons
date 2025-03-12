import { Home } from "./views/home/index.js";
import { Dashboard } from "./views/dashboard/index.js";
import { EventEmitterClass } from "./utils/EventEmitter.js";
import { SvgModel } from "./store.js";
export class App extends EventEmitterClass {
    constructor() {
        super();
        this.store = new SvgModel();
        this.dashboard = new Dashboard(this.store);
        this.home = new Home(this.store);
        this.routes = [
            {path: '/home', view: this.home},
            {path: '/browse', view: this.dashboard
            }];
        this.activeView = null;
        window.addEventListener('popstate',this.route.bind(this));
        window.app = this;
    }
    route(url = window.location.pathname) {
        // let path = window.location.pathname;
        const {root,subpath} = this.subpath(url)
        console.log(root,subpath)
        let target = this.routes.find(route => `/${root}` === route.path);
        if (!target) target = this.routes[0] // home
        let view = target.view;
        view.ready = this.ready;
        if (this.activeView) this.activeView.notify('inactive')
        this.activeView = view;
        this.activeView.notify('active');
        view.render(subpath);
        return view;
      }
    navigateTo(url){
        history.pushState(null,null,url);
        this.route(url);
    }
    
    subpath(url) {
      // Example: '/path/subpath' -> 'subpath'
      console.log(url)
      const pathname = new URL(url, window.location.origin).pathname;
      const pathSegments = pathname.split('/').filter(segment => segment.length > 0);
      const root = pathSegments[0]
      const subpath = pathSegments[1]
      return {
        root: root ? root : '',
        subpath: subpath ? subpath : '',
      }
      // return pathSegments.length > 1 ? pathSegments[1] : ''; // Default to '' if no subpath
    }
    async init() {
        document.body.addEventListener("click", (e) => {
          const link = e.target.closest('[data-link]')
            if (link) {
              e.preventDefault();

              const location = link.getAttribute('href');
              console.log('link',link)
              console.log('location',location)
              console.log(this.subpath(location))
              console.log(new URL(location, window.location.origin));
              this.navigateTo(location);
            }
          })
        this.route();
    }
    async render() {

    }
}
