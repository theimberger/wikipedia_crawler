/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_lifecycle__ = __webpack_require__(1);


document.addEventListener('DOMContentLoaded', () => {
  __WEBPACK_IMPORTED_MODULE_0__modules_lifecycle__["a" /* Start */]();
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ajax_utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__poly_hash__ = __webpack_require__(4);




const LinkMap = new __WEBPACK_IMPORTED_MODULE_2__poly_hash__["a" /* default */]();
const FetchQue = [];
var targetPages = [];

const Start = () => {
  let canvas = document.getElementById('main');
  // UIUtils.ResizeCanvas(canvas);
  // var ctx = canvas.getContext('2d');

  let startForm = document.getElementById('start');
  startForm.addEventListener('submit', InputListener);
};
/* harmony export (immutable) */ __webpack_exports__["a"] = Start;


const GetLinks = (e) => {
  e.preventDefault();
  __WEBPACK_IMPORTED_MODULE_0__ui_utils__["c" /* hideHeader */]();
  let query = document.getElementById('start_input');
  query.blur();
  LinkMap.add(query.value);
  __WEBPACK_IMPORTED_MODULE_1__ajax_utils__["a" /* fetchWikiPage */](query.value, Run);
  AddInput();
};

const InputListener = (e) => GetLinks(e);

const AddInput = () => {
  __WEBPACK_IMPORTED_MODULE_0__ui_utils__["a" /* addInput */]();
  let startForm = document.getElementById('start');
  startForm.removeEventListener('submit', InputListener);
  startForm.addEventListener('keydown', secondInput);
};

const secondInput = (e) => {
  if (e.keyCode !== 13) {
    return;
  }
  e.preventDefault();
  let first = document.getElementById('start_input');
  let second = document.getElementById('end_input');

  if (first.value !== LinkMap.origin) {
    LinkMap.reset(first.value);
    __WEBPACK_IMPORTED_MODULE_1__ajax_utils__["a" /* fetchWikiPage */](first.value, Run);
    return;
  }
  if (second.value !== LinkMap.destination){
    LinkMap.destination = second.value;
    __WEBPACK_IMPORTED_MODULE_1__ajax_utils__["a" /* fetchWikiPage */](second.value, updateEnd);
    return;
  }
};

const filterPages = (pages) => {
  if (pages.length === 0){
    return pages;
  }
  let filtered = [];
  let i = 0;

  let frequency = (100/pages.length);

  while (i < pages.length) {
    if (LinkMap.includes(pages[i])) {
      i ++;
      continue;
    }
    if (pages[i].includes(LinkMap.destination) &&
        LinkMap.destination.length > 4) {

      filtered.push(pages[i]);
      i ++;
      continue;
    }
    if ((50 * Math.random()) + frequency > 50) {
      filtered.push(pages[i]);
    }
    i ++;
  }

  return filtered;
};

const Run = (pages) => {
  var Test = document.getElementById('test');
  let found = false;
  pages = filterPages(pages);
  Test.append(pages + " ");

  let i = 0;

  while (i < pages.length) {
    LinkMap.add(pages[i]);
    FetchQue.push(RunFactory(pages[i]));
    if (pages[i].toLowerCase() === LinkMap.destination.toLowerCase()) {
      found = true;
    }
    i ++;
  }

  if (found) {
    console.log("FOUND IT");
    console.log(LinkMap.trace(LinkMap.destination));
    FetchQue.length = 0;
    return;
  }

  setTimeout(FetchQue[0], 100);
};

const RunFactory = (title) => () => {
  console.log(title);
  LinkMap.currentParent = title;
  __WEBPACK_IMPORTED_MODULE_1__ajax_utils__["a" /* fetchWikiPage */](title, Run);
  FetchQue.shift();
};

const updateEnd = (pages) => {
  console.log("changed");
  if (pages.length === 0){
    __WEBPACK_IMPORTED_MODULE_0__ui_utils__["b" /* changeColor */]("end_input", "red");
  } else {
    targetPages = pages;
    document.getElementById("end_input").blur();
    __WEBPACK_IMPORTED_MODULE_0__ui_utils__["b" /* changeColor */]("end_input", "black");
  }
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const hideHeader = () => {
  let header = document.getElementsByTagName('header');
  header = header[0];
  let top = -(header.offsetHeight - 5);
  top += "px";
  header.style.top = top;
};
/* harmony export (immutable) */ __webpack_exports__["c"] = hideHeader;


const showHeader = () => {
  let header = document.getElementsByTagName('header');
  header = header[0];
  header.style.top = "50px";
};
/* unused harmony export showHeader */


const addInput = () => {
  let endInput = document.createElement("input");
  endInput.id = "end_input";
  endInput.type = "text";
  endInput.placeholder = "enter a target page";
  let startForm = document.getElementById('start');
  startForm.append(endInput);
  endInput.focus();
};
/* harmony export (immutable) */ __webpack_exports__["a"] = addInput;


const ResizeCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
/* unused harmony export ResizeCanvas */


const changeColor = (id, color) => {
  document.getElementById(id).style.color = color;
};
/* harmony export (immutable) */ __webpack_exports__["b"] = changeColor;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const fetchWikiPage = (
  title,
  callback,
  reverse = false,
  fetched = []
) => {
  var wikiRequest = new XMLHttpRequest();

    wikiRequest.open(
      "GET",
      `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=${title}`
    );

  wikiRequest.onreadystatechange = () => {

    if (
      wikiRequest.readyState === XMLHttpRequest.DONE
      && wikiRequest.status === 200
    ) {
      let pages = formatResponse(wikiRequest);
      if (pages.length === 500) {
        if (reverse) {
          pages = mergeResult(fetched, pages);
          callback(pages);
        } else {
          fetchWikiPage(title, callback, true, pages);
        }
      } else if (pages.length > 0) {
        callback(pages);
      } else {
        callback([]);
        return false;
      }
    } else if (wikiRequest.readyState === XMLHttpRequest.DONE) {
      alert("error");
    }
  };

  wikiRequest.send();
};
/* harmony export (immutable) */ __webpack_exports__["a"] = fetchWikiPage;


const mergeResult = (fetched, pages) => {
  pages.reverse();
  let count = 0;
  let last = fetched[499].title;
  while (pages[count].title <= last) {
    count ++;
  }
  pages = pages.slice(count);
  return fetched.concat(pages);
};

const formatResponse = (response) => {
  let rjson = JSON.parse(response.responseText);
  if (pageDNE(rjson)) {
    console.log("page DNE");
    return [];
  }
  let pages = Object.keys(rjson.query.pages);
  pages = pages[0];
  pages = rjson.query.pages[pages].revisions[0]["*"];

  pages = pages.match(/\[(.*?)\]/g).map(
    (word) => {
      if (
        word.includes(":") ||
        word.includes("#") ||
        word.includes(".")
      ){
        return "";
      }
      word = word.slice(2, word.length - 1);
      if (word.includes("|")) {
        word = word.split("|");
        word = word[0];
      }
      return word;
    }).filter((word) => word.length > 0);

  return pages;
};

const pageDNE = (response) => {
  let pageIdx = Object.keys(response.query.pages);
  pageIdx = pageIdx[0];
  return (pageIdx === "-1");
};


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class PolyHash {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = PolyHash;


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


/***/ })
/******/ ]);