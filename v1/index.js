import {
    updateElementFactory as createElementFactory,
    el as elementFactory} from './utils/factories.js'


class SvgModel {
    constructor(list) {
        this.all = {
            elements: [],
        };
        this.categories = {
            categorySet: [],
        };
        this.collections = {
            collectionSet: ['Favorites','Recently Added'],
            favorites: {},
            recentlyAdded: {},
        };
        for (let i = 0; i < list.length; i++) {
            let element = list[i];
    
            let name = element[0];
            let category = element[1];
            let main_id = i;
            let markup = element[2].markup;
            
            let newElement = [name,category,main_id,markup,{}];
            this.setProps(newElement);
            this.all.elements.push(newElement);
    
            if (!this.categories.categorySet.includes(category)) {
                this.categories.categorySet.push(category);
            }
        }
        // Populate Categories
        for (const category of this.categories.categorySet) {
            this.categories[category] = {
                elements: [],
            };
            const tmpArr = [];
            let i = 0;
            this.all.elements.forEach(index => {
                if(index[1] == category) {
                    tmpArr.push(index)
                    index[4].category_id = i;
                    i++;
                }
            })
            this.categories[category].elements = tmpArr;
        }
    }

    setProps(index) {
        const props = index[4];
        props.id = index[2];
        props.displayName = index[0];
        props.category = index[1];
        props.isFavorite = false;
        props.knownCollections = [];
        props.HTML = {};
        props.CSS = {};
        props.play = function(){};
        props.update = function(){};
    }
    createCollection(name,elements = []) {
        if (!this.collections.collectionSet.includes(name)){
            this.collections.collectionSet.push(name)
        }
        this.collections[name] = elements
    }
    removeCollection(name) {
        delete this.collections[name]
    }
    addToCollection(name, element) {
        const collection = this.collections[name];
        collection.elements.push(element);
    }
    removeFromCollection(elements) {

    }
    // sortArrayByName(arr) {
    //     function flattenString(str) {
    //         let x = str.toString();
    //          return str.toUpperCase().replaceAll(' ', '').replaceAll('_', '');
    //     }

    //     let aZ = arr.slice().sort((a,b) => {
    //         if (flattenString(a[0]) > flattenString(b[0])) {
    //             return 1;
    //         } else {
    //             return -1
    //         }
    //     });
    //     let zA = arr.slice().sort((a,b) => {
    //         if (flattenString(a[0]) > flattenString(b[0])) {
    //             return -1;
    //         } else {
    //             return 1
    //         }
    //     });
    //     return {
    //         aZ,
    //         zA,
    //     }
    // }
    // sortArrayByCategory(arr) {
    //     return arr.slice().sort((a,b) => {
    //         a[1] - b[0];
    //     })
    // }
}

let list = [];
let model;

const preview_interface = {
    currentContext: null,
    currentCategory: null,
    get_context: function() {
        return document.querySelector('.display svg')
    },
    current: null,
    next: null,
    prev: null,
    knownCollections: null,
    isFavorite: null,
    settings: {
        position: {},
        color: {},
    },
    update(element,context) {
        if(context === "all") {
            this.currentContext = model.all.elements;
            this.currentCategory = "all"
        }
        this.currentContext = model.categories[context].elements;
        this.currentCategory = context
    }
}

const catergoryButton = document.querySelector('.categories');
const collectionButton = document.querySelector('.collections');
const markupButton = document.querySelector('.docs');
const searchBarContainer = document.querySelector('.searchbar-passive');
const searchIcon = document.querySelector('.search');
const searchInput = document.querySelector('.searchbar-passive input');
const clickOutsideModal = document.querySelector('.cosm');
const closeButton = document.querySelector('.btn-close');
const sidebar = document.querySelector('.sidebar');

const sidebarFactory = createElementFactory(sidebar,clickOutsideModal);
const searchbarFactory = createElementFactory(searchBarContainer);
const searchButtonFactory = createElementFactory(searchIcon);

sidebarFactory.openOnClick(catergoryButton);
sidebarFactory.openOnClick(markupButton);
sidebarFactory.openOnClick(collectionButton);
sidebarFactory.closeOnClick(closeButton);
sidebarFactory.closeOnClick(clickOutsideModal);

