export default class PolyHash {
  constructor() {
    this.map = Array(200).fill(null);
    this.origin = "";
    this.destination = "";
    this.currentParent = "";
    this.count = 0;
  }

  add(title, parent = this.currentParent, children = [], image = false) {
    if (this.origin === "") {
      this.origin = title;
      this.currentParent = title;
    }

    let addition = {
      title,
      parent,
      children,
      image,
    };

    let bucket = Math.floor(this.hashString(title) % this.map.length);
    if (this.map[bucket] === null) {
      this.map[bucket] = [];
    }
    this.map[bucket].push(addition);
    this.count ++;
    if (this.count > this.map.length) {
      this.resizeMap();
    }
  }

  resizeMap() {
    let temp = [];
    this.map.forEach((bucket) => {
      if (bucket) temp.push(...bucket);
    });

    this.map = Array(this.map.length * 2).fill(null);
    let bucket;
    temp.forEach((obj) => {
      bucket = Math.floor(this.hashString(obj.title) % this.map.length);
      this.map[bucket] ? this.map[bucket].push(obj) : this.map[bucket] = [obj];
    });
  }

  changeParent(parent) {
    this.currentParent = parent;
  }

  get(string) {
    let bucket = Math.floor(this.hashString(string) % this.map.length);
    let match = false;

    if (this.map[bucket] === null) return false;

    this.map[bucket].forEach((node) => {
      if (node.title === string) {
        match = node;
      }
    });

    return match;
  }

  trace(to, from = this.origin) {
    if (!this.includes(to)) {
      return false;
    }
    let parent = to;
    let pair;
    let trail = [];


    while (parent !== from && parent !== this.origin) {
      trail.push(parent);
      pair = this.get(parent);
      pair = pair.parent;
      parent = pair;
    }
    trail.push(parent);
    return trail.reverse();
  }

  includes(string) {
    if (this.get(string) === false){
      return false;
    }
    return true;
  }

  reset(newOrigin) {
    this.map = [];
    this.map = Array(200).fill(null);
    this.origin = newOrigin;
    // this.destination = "";
    this.currentParent = newOrigin;
    this.count = 0;
  }

  hashString(string) {
    let hash = 1,
        i = 0;

    while (i < string.length) {
      hash += string.charCodeAt(i);
      i ++;
    }

    hash = Math.floor(hash * Math.PI * 100000);
    return Math.abs(hash);
  }
}
