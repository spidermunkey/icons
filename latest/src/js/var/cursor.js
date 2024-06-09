export class Cursor {
  constructor(array, startingIndex = 0) {
    if (!Array.isArray(array))
      throw new Error(`expecting an array you passed ${array}`);
    if (isNaN(startingIndex))
      throw new Error(`expecting a number for startingIndex you passed ${startingIndex}`);
    if (array.length == 0) 
      throw new Error('cursor wont initialize with empty array');

      this.items = array;
      this.setPointer(startingIndex);
  }

  get first() {
    return this.items[0];
  }
  get last() {
    return this.items[this.items.length - 1];
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
  get size() {
    return this.items.length;
  }
  get isEmpty() {
    return this.size === 0;
  }
  get index(){
    return this.pointer;
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
    if (index >= this.size) this.pointer = this.size - 1;
      else if (index <= 0) this.pointer = 0;
        else this.pointer = index;
    return this.current;
  }
  incrementPointer(){
    this.pointer = this.pointer + 1;
  }
  decrementPointer(){
    this.pointer = this.pointer - 1;
  }

  skipToIndex(index) {
    if (!this.validIndex(index)) return;
    return this.setPointer(index);
  }
  skipToElement(element) {
    const index = this.items.indexOf(element);
    if (index) this.skipToIndex(index)
  }

  getIndexOf(index) {
    if (!this.validIndex(index)) return;
    return this.items[index];
  }

  skipToNext() {
    if (this.pointer + 1 >= this.size) return this.setPointer(0);
    return this.setPointer(this.pointer + 1);
  }

  skipToPrev() {
    if (this.pointer - 1 < 0) return this.setPointer(this.size - 1);
    return this.setPointer(this.pointer - 1)
  }

  skipToLast() {
    return this.setPointer(this.size);
  }

  skipToFirst() {
    return this.setPointer(0);
  }

  pluck(index) {
    this.items = this.items.splice(index + 1, 1);
    return this;
  }

  update(elements, startingIndex = 0) {
    this.setPointer(startingIndex)
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
