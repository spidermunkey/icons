import { Color } from "./Color.js";
export class Canvas extends MouseTrackingSlider {
    constructor({ canvas, pointer, hueBar, actions = {} }) {
        super( canvas, {});
        this.canvas = canvas;
        this.pointer = pointer;
        this.color = new Color({ hex: '#fff' });
        this.hueBar = hueBar;
        this.setCanvasHue();
        this.onMouseMove = function(state) { // state = { x , y , event }
            let event = state.event;
            let adjustedColor = this.handleCanvasPosition(event);
            if (actions?.mouseMove) actions.mouseMove(adjustedColor);
            this.setCanvasHue()
            return state
        }
        this.onMouseUp = function() {
            if (actions?.mouseUp) actions.mouseUp(this.color)
        }
        this.onMouseDown = function(state) { // state = { x , y , event }
            let event = state.event;
            let adjustedColor = this.handleCanvasPosition(event);
            if (actions?.onClick) actions.onClick(adjustedColor);
            // if (actions?.mouseUp) actions.mouseUp(adjustedColor);
            this.setCanvasHue();
            return state
        };
    }

    get coords() {
        return this.canvas.getBoundingClientRect();
    }

    get width() {
        return this.coords.width;
    }
    
    get height() {
        return this.coords.height;
    }

    handleCanvasPosition(event) {
        let { x , bottom, width, height } = this.coords;
        let yPos = event.clientY - bottom,
            xPos = event.clientX - x,
            y = Math.abs(yPos),
            xPct = Math.round((xPos / width) * 100),
            yPct = Math.round((y / height) * 100),
            xInBounds = xPct <= 100 && xPct >= 0,
            yInBounds = yPct <= 100 && yPct >= 0 && yPos <= 0;
            if (xInBounds) this.color.hsvSaturation = xPct;
            if (yInBounds) this.color.hsvValue = yPct;
            this.setPointer( this.color.hsv[1] , this.color.hsv[2] );
        return this.color
    }

    updateColor(props) {
        this.color = new Color(props);
    }

    update(props) {
        this.updateColor(props);
        this.setPointer(this.color.hsv[1], this.color.hsv[2]);
        this.setCanvasHue();
    }

    updateHue(value) {
        this.color.hue = value;
        this.setCanvasHue(value);
    }

    setCanvasHue(value = this.color.hue.toString()) {
        this.canvas.style.setProperty('--hue',`${value}`);
        if (this.hueBar){
            this.hueBar.setDegrees(value);
        }
    }

    setPointer(x,y) {
        let xToDecimal = x/100;
        let xDistance = this.width * xToDecimal;
        let xClamp = Math.min(xDistance,this.width)
        let yToDecimal = 1 - y/100;
        let yDistance = this.height * yToDecimal
        let yClamp = Math.min(yDistance,this.width)
        this.pointer.style.setProperty('--x',`${xClamp}px`);
        this.pointer.style.setProperty('--y',`${yClamp}px`);
    }
};
