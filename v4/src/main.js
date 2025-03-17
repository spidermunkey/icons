import * as _ from './js/utils/DOM-helpers.js'
import * as R from 'ramda'

import { SvgModel } from './store.js'
import { Bucket } from './js/utils//Structs.js'
import { preview } from './js/components/preview.js'

import { DashboardPanel as createDashboard } from './js/components/panel.js'

import { A2CMenuList, MenuList } from './js/components/MenuListItem.js'

import { Modal , DynamicModal , Tabber } from './js/utils/DOM.js'
import { EventEmitter  } from './js/utils/Observers.js'
console.log('%cICONS -- PORT 2222', "color: yellow; font-family: arial; font-size:20px")
const 
    API_PORT = 1279,
    store = new SvgModel(),
// modalGroups
    CATEGORY_MODALS = new Map(),
    COLLECTION_MODALS = new Map(),
// tabs
    menuTabber = new Tabber(),
    dashBoardTabber = new Tabber(),
    contextTabber = new Tabber(),
    previewTabber = new Tabber(),
    previewActionTabber = new Tabber(),
// elements
    dashboard = $('#DASHBOARD'),
    previewElement = $('#PREVIEW'),
    // menu-list containers
    contextMenu = $('.icon-context-menu'),
    categoryMenu = $('#CATEGORIES .modal__menu--items'),
    collectionMenu = $('#COLLECTIONS .modal__menu--items'),
    addToCollectionMenu = $('.add-to-collection .list-of-names',previewElement),  
    createCollectionOverlay = $('.modal.create-collection'),  
// modals
    chooseCollectionPanel = new Modal($('.menu--choose-collection',contextMenu)),
    showPreviewPanel = new Modal($('.menu--show-previews',contextMenu)),
    createCollectionModal = new Modal($('.modal.create-collection'));
// modal togglers
    chooseCollectionPanel.bindToggler($('.btn-snack.a2c'),contextMenu);
    showPreviewPanel.bindToggler($('.btn-snack.qp'),contextMenu);
    createCollectionModal.bindToggler($('.menu__actions-button.create-collection'))
                         .bindCloser( $('.close',createCollectionOverlay), $('.cc-cancel',createCollectionOverlay))
                         .bindTabber( menuTabber )
                         .onOpen(showModal)
                         .onClose(hideModal)
    
    createCollectionOverlay.addEventListener('click', closeOnClickOutside)
    $('form',createCollectionOverlay).onsubmit = async (e) => {
        e.preventDefault()
        let name = String(document.getElementById('cc-name').value)
        console.log(e);
        console.log(name);
        await app.createCollection(name);
        document.getElementById('cc-name').value = '';
    }
// components
let categoryMenuComponent,
    collectionMenuComponent,
    addToCollectionComponent;

