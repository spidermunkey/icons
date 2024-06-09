import { SvgModel } from './store.js'
import { Preview } from './components/Preview.js'
import { Tracker } from './model.js'
import { ContextMenu } from './components/Context.js'
import { Dashboard } from './components/Dashboard.js'
import { Menu } from './components/Menu.js'

export function App() {
    this.store = new SvgModel(),
    this.preview = new Preview(),
    this.context = new ContextMenu(),
    this.dashboard = new Dashboard(),
    this.menu = new Menu(),
    this.tracker = Tracker;
    this.state = {
        tab: '',
        group: undefined,
        clicked: undefined,
        context: undefined,
        bench: {},
        mode: 'click',
    }
    $('.btn-favit').onclick = () => addToCollection('favorites');
    this.dashboard.element.onmousedown = (e) => this.handleClick(e);
    this.dashboard.element.onkeydown = (e) => this.handleKeys(e);
    this.ready = this.store.init();

    this.copy =  async function(message) {
        try {
            await window.navigator.clipboard.writeText(message);
            return true;
        } catch(err) {
            return false
        }
    }
    this.handleClick = async function(event) {
        await this.ready;
        let wrapper = event.target.closest('.svg-wrapper');
        if (!wrapper) return console.log('no click on wrapper');
        let id = wrapper.dataset.id;
        if (!id) return console.error('this element doesnt have an id');
        const ctrlClick = event.ctrlKey,
              rightClick = event.buttons === 2,
              leftClick = event.buttons === 1;
        if (leftClick && ctrlClick) return console.log('adding ',id,' to benched icons');
        else if (rightClick) return  console.log('right click');
        else if (leftClick) {
            this.preview.update(this.store.all[id]);
            this.tracker.logClickedIcon(this.store.all[id]);
            return;
        }
    }
    this.addToCollection = async function( destination, node = this.preview.icon ) {
        if (destination === 'favorites') 
            node.isFavorite = true;
        node = node.save();
        message = await store.addToCollection({destination,node});
        return message;
    }
}
