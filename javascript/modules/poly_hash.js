export default class PolyHash {
  constructor() {
    this.map = Array(5000).fill(null);
    this.origin = "";
    this.destination = "";
    this.currentParent = "";
    this.count = 0;
  }

  add(title) {
    if (this.origin === "") {
      this.origin = title;
      this.currentParent = title;
      return;
    }

    let addition = [title, this.currentParent];
    let bucket = Math.floor(hashString(title) % this.map.length);
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
    //for now this'll do nothing
  }

  changeParent(parent) {
    this.currentParent = parent;
  }
  get(string) {
    let match = [];
    let bucket = Math.floor(hashString(string) % this.map.length);

    if (this.map[bucket] === null) {
        return false;
    }

    this.map[bucket].forEach((pair) => {
      if (pair[0] === string) {
        match = pair;
      }
    });

    if (match.length === 2){
      return match;
    }
    return false;
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
      pair = pair[1];
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

  reset(newTarget) {
    this.map = Array(5000).fill(null);
    this.origin = newTarget;
    // this.destination = "";
    this.currentParent = "";
    this.count = 0;
  }
}

const hashString = (string) => {
  var hash = 1;
  let i = 0;
  while (i < string.length) {
    hash += string.charCodeAt(i);
    i ++;
  }

  hash = Math.floor(hash * Math.PI * 100000);
  return Math.abs(hash);
};
