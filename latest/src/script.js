// FILE TO MINIMIZE IMPORTS
const eventMaps = {
  enter(event){
    return event.keyCode == 13 || event.which == 13 || event.key == 'Enter'
  },
  backspace(event){
    return event.keyCode == 8;
  },
  leftClick(event){
    return event.button === 0;
  },
  rightClick(event){
    return event.button === 2;
  },
  dblclick(event = e){
    return event.detail === 2;
  },
  cosm(event,parent){
    return event.target.closest(parent)
  },
  clicked(event,elementClass){
    return event.target.closest(elementClass)
  },
  isNumber(event){
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  },
}

const root = document.documentElement;
const docStyle = root.style;
const date = {
  standard: undefined,
  default: undefined,
  universal: undefined,
  east: undefined,
  west: undefined,
  central: undefined,
  leap: false,
  dayMap: {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thurday',
      5: 'Friday',
      6: 'Saturday',
      7: null,
  },
  monthMap: {
      'January': 31,
      get 'February'(){
          if (this.leap) return 29
          return 28;
      },
      'March': 31,
      'April': 30,
      'May': 31,
      'June': 30,
      'July': 31,
      'August': 31,
      'September': 30,
      'October': 31,
      'November': 30,
      'December': 31,
  },
  days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday',null],
  daysABRV: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat', null],
  months: ['January','February','March','April','May','June','July','August','September','October','November','December', null],
  monthsABRV: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Nov', 'Dec', null],
  isLeap: (year) => {
      return ((year % 4 == 0) && (year % 100 !=0)) || (year % 400 == 0)     
  },
  getLeaps: (to,from) => {
      function countFrom(lowest,highest) {
          let leapSince = 0;
          for (let i = lowest; i <= highest; i++) {
              if (date.isLeap(i))
                  leapSince++;
          }
          return leapSince;
      }
      return to < from ? countFrom(to,from) : countFrom(from,to);
  }
}

const mns = 1/1000;
const snm = 1/60;
const mnh = 1/60; 
const hnd = 1/24;
const dny = 1/365;
const mny = 1/12;

const msns = 1000;
const msnMinute = 60000;
const msnHour = 3600000;
const msnDay = 86400000;
const msnYear = msnDay * 365;

function $(arg, context = document) {
  const element = context.querySelector(arg);

  if (!element || !(element instanceof Element)) return null;

  element.listen = function (callback, listener = "click", capture = false) {
    element.addEventListener(listener, callback, capture);
    return element;
  };

  return element;
}
function $$(arg, element = document) {
  const array = Array.from(element.querySelectorAll(arg));
  return array;
}
function getRoot(element) {
  return element.documentElement.style;
}
function getVar(variableName) {
  return getComputedStyle(root).getPropertyValue(variableName);
}
function setVar(variableName, value) {
  return root.style.setProperty(variableName, value);
}
function addClass(element, classToAdd) {
  element.classList.add(classToAdd);
}
function removeClass(element, classToRemove) {
  element.classList.remove(classToRemove);
}
function ago(msDate) {
    const now = Date.now();
    const then = new Date(msDate);
    
    const monthsInYear = 1/12;

    const msInWeek = 604800000;
    const msInDay = 86400000;
    const msInHour = 3600000;
    const msInMin = 60000;
    const msInSec = 1000;
    
    const monthOf = date.months[then.getMonth()]

    const daysIn = date.monthMap[monthOf];
    const dayOf = then.getDate();
    const days = daysIn - dayOf;

    const leapSince = date.getLeaps(then.getFullYear(), new Date(now).getFullYear())
    let msAgo = now - then.getTime();
    let context = 'ago'
    if (msAgo < 0) {
        context = 'til'
    }

    msAgo = Math.abs(msAgo);

    const years = msAgo / msnYear;
    const monthsAgo = getRemainder(years);
    const months = monthsAgo / monthsInYear;

    // const weeks = monthsAgo / weeksInYear;

    const weeksAgo = Math.floor(msAgo / msInWeek);
    const daysAgo = (Math.floor(msAgo / msInDay) + leapSince);
    const hoursAgo = Math.floor(msAgo / msInHour);
    const minutesAgo = Math.floor(msAgo / msInMin);
    const secondsAgo = Math.floor(msAgo / msInSec);

    const ago = {
        since: new Date(now),
        then: new Date(then),

        years: Math.floor(years),
        months: Math.floor(months),
        days: days,

        yearsAgo: years,
        weeksAgo: weeksAgo,
        daysAgo: daysAgo,
        hoursAgo: hoursAgo,
        minutesAgo: minutesAgo,
        secondsAgo: secondsAgo,

        leaps: leapSince,
        string: undefined,
    };
    
    if (ago.yearsAgo >= 1) {
        if (ago.months >= 1) 
            ago.string = `${ago.years} Years, ${ago.months} Months ${context}`
        else if (ago.months < 1 ) 
            ago.string = `${ago.years} Years ${context}`
    } else if (months < 12 & months >= 1) {
        let rounded = ago.months === 1 && days > 0 ? 2 : 1
        ago.string = `${rounded} ${rounded === 1 ? 'Month' : 'Months'} ${context}`
    }
    else if (ago.weeksAgo < 4 && ago.weeksAgo > 2) {
        ago.string = `${ago.weeksAgo} Weeks ${context}`
    }

    else if (ago.daysAgo < 14 && ago.daysAgo > 2) {
        ago.string = `${ago.daysAgo} Days ${context}`
    }
    else if (ago.hoursAgo <= 48 && ago.hoursAgo >= 1) {
        if (ago.hoursAgo < 2 && ago.hoursAgo >=1) {
            ago.string = `${ago.hoursAgo} Hour ${context}`
        } else {
            ago.string = `${ago.hoursAgo} Hours ${context}`
        }
    }
    else if (ago.minutesAgo < 59 && ago.minutesAgo > 1) {
        ago.string = `${ago.minutesAgo} Minutes ${context}`
    }
    else if (ago.secondsAgo < 60 && ago.secondsAgo > 30) {
        ago.string = `${ago.secondsAgo} Seconds ${ago}`
    }
    else if (ago.secondsAgo < 30) {
        ago.string = `Just Now`
    }
    else {
        return ago;
    }
    ago.time = ago.string.split(' ')[0];
    ago.suffix = ago.string.split(' ')[1];
    ago['context'] = context;

    return ago;
}

function log() {
  console.log.apply(this, arguments);
}
function err() {
  console.log.apply(this, arguments);
}

function each(argList, callback) {
  return argList.map(callback);
}

function listenAll(elements, callback, listener = "click") {
  each(elements, (element) => listen(element, callback, listener));

  return elements;
}
function listen( //element passed always last argument instead of being used as this context
  element = document,
  callback,
  listener = "click",
  capture = false,
) {
  if (!element) {
    console.warn('no element passed to listen  function')
    return;
  }
  // let context = this;
  element.addEventListener(
    listener,
    function (event) {
      callback.apply(callback,[event, ...arguments, element]);
    },
    capture
  );
}
function mapEvents(event){
  const e = event;
  return {
    enter(event = e){
      return event.keyCode == 13 || event.which == 13 || event.key == 'Enter'
    },
    backspace(event = e){
      return event.keyCode == 8;
    },
    leftClick(event = e){
      return event.button === 0;
    },
    rightClick(event = e){
      return event.button === 2;
    },
    dblclick(event = e){
      return event.detail === 2;
    },
    cosm(parent, event = e){
      return event.target.closest(parent)
    },
    clicked(elementClass, event = e){
      return event.target.closest(elementClass)
    },
    isNumber(event = e){
      var charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
      return true;
    },
  }
}
function clicked(elementClass, event) {
  return eventMaps.clicked(event,elementClass)
}
function cosm(parentTagName) {
  return (event) => event.target.closest(parentTagName)
}
function followMouseFromEventTarget(event) {
  const { currentTarget: target } = event;

  const rect = target.getBoundingClientRect(),
    mouseXFromTarget = e.clientX - rect.left,
    mouseYFromTarget = e.clientY - rect.top;

  return {
    x: mouseXFromTarget,
    y: mouseYFromTarget,
    mouseX: e.clientX,
    mouseY: e.clientY,
  };
}
function followMouseFromCoords(coords) {
  return function (event) {
    const { clientX, clientY } = event;
    const { x, y } = coords;

    return {
      x: clientX - x,
      y: clientY - y,
      mouseX: clientX,
      mouseY: clientY,
    };
  };
}
function boundary(element){
  return element.getBoundingClientRect();
}