// ------------------------------ //
// SEARCH BAR METHODS
// --------------------//
searchbarFactory.setOpenCloseToggler(searchIcon);
searchbarFactory.onMouseOut(closeSearch)

const focusSearchbar = elementFactory.focusElement(searchInput);
function closeSearch() {
    var searchbar = document.querySelector('.searchbar-passive')
    searchbar.classList.remove('open');
    searchbar.dataset.state='closed';
}

// -------------------------------//
// SEARCH BUTTON METHODS
// ------------------- //
searchButtonFactory.onClick(closeOnMouseOut)
function closeSearchbar(removeListener=true) {
    var searchbar = document.querySelector('.searchbar-passive');
    searchbar.dataset.state='closed';
    searchbar.classList.remove('open');
    removeListener ? searchbar.removeEventListener('mouseleave',closeSearchbar) :
    console.log('somethings sticky here');
}
function closeOnMouseOut() {
    searchBarContainer.addEventListener('mouseleave', closeSearchbar)
    searchBarContainer.classList.contains('open') ? focusSearchbar() : 'inactive'
}

// -------------------------------------------------------------------------------------------------------------------------------- //

function createIcon(index) {

        let el = document.createElement('div');
        const props = index[4];
        const markup = index[3];
        el.dataset.id = props.id;
        el.dataset.category = props.category;
        el.dataset.cid = props.category_id;
        el.dataset.name = props.displayName;
        el.dataset.role = 'svg_wrapper';
        el.classList.add('svg-wrapper');
        el.innerHTML = markup;

        hydrateIcon(el);

        return el;
}
// model.categories[document.querySelector('[data-role="dashboard_tab"][data-state="active"]').dataset.tab] || model.all.elements
function hydrateIcon(el) {
    el.addEventListener('click', (e) => {
        const html = el.innerHTML;
        const displayName = el.dataset.name.toString().replaceAll('_', ' ').toLowerCase();
        const displayCategory = el.dataset.category.toString().replaceAll('_', ' ');
        document.querySelector('[data-role="preview_icon"]').innerHTML = html;
        document.querySelector('[data-role="description_input"] .name').innerText = displayName;
        document.querySelector('[data-role="description_input"] .category').innerText = displayCategory;

        app.set_current(el);
    })

    el.addEventListener('dblclick', () => {
        const element = el.innerHTML;
        window.navigator.clipboard.writeText(element);
    })

    return;
}

function init_event_handlers(list,handler,event) {
    list.forEach(item => {
        item.addEventListener(event, (e) => {
            handler(e.target)
        })
    })
}

function tabber(listOfModals,listOfTabs) {
    return function (clicked_tab) {
            listOfModals.forEach(modal => {
                if(modal.dataset.tab === clicked_tab.dataset.tab) {
                    modal.dataset.state="active";
                }
                if(modal.dataset.tab !== clicked_tab.dataset.tab) {
                    modal.dataset.state="inactive";
                }
            })

            if (listOfTabs) {
                listOfTabs.forEach(
                    tab => {
                        if (clicked_tab != tab && tab.classList.contains('active')) {
                            tab.classList.remove('active');
                        }
                        if (!clicked_tab.classList.contains('active')) {
                            clicked_tab.classList.add('active');
                        }
                    }
                )
            }
        return;
    }
}

function toggler(tupleOfModals,toggler) {
        toggler.addEventListener('click', () => {
            tupleOfModals.forEach(modal => {
                modal.dataset.state == "active" ? modal.dataset.state = "inactive" : modal.dataset.state = "active";
            })
        })
}

const init_toggler = (tuple,toggle) => toggler(tuple, toggle);

// HYDRATE
function hydrateTabs() {
    const menuTabs = [...document.querySelectorAll('[data-role="menu_tab"]')];
    const menuModals = [...document.querySelectorAll('[data-role="menu"]')];

    const interfaceTabs = [...document.querySelectorAll('[data-role="interface_tab"]')];
    const interfaceModals = [...document.querySelectorAll('[data-role="interface_menu"]')];

    const collections_interface_toggler =  document.querySelector('.a2c');
    const collections_interface_toggler2 = document.querySelector('.collections_interface .btn-back');
    const collections_interface_modals = [document.querySelector('.interface'),document.querySelector('.collections_interface')];

    const category_modals = [...document.querySelectorAll('[data-role="dashboard_tab"]')];
    const category_tabs = [...document.querySelectorAll('[data-role="tab_link"]')];


    const interface_tab_handler = tabber(interfaceModals,interfaceTabs);
    const menu_tab_handlers = tabber(menuModals);
    const category_tab_handlers = tabber(category_modals,category_tabs);
    init_toggler(collections_interface_modals,collections_interface_toggler);
    init_toggler(collections_interface_modals,collections_interface_toggler2);

    init_event_handlers(menuTabs,menu_tab_handlers,'click');
    init_event_handlers(interfaceTabs,interface_tab_handler,'click');
    init_event_handlers(category_tabs,category_tab_handlers,'click');
}

