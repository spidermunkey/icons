import { SvgModel } from './js/store.js'
import { Tracker }  from './js/model.js'
import { Preview } from './js/components/Preview.js'
import { SearchModal } from './js/components/Search.js'
import { ContextMenu } from './js/components/Context.js'
import axios from 'axios'
const
    API_PORT = 1279,
    store = new SvgModel(),
    tracker = Tracker,
    preview = new Preview(),
    search = new SearchModal(),
    context = new ContextMenu(),
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
    // menuIcons = $$(".sidebar .tab[data-type='nested']"), 
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
    // get data
    modelReady = store.init(),
    // categoriesReady = createCategoryPanels(),
    // menuReady = createCollectionPanels(),
    initialPreviewModalOnAppOpen = 'position';
    // modalGroups
    CATEGORY_MODALS = {},
    COLLECTION_MODALS = {},
    // tabs
    // build app
(async function test() {
    let [effect,count] = signal(0);
    // await caches.delete('icons')
    dashboard.addEventListener('click',() => {
        if (count.value >= 5)
            return count.value = 8
        count.value++;
        console.log(count.value)
    })
    console.log(count.value)
    let random= await store.getRandom(20);
    let randomEach = async () => {
        let cats = await store.getRandom(30,'all');
        const dogs = await store.getCollectionNames();
        // for (cat of cats) {
        //     console.log('fetching random',cat)
        //     const res = await fetch(`http://localhost:1279/icons/random/${cat}?n=30`)
        //     console.log('found this',await res.json())
        // }
        for (const dog of dogs) {
            console.log('fetching random',dog)
            const collection = await store.getMeta();
            const meta = collection[dog];
            const updated_at = meta.updated_at;
            const size = meta.size;
            console.log('METRICS',collection[dog])
            const data = meta.sample
            // console.log('found this',await res.json())
            const dogPrevTab = $(`.menu-list-item[modal="${dog}"]`)
            console.log(dogPrevTab)
            const dogModal = $('.peek-modal[modal="icons"]')
            dogPrevTab.addEventListener('mouseenter', () => {
                const modal = dogModal;
                const labels = $('.peek-modal-labels',modal);
                const prev = $('.peek-modal-icons',modal);
                labels.innerHTML = `
                    <div class="peek-label-title">${dog}</div>
                    <div class="peek-label count">saved icons: ${size}</div>
                    <div class="peek-label updated_on"> last updated: ${updated_at ? updated_at : 'never'}</div>
                `
                prev.innerHTML = data.map(value => `<div class="pk-icon">${value.markup}</div>`).join('')
            })

        }
        console.log(cats)
    }
    randomEach();
        console.log(random)
        // localStorage.setItem('random',JSON.stringify(random.map(index => index.markup)))
    // };
    $('.pinned-preview').innerHTML = random.map(value => `<div class="bp-icon">${value.markup}</div>`).join('')
    $('.bench-preview-icons .bp-icon-wrapper').innerHTML = random.slice(-8).map((node => `<div class="bp-icon">${node.markup}</div>`)).join('')
    
}())

(async function init() {

        const navtabs =  $$('.menu-label[role="tab"][type="nav"]')
        const navmodals = $$('.menu-modals .menu-modal[type="modal"]')
        const menuTabber = $('.logo')
        const menu = $('.menu')
        const search = $('.search.passive-search')
        
        const closeAllTabs = () => navmodals.forEach(modal => modal.classList.remove('active'))
        const removeAllTags = () => navtabs.forEach(tab => tab.classList.remove('active'));
        
        listen(menuTabber,() => {
            $('.menu-cosm').classList.toggle('active')
            menu.classList.toggle('active')
            if (!menu.classList.contains('active')) {
                search.classList.remove('m-state')
                    closeAllTabs();
                }
            else if (menu.classList.contains('active')) {
                search.classList.add('m-state')
            }
            
        })


        navtabs.forEach(tab => listen(tab, () => {
            const modal = $(`.menu-modal[modal='${tab.getAttribute('modal')}']`)
            closeAllTabs();
            removeAllTags();
            modal.classList.add('active');

            tab.classList.add('active');

        },'mouseenter'));

        createAllTab();
        listen(document, handleClickOutside.bind(context));
        listen(document, handleRightClick.bind(context), 'contextmenu');
        // modal togglers
        createCollectionModal
            // .bindToggler($('.menu__actions-button.create-collection'))
            .bindCloser( $('.close',createCollectionOverlay), $('.cc-cancel',createCollectionOverlay))
            .bindTabber( menuTabber )
            .onOpen(showModal)
            .onClose(hideModal);
        createCollectionOverlay.onclick = () => closeOnClickOutside();
        // preview.init
        btnBorder.onclick = () => preview.toggleBorder();
        $('.search-modal .btn-copy-icon').onclick = () => search.copyToClipboard();
        $('.search-modal .btn-edit-icon').addEventListener('click', async () => {
            await modelReady;
            preview.update(getIconById( $('.icon-prev').dataset.id));
            preview.toggleBorder();
            search.close();
        })
        btnCopy.onclick = () => preview.copyToClipboard();
        btnFavorite.onclick = () => save('favorites');
        createCollectionForm.onsubmit = () => handleCreateCollectionForm();
        dashboard.onmousedown = (e) => handleClick(e);
        document.addEventListener('keydown',handleKeys);
        // init sidebar tab functionality
        // menuIcons.map(group => {
        //     let tabIcon = $('.tab__button',group),
        //         correspondingModal = $('.tab__modal',group),
        //         tabCloser = $('.btn.close-modal',correspondingModal),
        //         modal = new Modal(correspondingModal);
        //     modal
        //         .bindOpener(tabIcon)
        //         .bindTabber(menuTabber)
        //         .onOpen(showModal)
        //         .onClose(hideModal);
        //     if (tabCloser) modal.bindCloser(tabCloser);
        // });
        // init preview tab functionality // ['positions', 'preview', 'color']
        previewModals.map(element => {
            let tabName = element.dataset.tab,
                modal = new Modal(element),
                tabber = $(`.preview__tabber--tab[data-tab="${tabName}"]`);
            if (tabber) modal
                        .bindOpener(tabber)
                        .bindTabber(previewTabber)
                        .onOpen(() => tabber.classList.add('active'))
                        .onClose(() => tabber.classList.remove('active'));
            // if (tabName == initialPreviewModalOnAppOpen) modal.open();
            return modal;
        });
        createCollectionLinks();

}())