function throttle(fn, wait = 60) {
  var time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn.call(this,...arguments);
      time = Date.now();
    } else return;
  }
}
function debounce(fn,interval = 60) {
  var time = Date.now();
  let timeoutId;
  return function() {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.call(this,...arguments);
      time = Date.now();
    },interval)
    return time
  }

}
function nextTick(callback) {
  return setTimeout(callback, 0);
}

function toDecimal(num) {
  return num / 100;
}
function getRemainder(float) {
  return float - Math.floor(float);
}
function currentTime() {
  return new Date().toLocaleTimeString();
}
function toClipboard(value, message) {
  window.navigator.clipboard.writeText(value)
  if (message) console.log("message from clipboard", message)
}
function uuid() {
  let time = Date.now().toString(36).toLocaleLowerCase();
  // random high number
  let randomNumber = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
  // random high num to hex => "005EIPQUTQ64" => add 0s to make sure its 12digits
  randomNumber = randomNumber.toString(36).slice(0, 12).padStart(12, "0").toLocaleUpperCase();
  // coerce into a string
  return "".concat(time, "-", randomNumber);
}

function createToggleList(elements, classList = ["active"]) {
  // console.log('creating a toggle list with elements',elements,'toggling between the class(s)',classList)
  function toggle(element) {
    elements.forEach((element) => element.classList.remove(...classList));
    element.classList.add(...classList);
  }
  elements.forEach((element) => element.addEventListener("click", toggle))
  return {
    classList,
    elements: [...elements],
    toggle,
    add: function (element) {
      this.elements.push(element);
    },
  };
}
function frag() {
  return document.createDocumentFragment();
}
function div(classList = [], styleProps = {}, attrs = {}, children) {
  const div = document.createElement("div");
  if (classList.length > 0) div.classList.add(...classList);

  if (styleProps) {
    for (prop in styleProps) {
      console.log(prop);
      console.log(styleProps[prop]);
      div.style[prop] = styleProps[prop];
    }
  }

  if (children) {
    children.forEach(div.appendChild);
  }

  return div;
}
function ul() {
  return document.createElement("ul");
}
function li() {
  return document.createElement("li");
}
function inp(){
  return document.createElement('input')
}
function span() {
  return document.createElement("span");
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}
function uppercase(str) {
  return str.split('').map((x) => (x = x.toUpperCase())).join("");
}
function lowercase(str) {
  return str.split('').map((x) => (x = x.toLowerCase())).join("");
}
function exclaim(str) {
  return str + "!";
}

function first(value,n=1) {
  return value.slice(0,n);
}
function last(value,n=1) {
  return value[value.length - n];
}

function isValidHex(str){
    // Regular expression to match a valid hexadecimal color code
    const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    // Check if the string matches the regular expression
    if (!hexRegex.test(str)) {
        return false; // Not a valid hexadecimal color code
    }
    // Check if the string starts with '#' and remove it if present
    if (str.charAt(0) === '#') {
        str = str.substring(1);
    }
    // If the string has 3 characters, expand it to 6 characters
    if (str.length === 3) {
        str = str.split('').map(c => c + c).join('');
    }
    // Try to create a new <div> element with the color and check if it is a valid CSS color
    const div = document.createElement('div');
    div.style.color = '#000'; // Set the color to black (default)
    div.style.color = '#' + str; // Set the color to the provided hexadecimal code
    return div.style.color !== '#000'; // If the color was successfully set, it's a valid CSS color
}
function isValidNamedColor(str){
  const namedColors = {
    aliceblue: "#F0F8FF",
    antiquewhite: "#FAEBD7",
    aqua: "#00FFFF",
    aquamarine: "#7FFFD4",
    azure: "#F0FFFF",
    beige: "#F5F5DC",
    bisque: "#FFE4C4",
    black: "#000000",
    blanchedalmond: "#FFEBCD",
    blue: "#0000FF",
    blueviolet: "#8A2BE2",
    brown: "#A52A2A",
    burlywood: "#DEB887",
    cadetblue: "#5F9EA0",
    chartreuse: "#7FFF00",
    chocolate: "#D2691E",
    coral: "#FF7F50",
    cornflowerblue: "#6495ED",
    cornsilk: "#FFF8DC",
    crimson: "#DC143C",
    cyan: "#00FFFF",
    darkblue: "#00008B",
    darkcyan: "#008B8B",
    darkgoldenrod: "#B8860B",
    darkgray: "#A9A9A9",
    darkgreen: "#006400",
    darkkhaki: "#BDB76B",
    darkmagenta: "#8B008B",
    darkolivegreen: "#556B2F",
    darkorange: "#FF8C00",
    darkorchid: "#9932CC",
    darkred: "#8B0000",
    darksalmon: "#E9967A",
    darkseagreen: "#8FBC8F",
    darkslateblue: "#483D8B",
    darkslategray: "#2F4F4F",
    darkturquoise: "#00CED1",
    darkviolet: "#9400D3",
    deeppink: "#FF1493",
    deepskyblue: "#00BFFF",
    dimgray: "#696969",
    dodgerblue: "#1E90FF",
    firebrick: "#B22222",
    floralwhite: "#FFFAF0",
    forestgreen: "#228B22",
    fuchsia: "#FF00FF",
    gainsboro: "#DCDCDC",
    ghostwhite: "#F8F8FF",
    gold: "#FFD700",
    goldenrod: "#DAA520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#ADFF2F",
    honeydew: "#F0FFF0",
    hotpink: "#FF69B4",
    indianred: "#CD5C5C",
    indigo: "#4B0082",
    ivory: "#FFFFF0",
    khaki: "#F0E68C",
    lavender: "#E6E6FA",
    lavenderblush: "#FFF0F5",
    lawngreen: "#7CFC00",
    lemonchiffon: "#FFFACD",
    lightblue: "#ADD8E6",
    lightcoral: "#F08080",
    lightcyan: "#E0FFFF",
    lightgoldenrodyellow: "#FAFAD2",
    lightgray: "#D3D3D3",
    lightgreen: "#90EE90",
    lightpink: "#FFB6C1",
    lightsalmon: "#FFA07A",
    lightseagreen: "#20B2AA",
    lightskyblue: "#87CEFA",
    lightslategray: "#778899",
    lightsteelblue: "#B0C4DE",
    lightyellow: "#FFFFE0",
    lime: "#00FF00",
    limegreen: "#32CD32",
    linen: "#FAF0E6",
    magenta: "#FF00FF",
    maroon: "#800000",
    mediumaquamarine: "#66CDAA",
    mediumblue: "#0000CD",
    mediumorchid: "#BA55D3",
    mediumpurple: "#9370DB",
    mediumseagreen: "#3CB371",
    mediumslateblue: "#7B68EE",
    mediumspringgreen: "#00FA9A",
    mediumturquoise: "#48D1CC",
    mediumvioletred: "#C71585",
    midnightblue: "#191970",
    mintcream: "#F5FFFA",
    mistyrose: "#FFE4E1",
    moccasin: "#FFE4B5",
    navajowhite: "#FFDEAD",
    navy: "#000080",
    oldlace: "#FDF5E6",
    olive: "#808000",
    olivedrab: "#6B8E23",
    orange: "#FFA500",
    orangered: "#FF4500",
    orchid: "#DA70D6",
    palegoldenrod: "#EEE8AA",
    palegreen: "#98FB98",
    paleturquoise: "#AFEEEE",
    palevioletred: "#DB7093",
    papayawhip: "#FFEFD5",
    peachpuff: "#FFDAB9",
    peru: "#CD853F",
    pink: "#FFC0CB",
    plum: "#DDA0DD",
    powderblue: "#B0E0E6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#FF0000",
    rosybrown: "#BC8F8F",
    royalblue: "#4169E1",
    saddlebrown: "#8B4513",
    salmon: "#FA8072",
    sandybrown: "#F4A460",
    seagreen: "#2E8B57",
    seashell: "#FFF5EE",
    sienna: "#A0522D",
    silver: "#C0C0C0",
    skyblue: "#87CEEB",
    slateblue: "#6A5ACD",
    slategray: "#708090",
    snow: "#FFFAFA",
    springgreen: "#00FF7F",
    steelblue: "#4682B4",
    tan: "#D2B48C",
    teal: "#008080",
    thistle: "#D8BFD8",
    tomato: "#FF6347",
    turquoise: "#40E0D0",
    violet: "#EE82EE",
    wheat: "#F5DEB3",
    white: "#FFFFFF",
    whitesmoke: "#F5F5F5",
    yellow: "#FFFF00",
    yellowgreen: "#9ACD32"
  };
  return !!(namedColors[str])
}