const hydrators = [ hydrateTabs ]
const hydrate = () => hydrators.forEach(hydrator => hydrator());

// BUILD
function build_all_tab() {
    const dashboard = document.querySelector('[data-role="dashboard_tab"][data-tab="all"]');
    const frag = document.createDocumentFragment();
    const elements = model.all.elements;
    for (let i = 0; i < elements.length; i++) {
        frag.appendChild(createIcon(elements[i]));
    }
        dashboard.innerHTML = '';
        dashboard.append(frag);
        dashboard.dataset.state='active';
}

function build_category_menu() {
    const category_menu = document.querySelector('.side-menu[data-tab="categories"] .menu-links');
    category_menu.innerHTML = '';
    const menuFrag = document.createDocumentFragment();

    model.categories.categorySet.forEach(
        category => {
            const str = category.toString();
            const tab = str[0].toUpperCase() + str.substring(1);
            const li = document.createElement('li');
            li.dataset.tab = category;
            li.dataset.role = 'tab_link';
            li.innerText = tab;
            menuFrag.appendChild(li);
        }
    )
    category_menu.append(menuFrag);
    
    const category_tabs = [...document.querySelectorAll('.side-menu[data-tab="collections"] .menu-links li')];
}

function build_collections_menu() {
    const collections_menu = document.querySelector('.side-menu[data-tab="collections"] .menu-links');
    const collections_interface = document.querySelector('.collections_interface');
    const collection_set = model.collections.collectionSet;
    collections_menu.innerHTML = '';
    const collectionsFrag = document.createDocumentFragment();
    const collectionsFrag2 = document.createDocumentFragment();

    if (collection_set.length === 0) {
        const noDice = document.createElement('div');
        noDice.classList.add('no-known-collections');
        noDice.innerText = "You Have No Collections!";
        menuFrag.append(noDice);
        collections_menu.append(menuFrag);
    } else {
    model.collections.collectionSet.forEach(
            collection => {
                const str = collection.toString();
                const tab = str[0].toUpperCase() + str.substring(1);
                const li = document.createElement('li');
                li.innerText = tab;
                collectionsFrag.appendChild(li);
                collectionsFrag2.appendChild(li);
            }
        )
    }
    collections_menu.append(collectionsFrag);
    collections_interface.append(collectionsFrag2);
}

function build_dashboard_tab(arr,tab) {
        const dashboard = document.querySelector('.svg-dashboard');
        const dashFrag = document.createDocumentFragment();
        const dash = document.createElement('div');

        dash.dataset.tab = tab;
        dash.dataset.type = 'categories';
        dash.dataset.role = 'dashboard_tab';
        dash.dataset.state = 'inactive';

        for (let i = 0; i < arr.length; i++) {
            dash.appendChild(createIcon(arr[i]))
        }



        dashFrag.append(dash);
        dashboard.appendChild(dashFrag);
}

function build_dashboard() {
    model.categories.categorySet.forEach(category => {
        build_dashboard_tab(model.categories[category].elements,category);
    })



}

const builders = [ build_all_tab , build_category_menu, build_collections_menu , build_dashboard ];
const build = () => builders.forEach(builder => builder());

// OBSERVE
const app = {

};

// ------------------------------------------------------------- //
// BUILD STEP //
// ------------------------------------------------------------- //
(function loadData() {
    fetch('./data/icons.json')
        .then((res) => { return res.json()})
        .then((data) => {
            data.forEach(el => {
                list.push(el)
                // console.log(el);
            })
            model = new SvgModel(list);
            console.log(model);
            console.log(list)
            build();
            hydrate();
        })
})()