function createDashboardPanel(tabButton,type) { // Create Dynamic Modal For Newly created links inside menu
    let panel = div(),
        tabName = tabButton.dataset.tab,
        endpoint = type == 'collection' ? resolveCollectionEndpoint(tabName) : resolveCategoryEndpoint(tabName);
        const modal = new DynamicModal(panel, { type:'eager', endpoint, dataHandler: createDashboard });
        dashboard.appendChild(panel);
        panel.classList.add('dashboard__modal');
        panel.dataset.tab = tabName;
        panel.dataset.type = 'category';
        modal.bindOpener(tabButton)
            .bindTabber(dashBoardTabber)
            .onOpen(showModal)
            .onClose(hideModal);
}

async function createCategoryLinks() { // get list of names from db
    const cNames = await store.getCategoryNames();
    cNames.sort().forEach(name => $('.collection-list').appendChild(element))
}

async function createCollectionLinks() { // get list of names from db
    const names = await store.getCollectionNames();
    console.log(names)
    $('.collections-list').innerHTML = names.sort().map(name => `<div class="menu-list-item" type="preview" modal="${name}">${name}</div>`).join('')
    

}

async function createCategoryPanels() { (await createCategoryLinks()).forEach( link => createDashboardPanel(link,'category') )}

async function createCollectionPanels() {(await createCollectionLinks()).forEach( link => createDashboardPanel(link,'collection') )}

async function createAllTab() {
    const tabName = 'all',
          fragment = frag(),
          dash = div();
    fragment.appendChild(dash);
    dash.classList.add('dashboard__modal');
    dash.dataset.tab = tabName;
    dash.dataset.type = tabName;
    const modal = new DynamicModal(dash, { type:'eager', requestHandler:store.getAll , dataHandler: createDashboard } );
    
    modal.bindOpener($('.home'))
        .bindTabber(dashBoardTabber)
        .onOpen(showModal)
        .onClose(hideModal)
        .open();
    dashboard.append(fragment);
};

function updateFavoriteIcons() {
    preview.currentIcon.isFavorite
        ? $('.btn-favit').classList.add('icon-is-favorite')
        : $('.btn-favit').classList.remove('icon-is-favorite');
}

function showModal() {
    this.element.classList.add('active');
    app.state.tab = this.element.dataset.tab;
    app.state.type = this.element.type;
}

function hideModal() {
    this.element.classList.remove('active');
    app.state.tab = undefined;
    app.state.type = undefined;
}

function MenuList(listOfNames) {
    this.element = ul();
    this.element.classList.add('menu-items');
    this.addItem = name => {
        const newLink = MenuListItem(name);
        appendElement( this.element, newLink );
        return newLink;
    }
    this.appendTo = parent => appendElement( parent, this.element);
    this.cloneTo = parent => appendElement( parent, this.element.cloneNode(true));
    this.replaceItems = listOfNames => {
        this.innerHTML = ''; 
        listOfNames.forEach(this.addItem);
    }

    Object.defineProperty(this, 'links', {
        get() {
            return $$('.modal__menu--items-item', this.element);
        }
    })
    
    listOfNames.forEach(this.addItem);
}

