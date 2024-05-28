import { SvgModel } from './store.js'
import { Tracker } from './Tracker.js'
import { Preview } from './components/Preview.js'
import { SearchModal } from './components/Search.js'
import { ContextMenu } from './components/Context.js'

const

    API_PORT = 1279,
    store = new SvgModel(),
    tracker = new Tracker(),
    preview = new Preview(),
    search = new SearchModal(),
    context = new ContextMenu(),
    // modalGroups
    CATEGORY_MODALS = {},
    COLLECTION_MODALS = {},
    // tabs
    menuTabber = new Tabber(),
    dashBoardTabber = new Tabber(),
    previewTabber = new Tabber(),
    previewActionTabber = new Tabber(),
    collectionMenuComponent = new MenuList([]),
    categoryMenuComponent = new MenuList([]),
    // elements
    dashboard = $('#DASHBOARD'),
    previewElement = $('#PREVIEW'),
    // menu-list containers
    categoryMenu = $('#CATEGORIES .modal__menu--items'),
    collectionMenu = $('#COLLECTIONS .modal__menu--items'),
    menuIcons = $$(".sidebar .tab[data-type='nested']"), 
    createCollectionOverlay = $('.modal.create-collection'),
    createCollectionForm = $('form',createCollectionOverlay),  
    // modals
    createCollectionModal = new Modal($('.modal.create-collection'));
    previewModals = $$('.preview__modals > [data-role="tab"]',previewElement);
    previewSubModals = $$('.preview-action__window');
    // buttons
    btnCopy = $('.btn-copy'),
    btnBorder = $('.btn-border'),
    btnFavorite = $('.btn-favit'),
    btnFavoriteContext = $('.btn-snack.favit'),

    // get data
    modelReady = store.init(),
    categoriesReady = createCategoryPanels(),
    menuReady = createCollectionPanels(),
    initialPreviewModalOnAppOpen = 'position';

    console.log(previewModals)
    // build app
    (async function init() {

        
        createAllTab();

        listen(document, handleClickOutside.bind(context));
        listen(document, handleRightClick.bind(context), 'contextmenu');
        // modal togglers
        createCollectionModal
            .bindToggler($('.menu__actions-button.create-collection'))
            .bindCloser( $('.close',createCollectionOverlay), $('.cc-cancel',createCollectionOverlay))
            .bindTabber( menuTabber )
            .onOpen(showModal)
            .onClose(hideModal)

        createCollectionOverlay.onclick = () => closeOnClickOutside()


        // preview.init
        btnBorder.onclick = () => preview.toggleBorder();
        $('.search-modal .btn-copy-icon').onclick = () => search.copyToClipboard();
        $('.search-modal .btn-edit-icon').addEventListener('click',async () => {
            await modelReady
            preview.update(getIconById( $('.icon-prev').dataset.id));
            preview.toggleBorder();
            search.close();
        })
        btnCopy.onclick = () => preview.copyToClipboard();
        btnFavorite.onclick = () => save('favorites');
        btnFavoriteContext.onclick = () => toggleFavorite();
        createCollectionForm.onsubmit = () => handleCreateCollectionForm()

        dashboard.onmousedown = (e) => handleClick(e);
        document.addEventListener('keydown',handleKeys);


        // init sidebar tab functionality
        menuIcons.map(group => {

            let tabIcon = $('.tab__button',group),
                correspondingModal = $('.tab__modal',group),
                tabCloser = $('.btn.close-modal',correspondingModal),
                modal = new Modal(correspondingModal);

            modal
                .bindOpener(tabIcon)
                .bindTabber(menuTabber)
                .onOpen(showModal)
                .onClose(hideModal);
                if (tabCloser) modal.bindCloser(tabCloser);

        });


        // init preview tab functionality // ['positions', 'preview', 'color']
        previewModals.map(element => {

            let tabName = element.dataset.tab,
                modal = new Modal(element),
                tabber = $(`.preview__tabber--tab[data-tab="${tabName}"]`);

            // console.log(tabName,modal,tabber)
            if (tabber)
                modal
                    .bindOpener(tabber)
                    .bindTabber(previewTabber)
                    .onOpen(() => tabber.classList.add('active'))
                    .onClose(() => tabber.classList.remove('active'));

            if (tabName == initialPreviewModalOnAppOpen) 
                modal.open();

            return modal
        });


        // init preview action "sub-tabs" // [ export menu, save menu, benched icons ]
        // previewSubModals.map(element => {

        //     let tabName = element.dataset.tab,
        //         modal = new Modal(element),
        //         tabber = $(`.preview-action__button[data-tab="${tabName}"]`);

        //     modal
        //         .bindOpener(tabber)
        //         .bindTabber(previewActionTabber)
        //         .onOpen(() => tabber.classList.add('active'))
        //         .onClose(() => tabber.classList.remove('active'))

        //     return modal
        // });

}())