const modelReady = store.init();
const categoriesReady = createCategoryLinksThenPopulate();
const menuReady = createCollectionLinksThenPopulate();
const app = {
    
    emitter: new EventEmitter(),

        state: {

            tab: '',
            group: undefined,
            clicked: undefined,
            context: undefined,
            bench: new Bucket(),
            mode: 'click',
            

        },

        'updatePreview': ( { event, type, key, tabName} ) => {
            let collection;
            let node;

            console.dir('updating preview with',{event,type,key,tabName})
            // find which bucket the clicked icon came from

                if (type==='category') collection = store.categories[tabName];
                else if (type==='collection') collection = store.collections[tabName];
                else if(type==='all') collection = store.all;
                else collection = undefined;

                // console.log(collection)
            if (collection) {
                node = collection.use(key);
                console.log(node)
                preview.update(node);
                app.state.clicked = node;
                updateFavoriteIcons();
            }
    
        },

        'updateContext': ( { event, type, key, tabName } ) => {
            let collection,
                node,
                isFavorite;

            console.dir('updating context with',{event,type,key,tabName})
            // find which bucket the clicked icon came from

                if (type ==='category') collection = store.categories[tabName];
                else if (type ==='collection') collection = store.collections[tabName]
                else if(type ==='all') collection = store.all
                else { console.error('collection undefined'); return }

                node = collection.use(key);
                isFavorite = node.isFavorite;
                app.state.context = node;

                console.log(node,'isFavorite:',isFavorite);

        },

        'toggleFavorite': async () => {
            if (!this.state.context) return
            
                let node = this.state.context,
                    isFav = node.isFavorite;

                node.isFavorite = !isFav;

                console.dir({
                    isfavorite: isFav,
                    node,
                    kc: node.knownCollections,
                })
                await app.save('favorites');
                updateFavoriteIcons();
                
        },

        'save': async ( destination, node = preview.currentIcon ) => {
            console.log('saving to',destination,store.collections[destination])
            let savingToFavorites = destination === 'favorites';
            if (savingToFavorites) node.isFavorite = true;

            node = node.save();

            let { name, rebased } = node;

            let message = await store.addToCollection({

                destination,
                name: rebased ? rebased : name,
                meta: node,

                onSuccess:(message) => {

                    console.log(message)
                    COLLECTION_MODALS.get(destination).notifyChange();
                    console.log(COLLECTION_MODALS);

                },
                onFailure:(message) => console.error(message),
            });

            if (message.success === true) {
                if (savingToFavorites) updateFavoriteIcons();

            }

            return message;

        },

        'handleClick': (event) => {

            let wrapper = event.target.closest('.svg-wrapper');
            if (!wrapper) return 
        
                let { name , rebased } = wrapper.dataset
        
                let key = rebased ? rebased : name ? name : undefined;
        
                if (!key) {
                    console.error('this element doesnt have a key');
                    return;
                }
            
            app.updatePreview({ event, type:'category', key, tabName });

        },

        'createCollection': async (name) => {
            $('.cc-button').innerHTML = `<div class="cc-loader--container"><span>waiting for server</span><div class="cc-loader"></div></div>`;
            await modelReady;
            await menuReady;
            await categoriesReady;

            const success = await store.createCollection(name);

            if (success) { 
                console.log('collection successfully created... creating links')
                console.log(menuReady,collectionMenuComponent)

                
                const cLink = collectionMenuComponent.addItem(name);
                const a2cLink = addToCollectionComponent.addItem(name,0);
                console.log('added',cLink,'to',collectionMenuComponent);
                console.log('added',a2cLink.element,'to',addToCollectionComponent);

                // Create Dynamic Modal For Newly created links inside menu
                const panel = document.createElement('div')
                const tabName = cLink.dataset.tab;

                panel.classList.add('dashboard__modal')
                panel.dataset.tab = tabName;
                dashboard.appendChild(panel);
                panel.addEventListener('mousedown', (event) => {

                    let wrapper = event.target.closest('.svg-wrapper')
                    if (!wrapper) return 
        
                        let { name , rebased } = wrapper.dataset
                            key = rebased ? rebased : name;

                    app.updatePreview({ event: e, type:'collection', key, tabName })

                })

                const modal = new DynamicModal(panel, {
                    type: 'lazy', 
                    endpoint: resolveCollectionEndpoint(tabName),
                    dataHandler: createDashboard 
                })

                modal.bindOpener(cLink)
                    .bindTabber(dashBoardTabber)
                    .onOpen(showModal)
                    .onClose(hideModal)

                a2cLink.element.addEventListener('click', () => app.save(name))

                COLLECTION_MODALS.set(tabName,modal);
                console.log('closing',createCollectionModal)
                $('.cc-button').innerHTML = `Create Collection`;
                createCollectionModal.close();
                
            }
        },
}



// preview.init
$('.btn-border').onclick = () => preview.toggleBorder();
$('.btn-copy').onclick = () => preview.copyToClipboard();
$('.btn-favit').onclick = () => app.save('favorites');
$('.btn-snack.favit').onclick = () => app.toggleFavorite();

intializeAllTab();
initializeContextMenu();

// init sidebar tab functionality
$$(".sidebar .tab[data-type='nested']").map(group => {

    const tButton = $('.tab__button',group),
          tModal = $('.tab__modal',group),
          tCloser = $('.btn.close-modal',tModal),
          modal = new Modal(tModal);

    if (tCloser) modal.bindCloser(tCloser)

    modal.bindOpener(tButton)
         .bindTabber(menuTabber)
         .onOpen(showModal)
         .onClose(hideModal);

});

// init contextmenu tab functionality
[chooseCollectionPanel,showPreviewPanel].forEach(modal => {

    modal.bindTabber(contextTabber)
         .onOpen(function openNearMouseClick(event) {
                // MOUSE COORDS
                let { clientX, clientY} = event,
                // WIN DIMS
                    { innerWidth, innerHeight } = window,
                // COMP DIMS
                    { height, width } = this.element.getBoundingClientRect(),
                // BUFFER HEIGHT
                    snackBarSize = 90;

                let noRoomForWindowRight = (innerWidth - clientX) < (height + snackBarSize),
                    noRoomForWindowBottom = (innerHeight - clientY) < (width + snackBarSize),
                    windowIsVertical = this.element.parentElement.parentElement.classList.contains('vert');
                
                if ( windowIsVertical && noRoomForWindowRight) this.element.parentElement.classList.add('left')
                else if ( !windowIsVertical && noRoomForWindowBottom) this.element.parentElement.classList.add('top')

                this.element.parentElement.classList.add('active')
                this.element.classList.add('active-bottom')
         })

});

