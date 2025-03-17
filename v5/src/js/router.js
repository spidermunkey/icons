export class Router {
  constructor(routes){
    this.routes = routes;
  }
  match(path = Window.location.pathname) {
    return this.routes.find(route => path === route.path)
  }
  route(path) {
    let target = this.match(path);
    if (!target) 
      target = this.routes[0] // home
    
    let view =
      target.once
      ? target.view
      : new target.view()

      return view;

  }
  navigateTo(url){
    history.pushState(null,null,url);
    route();
  }
  async renderView(target){
    await view.render(target)
  }
}