function createDashboardPanel(tabButton,type) {
    // Create Dynamic Modal For Newly created links inside menu
    let panel = div(),
          tabName = tabButton.dataset.tab,
          endpoint = type == 'collection' ? resolveCollectionEndpoint(tabName) : resolveCategoryEndpoint(tabName)
            console.log('creating modal for endpoint', endpoint)
            console.log(tabName,tabButton)

          const modal = new DynamicModal(panel,{ 
                type:'eager', 
                endpoint, 
                dataHandler: createDashboard 
          });

        dashboard.appendChild(panel);

        panel.classList.add('dashboard__modal');
        panel.dataset.tab = tabName;
        panel.dataset.type = 'category';

        modal.bindOpener(tabButton)
        .bindTabber(dashBoardTabber)
        .onOpen(showModal)
        .onClose(hideModal)

}

async function createCategoryLinks() {
    // get list of names from db
    console.log('populating categories')
    const cNames = await store.getCategoryNames();
    cNames.sort().forEach(name => categoryMenuComponent.addItem(name))

    categoryMenuComponent.appendTo(categoryMenu);
    return categoryMenuComponent.links;
}

async function createCollectionLinks() {
    // get list of names from db
    const names = await store.getCollectionNames();
    names.forEach(name => collectionMenuComponent.addItem(name))
    collectionMenuComponent.appendTo(collectionMenu);
    return collectionMenuComponent.links;
}

async function createCategoryPanels() {
    (await createCategoryLinks()).forEach( link => createDashboardPanel(link,'category') )
}

async function createCollectionPanels() {
    (await createCollectionLinks()).forEach( link => createDashboardPanel(link,'collection') )
}

async function createAllTab() {

    const tabName = 'all',
        fragment = frag(),
        dash = div();
        fragment.appendChild(dash);

    dash.classList.add('dashboard__modal');

    dash.dataset.tab = 'all';
    dash.dataset.type = 'all';


    // dash.addEventListener('mousedown', handleModalClick);

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

    dashboard.append(fragment)
    
};

function updateFavoriteIcons() {

    if (app.state.context && app.state.context.isFavorite) 
        $('.btn-snack.favit').classList.add('icon-is-favorite');
    else 
        $('.btn-snack.favit').classList.remove('icon-is-favorite');

    if (preview.currentIcon.isFavorite) 
        $('.btn-favit').classList.add('icon-is-favorite');
    else 
        $('.btn-favit').classList.remove('icon-is-favorite');
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

function MenuList(listOfNames) {

    this.element = ul();
    this.element.classList.add('menu-items');
    this.addItem = (name) => {
        const newLink = MenuListItem(name);
        appendElement( this.element, newLink );
        return newLink
    }
    this.appendTo = parent => appendElement( parent, this.element);
    this.cloneTo = parent => appendElement( parent, this.element.cloneNode(true));
    this.replaceItems = listOfNames => {
        this.innerHTML = ''; 
        listOfNames.forEach(this.addItem)
    }

    Object.defineProperty(this, 'links', {
        get() {
            return $$('.modal__menu--items-item', this.element)
        }
    })
    
    listOfNames.forEach(this.addItem);
}

function MenuListItem(name) {
    const li = document.createElement('li');
    li.classList.add('modal__menu--items-item');
    li.dataset.tab = name;
    li.textContent = capitalize(name);
    return li
}

function createIconElement(props) {
    let {name,category,id,cid,markup,rebased} = props;
    let el = document.createElement('div');
    el.classList.add('showcase');
    el.classList.add('svg-wrapper');
    el.dataset.category = category;
    el.dataset.name = name;
    el.dataset.cid = cid;
    el.dataset.id = id;
    el.innerHTML = markup || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 10a10 10 0 1 1 20 0 10 10 0 0 1-20 0zm16.32-4.9L5.09 16.31A8 8 0 0 0 16.32 5.09zm-1.41-1.42A8 8 0 0 0 3.68 14.91L14.91 3.68z"></path></svg>`;
    if (rebased) el.dataset.rebased = rebased;
    return el;
};

function createDashboard(list) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('content-wrapper')
    list.forEach(prop => wrapper.appendChild(createIconElement(prop)))
    return wrapper.innerHTML
};

async function handleCreateCollectionForm(e) {
    e.preventDefault();
    let name = String(document.getElementById('cc-name').value);
    await createCollection(name);
    document.getElementById('cc-name').value = '';
}

function closeOnClickOutside(e) {
    console.log(e.target.closest('.create-collection__form'))
    if (!e.target.closest('.create-collection__form')) createCollectionModal.close();
}

