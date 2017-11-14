export default class PolyHash {
  constructor() {
    this.map = Array(1000).fill(null);
    this.origin = "";
    this.destination = "";
    this.currentParent = "";
    this.count = 0;
  }

  add(title, parent = this.currentParent, children = []) {
    if (this.origin === "") {
      this.origin = title;
      this.currentParent = title;
    }

    let addition = {
      title: title,
      parent: parent,
      children: children
    };

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
    let match = {};
    let bucket = Math.floor(hashString(string) % this.map.length);

    if (this.map[bucket] === null) {
        return false;
    }

    this.map[bucket].forEach((node) => {
      if (node.title === string) {
        match = node;
      }
    });

    if (match.title === string){
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
