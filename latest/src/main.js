import { SvgModel } from './js/store.js'
import { Preview } from './js/components/Preview.js'
import { ContextMenu } from './js/components/Context.js'
import { Dashboard } from './js/components/Dashboard.js'
import { Menu } from './js/components/Menu.js'
import { Icon } from './js/components/Icon.js'
import { Cursor } from './js/var/cursor.js'

document.addEventListener('DOMContentLoaded',async function init() {
    
    const store = new SvgModel(),
    preview = new Preview(),
    context = new ContextMenu(),
    dashboard = new Dashboard(),
    menu = new Menu(),
    state = {
        tab: '',
        group: undefined,
        clicked: undefined,
        context: undefined,
        bench: {},
        mode: 'click',
        pinned: 'favorites',
        cursor: undefined,
    },
    ready = store.init();
    $('.btn-favit').onclick = () => addToCollection('favorites');
    dashboard.element.onmousedown = (e) => handleClick(e);
    // dashboard.element.onkeydown = (e) => handleKeys(e);
    $('.menu-modals').addEventListener('click',handleMenuClick)
    $('.preview-widget').addEventListener('click',preview.open.bind(preview))
    $('.close-preview').addEventListener('click',preview.close.bind(preview))
    $('.home').addEventListener('click', renderCollection.bind(this,'all'))
    $('.bench-widget').addEventListener('click',openBench)
    $('.pinned-widget').addEventListener('click',renderCollection.bind(this,state.pinned))
    $('.preview__window--navigator.btn-next').addEventListener('click',async () => {
        await ready;
        preview.update(state.context.cursor.skipToNext())
    })
    $('.preview__window--navigator.btn-prev').addEventListener('click',async () => {
        await ready;
        preview.update(state.context.cursor.skipToPrev())
    })
    preview.close();
    renderCollection('all');

    function openBench(){
        if (!store.bench.size || store.bench.size <= 0)
            return;
        preview.open.call(preview);
        dashboard.render(store.bench)
    }

    async function renderCollection(name) {
        await ready
        dashboard.setLoading();
        preview.setLoading();
        const data = await store.getCollection(name);
        state.context = data;
        const {icons,cursor,meta} = data;
        console.log('CURSOR',cursor);
        dashboard.render(icons);
        dashboard.updateHeader(meta);
        dashboard.setReady();

        preview.setReady();
        preview.update(state.context.cursor.current);
    }
    async function copy(message) {
        try {
            await window.navigator.clipboard.writeText(message);
            return true;
        } catch(err) {
            return false
        }
    }
     async function handleClick(event) {
        await ready;
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
            const icon = state.context.getIcon(id);
            preview.update(icon);
            state.context.cursor.skipToElement(icon);
            return;
        }
    }
    async function addToCollection( destination, node = preview.icon ) {
        if (destination === 'favorites') 
            node.isFavorite = true;
        node = node.save();
        message = await store.addToCollection({destination,node});
        return message;
    }
    async function handleMenuClick(event){
        const link = event.target.closest('.menu-list-item[role="tab"]');
        if (!link) return;
        dashboard.setLoading();
        const modal = link.getAttribute('modal');
        menu.close();
        await renderCollection(modal);

    }

})


