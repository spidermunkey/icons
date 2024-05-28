export function getRandomIndex(arr) {
    return Math.floor( Math.random() * arr.length );
}

export function createBus(...fns) {
    return {
        tl: [...fns],
        add: function (fn) {
            this.tl.push(fn);
        },
        run: function (data) {
            fns.forEach(fn => fn(data))
        }
    }
}

export function average(array) {
    return array.reduce((a, b) => a + b) / array.length;
}

export function midpoint() {
    return (Math.min.apply(null, arguments) + Math.max.apply(null, arguments)) / 2;
}

export function unless(test, then) {
    if (!test) then();
}

export function repeat(n, action) {
    for (let i = 0; i < n; i++) {
      action(i);
    }
}

export function greaterThan(n) {
    return m => m > n;
}

export function repeatLog(n) {
    for (let i = 0; i < n; i++) {
      console.log(i);
    }
}

export function every(cond, array) {
    let result = true;
    for (index of array) {
        if (!cond(index)) {
            result = false;
        }
    }
    return result;
}

export function uuid() {
    let timmy = Date.now().toString(36).toLocaleLowerCase();
    // random high number
    let randy = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
    // random high num to hex => "005EIPQUTQ64" => add 0s to make sure its 12digits
    randy = randy.toString(36).slice(0, 12).padStart(12, '0').toLocaleUpperCase();
    // coerce into a string
    return ''.concat(timmy, '-', randy);
}

export function ordinal(num) {

    // ! does not handle teens over 100

    if (!isNaN(num)) {
        let n = num;
        let suff;

        if (num > 20) {
            // convert to string
            d = num.toString()
            // grab the last digit
            n = d[d.length - 1];
        }

        n == 1 ? suff = 'st'
        : n == 2 ? suff = 'nd'
        : n == 3 ? suff = 'rd'
        // teens < 100
        : suff = 'th'

        return num.toString() + suff;
    }
}

export function getRect(element) {
    return element.getBoundingClientRect();
}

export * from './helpers.js'