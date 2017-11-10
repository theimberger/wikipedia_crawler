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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_lifecycle__ = __webpack_require__(4);


document.addEventListener('DOMContentLoaded', () => {
  __WEBPACK_IMPORTED_MODULE_0__modules_lifecycle__["a" /* Start */]();
});


/***/ }),
/* 1 */,
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
/* harmony export (immutable) */ __webpack_exports__["b"] = hideHeader;


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
};
/* harmony export (immutable) */ __webpack_exports__["a"] = addInput;



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

  // if (!reverse) {
  //   wikiRequest.open(
  //     "GET",
  //     `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=links&pllimit=max&titles=${title}`
  //   );
  // } else {
  //   wikiRequest.open(
  //     "GET",
  //     `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=links&pllimit=max&titles=${title}&pldir=descending`
  //   );
  // }
    wikiRequest.open(
      "GET",
      `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=${title}`
    );

  wikiRequest.onreadystatechange = () => {

    if (
      wikiRequest.readyState === XMLHttpRequest.DONE
      && wikiRequest.status === 200
    ) {
      let rjson = JSON.parse(wikiRequest.responseText);
      let pages = Object.keys(rjson.query.pages);
      pages = pages[0];
      pages = rjson.query.pages[pages].revisions[0]["*"];
      pages = pages.match(/\[(\w+)/g).map((word) => word.slice(1));
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


//https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=jsonfm&titles=${}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ajax_utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__poly_hash__ = __webpack_require__(5);




const LinkMap = new __WEBPACK_IMPORTED_MODULE_2__poly_hash__["a" /* default */]();
var FetchQue = [];

const Start = () => {
  let canvas = document.getElementById('main');
  ResizeCanvas(canvas);
  var ctx = canvas.getContext('2d');

  let startForm = document.getElementById('start');
  startForm.addEventListener('submit', InputListener);
};
/* harmony export (immutable) */ __webpack_exports__["a"] = Start;


const GetLinks = (e) => {
  e.preventDefault();
  __WEBPACK_IMPORTED_MODULE_0__ui_utils__["b" /* hideHeader */]();
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
  startForm.addEventListener('submit', secondInput);
};

const secondInput = (e) => (e) => {
  e.preventDefault();
  let first = document.getElementById('start_input');
  let second = document.getElementById('end_input');
  if (first.value !== LinkMap.origin) {
    LinkMap.map = [];
    LinkMap.parent = "";
    LinkMap.origin = "";
    GetLinks(first.value);
    return;
  }
  if (second.value !== LinkMap.destination){
    LinkMap.destination = second.value;
    return;
  }
};

const Run = (pages) => {
  let found = false;
  let i = 0;
  let uniques = [];
  while (i < pages.length) {
    if (!LinkMap.includes(pages[i])) {
      LinkMap.add(pages[i]);
      uniques.push(pages[i]);
      if (pages[i] === LinkMap.destination) {
        found = true;
      }
    }
    i ++;
  }
  i = 0;
  FetchQue = FetchQue.concat(uniques);
  setTimeout(() =>
    {
      console.log(FetchQue);
      __WEBPACK_IMPORTED_MODULE_1__ajax_utils__["a" /* fetchWikiPage */](FetchQue[0], Run);
      FetchQue.shift();
    },
    1000
  );
};

const ResizeCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
/* unused harmony export ResizeCanvas */



/***/ }),
/* 5 */
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

  includes(string) {
    let includes = false;
    let bucket = Math.floor(string.hashCode() % this.map.length);

    if (this.map[bucket] === null) {
      return false;
    }

    this.map[bucket].forEach((pair) => {
      if (pair[0] === string) {
        includes = true;
      }
    });

    return includes;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PolyHash;



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


/***/ })
/******/ ]);