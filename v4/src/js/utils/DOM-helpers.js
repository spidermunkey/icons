import * as R from 'ramda'

export {R};
const curry = R.curry;
// export const pipe = R.pipe;
// export const compose = R.compose;

// export const post = axios.post;
// export const get = axios.get;

export var $ = (arg,element = document) => element.querySelector(arg)
export var $$ = (arg,element = document) => Array.from(element.querySelectorAll(arg));
export var log = (...args) => console.log.apply(this,args);
export var err = (...args) => console.log.call(this,args);

export function createElement({ 
    tagName, 
    classList, 
    text, 
    data, 
}) 
{
    el = document.createElement(tagName)
    classList.forEach(cls => {
        el.classList.add(cls);
    });
    data.forEach((attr,value) => {
        el.dataset[attr] = value;
    });
    el.textContent = text;
    return element;
}

export const frag = () => document.createDocumentFragment();
export const divit = () => document.createElement('div');
export const ulit = () => document.createElement('ul');
export const appendit = curry((parent,child) => parent.append(child));
export const appenditchild = curry((parent,child) => parent.appendChild(child))
export const followMouseFromEventTarget = event => {
    const { currentTarget: target } = event;

    const rect = target.getBoundingClientRect(), 
        mouseXFromTarget = e.clientX - rect.left,
        mouseYFromTarget = e.clientY - rect.top;

    return {
        x: mouseXFromTarget,
        y: mouseYFromTarget,
        mouseX: e.clientX,
        mouseY: e.clientY,
    }
}

export const followMouseFromCoords = coords => event => {
    const { clientX,clientY } = event;
    const { x, y } = coords;
    return {
        x: clientX - x,
        y: clientY - y,
    }
}

export const clearField = inp => inp.value = "";
export const clearForm = form => $$("input",form).forEach(clearField)

// always returns response.json()
export const httpPost = async function(url = "",data = {}) {

    const response = await fetch( url ,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

    if (response.ok) {
        const result = await response.json();
        return result
    }
    console.log('resonse not ok' ,response)
}

// always returns response.json()
export const httpGet = async function(url = "") {

    const response = await fetch(url);
    
    if (response.ok) {
        const result = await response.json();
        return result
    }
    
}

export const bang = num => num == 1 ? 0 : num == 0 ? 1 : num;

export const filter = curry((f, xs) => xs.filter(f));

export const isNum = value => R.is(Number,value) && value !== NaN;
export const isArray = value => R.is(Array, value);
export const isObj = value => R.is(Object, value);

export const add = curry((x,y) => x + y);
export const subtract = curry((x,y) => y - x);
export const incer = add(1);
export const decer = subtract(1);
export const modulo = curry((x,y) => y % x);
export const isOdd = modulo(2);
export const isEven = num => bang(isOdd(num));


export const addList = (args) => args.reduce(add);
export const getOdds = filter(isOdd);

export const toPair = f => ([x,y]) => f(x,y);
export const fromPair = f => (x,y) => f([x,y]);
export const flip = f => (y,x) => f(x,y);
export const uncurry = f => (x,y) => f(x)(y);

export const capitalize = word => R.head(word).toUpperCase() + word.slice(1);
export const toUpper = str =>str.toUpperCase();
export const exclaim = str => str + '!';
export const first = xs => xs[0];

export const split = curry((delimeter,string) => string.split(delimeter)); 
export const splitWords = split(' ');
export const replaceString = curry((regex, replacement, str) => str.replace(regex, replacement));
export const replaceVowels = w => replaceString(/[AEIOU]/ig,w)
export const concat = curry((y,x) => x + y);

export function sanitize(string) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
            "`": '&grave;',
            '`': '&#x60;',
            '=': '&#x3D;',
        };
        const reg = /[&<>"'/]/ig;
        return string.replace(reg, (match)=>(map[match]));
}

// export const match = regex => str => str.match(regex)
// export const strCheck = (success,err) => str => match(str) ? success(str) : err(str)

export function checkSTR(string) {
    if(string.match(/^[0-9a-zA-Z]{1,16}$/)){
        //The id is fine
    }
    else{
        //The id is illegal
    }
}

export function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    })
}