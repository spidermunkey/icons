import { SvgModel } from './js/store.js'
import { Preview } from './js/components/Preview.js'
import { ContextMenu } from './js/components/Context.js'
import { Dashboard } from './js/components/Dashboard.js'
import { Menu } from './js/components/Menu.js'
import { Pocket } from './js/components/Pocket.js'
import { Cursor } from './js/var/cursor.js'
import { Icon } from './js/components/Icon.js'

document.addEventListener('DOMContentLoaded',async function init() {
    
    const store = new SvgModel(),
    preview = new Preview(),
    context = new ContextMenu(),
    dashboard = new Dashboard(),
    pocket = new Pocket(),
    menu = new Menu(),
    state = {
        tabName: '',
        group: undefined,
        clicked: undefined,
        context: {
        },
        bench: store.bench,
        mode: 'click',
        pinned: 'favorites',
        cursor: undefined,
        set tab(name){
            $('.dashboard__modal').setAttribute('tab',name);
            this.tabName = name;
            console.trace('TAB SET',name,this.tabName)

        },
        get tab() {
            return this.tabName;
        }
    },
    mode = 'click',
    ready = store.init();
    $('.btn-favit').onclick = () => addToCollection('favorites');
    dashboard.element.onmousedown = (e) => handleClick(e);
    dashboard.element.ondblclick = (e) => handleDoubleClick(e);
    // dashboard.element.onkeydown = (e) => handleKeys(e);
    $('.menu-modals').addEventListener('click',handleMenuClick)
    $('.preview-widget').addEventListener('click',openPreview)
    $('.close-preview').addEventListener('click',closePreview)
    $('.home').addEventListener('click', () => renderCollection('all'))
    $('.bench-widget').addEventListener('click',openBench)
    $('.pinned-widget').addEventListener('click',() => renderCollection(state.pinned))
    $('.preview .btn-bench.toggler').addEventListener('click',() => {
        const icon = state.selected;
        let isBenched;
        if (icon) isBenched = toggleBench(icon)
        if (!isBenched) {
            icon.isBenched = false;
            $('.btn-bench').classList.remove('icon-is-benched');
        } else {
            icon.isBenched = true;
            $('.btn-bench').classList.add('icon-is-benched');

        }
        
    })
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
        if (!store.pocket.size || store.pocket.size <= 0)
            return;
        renderBench();
    }

    function openPreview() {
        if (preview.currentModal)
            preview.currentModal.classList.add('active');
        $('.widget-pre').classList.remove('active');
        $('.widget-main').classList.add('active');
    }

    function closePreview() {
        if (preview.currentModal)
            preview.currentModal.classList.remove('active');
        $('.widget-main').classList.remove('active');
        $('.widget-pre').classList.add('active');
    }

    function handleDoubleClick(event) {

    }

    function renderBench() {
        dashboard.setLoading();
        state.context = store.bench
        state.context.cursor = new Cursor(store.bench.icons)
        dashboard.render(store.bench.icons);
        dashboard.updateHeader({});
        dashboard.setReady();
        state.tab = 'bench';
        // preview.setReady();
        preview.update(state.context.cursor.current);
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
        state.tab = name;
        preview.setReady();
        preview.update(state.context.cursor.current);
    }
    function toggleBench(icon){
        const iconAdded = store.pocket.toggle(icon)
        return iconAdded
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

        if (leftClick && ctrlClick) {
            const icon = state.context.getIcon(id);
            const iconAdded = toggleBench(icon);
            console.log(iconAdded)
            if (!iconAdded) {
                icon.isBenched = false;
                if (state.tab == 'bench'){
                    console.log('here')
                    let element = store.pocket._find(id)
                    console.log('found',element)
                    if (element) {
                        element.remove();
                    }
                }
                if (preview.icon.id == id)
                    $('.btn-bench').classList.remove('icon-is-benched');
                    
                return
            }
            icon.isBenched = true;
            if (preview.icon.id == id)
                $('.btn-bench').classList.add('icon-is-benched');

            console.log('TAB',state.tab)
            console.log(state)

            return;
        }
        else if (rightClick) return  console.log('right click');
        else if (leftClick) {
            const icon = state.context.getIcon(id);
            preview.update(icon);
            state.selected = icon;
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


