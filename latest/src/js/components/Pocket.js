import { Bench } from "../var/Bench";
import { Notifier } from "../var/notify";
export class Pocket extends Notifier {
    constructor() {
        super();
        this.element = document.querySelector('.bench')

        this.menu = {
            element: document.querySelector('.bench--toggle-menu'),
            select: document.querySelector('.bench--toggle-menu .select'),
            delete: document.querySelector('.bench--toggle-menu .wipe'),
            export: document.querySelector('.bench--toggle-menu .export')
        }

        this.state ='empty'
        this.bucket = new Bench()
        this.selected = new Map()
    }

    get icons() {
        return this.bucket.values
    }
    get size() {
        return this.bucket.size
    }
    add(icon) {
        let key = icon.id;
        let value = icon;
        let pushSuccessful = this.bucket.push(key,value);
        console.log('push successful', pushSuccessful);
        if (pushSuccessful) {
            this.highlightDasboardElement(key)
            // this.addSelectedToBench(icon.pocket)
            $('.bench-count').textContent = this.size;
            return icon;
        } else {
            console.warn('err something went wrong adding to your bench')
            return null;
        }
    }
    remove(id) {
        let pluckSuccessful = this.bucket.pluck(id);
        if (pluckSuccessful) {
            this.removeHighlightFromDashboardElement(id);
            // this.removeSelectedFromBench(id);
            $('.bench-count').textContent = this.size;

            return null;
        } else
            console.log('err something went wrong with plucking from your bench')
    }
    toggle(icon) {
        console.log(icon)
        let status = this.getIconStatus(icon.id);
        console.log(status)
        if (status) {
            console.log('removing icon')
            return this.remove(icon.id)
        } else if (!status) {
            console.log('adding icon')
            return this.add(icon)
        }
    }
    _bind(id) {
        const dashboard = $('.dashboard');
        const binding = dashboard.querySelector(`[data-id="${id}"]`)
        return binding;
    }
    _find(id) {
        console.log(id)
        return document.querySelector(`.dashboard__modal[tab="bench"] [data-id="${id}"]`)
    }
    getIconStatus(id) {
        return this.bucket.has(id);
    }
    updateStatus() {
        if (this.bucket.size > 0 && this.state !== 'ready' && this.state !== 'selectAll') {
            this.state = 'ready'
            return this.state;
        }
        else if (this.bucket.size === 0 && this.state !== 'empty') {
            this.state = 'empty'
            return this.state;
        }
        return this.state;
    }


    addSelectedToBench(icon) {
        this.element.appendChild(icon)
    }
    highlightDasboardElement(id) {
        let binding = this._bind(id);
        if (binding && !binding.classList.contains('benched'))
            binding.classList.add('benched')
        else
            console.warn('something went wrong highlighting an element with the id of', id)
    }

    removeSelectedFromBench(id) {
        let element = this._find(id);
        // this.element.removeChild(element)
    }
    
    removeHighlightFromDashboardElement(id) {
        let binding = this._bind(id)
        if (binding.classList.contains('benched'))
            binding.classList.remove('benched')
        else
            console.log('cant find dashboard element by the id of',id)
    }


    toggleSelected(id,element) {
        let selected = this.bucket.use(id);
        let flag = selected.isBenched;
        if (flag) {
            selected.isBenched = false;
            this.selected.delete(id);
            this.unselectFromBench(element);
        } else {
            selected.isBenched = true;
            this.selected.set(id,selected);
            this.selectFromBench(element)
        }
    }
    selectFromBench(element) {
        element.classList.add('selected')
    }
    unselectFromBench(element) {
        element.classList.remove('selected');
    }
    deleteSelected() {
        let selected = Array.from(this.selected.keys())
        if (selected.length > 0)
            selected.forEach(id => {
                this.selected.get(id).isSelected = false;
                this.selected.delete(id);
                this.remove(id);
            })
    }
    toggleSelectAll() {
        if (this.state !== 'empty') {
            console.log('yo')
            if (this.state == 'selectAll') {
                console.log('yo yo')
                this.state = 'ready'
                this.unselectAllInBench();
            } else {
                console.log('yo yo')
                this.state = 'selectAll'
                this.selectAllInBench();
            }
        }
    }
    selectAllInBench() {
        console.log('yo yo yo')
        let targets = Array.from(this.element.children);
        let group = this.bucket.useValues();
        group.forEach(value => value.isSelected = true)
        targets.forEach(child => child.classList.add('selected'))
        this.selected = new Map(this.bucket.useEntries());
    }
    unselectAllInBench() {
        let targets = Array.from(this.element.children);
        let group = this.bucket.useValues();
        group.forEach(value => value.isSelected = false);
        targets.forEach(child => child.classList.remove('selected'))
        this.selected = new Map()
    }


    toggleExportMenu() {
        document.querySelector('.interface').classList.add('passive')
        document.querySelector('.interface--menu').classList.add('active')
        // this.bench.wrapper.style.transform = 'translateY(-250px)'
    }

    init() {
        this.element.addEventListener('click', (e) => {
            console.log('yo')
            let el = e.target.closest('.comp--bench')
            let key;
            console.log(key,el)
            if (el)
                key = Number(el.dataset.id);
            else 
                return;
                
            if (el && key)
                this.toggleSelected(key,el);
        })

        this.menu.select.addEventListener('click',() => {
            console.log('yoooo')
            this.toggleSelectAll();
        })
        this.menu.delete.addEventListener('click',() => {
            this.deleteSelected();
        })
        this.menu.export.addEventListener('click',() => {
            this.toggleExportMenu();
        })
    }
}

function BenchPreview(icons) {
  return icons
          .slice(-8)
          .map((node => `<div class="bp-icon">${node.markup}</div>`))
          .join('')
}
