import { capitalize , ulit , appendit } from "../utils/DOM-helpers"
import { from } from '../utils/Date.js'
import { capitalize } from '../utils/DOM-helpers.js'

export function MenuList(listOfNames) {

    this.element = ulit();
    this.element.classList.add('menu-items');
    
    this.addItem = (name) => {
        const newLink = MenuListItem(name);
        appendit( this.element, newLink );
        return newLink
    }
    this.appendTo = parent => appendit( parent, this.element);
    this.cloneTo = parent => appendit( parent, this.element.cloneNode(true));
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


export const MenuListItem = (name) => {
    const li = document.createElement('li');
    li.classList.add('modal__menu--items-item');
    li.dataset.tab = name;
    li.textContent = capitalize(name);
    return li
}


export function A2CMenuList(listOfNames) {

    this.element = ulit();
    this.element.classList.add('menu-items');
    this.links = new Map();

    this.appendTo = parent => appendit( parent, this.element);
    this.cloneTo = parent => appendit( parent, this.element.cloneNode(true));
    
    this.replaceItems = listOfNames => {
        this.innerHTML = ''; 
        listOfNames.forEach(this.addItem)
    }

    this.addItem = (name,collectionSize) => {
        const link = new A2CLink(name,collectionSize);
        this.links.set(name,link)
        appendit( this.element, link.element);
        return link
    }


    listOfNames.forEach(this.addItem)
}

export function A2CLink(name,collectionSize) {

    this.createdOn = new Date(Date.now());
    this.prettier = this.createdOn.toDateString();
    
    this.getTimeSince = () => from(this.createdOn).string;
    
    this.element = document.createElement('div');
    this.element.classList.add('collection-wrapper')
    this.element.dataset.collection=name

    this.updateStamp = () => $('.stamp',this.element).outerHTML = this.stamp();
    this.updateCollectionSize = () => $('.num',this.element).outerHTML = this.size();

    this.size = () => `<span class="num">${collectionSize}</span>`
    this.stamp = () => `<span class="stamp">Updated ${this.getTimeSince()}<span>`

    this.element.innerHTML = `<span class="name">${capitalize(name)}</span><span class="numberOfIcons"><span class="num">${collectionSize || 'NAN'}</span><span>  Icons </span></span><span class="timestamp">${this.stamp()}</span>`
};