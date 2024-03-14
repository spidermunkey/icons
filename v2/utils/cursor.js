/* basic documentation
    INFINITE CURSOR
    
    expects atleast a tuple

    if .nxt || .prv is called
        it will always increment || decrement the cursor updating the current state
    
    if .next || .prev is called
        it will only return the next || prev value in the collection

    if last || first is null 
        it will return the first || last element in the array passed

    options = {
        startingIndex: 1,
        onNext: undefined,
        onPrev: undefined,
    }


    for dom manupulation
        1) use a proxy method to handle state changes.
        2) pass { onNext: function , onPrev: function }
*/
export function cursor( arr, opts = { startingIndex: 1 })
{
    function validateCursor(arr,opts) {
        if(!Array.isArray(arr)) {
            console.log(`Cursor instance canceled... was expecting an array you passed ${arr}`);
            return false;
        }
        if ( !isNaN(opts.startingIndex) && opts.startingIndex !== 0 && opts.startingIndex < arr[arr.length - 1] ) {
            cursor = opts.startingIndex;
        }
        if (arr.length < 2 && arr.length > 0) {
            cursor = 1;
        }
        else if (isNaN(opts.startingIndex)) {
            return console.log(`expecting a number for startingIndex you passed ${opts.startingIndex}`);
        }
        return cursor;
    }
    // if type array is not passed throw error
    if (validateCursor()) {
        let cursor = opts.startingIndex;
        let elements =  ["last",...arr,"first"];

        return {
            cursor,
            elements,
            first: elements[1],
            last: elements[elements.length - 2],
            next: undefined,
            prev: undefined,
            current: undefined,

            // get next cursor value before changing state
            get next() {
                // console.log(this.elements)
                let next = this.elements[this.cursor + 1];
                console.log(`\ncurrent state: ${this.cursor}\nnext element: ${next}\n`);
                return next;
            },
            // get previous cursor value before changing state
            get prev() {
                let prev = this.elements[this.cursor - 1];
                console.log(`\ncurrent state: ${this.cursor}\nnext element: ${prev}\n`);

                return prev;
            },
            // get current cursor value
            get current() {
                console.log(`\ncurrent element is ${this.elements[this.cursor]}`)
                return this.elements[this.cursor];
            },
            // get all elements in the array
            get all() {
                return this.elements.filter(index => index !== 'first' && index !== 'last');
            },
            get lastIndex() {
                return Number.parseInt(this.elements.indexOf(this.last));
            },
            get firstIndex() {
                return Number.parseInt(this.elements.indexOf(this.first));
            },
            // set next cursor value
            nxt() {
                // console.log(this.elements)
                let next = this.elements[this.cursor + 1];
                if (next === "first") {
                    console.log('\nskipping to first');
                    this.cursor = 1;
                    return this.first;
                }
                this.cursor += 1;
                // console.log('\niterating next... current value is:')
                return next;
            },
            // set previous cursor value
            prv() {
                let prev = this.elements[this.cursor - 1];
                if (prev === "last") {
                    console.log('\nskipping to last');
                    this.cursor = this.elements.length - 2;
                    return this.last;
                }
                // console.log('\niterating back... current value is:');
                this.cursor -= 1; 
                return prev
            },
            // jump to index number in array
            skipTo(index) {
                // this.all returns array without the first and second "null byte"
                // so I use a zeroed index for this.all
                // and a regular index for the cursor
                if (isNaN(index)) {
                    console.log(`\nskip function was expecting a number... you passed ${index}`)
                    return NaN;
                }
                else if (!this.all[index - 1]) {
                    console.log(`\nuh oh....index of ${index} doesn\'t exist\ntry a number from 1 to ${this.all.length}\n`);
                    return undefined;
                }
                console.log(`\nskipping to the ${nthSuffix(index)} index`);
                this.cursor = index;
                return this.all[index - 1];
            },
            skipToLast() {
                this.skipTo(this.lastIndex);
            },
            skipToFirst() {
                this.skipTo(this.firstIndex);
            },
            // add element to back of the list
            push(element) {
                console.log(`\nadding ${element} to the list`);
                this.elements = ["last",...this.all,element,"first"];
                console.log(`list updated... we\'re still on the ${this.nthSuffix(this.cursor)} index\n`);
            },
            // replace all elements in the array
            update(elements) {
                this.elements = ["last",...elements,"first"];
            },
            nthSuffix(num) {
                if (!isNaN(num)) {
                    let n = num;
                    let suff;

                    if (num > 20) {
                        // convert to string
                        let d = num.toString()
                        // grab the last digit
                        n = d[d.length - 1];
                    }

                    n == 1 ? suff = 'st'
                    : n == 2 ? suff = 'nd'
                    : n == 3 ? suff = 'rd'
                    : suff = 'th'

                    return num.toString() + suff;
                }
                return `this function expects numbers`
            }
        }
    }
}

// returns string of the same number suffixed with st, nth, rd, or nd
