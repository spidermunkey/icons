export function showBorder(target,style) {
    target.style.border = style;
};
export function hideBorder() {
    target.style.border = '';
};
export function showBoundary(target) {
    showBorder(target,'1px dotted red')
};

// HTML DEPENDENT (DATA-ATTRIBUTES)
export function TabHandler({ tabs, wrappers, initial , modals }) {
            this.current = null;
            this.cursor = null;
            this.previous = null;

            // here
            this.tabset = {
                'key': {
                    tab: 'element',
                    window: 'element',
                    state: 'inactive',
                    //     key,
                    //     tab: element,
                    //     window: undefined,
                    //     status: undefined,
                    //     onActive() {
                    //         // default
                    //             this.window.classList.add('active');
                    //             this.tab.classList.add('active');
                    //         // default 2
                    //             // this.window.style.display = 'none';
                    //     },
                    //     onPassive() {
                    //         // default
                    //             this.window.classList.remove('active');
                    //             this.tab.classList.remove('active');
                    //     },
            
                    //     set state(status) {
                    //         this.status = status;
                    //         if (status == 'inactive')
                    //             this.onPassive();
                    //         else if (status == 'active')
                    //             this.onActive();
                    //     },
                    //     get state() {
                    //         return this.status;
                    //     },
                    //     set fnActive(fn) {
                    //         this.onActive = fn;
                    //     },
                    //     set fnPassive(fn) {
                    //         this.onPassive = fn;
                    //     }
                }
            }

            // set here
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
                let element = node;
                this.tabset[key].window = element;
                if (key == this.current)
                    this.tabset[key].state = 'active';
                return [key,element];
            });
            
            this.isCurrent = (key) => this.current.key === key;
            this.notCurrent = (key) => !this.isCurrent(key);

            this.isModal = (key) => this.modals.includes(key);
            this.isActive = (value) => this.value.state == 'active';
            this.setActive = (value) => this.value.state == 'active';
            this.setPassive = (value) => this.value.state == 'inactive';
            this.init = () => {
                // [TAB,MODAL]
                this.tabs.forEach(index => {
                    let tabName = index[0]
                    let tabElement = index[1]
                    if (this.modals && this.isModal(tabName)){
                        this.toggleOnClick(tabName,tabElement);
                    }
                    else
                        tabElement.onclick = () => this.setCurrent(tabName);
                })
            }

            this.setCurrent = (key) => {
                let engaged = this.tabset[key];
                if (!this.current) {
                    engaged.state = 'active'
                    return this.current = engaged;
                }
                this.swapState(engaged);
            }
        
            this.toggleCurrent = (key) => {
                let active = key.dataset.window;
                if (active)
                    this.setCurrent(active);
                else
                    return console.log('something went wrong in the toggle function')
                // console.log('toggling')
            }

            this.toggleOnClick = (key,element) => {
                element.onclick = () => {
                    if (this.isCurrent(key))
                        this.returnPreviousState();
                    else
                        this.setCurrent(key)
                }
            }

            this.returnPreviousState = () => {
                let previous = this.previous;
                if (previous)
                    this.setCurrent(previous.key);
                else
                    console.log('something wrong here')
            }
            this.swapState = (engaged) => {
                let current = this.current
                if (!this.isCurrent(engaged.key)) {
                    if (current.state == 'active')
                        current.state = 'inactive'
                    if (engaged.state == 'inactive' || engaged.state !== 'active') {
                        engaged.state = 'active';
                        this.current = engaged;
                        this.previous = current;
                    } else {
                        console.log('err something went wrong', engaged, current);
                    }
                }
            }
            this.flipState = (obj) => {
                if (this.isActive(obj))
                    this.setPassive(obj)
                else
                    this.setActive(obj)
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

export function ModalHandler(target, opts = {
    
    open: null,
    close: null,
    setPending: null,
    stopPending: null,

    onOpen: null,
    onClose: null,
    onPending: null,
    onPendingCanceled: null,

    closers: [],
    openers: [],
    togglers: [],
}) {
    this.target = target;
    this.status = null;
    this.openers = opts.openers;
    this.closers = opts.closers;
    this.togglers = opts.togglers;

    this.open = opts.open || function() {
        this.target.classList.add('active');
        if (this.onOpen)
            return this.onOpen();
    }
    this.onOpen = opts.onOpen;

    this.close = opts.close || function() {
        this.target.classList.remove('active');
        if (this.onClose)
            return this.onClose();
    }
    this.onClose = opts.onClose;

    this.setPending = opts.setPending || function() {
        this.target.classList.add('pending');
        if (this.onPending)
            return this.onPending();
    }
    this.onPending = opts.onPending;

    this.stopPending = opts.stopPending || function() {
        this.target.classList.remove('pending');
        if (this.onPendingCanceled)
            return this.onPendingCanceled();
    }
    this.cancelPending = opts.cancelPending;

    this.toggleState = () => {
        let state = this.getState();
        if (state === 'active')
            this.setState('inactive')
        else if (state === 'inactive' || state === null)
            this.setState('active')
    }
    this.setState = (status) => {
        if (status === 'inactive')
            this.close();
        else if (status === 'active')
            this.open();
        else if (status === 'pending')
            this.setPending();
        else {
            console.log('please set that to a valid status prop [ active , passive , pending ]',status)
            return status
        }
        this.status = status
        return status;
    },
    this.getState = () => {
        return this.status;
    }
    
    this.addOpener = () => null;
    this.disableOpener = () => null;

    this.addCloser = () => null;
    this.disableCloser = () => null;

    this.init = () => {
        if (this.closers) {
            this.closers.forEach( element => {
                    element.addEventListener('click', () => {
                    this.setState('inactive')
                    })
                })
        }

        if (this.openers) {
            this.openers.forEach(
                element => element.addEventListener('click',
                () => this.setState('active'))
            )
        }

        if (this.togglers) {
            this.togglers.forEach(
                element => element.addEventListener('click',this.toggleState.bind(this))
            )
        }

        return this;
    }
}

// JAVASCRIPT DEPENDENT (PROPS & COMPONENTS)
export function Modal(element, options = {
    open: null,
    close: null,
    toggle: null,
    onOpen: null,
    onClose: null,
    onToggle: null,
}) {
    this.target = element;
    this.onClose = options.onClose;
    this.onOpen = options.onOpen;
    this.onToggle = options.onToggle;

    this.open = options.open || function() {
        this.target.classList.add('active')
    }
    this.close = options.close || function() {
        this.target.classList.remove('active')
    }
    this.toggle = options.toggle || function() {
        this.target.classList.toggle('active');
    }

    this.setClosers = (...elements) => {
        elements.forEach(element => element.addEventLister('click',this.close))
    }
    this.setOpeners = (...elements) => {
        elements.forEach(element => element.addEventListener('click',this.open))
    }
    this.setTogglers = (...elements) => {
        elements.forEach(element => element.addEventListener('click',this.toggle))
    }
}

export function Accordian({ tabs, wrappers , initial, cosm }) {
    this.current = undefined;
    this.cursor = null;
    this.previous = null;

    // here
    this.tabset = {
        'key': {
            tab: 'element',
            window: 'element',
            state: 'inactive',
        }
    }

    // set here
    this.tabs = tabs.map(node => {
        let key = node.dataset.tab;
        let element = node;
        this.tabset[key] = {
            key,
            tab: element,
            window: undefined,
            status: undefined,
            open() {
                this.window.classList.add('active');
                this.tab.classList.add('active');
                if (this.onOpen)
                    this.onOpen();
            },
            close() {
                this.window.classList.remove('active');
                this.tab.classList.remove('active');
                if (this.onClose)
                    this.onClose();
            },
            toggle() {
                if (this.state == 'inactive')
                    this.state = 'active'
                else if (this.state == 'active')
                    this.state = 'inactive'
                else
                    console.log('err something went wrong with the modal toggler')
                return;
            },
            set state(status) {
                this.status = status;
                if (status == 'inactive')
                    this.close();
                else if (status == 'active')
                    this.open();
            },
            get state() {
                return this.status;
            },
            set activeHandler(fn) {
                this.onOpen = fn
            },
            set passiveHandler(fn) {
                this.onClose = fn
            }
        }
            return [key,element]
    })

    this.windows = wrappers.map(node => {
        let key = node.dataset.tab;
        let element = node;
        console.log(node,key,element)
        this.tabset[key].window = element;
        node.querySelector('.btn.close-modal').addEventListener('click', () => {
            console.log(this.current)
            this.toggleCurrent()
        })
        return [key,element]
    })

    this.isCurrent = (key) => this.current.key === key;
    this.notCurrent = (key) => !this.isCurrent(key);

    this.isActive = (value) => this.value.state == 'active';
    this.setActive = (value) => this.value.state == 'active';
    this.setPassive = (value) => this.value.state == 'inactive';
    this.toggle = (key) => this.tabset[key].toggle();

    this.setCurrent = (key) => {
        if (!this.current) {
            this.current = this.tabset[key];
            this.tabset[key].state = 'active'
            return this.current;
        }
        else if (this.isCurrent(key))
            return this.toggleCurrent();

        else if (!this.isCurrent(key)) {
            return this.swapCurrent(key);
        } 
    }
    this.swapCurrent = (key) => {
        this.current.state = 'inactive'
        this.tabset[key].state = 'active'
        this.current = this.tabset[key];
    }
    this.toggleCurrent = () => {
        if (this.current) {
            return this.current.toggle();
        }
        return;
    }

    this.init = () => {
        // [TAB,MODAL]
        this.tabs.forEach(index => {
            let tabName = index[0]
            let tabElement = index[1]
            tabElement.addEventListener('click',() => this.setCurrent(tabName));
        })

    }
}