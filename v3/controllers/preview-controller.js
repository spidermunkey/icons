var interfaceTabs = [...document.querySelectorAll('.tab_section [data-role="tab"]')];
var interfaceModals = [...document.querySelectorAll('.modal_container [data-role="modal"]')];

const toggleBtns = [...document.querySelectorAll('[data-role="slider_button"]')];

const animeListItems = [...document.querySelectorAll('.animation_list .list-item')];
const animeListHeaders = [...document.querySelectorAll('.animation_list .list-header')];

let icon_observer = {
    el: null,
    start: null,
    leftBound: null,
    rightBound: null,
    position: 0,
}

document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove',trackX);
        icon_observer.element = null;
})


function initHandlers(list,handler,event) {
    list.forEach(item => {
        item.addEventListener(event, (e) => {
            requestAnimationFrame(() => handler(e.target));
        })
    })
}

function trackX(e) {

    icon_observer.position = distance;
    if (x > icon_observer.leftBound && x < icon_observer.rightBound) {
    icon_observer.el.style.transform = `translateX(${distance}px)`
    
    console.log(Math.floor(distance/(266/100)) + '%');
    }
}
function init_slider(target) {
    icon_observer.el = target;
    icon_observer.leftBound = target.parentElement.getBoundingClientRect().x;
    icon_observer.rightBound = target.parentElement.getBoundingClientRect().right - 16;
    icon_observer.start = target.getBoundingClientRect().x;
    document.addEventListener('mousemove', trackX)
}

function toUpper(str) {
    const fixed = str[0].toUpperCase() + str.substring(1);
    return fixed.toString();
}

function upperSentence(phrase) {
    const arr = phrase.split(" ");
    arr.forEach((word,index) => {
        word = toUpper(arr[index])
    })
    return arr.join(" ").toString();
}

function fixCamelCase(str) {
    const fixed = str.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1).join(" ")
    const newStr = toUpper(fixed);
    return newStr.toString();
}

function fixSnakeCase(str) {
    const fixed = str.replace("_"," ")
    const newStr = toUpper(fixed);
    return newStr
}

animeListHeaders.forEach(header => {
    let txt = header.innerText;
    let newTxt = fixSnakeCase(txt);
    header.innerText = upperSentence(newTxt);
})
animeListItems.forEach(item => {
    let txt = item.innerText;
    item.innerText = fixCamelCase(txt);
})

initHandlers(toggleBtns,init_slider,'mousedown');