function input(element) {
  this.element = null;
  if (!element){
    this.element = document.createElement('input')
  } else {
    this.element = element;
  }
  this.check = check.bind(this,this.element);
  this.uncheck = uncheck.bind(this,this.element);
  this.highlight = highlightInput.bind(this,this.element);
  this.disable = disable.bind(this,this.element);
  this.enable = enable.bind(this,this.element);
  this.throttle = throttleInput.bind(this,this.element);
  this.isEmpty = () => this.element.value === 0 || this.element.value === "0" || this.element.value === "";
  this.focus = () => this.element.select();
  return this
}
function check(input) {
  input.checked = true;
}
function uncheck(input) {
  input.checked = false;
}
function checkAll(inputGroup) {
  inputGroup.forEach((inp) => (inp.checked = true));
}
function uncheckAll(inputGroup) {
  inputGroup.forEach((inp) => (inp.checked = false));
}
function focusInputOnClick(event, placholder) {
  let input = event.target;
  if (input.nodeName !== "INPUT") return;
  if (placholder && typeof placholder == "string") input.value = placholder;

  // console.log(placholder)
  input.select();
  return input;
}
function clearField(input) {
  input.value = "";
  return input;
}
 function clearForm(form) {
  $$("input", form).map(clearField);
  return form;
}
function allChecked(inputGroup) {
  return inputGroup.every((inp) => inp.checked == true);
}
 function noneChecked(inputGroup) {
  return inputGroup.every((inp) => inp.checked == false);
}
 function oneChecked(inputGroup) {
  return inputGroup.some((inp) => inp.checked == true);
}
 function oneUnchecked(inputGroup) {
  return inputGroup.some((inp) => inp.checked == false);
}
 function disable(submitInput) {
  submitInput.disabled = true;
}
 function enable(submitInput) {
  submitInput.disabled = '';
}
function highlightInput(input) {
  input.focus();
  input.select();
  return input;
}
 function isEmptyNumberInput(input) {
  return input.value === 0 || input.value === "0" || input.value === "";
}
function throttleInput(input, time) {
  /* 
        https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
        The disabled attribute is supported by 
        <button>, <fieldset>, <optgroup>, <option>, <select>, <textarea> and <input>.
    */
    input.disabled = true;
    setTimeout(() => (input.disabled = false), time);
  return;
}
function focusInput(input, value) {
  if (!!value) input.value = value;
  input.select();
  return input;
}


function has(obj,property){
  return Object.hasOwn(obj,property);
}
function objMerge(targetObj, mergingObj) {
  return {
    ...structuredClone(targetObj),
    ...structuredClone(mergingObj),
  };
}
function equal(o1,o2){
  if (o1 === o2) 
    return true;

  if (!isObj(o1) || !isObj(o2))
    return false;

  const o1keys = keys(o1);
  const o2keys = keys(o2);

  if (o1keys.length !== o2keys.length)
    return false;

  for (const key of o1keys)
    if (o1[key] !== o2[key]) return false;

  return true;
}
function deepEqual(x, y, z) {
  // https://stackoverflow.com/questions/25456013/javascript-deepequal-comparison
  if (x === y) return true; // test primitives first
  if (typeof x == "function" &&  y && x.toString() == y.toString()) return true; // test function definitions
  // test objects by first type by comparing constructors
  // then test further by comparing length of keys
  // finally recursively compare keys until all types, keys, and primitives have been checked
  return x && y && typeof x == "object" && x.constructor == y.constructor && (z = Object.keys(y)) && z.length == Object.keys(x).length && !z.find(v => !deepEqual(x[v], y[v]))
}
function isObj(obj){
    return !(typeof obj !== 'object' || Array.isArray(obj) || obj === null )
}
function objMap(obj,fun){
  return objToArray(obj).map(fun);  
}
function objToArray(obj){
  let arr = []
  for (const key in obj){
    arr.push(obj[key])
  }
  return arr
}

function filterObjects(objects,nestedProperty){ // get array of nested property in group of objects i.e. <name>
  let arr = []
  for (const object in objects){
    if (objects[object] && objects[object][nestedProperty])
    arr.push(objects[object][nestedProperty])
  }
  return arr
}