function resolveEP(ep) {
    return `http://localhost:${API_PORT}/icons/${ep}`
};

function resolveCategoryEndpoint(categoryName) {
    return resolveEP(`categories/${categoryName}`)
};

function resolveCollectionEndpoint(collectionName) {
    return resolveEP(`collections/${collectionName}`)
};


function updatePreview(id) {
    let node = getIconById(id);
        preview.update(node);
        app.state.context = node;
        updateFavoriteIcons();    
}

async function toggleFavorite() {

    if (!this.state.context) return
    
        let node = this.state.context,
            isFav = node.isFavorite;

        node.isFavorite = !isFav;
        
        await save('favorites');
        updateFavoriteIcons();       
}


async function save( destination, node = preview.currentIcon ) {
    
    console.log('saving to',destination,store.collections[destination]);

    // should be a put req
    if (destination === 'favorites') 
        node.isFavorite = true;

    node = node.save();

    let { id } = node;

    let message = await store.addToCollection({

        destination,
        id,
        onFailure:(message) => console.error(message),
        onSuccess:(message) => console.log(message),
    });

    if (message.success === true && destination === 'favorites')
            updateFavoriteIcons();

    return message;

}

async function copyFromSearch() {

}

async function handleClick(event) {

        console.log('model status: ',modelReady);
        await modelReady;

        if (event.target.closest('.search-modal')){
            handleSearchClick(event);
            return;
        }

        let wrapper = event.target.closest('.svg-wrapper');
        if (!wrapper) {
            console.log('no click on wrapper');
            return 
        }

        let { id } = wrapper.dataset;
        console.log(id)
        if (!id) {
            console.error('this element doesnt have an id');
            return;
        }



        const ctrlClick = event.ctrlKey;
        const rightClick = event.buttons === 2;
        const leftClick = event.buttons === 1;

        if (leftClick && ctrlClick) {
            console.log('control click');
            toggleBench(id);
            return
        }
        else if (rightClick) {
            console.log('right click');
            // updateContext(meta);
            return
        }
        else if (leftClick) {
            console.log('left click');
            updatePreview(id);
            tracker.logClickedIcon(getIconById(id));
            return;
        }


}

function handleKeys(event) {
    const escape = event.key === 'escape' || event.key === 'Escape'

    const exitSearch = escape && search.state === 'active'
    if (exitSearch) {
        search.close();
    }
    console.log(exitSearch)
}
function handleSearchClick(event) {
    const ctrlClick = event.ctrlKey;
    const rightClick = event.buttons === 2;
    const leftClick = event.buttons === 1;
    if (leftClick) {
        console.log('left-click')
    }
}

function toggleBench(id) {
    console.log('opening benched icons')
}

async function createCollection(name){
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

            updatePreview({ event: e, type:'collection', key, tabName })

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

        a2cLink.element.addEventListener('click', () => save(name))

        // COLLECTION_MODALS.set(tabName,modal);
        console.log('closing',createCollectionModal)
        $('.cc-button').innerHTML = `Create Collection`;
        createCollectionModal.close();
        
    }
}

function getIconById(id) {
    return store.all[id];
}


function handleContextMenuEvent(event) {

    // const clickedIcon = elementClicked('.dashboard .svg-wrapper',event);

    // if (clickedIcon && clickedIcon.dataset.isFavorite === 'true') highlightFavoriteIcon() 
    // else hideFavoriteIcon();
        
    context.handleRightClick(event);
}

function handleClickOutside(event) {
    if (!event.target.closest('.color-context')) { 
        event.preventDefault(); 
        this.close(); 
    }
}

function handleRightClick(event) {
    console.log('here')
    const clickedContextMenu = elementClicked('.db-context',event);
    const clickedIcon = elementClicked('.dashboard .svg-wrapper',event);
    console.log(clickedContextMenu,clickedIcon)
    // console.log(clickedIcon)
    // handle right click outside
    console.log(context.state)
    if ( this.state === 'active' && !clickedContextMenu ) {
        event.preventDefault();

        if (clickedIcon) {
            const { id } = clickedIcon.dataset;
            const icon = getIconById(id)
            console.log('here now')
            console.log(icon)
            this.updateMouseBasedPosition(event);
            this.update(icon)
            return
        }
        context.close()
        return;
    }
    
    if (context.state === 'inactive' && clickedIcon) {
        const {id} = clickedIcon.dataset
        const icon = getIconById(id)
        event.preventDefault();
        console.log('down here now')

        // position menu
        this.updateMouseBasedPosition(event);
        this.update(icon)
        // show menu
        this.open();
        return
    }

    this.close();

    return;
}