// init preview tab functionality
$$('.preview__modals > [data-role="tab"]',previewElement).map(modal => {

    const tabName = modal.dataset.tab,
          tModal = new Modal(modal),
          tabber = $(`.preview__tabber--tab[data-tab="${tabName}"]`);

    tModal.bindOpener(tabber)
          .bindTabber(previewTabber)
          .onOpen(function() {
                tabber.classList.add('active');
                this.element.classList.add('active');
           })
          .onClose(function() {
                tabber.classList.remove('active');
                this.element.classList.remove('active');
           });
    if (tabName == 'position') tModal.open();

});

// init preview action "sub-tabs"
$$('.preview-action__window').map(modal => {

    const tabName = modal.dataset.tab,
          tModal = new Modal(modal),
          tabber = $(`.preview-action__button[data-tab="${tabName}"]`);

    tModal.bindOpener(tabber)
          .bindTabber(previewActionTabber)
          .onOpen(function() {
              tabber.classList.add('active')
              this.element.classList.add('active')
          })
          .onClose(function() {
              tabber.classList.remove('active')
              this.element.classList.remove('active')
          })

});

async function createCategoryLinksThenPopulate() {

    // get list of names from db
    const cNames = await store.getCategoryNames(),
    sorted = cNames.sort(),
    categoryMenuComponent = new MenuList(cNames);
    categoryMenuComponent.appendTo(categoryMenu);
    categoryMenuComponent.links.forEach( link => {

        // Create Dynamic Modal For Newly created links inside menu
        const panel = _.divit(),
              tabName = link.dataset.tab,
              modal = new DynamicModal(panel,{ 
                    type:'eager', 
                    endpoint: resolveCategoryEndpoint(tabName), 
                    dataHandler: createDashboard 
              });

            dashboard.appendChild(panel);

            panel.classList.add('dashboard__modal');
            panel.dataset.tab = tabName;
            panel.dataset.type = 'category';
            panel.addEventListener( 'mousedown' , handleModalClick('category',tabName) )

            modal.bindOpener(link)
            .bindTabber(dashBoardTabber)
            .onOpen(showModal)
            .onClose(hideModal)

            CATEGORY_MODALS.set(tabName,modal);

        })
        return true;
}

async function createCollectionLinksThenPopulate() {
    // get list of names from db
    const names = await store.getCollectionNames();
    
    collectionMenuComponent = new MenuList(names);
    collectionMenuComponent.appendTo(collectionMenu);
    collectionMenuComponent.cloneTo(chooseCollectionPanel.element);
    collectionMenuComponent.links.forEach(link => {
        // Create Dynamic Modal For Newly created links inside menu
            const panel = document.createElement('div')
            const tabName = link.dataset.tab;

            panel.classList.add('dashboard__modal')
            panel.dataset.tab = tabName;
            panel.dataset.type = 'collection';
            dashboard.appendChild(panel);

            panel.addEventListener('mousedown', handleModalClick('collection', tabName) )

            const modal = new DynamicModal(panel, {
                type: 'lazy', 
                endpoint: resolveCollectionEndpoint(tabName),
                dataHandler: createDashboard 
            })

            modal.bindOpener(link)
                 .bindTabber(dashBoardTabber)
                 .onOpen(showModal)
                 .onClose(hideModal)


            COLLECTION_MODALS.set(tabName,modal)
    });

    await modelReady
        addToCollectionComponent = new A2CMenuList([]);
        addToCollectionMenu.innerHTML = '';
        names.map(name => {
            let collectionSize = store.collections[name].size;
            let link = addToCollectionComponent.addItem(name,collectionSize);
            link.element.addEventListener('click', () => app.save(name))
        })
        addToCollectionComponent.appendTo(addToCollectionMenu)

    return true;
};

async function intializeAllTab() {

    const tabName = 'all',
          frag = _.frag(),
          dash = _.divit();
          frag.appendChild(dash);

    dash.classList.add('dashboard__modal');

    dash.dataset.tab = 'all';
    dash.dataset.type = 'all';


    dash.addEventListener('mousedown', handleModalClick('all','all'));

    const modal = new DynamicModal(dash, {
        type:'eager',
        endpoint: resolveCategoryEndpoint('all'),
        dataHandler: createDashboard,
    });

    // add event listener to link button
    modal.bindOpener(document.getElementById('HOME'))
         .bindTabber(dashBoardTabber)
         .onOpen(showModal)
         .onClose(hideModal)
         .open();

    dashboard.prepend(frag)
    CATEGORY_MODALS.set('all',modal)
};

function initializeAddToCollectionModal() {

};