function objToTuplesArray(obj){
  let arr = []
  for (const key in obj){
    arr.push([key,obj[key]])
  }
  return arr
}
function objectSizeOf(obj){
  const size = new Blob([JSON.stringify(obj)]).size;
  return {
    Bytes: size,
    KB: (size / 1024).toFixed(2),
    MB: (size / (1024 ** 2)).toFixed(2),
    GB: (size / (1024 ** 3)).toFixed(2),
    Formatted: formatSize(size),
  }
}
function formatSize(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
function objectLength(obj,ignoreList){
  if (!objectIsFalsey(obj)){
    const keys = ignoreList ? Object.keys(obj).filter(key => !ignoreList.some(i => i === key)) : Object.keys(obj)
    return keys.length
  } else {
    return 0;
  }
}
function objectIsEmpty(obj){
    for (const prop in obj) 
      if (Object.hasOwn(obj, prop)) 
        return false;
    return true;
}
function objectIsFalsey(obj){
    if (!isObj(obj)) return true
    else return objectIsEmpty(obj)
}

class Cursor {
    // Allows extends a basic array allowing easy access to the next and previous elements in a list
    // according to a pointer in memory
    // EXPECTS INDEXES TO START FROM 1 INSTEAD OF ZERO
    // INDEX OF 0 == "FIRST"
    // INDEX OF length-1 = "LAST"
    // expects callers to add one when using array indexes
    constructor(array, startingIndex = 1) {
      if (!Array.isArray(array))
        throw new Error(`expecting an array you passed ${array}`);
      if (isNaN(startingIndex))
        throw new Error(
          `expecting a number for startingIndex you passed ${startingIndex}`
        );
  
      let pointer;
      let items;
  
      if (startingIndex !== 0 && startingIndex < array.length - 1)
        this.pointer = startingIndex;
      if (array.length === 1 || array.length === 0) this.pointer = 1;
  
      this.items = ["first", ...array, "last"];
    }
  
    get first() {
      return this.items[1];
    }
    get last() {
      return this.items[this.items.length - 2];
    }
    get next() {
      return this.items[this.pointer + 1];
    }
    get prev() {
      return this.items[this.pointer - 1];
    }
    get current() {
      return this.items[this.pointer];
    }
    get all() {
      return this.items.filter((index) => index !== "first" && index !== "last");
    }
    get size() {
      return this.items.length - 2;
    }
    get isEmpty() {
      return this.size === 0;
    }
  
    validIndex(index) {
      if (isNaN(index)) return NaN;
      // console.log(`\nskip function was expecting a number... you passed ${index}`)
  
      if (index > this.size || index < 0) return undefined;
      // console.log(`\nuh oh....index of ${index} doesn\'t exist\ntry a number from 0 to ${this.size}\n`);
  
      return true;
    }
  
    setPointer(index) {
      if (!this.validIndex(index)) return;
  
      this.pointer = index;
      return this.items[index];
    }
  
    skipToIndex(index) {
      if (!this.validIndex(index)) return;
  
      return this.setPointer(index);
    }
    skipToElement(element) {
      const index = this.items.indexOf(element);
      if (index !== -1) this.skipToIndex(index)
    }
    getIndexOf(index) {
      if (!this.validIndex(index)) return;
  
      return this.items[index];
    }
  
    skipToNext() {
      if (this.next == "last") return this.setPointer(1);
      return this.setPointer(this.pointer + 1);
    }
  
    skipToPrev() {
      if (this.prev == "first") return this.setPointer(this.size);
      return this.setPointer(this.pointer - 1);
    }
  
    skipToLast() {
      return this.setPointer(this.size);
    }
  
    skipToFirst() {
      return this.setPointer(1);
    }
  
    pluck(index) {
      this.items = this.items.splice(index + 1, 1);
      return this;
    }
  
    addOne(element) {
      this.items.pop();
      this.items.push(element);
      this.items.push("last");
      return this;
    }
  
    addMany(elements) {
      this.items.pop();
      this.items.push(...elements);
      this.items.push("last");
      return this;
    }
  
    addOneAndSkipTo(element) {
        this.addOne(element);
        console.log('skipping to',this.items.indexOf(element))
        this.skipToIndex(this.items.indexOf(element))
    }
    
    update(elements, startingIndex = 1) {
      this.pointer = startingIndex;
      this.items = ["first", ...elements, "last"];
      return this;
    }
  
    nthSuffix(num) {
      if (!isNaN(num)) {
        let n = num;
        let suff;
        if (num > 20) {
          // convert to string
          let d = num.toString();
          // grab the last digit
          n = d[d.length - 1];
        }
  
        n == 1
          ? (suff = "st")
          : n == 2
          ? (suff = "nd")
          : n == 3
          ? (suff = "rd")
          : (suff = "th");
        return num.toString() + suff;
      }
      return `this function expects numbers`;
    }
  }
class Bucket {
    constructor() {
      this.items = new Map();
      this.identity = "bucket";
      this.idn = 0;
    }
  
    get size() {
      return this.items.size;
    }
    get keys() {
      return Array.from(this.items.keys());
    }
    get values() {
      return Array.from(this.items.values());
    }
    get copies() {
      return Array.from(this.items.values()).map(structuredClone);
    }
  
    push(key, value) {
      if (!this.items.has(key)) return this.items.set(key, value);
    }
  
    pluck(key) {
      return this.items.delete(key);
    }
  
    has(key) {
      return this.items.has(key);
    }
  
    use(key) {
      return this.items.get(key);
    }
  
    useValue(key) {
      return structuredClone(this.items.get(key));
    }
  
    spread(map) {
      let duplicates = this.compare(map);
      if (duplicates.length > 0) {
        console.error(`${duplicates.length} duplicates found in the keyset. No items were added`,duplicates);
        return duplicates;
      }
      map.forEach((value, key) => this.push(key, value));
      return this;
    }

    compare(map) {
      return Array.from(map.keys()).filter(this.has);
    }

    wipe() {
      this.items = new Map();
    }
}
class Observer {
  constructor(target) {
    this.Target = target;
    this.subscribers = new Set();
    this.priorities = new Set();
  }

  subscribe(...fns) {
    fns.forEach((fn) => 
      this.Target 
        ? fn = fn.bind(this.Target) 
        : this.subscribers.add(fn))
    return this;
  }

  unsubscribe(fn) {
    this.subscribers.delete(fn);
    return this;
  }

  prioritize(fn) {
    if (this.Target) fn = fn.bind(this.Target);
    this.priorities.add(fn);
  }

  unprioritize(fn) {
    this.priorities.delete(fn);
  }

  notify(...values) {
    for (const fn of this.priorities)
      if (fn) fn(...values);
    for (const fn of this.subscribers)
      if (fn) fn(...values);
  }
  get isEmpty() {
    return this.subscribers.size === 0;
  }

  get hasPriorities() {
    return this.priorities.size > 0;
  }
}
class Observable {
  constructor(targetThis, ...fns) {
    this.observer = new Observer(targetThis);
    if (fns)
      fns.forEach(fn => this.observer.subscribe(fn))
  }


  set() {
    this.notify();
    console.log('observer triggered',console.log(this))
  }

  subscribe(...fns) {
    this.observer.subscribe(...fns);
    return this;
  }

  unsubscribe(fn) {
    this.observer.unsubscribe(fn);
    return this;
  }

  prioritize(fn) {
    this.observer.prioritize(fn);
    return this;
  }

  unprioritize(fn) {
    this.observer.unprioritize(fn);
    return this;
  }

  notify(...values) {
    this.observer.notify(...values);
    return this;
  }

  get isEmpty() {
    return this.observer.isEmpty;
  }

  get hasPriorities() {
    return this.observer.hasPriorities;
  }

  get listeners() {
    return this.observer.listeners;
  }
  get priorities() {
    return this.observer.priorities;
  }

  static create(target) {
    return new Observable(target);
  }

  static observe(obj) {
    if (obj != null) {
      Object.assign(obj, {
        subscribe: this.subscribe.bind(obj),
        unsubscribe: this.unsubscribe.bind(obj),
        prioritize: this.prioritize.bind(obj),
        unprioritize: this.unprioritize.bind(obj),
        notify: this.notify.bind(obj),
        subscribe: this.subscribe.bind(obj),
        get isEmpty() {
          return this.observer.isEmpty;
        },
        get hasPriorities() {
          return this.observer.hasPriorities;
        },
      });
      return obj;
    }
  }
}
class Task {
  constructor(promiseFn,{ 
    name = '',
    min = 1500,
    max = null,
    onData = [],
    onLoading = [],
    onReady = [],
    poll = null,
  } = {}) {
    this.name = name;
    this.min = min;
    this.max = max;
    this.promise = promiseFn;
    this.state = undefined; // [undefined || loading || ready ]
    this.data = null;
    this.running = false;
    this.task = promiseFn;
    this.emitter = new EventEmitter();
    this.updateNeeded = true;
    onLoading.forEach(listener => this.onload(listener))
    onData.forEach(listener => this.ondata(listener))
    onReady.forEach(listener => this.onready(listener))
    if (poll) setInterval(this.run,poll)
  }
  getData = async (updateNeeded = this.updateNeeded) => {
    if (updateNeeded) {
      return await this.run();
    }
    else {
      this.emit("ready", this.data);
      return this.data
    }
  }
  run = async (...args) => {
    // handle minimum task interval
    if (this.running === true) return this.data;
    try {
      const minimum_interval_timer = this.min ? new Promise((resolve,reject) => {setTimeout(() => resolve(true),this.min)}) : 0 ;
      this.running = true
      this.state = "loading";
      this.emit("loading");
      this.data = await this.task(...args);
      if (minimum_interval_timer != 0) await minimum_interval_timer;
      this.state = "ready";
      this.emit("ready", this.data);
      this.updateNeeded = false;
  } catch (error) {
      console.trace(`error running task: ${error}`);
      this.state = "error";
      this.data = null;
      this.emit("error", error);
    } finally {
      this.running = false;
      return this.data
    }
  }

  on(event, listener) {
    this.emitter.on(event, listener);
    return this;
  }
  ondata(listener){
    this.onready(listener)
    if (this.data !== null)
      listener(this.data)
  }
  onready(listener){
    this.on('ready',listener)
  }
  onload(listener){
    this.on('loading',listener);
  }
  remove(event, listener) {
    this.emitter.off(event, listener);
    return this;
  }
  emit(event, ...args) {
    // console.log(event,args)
    this.emitter.notify(event, ...args);
    return this;
  }
}
class EventEmitter {
    constructor(events) {
      this.events = events || new Map();
    }
    on(event, ...listeners) {
      if (!this.events.has(event)) this.events.set(event, new Observable());
  
      listeners.forEach((listener) => {
        this.events.get(event).subscribe(listener);
      });
    }
    once(event, listener) {
      const singleton = (...args) => {
        listener(...args);
        this.off(event, singleton);
      };
      this.on(event, singleton);
    }
    off(event, listener) {
      if (!this.events.has(event)) return;
      this.events.get(event).unsubscribe(listener);
    }
    clear(event) {
      if (this.events.has(event)) return;
      this.events.set(event, new Observable());
    }
    notify(event, ...args) {
      if (!this.events.has(event)) return;
      this.events.get(event).notify(...args);
    }
    static create(object,events){
      object.events = events || new Map();
      object.on = this.on.bind(object);
      object.once = this.once.bind(object);
      object.off = this.off.bind(object);
      object.clear = this.clear.bind(object);
      object.emit = this.emit.bind(object);
      return object;
    }
}
class Slider {
  constructor(
      targetElement, 
      { onMouseUp, onMouseDown, onMouseMove, onReset, start = 50 }, 
      orientation = 'horizontal',
    ) 
  {
    const self = this;
    this.orientation = orientation;
    this.start = start;
    this.container = targetElement;
    this.track = targetElement.querySelector(".slider-track") || targetElement;
    this.handle = targetElement.querySelector(".slider-handle");
    this.label = targetElement.querySelector('.label')
    this.onMouseDown = onMouseDown ||
      function (state) {
        console.log("mouse down", state);
      };

    this.onMouseUp = onMouseUp ||
      function (state) {
        console.log("mouse up", state);
      };

    this.onMouseMove = function (...args) {
      if(onMouseMove !== undefined && typeof onMouseMove === 'function')
        requestAnimationFrame(onMouseMove.bind(this, ...args));
      else console.log("mouse moving", state);
  }

  this.onReset = function(state){
    if(onReset !== undefined && typeof onReset === 'function')
      onReset(state)
    else console.log('slider reset')
  }

    this.coords = {
      get max() {
          return (self.orientation == 'horizontal' ? this.track.width : this.track.height) - this.handleMidpoint;
      },
      get min() {
        return 0 + this.handleMidpoint;
      },
      get handleSize() {
        return this.handle.width;
      },
      get handleMidpoint() {
        return this.handleSize / 2;
      },
      get handlePosition() {
          return (self.orientation == 'horizontal' ? this.handle.x : this.handle.y) + this.handleMidpoint;
      },
      get distanceTraveled() {
        return this.handlePosition - this.trackStart;
      },
      get trackWidth() {
          return self.orientation == 'horizontal' ? this.track.width - this.handleSize : this.track.height - this.handleSize;
      },
      get trackStart() {
        return this.trackLeft + this.handleMidpoint;
      },
      get trackLeft() {
          return (self.orientation == 'horizontal' ? this.track.x : this.track.y);
      },
      get track() {
        return self.track.getBoundingClientRect();
      },
      get handle() {
        return self.handle.getBoundingClientRect();
      },
      clamp(val) {
        let max = this.max;
        let min = this.min;
        if (isNaN(val)) throw new Error(`clamp function expects a number...you passed ${val}`);
        if (val >= max) return max;
        else if (val <= min) return min;
        else return val;
      },
    };
    this.MAX = {
      px: this.coords.track.width,
      pct: 100,
      deg: 360,
    };
    this.MIN = {
      px: 0,
      pct: 0,
      deg: 0,
    };
    this.state = {
      px: undefined,
      deg: undefined,
      pct: undefined,
    };
    this.handle.addEventListener("mousedown", this.handleDrag);
    this.track.addEventListener("click", this.handleClick);
    if (this.label) this.label.addEventListener("dblclick", this.reset)
    this.setPercent(this.start)
  }
  update = (event) => {
      return this.setHandle(this.getDistanceTraveled(event));
  }
  setHandle = (distanceTraveled) => {
    let clamped = this.coords.clamp(distanceTraveled);
    this.handle.style.transform = `${this.orientation == 'horizontal' ? 'translateX(' : 'translateY('}${clamped - this.coords.handleMidpoint}px)`;
    if (distanceTraveled <= 0) return this.MIN;
    if ( (this.orientation == 'horizontal' ? distanceTraveled >= this.coords.track.width : distanceTraveled >= this.coords.track.height))
      return this.MAX;
    let distance = Math.trunc(distanceTraveled);
    let distanceInPercent = Math.trunc((distanceTraveled / (this.orientation == 'horizontal' ? this.coords.track.width : this.coords.track.height)) * 100);
    let distanceInDegrees = Math.trunc((distanceTraveled / (this.orientation == 'horizontal' ? this.coords.track.width : this.coords.track.height)) * 360);
    let values = {
      px: distance,
      pct: distanceInPercent,
      deg: distanceInDegrees,
    };
    return values;
  }
  handleDrag = (event) => {
      event.stopImmediatePropagation();
      let initialMouseUpIfAny = document.onmouseup;
      let controller = new AbortController();
      let state;
      const update = event => {
        state = this.update(event);
        this.onMouseMove(state);
      }
      const cleanupListener = () => {
        document.removeEventListener("mousemove", update, { capture: true, signal: controller.signal});
        document.onmouseup = initialMouseUpIfAny;
      }
      const abort = () => {
        controller.abort();
        this.onMouseUp(state);
        nextTick(cleanupListener);
      }
      document.addEventListener("mousemove", update, { capture: true, signal: controller.signal,});
      document.onmouseup = abort;
  }
  handleClick = (event) => {
      if (event.target == this.handle) return;
      let state = this.update(event);
      this.onMouseDown(state);
      this.onMouseUp(state);
  }
  reset = () => {
    let state = this.setFrom('pct',this.start)
    console.log(state)
    return this.onReset(state)
  }
  disable = () => {
    this.handle.removeEventListener( "mousedown", this.handleDrag);
    this.track.removeEventListener( "mousedown", this.handleClick);
  }
  getDistanceTraveled = (event) => {
      return this.orientation == 'horizontal' ? event.clientX - this.coords.trackLeft : event.clientY - this.coords.trackLeft;
  }
  convertValue = (type, value) => {
    let max = this.orientation == 'horizontal' ? this.coords.track.width : this.coords.track.height;
    if (type === "pct") return max * (value / 100);
    if (type === "deg") return max * (value / 360);
    if (type === undefined) {
      console.warn('you passed an invalid type to the sliders conver function',type,value);
      return undefined; 
    }
      console.error('something went wrong in the convert value function',type,value);
      return;
  }
  setFrom = (type, value) => {
    return this.setHandle(this.convertValue(type, value));
  }
  setDegrees = (value) => {
    return this.setFrom("deg", value);
  }
  setPercent = (value) => {
    return this.setFrom("pct", value);
  }
  setPixels = (value) => {
    return this.setHandle(value);
  }
}
class MouseTrackingSlider {
  constructor(targetElement, { onMouseMove, onMouseUp, onMouseDown, onDblClick, reset }) {
    this.targetElement = targetElement;
    this.initialPosition_x = null;
    this.initialPosition_y = null;
    this.currentPosition_x = null;
    this.currentPosition_y = null;
    this.onMouseMove = onMouseMove || null
    this.onDoubleClick = (event) => {
      event.stopImmediatePropagation()
      console.log(targetElement, "double click detected")
      if (onDblClick) onDblClick(event)
    }
    this.onMouseDown = onMouseDown ||
      function () {
          console.log(targetElement, "triggered mousetracker mouseDown");
      };
    this.onMouseUp = onMouseUp ||
      function () {
        console.log(targetElement, "triggered mousetracker mouseUp");
      };
      this.reset = reset || 
      function() {
          console.log('reseting mousetracker')
      }
    this.targetElement.addEventListener("mousedown", this.track);
    this.targetElement.addEventListener("click", this.handleClick);
  }
  handleDrag = (event) =>{
      let distanceFromInitialPosition_x = event.clientX - this.initialPosition_x;
      let distanceFromInitialPosition_y = event.clientY - this.initialPosition_y;
      let debuffed_y = this.currentPosition_x = Math.floor(distanceFromInitialPosition_x / 3);
      let debuffed_x = this.currentPosition_y = Math.floor(distanceFromInitialPosition_y / 3);
      this.onMouseMove({ x: Number(debuffed_y), y: Number(debuffed_x), event });
    }
  track = (event) => {
    let controller = new AbortController();
    if (event.button !== 0) return;
    if (event.detail === 2) return this.onDoubleClick(event);
    if (!this.initialPosition_x) this.initialPosition_x = event.pageX;
    if (!this.initialPosition_y) this.initialPosition_y = event.pageY;
    this.handleClick(event)
    document.addEventListener("mousemove", this.handleDrag, { signal: controller.signal },true);
    document.addEventListener("mouseup", () => {
      controller.abort();
      this.initialPosition_x = null;
      this.initialPosition_y = null;
      event.stopImmediatePropagation();
      if ( this.onMouseUp ) this.onMouseUp({event, x: Number(this.xPos), y: Number(this.yPos)});
    });
  }
  handleClick = (event) => {
    let xZeroed = event.clientX - this.initialPosition_x;
    let yZeroed = event.clientY - this.initialPosition_x;
    // divide by 3 for slower realistic drag effect?
    let vx = this.currentPosition_x = Math.floor(xZeroed / 3);
    let vy = this.currentPosition_y = Math.floor(yZeroed / 3);
    if (this.onMouseDown) this.onMouseDown({ x: Number(vx), y: Number(vy), event })
  }
}
class DateTime {
  constructor(dateObject) {}
  static mns = 1 / 1000;
  static snm = 1 / 60;
  static mnh = 1 / 60;
  static hnd = 1 / 24;
  static dny = 1 / 365;
  static mny = 1 / 12;
  static msns = 1000;
  static msnMinute = 60000;
  static msnHour = 3600000;
  static msnDay = 86400000;
  static msnYear = DateTime.msnDay * 365;
  static daysIn(month) {
    const abbrv = month.slice(0, 3);
    if (DateTime.monthMap[month]) return DateTime.monthMap[month];
    else if (DateTime.monthMap[abbrv]) return DateTime.monthMap[abbrv];
  }
  static dayMap = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thurday",
    5: "Friday",
    6: "Saturday",
    7: null,
    toArray() {
      const arr = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
      arr.abbrv = arr.abbreviate = () => arr.map(slice.bind(months, [0, 3]));
      return arr;
    },
  };

  static get days() {
    return DateTime.dayMap.toArray();
  }

  static get monthMap() {
    return {
      january: 31,
      get february() {
        if (DateTime.thisYearIsLeap()) return 29;
        return 28;
      },
      march: 31,
      april: 30,
      may: 31,
      june: 30,
      july: 31,
      august: 31,
      september: 30,
      october: 31,
      november: 30,
      december: 31,
    };
  }

  static get months() {
    const arr = ["january","february","march","april","may","june","july","august","september","october","november","december",];
    arr.abbrv = arr.abbreviate = () => arr.map(slice.bind(arr, [0, 3]));
    return arr;
  }

  static get clock() {
    const curDate = new Date();
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const hours = curDate.getHours();
    const minutes = curDate.getMinutes();
    const seconds = curDate.getSeconds();
    const context = hours >= 12 ? "pm" : "am";
    return {
      dow: days[curDate.getDay()],
      month: months[curDate.getMonth()],
      date: curDate.getDate(),
      hour: hours <= 12 ? hours : hours - 12,
      minute: minutes,
      second: seconds,
      miliseconds: curDate.getMilliseconds(),
      context,
      time: {
        hour: hours <= 12 ? hours.toString() : (hours - 12).toString(),
        minute: minutes >= 10? minutes.toString() : minutes.toString().padStart(2, "0"),
        second: seconds >= 10 ? seconds.toString() : seconds.toString().padStart(2, "0"),
        context,
        get string() {
          return ([this.hour, this.minute, this.second].join(":") + " " + context);
        },
        get default() {
          return [this.hour, this.minute].join(":") + " " + context;
        },
      },
    };
  }

  static get time() {
    return DateTime.clock.time.default;
  }

  static date = {
    standard: undefined,
    default: undefined,
    universal: undefined,
    east: undefined,
    west: undefined,
    central: undefined,
    leap: DateTime.thisYearIsLeap(),
    dayMap: {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thurday",
      5: "Friday",
      6: "Saturday",
      7: null,
    },
    get monthMap() {
      return {
        January: 31,
        get February() {
          if (DateTime.date.leap) return 29;
          return 28;
        },
        March: 31,
        April: 30,
        May: 31,
        June: 30,
        July: 31,
        August: 31,
        September: 30,
        October: 31,
        November: 30,
        December: 31,
      };
    },
    days: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",null],
    daysABRV: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", null],
    months: ["January","February","March","April","May","June","July","August","September","October","November","December",null],
    monthsABRV: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Nov","Dec",null],
  };

  static now() {
    return new Date();
  }

  static stamp() {
    return {
      day: DateTime.today(),
      month: DateTime.thisMonth(),
      year: DateTime.thisYear(),
      date: DateTime.currentDate(),
      time: DateTime.currentTime(),
      isLeap: DateTime.thisYearIsLeap(),
      ms: Date.now(),
    };
  }

  static compareStamps(current, prev) {
    return ago(new Date(current.ms), prev.ms);
  }

  static weekOf(stamp) {}
  static monthOf(stamp) {}
  static yearOf(stamp) {}
  
  static today() {
    return DateTime.date.days[new Date().getDay()];
  }

  static currentTime() {
    return new Date().toLocaleTimeString();
  }

  static currentDate() {
    return new Date().getDate();
  }

  static thisMonth() {
    return DateTime.date.months[new Date().getMonth()];
  }

  static thisYear() {
    return new Date().getFullYear();
  }

  static thisYearIsLeap() {
    return DateTime.isLeap(DateTime.thisYear());
  }

  static isLeap(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }

  static getLeaps(to, from) {
    function countFrom(lowest, highest) {
      let leapSince = 0;
      for (let i = lowest; i <= highest; i++) {
        if (DateTime.isLeap(i)) leapSince++;
      }
      return leapSince;
    }
    return to < from ? countFrom(to, from) : countFrom(from, to);
  }

  static daysInMonth(month, year) {
    let days = date.monthMap[month];
    if (date.isLeap(year && (month == "February" || month == "Feb"))) days = 29;
    return days;
  }

  static msnMonth(month, year) {
    let days = daysInMonth(month, year);
    let msInMonth = days * DateTime.msnDay;
    return msInMonth;
  }

  static hoursAgo(stamp) {
    const then = toHours(stamp);
    const now = toHours(Date.now());
    const diffy = now - then;
    return diffy;
  }

  static secondsAgo(stamp) {
    const then = toSecondsFloat(stamp);
    const now = toSecondsFloat(Date.now());
    const diffy = now - then;
    const ago = {
      seconds: Math.floor(diffy),
      milliseconds: null,
    };
    return ago;
  }

  static secondsLeft(milliseconds) {
    const minutes = toMinutesFloat(milliseconds);
    return minutes;
  }

  static toSeconds(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    return seconds;
  }
  static toSecondsFloat(milliseconds) {
    const seconds = milliseconds / 1000;
    return seconds;
  }

  static toMinutes(milliseconds) {
    let seconds = toSeconds(milliseconds);
    let minutes = Math.floor(seconds / 60);
    return minutes;
  }

  static toMinutesFloat(milliseconds) {
    const minutes = toSecondsFloat(milliseconds) / 60;
    const floored = Math.floor(minutes);
    const seconds = Math.floor((minutes - floored) / snm);

    const ago = {
      floored: floored,
      minutes: minutes,
      seconds: seconds,
      string: `${minutes} : minutes, and ${seconds} : seconds ago`,
    };
    return ago;
  }

  static minutesAgo(stamp) {
    const now = toMinutesFloat(Date.now()).minutes;
    const then = toMinutesFloat(stamp).minutes;
    const minutes = Math.floor(now - then);
    const seconds = Math.floor((now - then - Math.floor(now - then)) / snm);
    const ago = {
      minutes: minutes,
      seconds: seconds,
      string: `${minutes} minutes, and ${seconds} seconds ago`,
    };
    return ago;
  }

  static toHours(milliseconds) {
    let minutes = toMinutes(milliseconds);
    let hours = Math.floor(minutes / 60);
    return hours;
  }

  static toHoursFloat(milliseconds) {
    let minutes = toMinutesFloat(milliseconds);
    let hours = minutes / 60;
    return hours;
  }

  static toDays(milliseconds) {
    let hours = toHours(milliseconds);
    let days = Math.floor(hours / 24);
    return days;
  }

  static toDaysFloat(milliseconds) {
    let hours = toHoursFloat(milliseconds);
    let days = hours / 24;
    return days;
  }

  static toMonths(milliseconds) {}
  static toMonthsFloat(milliseconds) {}

  static toYears(milliseconds) {
    let days = toDays(milliseconds);
    let years = Math.floor(days / 365);
    return years;
  }

  static from(since, compare = Date.now()) {
    console.warn('months ago algorithm is WRONG... Weeks ago too')
    const now = compare,
          then = since.getTime(),
          nowDate = new Date(compare),
          weeksInYear = 52,
          monthsInYear = 1 / 12,
          msnYear = DateTime.msnDay * 365,
          msInWeek = 604800000,
          msInDay = 86400000,
          msInHour = 3600000,
          msInMin = 60000,
          msInSec = 1000,
          minutesInHour = 60,
          secondsInMinute = 60,
          monthOf = DateTime.months[since.getMonth()],
          prevMonthOf = DateTime.months[nowDate.getMonth()],
          daysIn = DateTime.monthMap[monthOf],
          prevDaysIn = DateTime.monthMap[prevMonthOf],
          dayOf = since.getDate(),
          prevDayOf = nowDate.getDate(),
          days = Math.abs(dayOf - prevDayOf),
          leapSince = DateTime.getLeaps(since.getFullYear(), new Date(now).getFullYear());
    let msAgo = now - then, 
        context = msAgo < 0 ? "til" : "ago";
    msAgo = Math.abs(msAgo)

    const years = msAgo >= msnYear ? msAgo / msnYear : 0,
          monthsAgo = DateTime.getRemainder(years),
          months = monthsAgo / monthsInYear,
          weeksAgo = msAgo >= msInWeek ? Math.floor(msAgo / msInWeek) : 0,
          weeks = monthsAgo / weeksInYear,
          daysAgo = msAgo >= msInDay ? Math.floor(msAgo / msInDay) + leapSince : 0,
          hoursAgo = msAgo >= msInHour ? Math.floor(msAgo / msInHour) : 0,
          hours = hoursAgo,
          minutesAgo = msAgo >= msInMin ? Math.floor(msAgo / msInMin) : 0,
          minutes = Math.floor(DateTime.getRemainder(msAgo / msInHour) * minutesInHour),
          secondsAgo = msAgo >= msInSec ? Math.floor(msAgo / msInSec) : 0,
          seconds = Math.floor(DateTime.getRemainder(msAgo / msInMin) * secondsInMinute),
          ago = {
            since: new Date(now),
            then: new Date(then),
            years: Math.floor(years),
            months: Math.floor(months),
            days: days,
            yearsAgo: years,
            weeksAgo: weeksAgo,
            daysAgo: daysAgo,
            hoursAgo: hoursAgo,
            hours,
            minutesAgo: minutesAgo,
            minutes,
            secondsAgo: secondsAgo,
            seconds,
            milisecondsAgo: msAgo,
            // milliseconds: msAgo,
            leaps: leapSince,
            string: undefined,
          };
    if (ago.yearsAgo >= 1) {
      if (ago.months >= 1)
        ago.string = `${ago.years} Years, ${ago.months} Months ${context}`;
      else if (ago.months < 1) 
        ago.string = `${ago.years} Years ${context}`;
      else if (ago.weeksAgo < 4 && ago.weeksAgo > 2)
        ago.string = `${ago.weeksAgo} Weeks ${context}`;
      else if (ago.daysAgo < 14 && ago.daysAgo > 2)
        ago.string = `${ago.daysAgo} Days ${context}`;
      else if (ago.hoursAgo <= 48 && ago.hoursAgo >= 1) {
        if (ago.hoursAgo < 2 && ago.hoursAgo >= 1) {
          ago.string = `${ago.hoursAgo} Hour ${context}`;
        } else {
          ago.string = `${ago.hoursAgo} Hours ${context}`;
        }
    } else if (ago.minutesAgo < 59 && ago.minutesAgo > 1) {
      ago.string = `${ago.minutesAgo} Minutes ${context}`;
    } else if (ago.secondsAgo < 60 && ago.secondsAgo > 30) {
      ago.string = `${ago.secondsAgo} Seconds ${ago}`;
    } else if (ago.secondsAgo < 30) {
      // ago.string = `Just Now`
      ago.time = "Just Now";
      ago["context"] = context;
      return ago;
    } else return ago;
    ago.time = ago.string.split(" ")[0];
    ago.suffix = ago.string.split(" ")[1];
    ago["context"] = context;
    }
    return ago;
  }
  static getRemainder(float) {
    // miliseconds left after floored value IN DECIMAL
    return float - Math.floor(float);
  }
}
class Time {
  constructor() {}
  static get current() {
    return new Date().toLocaleTimeString();
  }
  static setTimer(start, end) {}
  static in(format) {
    switch (format) {
      case "ms" || "miliseconds": {}
      case "hms" || "hourminutesseconds": {}
      case "hm" || "hoursminutes": {}
    }
  }
  static get current() {
    return {};
  }
  static padNum(num) {
    if (num.toString().length == 1) return num.toString().padStart(2, "0");
    else return num.toString();
  }
  static msToStamp(ms) {
    const msInHour = 3600000;
    const msInMin = 60000;
    const msInSec = 1000;
    const minutesInHour = 60;
    const secondsInMinute = 60;
    const hours = ms >= msInHour ? Math.floor(ms / msInHour) : 0;
    // const hours = hoursAgo;
    // const minutesAgo = ms >= msInMin ? Math.floor(ms / msInMin) : 0;
    const minutes = Math.floor(getRemainder(ms / msInHour) * minutesInHour);
    // const secondsAgo = ms >= msInSec ? Math.floor(ms / msInSec) : 0;
    const seconds = Math.floor(getRemainder(ms / msInMin) * secondsInMinute);
    function getRemainder(float) {
      // miliseconds left after floored value IN DECIMAL
      return float - Math.floor(float);
    }
    return { hours, minutes, seconds,
      get formatted() {
        return {
          hours: Time.padNum(this.hours),
          minutes: Time.padNum(this.minutes),
          seconds: Time.padNum(this.seconds),
        }
      }
    }
  }
}
class Timer {
  // DEFAULTS TO COUNTDOWN
  constructor({ props }) {
    this.currentInterval = null;

    this.days = props.days || [];

    this.title = props.title;

    this.time = props.time;

    this.initial = props.initial || structuredClone(props.time);

    this.id = props.id || uuid();

    this.element = undefined;

    let today = new Date();

    let dow = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    this.isToday = this.days.some((day) => day === dow[today.getDay()]) || null;
  }

