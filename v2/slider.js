export default function SlidingTracker(wrapper)
{
    // INTERNAL STATE
    const self = this;
    this.container = wrapper;
    this.track = wrapper.querySelector('.slider-track');
    this.handle = wrapper.querySelector('.slider-handle');
    this.coords = {
        get max() {
            return this.track.width - this.handleMidpoint;
        },
        get min() {
            return 0 + this.handleMidpoint;
        },
        get handleSize() {
            return this.handle.width;
        },
        get handleMidpoint() {
            return this.handleSize/2;
        },
        get handlePosition() {
            return this.handle.x + this.handleMidpoint;
        },
        get distanceTraveled() {
            return this.handlePosition - this.trackStart;
        },
        get trackWidth() {
            return this.track.width - this.handleSize;
        },
        get trackStart() {
            return this.trackLeft + this.handleMidpoint;
        },
        get trackLeft() {
            return this.track.x;
        },
        get track() {
            return self.track.getBoundingClientRect();
        },
        get handle() {
            return self.handle.getBoundingClientRect();
        },
        clamp(val) {
            let x;
            let max = this.max;
            let min = this.min;
            if (isNaN(val)) 
                throw new Error(`clamp function expects a number...you passed ${val}`)
            if (val >= max)
                x = max
            else if (val <= this.min)
                x = min;
            else
                x = val;

            return x;
        },
    };
    this.state = {
            px: undefined,
            deg: undefined,
            pct: undefined,
    },
    // PUB/SUB METHODS
    this.reciever = undefined;
    this.notify = () => this.reciever.setState(this.state);
    this.bind = obj => this.reciever = obj;

    this.update = value => this.setTarget(this.setHandle(value))
    this.reset = () => this.update(0);

    // SET HANDLE AND TARGET ELEMENT
    this.setTarget = values => {
        // console.log('shifting handle')
        // console.log(values)
        this.state = values;
        this.reciever.setTarget(values)
    }
    this.setHandle = distanceTraveled => {
        // Move Slider
        let clamped = this.coords.clamp(distanceTraveled);
        // console.log('HERE!')
        this.handle.style.transform = `translateX(${clamped - this.coords.handleMidpoint}px)`;
        // Return Current State
        if (distanceTraveled <= 0)
            return {
                px: 0,
                pct: 0,
                deg: 0,
            }
        if (distanceTraveled >= this.coords.track.width)
            return {
                px: this.coords.track.width,
                pct: 100,
                deg: 360,
            }

            let distance = Math.trunc(distanceTraveled);
            let distanceInPercent = Math.trunc((distanceTraveled / this.coords.track.width) * 100);
            let distanceInDegrees = Math.trunc((distanceTraveled / this.coords.track.width) * 360);
            return {
                px: distance,
                pct: distanceInPercent,
                deg: distanceInDegrees,
            }

    }
    this.setState = (type,value) => {
        let converted;
        let max = this.coords.track.width;
        switch(type) {
            case 'pct' :
                // convert pct to distance
                converted = max * (value/100);
                break;
            case 'deg' :
                // convert deg to distance
                converted = max * (value/360)
                break;
            default :
                break;
        }
        this.update(converted);
    }

    this.handleMouseClick = event => this.handleMouseX(event);
    // DRAG OPS
    this.handleMouseX = (event) => {
        let x = event.clientX;
        let start = this.coords.trackLeft;
        let end = start + this.coords.track.width;
        let displacement = x - start;
        this.update(displacement);
    }
    // DRAG LISTENERS
    this.handleMouseDrag = () => {
            // console.log('tracking:', this)
            document.addEventListener('mousemove', this.handleMouseX);
            document.addEventListener('mouseup', () => {
                    document.removeEventListener('mousemove',this.handleMouseX);
                    this.notify();
                    // console.log('tracking stopped');
            })
    }
    // CLICK LISTERS
    this.init = (reciever) => {
        // console.log('slider initialized');
        // console.log(this);
        this.handle.addEventListener('mousedown', (e) => this.handleMouseDrag(e));
        this.track.addEventListener('click', (e) => this.handleMouseClick(e));
        this.bind(reciever)    
    }
    // REMOVE CLICK LISTENERS
    this.disable = () => {
        // console.log('slider disabled');
        // console.log(this);
        this.handle.removeEventListener('mousedown', this.handleMouseDrag);
        this.track.removeEventListener('click', this.handleMouseClick);
    }
}