function MenuListItem(name) {
    const li = document.createElement('li');
    li.classList.add('modal__menu--items-item');
    li.dataset.tab = name;
    li.textContent = capitalize(name);
    return li;
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
    const wrapper = document.createElement('div');
    wrapper.classList.add('content-wrapper');
    list.forEach(prop => wrapper.appendChild(createIconElement(prop)));
    return wrapper.innerHTML;
};

async function handleCreateCollectionForm(e) {
    e.preventDefault();
    let name = String(document.getElementById('cc-name').value);
    await createCollection(name);
    document.getElementById('cc-name').value = '';
}

function closeOnClickOutside(e) {
    if (!e.target.closest('.create-collection__form')) createCollectionModal.close();
}

function resolveEP(ep) {
    return `http://localhost:${API_PORT}/icons/${ep}`;
};

function resolveCategoryEndpoint(categoryName) {
    return resolveEP(`categories/${categoryName}`);
};

function resolveCollectionEndpoint(collectionName) {
    return resolveEP(`collections/${collectionName}`);
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
    // should be a put req
    if (destination === 'favorites') 
        node.isFavorite = true;
    node = node.save();
    let { id } = node,
        message = await store.addToCollection({
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
    //...
}

async function handleClick(event) {
        console.log('model status: ',modelReady);
        await modelReady;
        if (event.target.closest('.search-modal')) return handleSearchClick(event);
        let wrapper = event.target.closest('.svg-wrapper');
        if (!wrapper) return console.log('no click on wrapper');
        let id = wrapper.dataset.id;
        if (!id) return console.error('this element doesnt have an id');
        const ctrlClick = event.ctrlKey,
              rightClick = event.buttons === 2,
              leftClick = event.buttons === 1;
        if (leftClick && ctrlClick) return toggleBench(id);
        else if (rightClick) return  console.log('right click');
        else if (leftClick) {
            updatePreview(id);
            tracker.logClickedIcon(getIconById(id));
            return;
        }
}

function handleKeys(event) {
    const escape = event.key === 'escape' || event.key === 'Escape';
    const exitSearch = escape && search.state === 'active';
    if (exitSearch) search.close();
}
function handleSearchClick(event) {
    const ctrlClick = event.ctrlKey,
          rightClick = event.buttons === 2,
          leftClick = event.buttons === 1;
    if (leftClick) console.log('left-click');
}

function toggleBench(id) {
    console.log('adding ',id,' to benched icons');
}

async function createCollection(name){
    $('.cc-button').innerHTML = `<div class="cc-loader--container"><span>waiting for server</span><div class="cc-loader"></div></div>`;
    await modelReady , menuReady , categoriesReady;
    const success = await store.createCollection(name);
    if (success) { // Create Dynamic Modal For Newly created links inside menu
        const cLink = collectionMenuComponent.addItem(name),
              a2cLink = addToCollectionComponent.addItem(name,0),
              panel = document.createElement('div'),
              tabName = cLink.dataset.tab;

        panel.classList.add('dashboard__modal');
        panel.dataset.tab = tabName;
        dashboard.appendChild(panel);
        panel.addEventListener('mousedown', (event) => {
            let wrapper = event.target.closest('.svg-wrapper');
            if (!wrapper) return;
            let key = wrapper.dataset.rebased ? wrapper.dataset.rebased : wrapper.dataset.name;
            updatePreview({ event: e, type:'collection', key, tabName });
        });
        const modal = new DynamicModal(panel, {
            type: 'lazy', 
            endpoint: resolveCollectionEndpoint(tabName),
            dataHandler: createDashboard 
        });
        modal.bindOpener(cLink)
            .bindTabber(dashBoardTabber)
            .onOpen(showModal)
            .onClose(hideModal);
        a2cLink.element.addEventListener('click', () => save(name));
        $('.cc-button').innerHTML = `Create Collection`;
        createCollectionModal.close();
    }
}

function getIconById(id) {
    return store.all[id];
}


function handleContextMenuEvent(event) {
    context.handleRightClick(event);
}

function handleClickOutside(event) {
    if (!event.target.closest('.color-context')) { 
        event.preventDefault(); 
        this.close(); 
    }
}

function handleRightClick(event) {
    const clickedContextMenu = elementClicked('.db-context',event);
    const clickedIcon = elementClicked('.dashboard .svg-wrapper',event);
    // handle right click outside
    if ( this.state === 'active' && !clickedContextMenu ) {
        event.preventDefault();
        if (clickedIcon) {
            const { id } = clickedIcon.dataset;
            const icon = getIconById(id);
            this.updateMouseBasedPosition(event);
            this.update(icon);
            return;
        }
        return context.close();
    }
    
    if (context.state === 'inactive' && clickedIcon) {
        const {id} = clickedIcon.dataset;
        const icon = getIconById(id);
        event.preventDefault();
        // position menu
        this.updateMouseBasedPosition(event);
        this.update(icon);
        // show menu
        return this.open();
    }
    return this.close();
}