  padNum(num) {
    if (num.toString().length == 1) return num.toString().padStart(2, "0");
    else return num.toString();
  }

  play() {
    if (this.currentInterval) return;
    this.currentInterval = setInterval(this.countdown.bind(this), 1000);
  }

  decer() {
    let t = Timer.formatMs(this.time.total - 1000);

    if (Math.round(t.total) < 0) {
      t = Timer.formatMs(0);
      clearInterval(this.currentInterval);
      this.currentInterval = null;
      return;
    }

    return t;
  }

  incer() {
    let t = Timer.formatMs(this.time.total + 1000);

    if (Math.round(t.total) < 0) {
      t = Timer.formatMs(0);
      clearInterval(this.currentInterval);
      this.currentInterval = null;
      return;
    }

    return t;
  }

  pause() {
    clearInterval(this.currentInterval);
    this.currentInterval = null;
    this.showPaused();
    console.log(this);
    return;
  }

  stop() {
    clearInterval(this.currentInterval);
    this.currentInterval = null;
  }

  reset() {
    clearInterval(this.currentInterval);
    this.currentInterval = null;
    this.time = structuredClone(this.initial);
  }

  resetView() {
    this.showPaused();
    this.reset();
    this.update();
  }

  countdown() {
    this.time = this.decer();

    if (this.time.total <= 0) return this.resetView();
    this.update();
  }

