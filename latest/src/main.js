import { SvgModel } from './js/store.js'
import { Preview } from './js/components/Preview.js'
import { ContextMenu } from './js/components/Context.js'
import { Dashboard } from './js/components/Dashboard.js'
import { Menu } from './js/components/Menu.js'
import { Cursor } from './js/var/cursor.js'
import { Scanner } from './js/components/Scanner.js';

document.addEventListener('DOMContentLoaded',async function init() {
    
    const store = new SvgModel(),
    preview = new Preview(),
    context = new ContextMenu(),
    dashboard = new Dashboard(),
    menu = new Menu(),
    state = {
        tabName: '',
        group: undefined,
        clicked: undefined,
        context: {},
        bench: store.bench,
        mode: 'click',
        pinned: 'favorites',
        cursor: undefined,
        set tab(name){
            $('.dashboard__modal').setAttribute('tab',name);
            this.tabName = name;
        },
        get tab() {
            return this.tabName;
        }
    },
    ready = store.init(),
    scanner = new Scanner(),
    pocket = store.pocket;
    scanner.notifier.on('new entry',async function(entry) {
        await ready;
        store.collections['recent'].meta.ready = false;
        console.log(store.collections['recent'])
    })
    pocket.on('add',function(icon) {
        const dashboard = $('.dashboard');
        const binding = dashboard.querySelector(`[data-id="${icon.id}"]`);
        if (binding && !binding.classList.contains('benched'))
            binding.classList.add('benched');

        if (preview.icon.id == icon.id)
            $('.btn-bench').classList.add('icon-is-benched');

        $('.bench-count').textContent = pocket.size;
        icon.isBenched = true;
    })
    pocket.on('remove',function(icon) {
        const dashboard = $('.dashboard');
        const binding = dashboard.querySelector(`[data-id="${icon.id}"]`)
        if (binding && binding.classList.contains('benched'))
            binding.classList.remove('benched')

        if (preview.icon.id == icon.id)
            $('.btn-bench').classList.remove('icon-is-benched');

        if (state.tab == 'bench')
           pocket._find(icon.id)?.remove();

        $('.bench-count').textContent = pocket.size;
        icon.isBenched = false;
    })

    dashboard.element.onmousedown = (e) => handleClick(e);
    dashboard.element.oncontextmenu = (e) => toggleContext(e);
    document.addEventListener('click',handleClickOutsideContext)
    $('.search.passive-search input').focus()
    $('.btn-favit').onclick = async () => {
        if (preview.icon && !preview.icon.isFavorite){
            console.log(preview.icon)
            const message = await addToCollection('favorites',preview.icon);
            if (message.success == true)
                alert('successfully added to favorites')
        } else alert('icon was not added to favorites')
    }
    $('.menu-modals').addEventListener('click',handleMenuClick)
    $('.preview-widget').addEventListener('click',openPreview)
    $('.close-preview').addEventListener('click',closePreview)
    $('.home').addEventListener('click', () => renderCollection('all'))
    $('.bench-widget').addEventListener('click',() => !pocket.size || pocket.size <= 0 ? null : renderBench())
    $('.pinned-widget').addEventListener('click',renderPinnedCollection)
    $('.preview .btn-bench.toggler').addEventListener('click',() => state.selected ? pocket.toggle(state.selected): null)
    $('.preview__window--navigator.btn-next').addEventListener('click',async function toggleNext() {
        await ready;
        preview.update(state.context.cursor.skipToNext())
    })
    $('.preview__window--navigator.btn-prev').addEventListener('click',async function togglePrev() {
        await ready;
        preview.update(state.context.cursor.skipToPrev())
    })
    $('.add-to-collection').addEventListener('click',() => {
        preview.toggleWindow('collections')
        console.log('clicked')
    })
    $('.db-context .btn.copy').addEventListener('click',async function copyCurrentContextIcon(e) {
        console.log('yo')
        if (!context.icon || !context.icon.markup) return;
        await window.navigator.clipboard.writeText(context.icon.markup);
        context.handleCopy();
    })
    $('.db-context .btn.pocket').addEventListener('click',() => {
        if (!context.icon) return;
        context.handlePocket(pocket.toggle(context.icon))
    })
    $('.db-context .btn.pocket').addEventListener('click',() => {
        if (!context.icon) return;
        context.handlePocket(pocket.toggle(context.icon))
    })
    $('.db-context .c-atp').addEventListener('click',() => {
        if (!context.icon) return;
        context.handlePocket(pocket.toggle(context.icon))
    })
    $('.db-context .open-preview').addEventListener('click',() => {
        preview.update(context.icon);
        preview.open('position');
        context.close();
    })
    $('.db-context .btn.favit').addEventListener('click', async () => {
        console.log(context.icon)
        console.log(context)    
        if (context.icon && !context.icon.isFavorite){
                console.log(context.icon)
                const message = await addToCollection('favorites',context.icon);
                if (message.success == true)
                   context.showFavorite();
                else console.log(message.message)
                
            } else alert('icon was not added to favorites')
    })
    $('.db-context .btn.info').addEventListener('click',() => {
        $('.db-context .info-card').classList.toggle('active')
    })
    $('.db-context .card-icon').addEventListener('click',() => {
        $('.db-context .card-icon').classList.toggle('active')
    })
    $('.db-context .o-color').addEventListener('click',() => {
        preview.update(context.icon)
        preview.open('color')
        context.close();
    })
    $('.db-context .o-position').addEventListener('click',() => {
        preview.update(context.icon)
        preview.open('position')
        context.close();
    })
    $('.db-context .o-components').addEventListener('click',() => {
        preview.update(context.icon)
        preview.open('components')
        context.close();
    })

    // pointer events need fixin
    preview.close();

    renderCollection('all');
    createA2CPreviewList();
    generateCollectionPreviews()

    let contextMenu = $('.db-context');



    async function copyFromWidget(){
        if (!preview.icon) return;
        await preview.copyToClipboard();
    }
    function toggleBorderFromWidget() {
        $('.widget-preview-icon').classList.toggle('active')
    }
    function toggleContext(event) {
        const clickedIcon = elementClicked('.dashboard .svg-wrapper',event);
        let icon;
        if (clickedIcon)
            icon = state.context.getIcon(clickedIcon.dataset.id)
            state.inspected = icon;
        context.handleRightClick(event,icon)
    }

    function handleClickOutsideContext(event) {
        if (!event.target.closest('.db-context')) { 
            event.preventDefault(); 
            context.close();
        }
    }
    function openPreview(event) {
        if (event.target.closest('.copy-icon'))
            return copyFromWidget()
        else if(event.target.closest('.widget-preview-icon'))
            return toggleBorderFromWidget()
        else if (event.target.closest('.tggle.color-icon'))
            preview.open('color')
        else if (event.target.closest('.tggle-open'))
            preview.open('position')
        else 
            preview.open()
        $('.widget-pre').classList.remove('active');
        $('.widget-main').classList.add('active');

    }

    function closePreview() {
        if (preview.currentModal)
            preview.currentModal.classList.remove('active');
        $('.widget-main').classList.remove('active');
        $('.widget-pre').classList.add('active');
        preview.close();
    }

    function renderBench() {
        dashboard.setLoading();
        state.context = store.bench;
        state.context.cursor = new Cursor(store.bench.icons);
        dashboard.render(store.bench.icons);
        dashboard.setReady();
        preview.update(state.context.cursor.current);
        state.tab = 'bench';
    }

    async function generateCollectionPreviews() {
        const pinned = state.pinned;
        const random = await store.getRandom(20,pinned);
        const widgetElement = $('.pinned-widget .pinned-preview')

        console.log('RANDO',random)
        for (const rando of random){
            const icon = document.createElement('div');
            icon.innerHTML = rando.markup
            icon.dataset.id = rando.id
            icon.isFavorite = rando.isFavorite
            icon.isBenched = rando.isBenched
            icon.classList.add('pinned-icon')
            widgetElement.appendChild(icon)
        }

    }
    async function renderCollection(name) {
        await ready
        dashboard.setLoading();
        preview.setLoading();
        state.context = await store.getCollection(name);
        dashboard.render(state.context.icons);
        dashboard.setReady();
        preview.setReady();
        preview.update(state.context.cursor.current);
        state.selected = preview.icon;
        state.tab = name;
    }

    async function renderPinnedCollection(event) {
        const icon = event.target.closest('.pinned-icon')
        let index = 0;

        await ready
        dashboard.setLoading();
        preview.setLoading();
        state.context = await store.getCollection(state.pinned);
        console.log(icon)
        if (icon){
            let id = icon.dataset.id;
            let icons = state.context.icons;
            for (let i = 0; i < icons.length; i++){
                if (icons[i].id == id){
                    index = i;
                    state.context.cursor.setPointer(index);
                    console.log(index)
                    break;
                }
           }
        }
        preview.update(state.context.cursor.current);
        dashboard.render(state.context.icons);
        dashboard.setReady();
        preview.setReady();
        state.tab = state.pinned;
        state.selected = preview.icon
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

        if (leftClick && ctrlClick)
            pocket.toggle(state.context.getIcon(id));
        
        // else if (rightClick) 
        //     return toggleContext(event);

        else if (leftClick) {
            const icon = state.context.getIcon(id);
            preview.update(icon);
            state.selected = icon;
            state.context.cursor.skipToElement(icon);
            return;
        }
    }
    async function addToCollection( destination, icon = preview.icon ) {
        message = await store.addToCollection({destination,icon});
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

    async function createA2CPreviewList() 
    {
        const collectionNames = store.getCollectionNames();
        (await collectionNames).forEach(name => {
            const element = document.createElement('div');
            element.textContent = name;
            element.classList.add('preview-a2c-item');
            element.dataset.collection = name;
            $('[data-tab="collections"][data-role="window"]').appendChild(element)
            element.addEventListener('click',async () => {
                console.log('adding to collection')
                const response = await store.addToCollection({ destination:name , icon:preview.icon })
                if (response.success){
                    // update tab data;
                    
                    state.tab == name ? null : null;

                }
            })
        })
        const createCollectionButton = document.createElement('div');
        createCollectionButton.textContent = 'Create Collection';
        createCollectionButton.classList.add('btn-create-collection');
        $('[data-tab="collections"][data-role="window"]').appendChild(createCollectionButton)



    }

})


