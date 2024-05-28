const tabFunctions = {
    open() {
        this.menu.classList.add('active');
        this.status = 'active'
        if (this.onOpen)
            this.onOpen();
    },
    close() {
        this.menu.classList.remove('active');
        this.status = 'inactive'
        if (this.onClose)
            this.onClose();
    },
    toggle() {
        console.log(this.state,this.status,this)
        if (this.state == 'inactive')
            this.state = 'active'
        else if (this.state == 'active')
            this.state = 'inactive'
        else
            console.log('err something went wrong with the modal toggler')
        return;
    },
    bindToggler(element) {
        console.log(element)
        if (this.togglers.has(element)) return `${element} is already bound as a toggler`
        this.togglers.add(element)
        element.addEventListener('click',this.toggle.bind(this))
        return `${element} successfully bound as a toggler`
    },
    bindOpener(element) {

    },
    bindCloser(element) {
        console.log(element)
        if (this.closers.has(element)) return `${element} is already bound as a closer`
        this.closers.add(element)
        element.addEventListener('click',this.close.bind(this))
        return `${element} successfully bound as a closer`
    },
}

const menuModalPairs = new Map(function initializeMenu(){

    // console.time('create tab bindings')

    const sidebar = document.querySelector('.js-role--sidebar-menu');    
    const kvPairs = Array.from(sidebar.querySelectorAll('.js-tabber--menu-tab'))
        .map(tabButton => {
            const tabName = tabButton.dataset.tab;
            const correspondingMenu = sidebar.querySelector(`.js-tabber--menu-modal[data-tab="${tabName}"]`)
            const keyValuePair = [ 
            tabName,
            Object.create(tabFunctions,
            {   
                key: {value: tabName},
                menu: {value: correspondingMenu}, 
                togglers: {
                    value: new Set(),
                    writable: true,
                },
                openers: {
                    value: new Set(),
                    writable: true,
                },
                closers: {
                    value: new Set(),
                    writable: true,
                },
                status: {
                    value: 'inactive',
                    writable: true,
                },
                state: {
                    set (status) {
                        this.status = status;
                        console.log(status,this.status)
                        if (status == 'inactive')
                            this.close();
                        else if (status == 'active')
                            this.open();
                
                    },
                    get() {
                        return this.status;
                    },
                },
                activeHandler:{
                    set activeHandler(fn) {
                        this.onOpen = fn
                    }
                },
                passiveHandler: {
                    set passiveHandler(fn) {
                        this.onClose = fn
                    }
                }
            })]
            


            keyValuePair[1].bindToggler(tabButton)
            keyValuePair[1].bindCloser(correspondingMenu.querySelector('.btn.close-modal'))
            return keyValuePair
        })


    // console.log(kvPairs)
    // console.timeEnd('create tab bindings');
    return kvPairs

}())

function Accordian(menuModalPairs) {
    this.current = undefined;
    this.cursor = null;
    this.previous = null;

    this.isCurrent = (key) => this.current.key === key;

    this.isActive = (value) => this.value.state == 'active';
    this.setActive = (value) => this.value.state == 'active';
    this.setPassive = (value) => this.value.state == 'inactive';
    this.toggle = (key) => this.tabset[key].toggle();

    this.setCurrent = (key) => {

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
}