  create(type) {
    let html = this.createTimerElement(type);
    let fragment = frag();
    let element = div();

    element.innerHTML = html;
    element.dataset.id = this.id;
    fragment.appendChild(element);

    return fragment;
  }

  showPlaying() {
    if (!this.element) return;
    $(".pause", this.element).classList.add("current");
    $(".play", this.element).classList.remove("current");
  }

  showPaused() {
    console.log(this);
    if (!this.element) return;
    $(".play", this.element).classList.add("current");
    $(".pause", this.element).classList.remove("current");
  }

  render(destination, type) {
    const frag = this.create(type);
    this.element = $(`[data-id="${this.id}"]`, frag);
    destination.appendChild(frag);
    listen($(".ctrl-wrapper", this.element), () => {
      if (!this.currentInterval) {
        this.showPlaying();
        this.play();
      } else if (this.currentInterval) {
        this.showPaused();
        this.pause();
      }
    });
    listen($(".reset", this.element), this.resetView.bind(this));
    listen($(".delete", this.element), this.delete.bind(this));
  }

  update() {
    if (!this.element) return;
    $(".time-slot-wrapper", this.element).innerHTML = this.createTimeSlot();
  }

  async delete() {
    console.log(api, "delete");
    const deleted = api.delete(this.id);
    if (deleted) {
      this.element.remove();
      this.element = null;
    }
  }

