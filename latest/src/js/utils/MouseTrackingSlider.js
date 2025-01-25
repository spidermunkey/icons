export class MouseTrackingSlider {
  constructor(targetElement, { 
    onMouseMove, onMouseUp, onMouseDown, reset 
  }) {

    this.targetElement = targetElement;
    this.initialPosition_x = null;
    this.initialPosition_y = null;
    this.currentPosition_x = null;
    this.currentPosition_y = null;
    this.onMouseMove = onMouseMove || null;
    this.onMouseDown = onMouseDown || function () { console.log(targetElement, "triggered mousetracker mouseDown") };
    this.onMouseUp = onMouseUp || function () { console.log(targetElement, "triggered mousetracker mouseUp") };
     this.reset = reset || function() { console.log('reseting mousetracker') };
    this.targetElement.addEventListener("mousedown", this.track);
    this.targetElement.addEventListener("click", this.handleClick);
  }

  handleDrag = (event) =>{
      let distanceFromInitialPosition_x = event.clientX - this.initialPosition_x;
      let distanceFromInitialPosition_y = event.clientY - this.initialPosition_y;
      let debuffed_y = this.currentPosition_x = Math.floor(distanceFromInitialPosition_x / 3);
      let debuffed_x = this.currentPosition_y = Math.floor(distanceFromInitialPosition_y / 3);
      this.onMouseMove({ x: Number(debuffed_y), y: Number(debuffed_x), event });
    }
  
  track = (event) => {
    if (event.button !== 0) return;
    if (!this.initialPosition_x) this.initialPosition_x = event.pageX;
    if (!this.initialPosition_y) this.initialPosition_y = event.pageY;
    let controller = new AbortController();
    this.handleClick(event)
    document.addEventListener("mousemove", this.handleDrag, { signal: controller.signal }, true );
    document.addEventListener("mouseup", () => {
      controller.abort();
      this.initialPosition_x = null;
      this.initialPosition_y = null;
      event.stopImmediatePropagation();
      if ( this.onMouseUp ) this.onMouseUp({event, x: Number(this.xPos), y: Number(this.yPos)});
    });
  }
  handleClick = (event) => {
    let xZeroed = event.clientX - this.initialPosition_x;
    let yZeroed = event.clientY - this.initialPosition_x;
    // divide by 3 for slower realistic drag effect?
    let vx = this.currentPosition_x = Math.floor(xZeroed / 3);
    let vy = this.currentPosition_y = Math.floor(yZeroed / 3);
    if (this.onMouseDown) this.onMouseDown({ x: Number(vx), y: Number(vy), event })
  }
}
