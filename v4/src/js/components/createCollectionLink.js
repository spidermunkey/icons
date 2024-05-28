import {from} from '../utils/Date.js'
import  {capitalize} from '../utils/DOM-helpers.js'

export function collectionLink(name,collectionSize) {

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