  static timeInMs({ hours, minutes, seconds }) {
    // convert all to ms
    let msSeconds = seconds * 1000,
      msMinutes = minutes * 60000,
      msHours = hours * 3600000;

    return msHours + msSeconds + msMinutes;
  }

  static formatMs(ms) {
    const msInSeconds = 1000;
    const msInMinutes = 60000;
    const msInHours = 3600000;

    const approxHour = ms / 3600000;
    const hours = Math.floor(approxHour);
    const hoursFloat = approxHour - hours;

    const approxMinutes = (hoursFloat * msInHours) / msInMinutes;
    const minutes = Math.floor(approxMinutes);
    const minutesFloat = approxMinutes - minutes;

    const seconds = Math.round((minutesFloat * msInMinutes) / msInSeconds);

    return {
      hours,
      minutes,
      seconds,
      total: ms,
    };
  }

  createTimerElement(type) {
    return `
        <div class="timer" ${type ? `data-type=${type}` : null} >
            <div class="timer--options">
                <div class="option delete">
                    <span class="label">delete</span>
                </div>
                <div class="option edit">
                    <span class="label">edit</span>
                </div>
            </div>
            <div class="timer--header">
                <div class="timer--header-title">
                    <span class="label">${this.title}</span>
                </div>
                <div class="timer--header-options">
                    <div class="timer--header-options__icon">
                        <span class="label show">show options</span>
                        <span class="lable hide">hide options</span>
                    </div>
                </div>
            </div>
            <div class="timer--clock">
                <div class="timer--clock-controls">
                    <div class="ctrl-wrapper">
                        <div class="play ctrl current">
                            <span class="control">play</span>
                        </div>
                        <div class="pause ctrl">
                            <span class="control">pause</span>
                        </div>
                    </div>
                    <div class="reset">reset</div>
    
                </div>
    
                <div class="timer--clock-times">
                    <div class="time-slot-wrapper">${this.createTimeSlot()}</div>
    
                </div>
            </div>
        </div>`;
  }

