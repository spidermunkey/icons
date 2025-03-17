export class Bucket {
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
    if (!key) return console.warn(`... invalid key`);
    if (!value) return console.warn(`... invalid value`);
    if (this.has(key)) return console.warn(`item not pushed ... duplicate key`);
    this.items.set(key, value);
    return true;
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
      console.error(
        `${duplicates.length} duplicates found in the keyset. No items were added`,
        duplicates
      );
      return duplicates;
    }

    map.forEach((value, key) => this.push(key, value));
    // obj implimentation?
    // for (key in obj)
    //   this.push(key, obj[key]);
    return this;
  }

  compare(map) {
    return Array.from(map.keys()).filter(this.has);
  }

  wipe() {
    this.items = new Map();
  }
}
