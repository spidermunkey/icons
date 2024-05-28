const animeInterface = document.querySelector('.animation-interface');
const collectionInterface = document.querySelector('.collection-interface');
const collectionsOpenButton = document.querySelector('.download');
const collectionsCloseButton = document.querySelector('.collection-interface svg') 

function toggleFavorites() {
    // push/pop from favorites array
    // if state.tab == favorites append/remove element now.
    // run animation
    var el = document.querySelector('.favorite');
    var icon = document.querySelector('.favorite svg');
    // console.log(el.dataset.isFavorite)
    if(el.dataset.isFavorite === 'true') {
        el.dataset.isFavorite = 'false'
        el.style.background = 'rgb(233, 231, 231)'
        el.style.borderRadius = '16px'
        el.style.boxShadow = '1px 1px 8px 2px rgba(0, 0, 0, 0.06),0px 2px 4px 2px rgba(0, 0, 0, 0.108),inset 0px 0px 1px 1px rgba(0, 0, 0, 0.377)'                    
        icon.style.fill = '#333'
        console.log(el.dataset.isFavorite);
        return
    }
    el.dataset.isFavorite = 'true';
    el.style.background = 'rgba(120, 119, 119, 0.777)'
    icon.style.fill = 'rgba(255, 230, 0, 0.932)'
    el.style.boxShadow = '1px 1px 8px 2px rgba(0, 0, 0, 0.06),0px 2px 4px 2px rgba(0, 0, 0, 0.108)'
    // el.style.borderRadius = '50%';
    console.log(el.dataset.isFavorite)
}

function toggleCopied() {
    document.querySelector('.copy--success').style.transform = 'scale(1)';
    document.querySelector('.copy--success').style.opacity = '1';
    document.querySelector('.copy > svg').style.opacity = '0';
    document.querySelector('.copy--success svg').style.transform = 'translate(0)';

    function reverse() {
        document.querySelector('.copy--success').style.opacity = '0';
        document.querySelector('.copy--success').style.transform = 'scale(0)';
        document.querySelector('.copy--success svg').style.transform = 'translateY(100px)';
        document.querySelector('.copy > svg').style.opacity = '1';
        
    }
    setTimeout(() => {
        reverse()
    },850);
}
animeCopy = function() {
    requestAnimationFrame(toggleCopied)
}
function transformX(el,dist,sfx='%') {
    el.style.transform = `translateX(${dist+sfx})`;
};
function makeTransparent(el) {
    el.style.opacity = '0';
}
function makeVisible(el, initial='1') {
    el.style.opacity = initial
}
function toggleAnimationInterface() {
    if (animeInterface.dataset.state === 'open') {
        transformX(animeInterface,0);
        return animeInterface.dataset.state = 'closed';
    }
    transformX(animeInterface,-50);
    animeInterface.dataset.state = 'open';
    console.log(animeInterface.dataset.state)
}
function closePlay() {
    animeInterface.style.transform = 'translateX(0)';
    animeInterface.dataset.state = 'closed'
}
function toggleCollectionsInterface() {
    // let otherEls = [...document.querySelectorAll('.svg-interface > *')]
    if (collectionInterface.dataset.state === 'open') {
        transformX(collectionInterface,0);
        makeTransparent(collectionInterface);
        // otherEls.forEach(el => makeVisible(el));
        return collectionInterface.dataset.state = 'closed';
    }
    transformX(collectionInterface,-100);
    makeVisible(collectionInterface);
    // otherEls.forEach(el => makeTransparent(el))
    return collectionInterface.dataset.state = 'open';
}

document.querySelector('.copy').addEventListener('click', () => animeCopy())
document.querySelector('.favorite').addEventListener('click', () => toggleFavorites())
document.querySelector('.play').addEventListener('click', () => toggleAnimationInterface())
document.querySelector('.animation-interface span').addEventListener('click',() => closePlay());
collectionsOpenButton.addEventListener('click', () => toggleCollectionsInterface());
collectionsCloseButton.addEventListener('click',() => toggleCollectionsInterface());