  createTimeSlot() {
    const { hours, minutes, seconds } = this.time;
    let h = this.padNum(hours),
      m = this.padNum(minutes),
      s = this.padNum(seconds);

    return `
        <div class="hours time-slot">
            <span class="tenth-hour">${h[0] || 0}</span>
            <span class="zero-hour">${h[1] || 0}</span>
            <span class="label">h</span>
        </div>
        <div class="minutes time-slot">
            <div class="tenth-minute">${m[0] || 0}</div>
            <div class="zero-minute">${m[1] || 0}</div>
            <span class="label">m</span>
        </div>
        <div class="seconds time-slot">
            <div class="tenth-second">${s[0] || 0}</div>
            <div class="zero-second">${s[1] || 0}</div>
            <span class="label">s</span>
        </div>`;
  }
}
class TimeTracker extends Timer {
  constructor({ props }) {
    super({ props });

    this.initial = Timer.formatMs(0);
    this.successTime = props.successTime;
    this.onSuccess =
      props.onSucces ||
      function () {
        console.log(`${this.title} tracker has completed`);
        if (this.element) $(".timer", this.element).classList.add("complete");
      };

    this.success = false;

    this.resetAfterSuccess = props.resetOnSuccess || false;
  }

  countup() {
    this.time = this.incer();
    if (this.success === false && this.time.total >= this.successTime.total) {
      this.success = true;
      this.onSuccess();
    }
    if (this.resetOnSuccess) return this.resetView();
    else this.update();
  }

  play() {
    if (this.currentInterval) return;
    this.currentInterval = setInterval(this.countup.bind(this), 1000);
  }
}
class scrollTrap {    
  constructor( scrollable , tick = 30) {
      this.isScrolling = false;
      this.tickReady = false;
      this.direction = 'idle';
      this.intermediateScrollPosition = 0;
      this.lastKnownScrollPostion = 0;
      this.tick = tick;
      this.element = scrollable;
      this.lksp = this.lastKnownScrollPostion;
      this.imsp = this.intermediateScrollPosition;
      this.element.addEventListener('scroll',this.handleScroll);
  }
  diff(eventTarget) {
    let last = this.lksp;
    let current = eventTarget.scrollTop;
    let dir = last < current ? 'incer' : 'decer';
    let diffy = Math.abs(last - current);
    this.direction = dir;
    return [diffy,dir]
  }
}

class COSM extends EventEmitter {
  constructor({selectors = [], exceptions = [], handler = null} = {}){
    super()
    this.selectors = selectors;
    this.exceptions = exceptions;
    this.handler = handler;
    this.eventHandler = this.eventHandler.bind(this);
    document.addEventListener('click', this.eventHandler);
  }

  eventHandler(event) {
    const clickOutsideRegistered = this.selectors.length > 0 && 
        !this.selectors.some(query => event.target.closest(query));

    const clickedException = this.exceptions.length > 0 ?
        this.exceptions.find(query => event.target.closest(query)) : false

    if (clickOutsideRegistered || clickedException) {
        this.handler && this.handler();
        this.notify('cosm',event,clickedException)
    }
  }
  setHandler(fun){
    this.on('cosm',fun)
  }
  addSelectors(...newSelectors) {
      this.selectors.push(...newSelectors);
  }
  addExceptions(...newExceptions) {
      this.exceptions.push(...newExceptions);
  }
  removeSelectors(...selectors){
      this.selectors = this.selectors.filter(query => !selectors.includes(query))
  }
  removeExceptions(...selectors){
      this.exceptions = this.exceptions.filter(query => !selectors.includes(query))
  }
  remove() {
      document.removeEventListener('click', this.eventListener);
  }
}

class ClientSideSocketServer extends EventEmitter {
  constructor(host = 'ws://localhost:1279') {
    this.shouldReconnect = true;
    this.max_retry_attempts = 5;
    this.retry_attempts = 0;
    this.reconnecting = false;
    this.socket = this.createWebSocket();
    this.notifications = [];
    this.notifier = new EventEmitter();
    this.host = host;
  // emitter 
  }

  createWebSocket() {
    this.cancelReconnect()

    try {
      let sock = new WebSocket(this.host);
      sock.onopen = this.handleConnection.bind(this);
      sock.onmessage = this.parseMessage.bind(this);
      sock.onclose = this.handleDisconnect.bind(this);
      sock.onerror = (err) => {
        console.error('WebSocket error:', err);
        this.handleDisconnect();
      };
      console.log('Scanner Ready For Updates');
      return sock;
    } catch(e) {
      console.warn(e);
    }

  }

  sendMessage(message) {
    if (this.socket)
      try {
        this.socket.send(message); 
      } catch(e){
        console.warn('error sending message: ',e)
      }
  }

  async parseMessage(event) {
    try {
      const notification = JSON.parse(event.data);
      this.notify('message',notification)
      console.log('incomming: ',notification);
      switch (type){
        case 'new entry' : console.log('new entry', data )
        default : console.log('incomming: ',notification);
      }
      this.notifications.push(notification)
      this.notifier.notify('new entry',notification);
    } catch(e) {
        console.error(e);
      }
  }

  cancelReconnect() {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.close();
    }
  }

  handleConnection() {
    this.sendMessage('Client Connected');
    this.reconnecting = false;
    this.retry_attemps = 0;
  }

  handleDisconnect(event){
    if (this.reconnecting) 
      return;
    this.reconnecting = true; // Set the flag to indicate the reconnection logic is running

    // event.wasClean 
    //   ? console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`)
    //   : console.log('WebSocket connection closed abruptly');

    if (this.shouldReconnect && this.retry_attempts < this.max_retry_attempts) {
        const timeout = Math.min(1000 * Math.pow(2, this.retry_attemps), 30000); // Exponential backoff
        console.log(`Attempting to reconnect in ${timeout / 1000} seconds...`);
        setTimeout(this.createWebSocket.bind(this), timeout);
        this.retry_attempts++;
    }
  }
}
