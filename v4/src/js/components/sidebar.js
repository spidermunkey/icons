import { Modal , DynamicModal , Tabber } from './js/utils/DOM.js'


const menuTabber = new Tabber();
const categoryMenuModal = $('#CATEGORIES .modal__menu--items');
const collectionMenuModal = $('#COLLECTIONS .modal__menu--items');

$$(".sidebar .tab[data-type='nested']").map(  group => {
    
    const tButton = $('.tab__button',group);
    const tModal = $('.tab__modal',group);
    const tCloser = $('.btn.close-modal',tModal);
    const tName = tButton.dataset.tab;

    const modal = new Modal(tModal);

    if (tCloser) modal.bindCloser(tCloser)

    modal.bindOpener(tButton);
    modal.bindTabber(menuTabber);
    
    modal.openTimeLine.subscribe(function() {
        this.element.classList.add('active');
    })
    
    // adding css closing visuals here
    modal.closeTimeLine.subscribe(function() {
        this.element.classList.remove('active')
    })
    return [ tName , { button:tButton , panel: tModal, modal: modal } ]

})