function initializeContextMenu() {
    chooseCollectionPanel.bindToggler($('.btn-snack.a2c'),contextMenu)
    showPreviewPanel.bindToggler($('.btn-snack.qp'),contextMenu)
    R.forEach((modal) => {
        modal.bindTabber(contextTabber)
        modal.openTimeLine.subscribe(function(e) {
            // MOUSE COORDS
            let { clientX, clientY} = e;
            // WIN DIMS
            let { innerWidth, innerHeight } = window;
            // COMP DIMS
            let { height, width } = this.element.getBoundingClientRect();
            // BUFFER HEIGHT
            let snackBarSize = 90;

            const noRoomForWindowRight = (innerWidth - clientX) < (height + snackBarSize);
            const noRoomForWindowBottom = (innerHeight - clientY) < (width + snackBarSize);
            const windowIsVertical = this.element.parentElement.parentElement.classList.contains('vert')
            
            if( windowIsVertical && noRoomForWindowRight)
                this.element.parentElement.classList.add('left')
            else if ( !windowIsVertical && noRoomForWindowBottom)
                this.element.parentElement.classList.add('top')

            this.element.parentElement.classList.add('active')
            this.element.classList.add('active-bottom')

        })
        modal.closeTimeLine.subscribe(function(e) {

            this.element.parentElement.classList.remove('left','top')
            this.element.parentElement.classList.remove('active')
            this.element.classList.remove('active-bottom')

        })
    },[chooseCollectionPanel,showPreviewPanel])

    contextMenu.addEventListener('contextmenu',(e) => e.preventDefault())
    dashboard.addEventListener('contextmenu',(e) => {
            let wrapper = e.target.closest('.svg-wrapper');
            if (!wrapper) return 
        
                let { name , rebased } = wrapper.dataset
        
                let key = rebased ? rebased : name ? name : undefined;
        
                if (!key) {
                    console.error('this element doesnt have a key');
                    return;
                }
            
            e.preventDefault();
            
            const width = Number(getComputedStyle(contextMenu).getPropertyValue('width').split('p')[0])
            contextMenu.style.top = `${e.clientY - 25}px`
            contextMenu.style.left = `${e.clientX - (width/2) - 48}px`
            contextMenu.classList.add('active')
            contextMenu.addEventListener('mouseleave', () => {
                contextTabber.closeActive();
                contextMenu.classList.remove('active')
            })
        })
};


function onDashboardClick(event) {
    let wrapper = event.target.closest('.svg-wrapper');
    if (!wrapper) return 

        let { name , rebased } = wrapper.dataset

        let key = rebased ? rebased : name ? name : undefined;

        if (!key) {
            console.error('this element doesnt have a key');
            return;
        }
        // app.broadcast('icon clicked',{ event, type:'all', key, tabName })
        
        app.updatePreview({ event, type:'category', key, tabName })
}


function showModal() {
    this.element.classList.add('active');
    // app.emit('Tab Open)
    app.state.tab = this.element.dataset.tab;
    app.state.type = this.element.type;
}

function hideModal() {
    this.element.classList.remove('active');
    // app.emit('Tab Closed')
    app.state.tab = undefined;
    app.state.type = undefined;
}

function handleModalClick( type, tabName ) {

    return function(event) {

        let wrapper = event.target.closest('.svg-wrapper');
        if (!wrapper) return 

        let { name , rebased } = wrapper.dataset;
        let key = rebased ? rebased : name;

        if (!key) {
            console.error('this element doesnt have a key');
            return;
        }

        const meta = { event, type, key, tabName }
        const ctrlClick = event.ctrlKey;
        const rightClick = event.buttons === 2;
        const leftClick = event.buttons === 1;
        
        if (leftClick && ctrlClick) {
            // app.toggleBench(meta)
            console.log('control click')
            return // app.toggleBench();
        }
        else if (rightClick) {
            console.log('right click');
            app.updateContext(meta)
            return // app.updateContext();
        }
        else if (leftClick) {
            console.log('left click')
            app.updatePreview(meta)
            return;
        }
    }

}

function updateFavoriteIcons() {

    if (app.state.context && app.state.context.isFavorite) $('.btn-snack.favit').classList.add('icon-is-favorite');
    else $('.btn-snack.favit').classList.remove('icon-is-favorite');

    if (preview.currentIcon.isFavorite || preview.currentIcon.knownCollections.includes('favorites')) $('.btn-favit').classList.add('icon-is-favorite');
    else $('.btn-favit').classList.remove('icon-is-favorite');
    
}

function initCOSM() {
    document.addEventListener('click', closeOnClickOutside);
}
function closeCOSM() {
    document.removeEventListener('click',closeOnClickOutside);
}

function closeOnClickOutside(e) {
    console.log(e.target.closest('.create-collection__form'))
    if (!e.target.closest('.create-collection__form')) createCollectionModal.close();
}

function resolveEP(ep) {
    return `http://localhost:${API_PORT}/icons/${ep}`
};

function resolveCategoryEndpoint(categoryName) {
    return resolveEP(`collections/${categoryName}`)
};

function resolveCollectionEndpoint(collectionName) {
    return resolveEP(`collections/${collectionName}`)
};
