
function Action(func,cond){
 return {
    action: [func],
    condition: cond != undefined && typeof cond === "function" ? cond : function(){return true},
    run(){
      if (typeof this.condition === 'function' && this.condition()){
        this.action.forEach(fun => fun())
      }
    }
  }
}

export class Delegator {
  constructor(element = document){
    element.addEventListener('click',this.delegate.bind(this))
    this.targets = new Set()
    this.actions = {}
  }
  delegate(event){
    this.targets.forEach(cls => {
      if (event.target.closest(cls) && this.actions[cls]){
        this.actions[cls].run()
      }
    })
  }
  add(className,func,conditional){
    if (this.actions[className]) {
      this.actions[className].action.push(func)
    } else {
      this.actions[className] = new Action(func,conditional)
      this.targets.add(className)
    }
  }
  remove(className){
    delete this.actions[className]
    this.targets.delete(className)
  }
  bind(className,func){
    if (this.actions[className])
      this.actions[className].action.push(func)
  }
}
