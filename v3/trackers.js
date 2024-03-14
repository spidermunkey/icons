export function MouseTrackingSlider ( target , setter , opts = { 
    useBuffer: true, 
    onMouseUp: null,
    onMouseDown: null,
    onDrag: null,
    }) {

    this.useBuffer = opts.useBuffer;
    this.xPosInitial = null;
    this.yPosInitial = null;

    this.target = target;
    this.handler = setter;

    this.state = {
        x: null,
        y: null,
    }

    this.getDistance = (event) => {
        if (!this.xPosInitial)
            this.xPosInitial = event.pageX;
        if (!this.yPosInitial)
            this.yPosInitial = event.pageY;

        let xZeroed = event.clientX - this.xPosInitial;
        let yZeroed = event.clientY - this.yPosInitial;
        let vx;
        let vy;
        if (this.useBuffer) {
            vx = Math.floor(xZeroed/3);
            vy = Math.floor(yZeroed/3);
        }
        let values = {
            x: Number(vx),
            y: Number(vy),
        }

        this.state = values;
        return values;
    }

    this.track = (event,setter) => {
        event.target.onpointermove = (event) => setter(this.getDistance(event));
        event.target.setPointerCapture(event.pointerId);
    }
    this.stop = (event) => {
        // console.log('tracking stopped')
        this.xPosInitial = null;
        this.yPosInitial = null;
        event.target.onpointermove = null;
        event.target.releasePointerCapture(event.pointerId);
        if (this.onMouseUp)
            this.onMouseUp();
        // console.log(this.state);
    }

    this.init = () => {
        this.target.onpointerdown = (event) => this.track(event,this.handler);
        this.target.onpointerup = this.stop.bind(this);
        return this.state;
    }
}