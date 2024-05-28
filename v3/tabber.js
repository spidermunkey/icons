export default function TabHandler(
{
    tabs,
    wrappers,
    initial,
    modals,
}) {
    this.current = null;
    this.cursor = null;
    this.previous = null;

    this.tabset = {
        'key': {
            tab: 'element',
            window: 'element',
            state: 'inactive',
        }
    }

    this.tabs = tabs.map(node => {
        let key = node.dataset.window;
        let element = node;
        this.tabset[key] = {
            key,
            tab: element,
            window: undefined,
            status: undefined,
            onActive() {
                // default
                    this.window.classList.add('active');
                    this.tab.classList.add('active');
                // default 2
                    // this.window.style.display = 'none';
            },
            onPassive() {
                // default
                    this.window.classList.remove('active');
                    this.tab.classList.remove('active');
            },

            set state(status) {
                this.status = status;
                if (status == 'inactive')
                    this.onPassive();
                else if (status == 'active')
                    this.onActive();
            },
            get state() {
                return this.status;
            },
            set fnActive(fn) {
                this.onActive = fn;
            },
            set fnPassive(fn) {
                this.onPassive = fn;
            }
        }
        return [key,element]
    });

    this.windows = wrappers.map(node => {
        let key = node.dataset.window;
        let current = this.tabset[key];
        let element = node;
        this.tabset[key].window = element;
        if (key == this.current)
            this.tabset[key].state = 'active';
        return [key,element];
    });

    this.init = () => {
        // console.log('current',this.current);
        this.tabs.forEach(index =>{
            // console.log(index,index[0],index[1])
            // console.log('yo')
            if (this.modals && this.modals.includes(index[0])){
                index[1].onclick = () => {
                    // console.log(this,'yoyo')
                    if (this.current.key == index[0]) {
                        // console.log('returning',this.current)
                        this.returnState();
                    }
                    else {
                        // console.log('setting',this.current)
                        this.setCurrent(index[0])
                    }
                }
                // console.log('modals set', index[0]);
            } 
            else
                index[1].onclick = () => this.setCurrent(index[0]);
        })
        // console.log('current',this.current)
    }

    this.setCurrent = (key) => {
        let active = this.tabset[key];
        let current = this.current;
        // console.log(key,active,current);
        if (!current) {
            // console.log('here')
            active.state = 'active'
            return this.current = active;
        }
        if (active.key !== current.key) {
            if (current.state == 'active')
                current.state = 'inactive'
            if (active.state == 'inactive' || !active.state)
                active.state = 'active';
            // console.log(active,current)
            this.current = active;
            this.previous = current;
            // console.log(this.previous,this.current)
        }
        // console.log('active set', this,this.current);
    }

    this.toggleCurrent = (key) => {
        let active = key.dataset.window;
        if (active)
            this.setCurrent(active);
        else
            return console.log('something went wrong in the toggle function')
        // console.log('toggling')
    }

    this.returnState = () => {
        // this.previous
        // console.log('hey')
        let previous = this.previous;
        if (previous)
            this.setCurrent(previous.key);
        else
            console.log('something wrong here')
    }
    this.swapState = (key) => {
        this.previous = this.current;
        this.current = key;

    }
    this.togglePendingState = () => {
        this.current.state = 'inactive'
    }
    this.toggleActiveState = () => {
        this.current.state = 'active'
    }
    if (modals)
        this.modals = modals
    else
        this.modals = null;
    if (initial) {
        this.initial = initial;
        this.setCurrent(initial);
    }
}
