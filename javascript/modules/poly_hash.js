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
    let bucket = Math.floor(title.hashCode() % this.map.length);
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
    let bucket = Math.floor(string.hashCode() % this.map.length);

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

  includes(string) {
    this.get(string);
  }

  // includes(string) {
  //   let includes = false;
  //   let bucket = Math.floor(string.hashCode() % this.map.length);
  //
  //   if (this.map[bucket] === null) {
  //     return false;
  //   }
  //
  //   this.map[bucket].forEach((pair) => {
  //     if (pair[0] === string) {
  //       includes = true;
  //     }
  //   });

  reset(newTarget) {
    this.map = Array(5000).fill(null);
    this.origin = newTarget;
    // this.destination = "";
    this.currentParent = "";
    this.count = 0;
  }
}


//code from
//http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
//slight varation to provide more variation in hashing

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  hash = Math.floor(hash * Math.PI * 10000);
  return Math.abs(hash);
};
