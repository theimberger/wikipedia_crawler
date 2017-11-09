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


const PageArray = [];

setInterval(() => {
  console.log(PageArray);
}, 10000);

document.addEventListener('DOMContentLoaded', () => {
  __WEBPACK_IMPORTED_MODULE_0__modules_lifecycle__["a" /* Start */](PageArray);
});


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const hideHeader = () => {
  let header = document.getElementsByTagName('header');
  header = header[0];
  let top = -(header.offsetHeight);
  top += "px";
  header.style.top = top;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = hideHeader;


const showHeader = () => {
  let header = document.getElementsByTagName('header');
  header = header[0];
  header.style.top = "50px";
};
/* unused harmony export showHeader */



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// fetchWikiPage is tricky -
//because the wiki api only lets me get 500 links per request,
//if a page has > 500 links, I'll miss some, so I make the same request
//but in decending order.  This does mean I'll miss any links between the two
//if the page has > 1,000 links


const fetchWikiPage = (PageArray, title, reverse = false, fetched = []) => {

  // title - the name of the page we're getting links from
  // reverse - whether we're getting a second batch of links from the same pages
  //    in reverse order
  // fetched - stores the links from the first query

  var wikiRequest = new XMLHttpRequest();

  if (!reverse) {
    wikiRequest.open(
      "GET",
      `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=links&pllimit=max&titles=${title}`
    );
  } else {
    wikiRequest.open(
      "GET",
      `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=links&pllimit=max&titles=${title}&pldir=descending`
    );
  }

  wikiRequest.onreadystatechange = () => {

    if (
      wikiRequest.readyState === XMLHttpRequest.DONE
      && wikiRequest.status === 200
    ) {
      let rjson = JSON.parse(wikiRequest.responseText);
      let pages = Object.keys(rjson.query.pages);
      pages = pages[0];
      pages = rjson.query.pages[pages].links;
      if (pages.length === 500) {
        if (reverse) {
          pages = mergeResult(fetched, pages);
          console.log(pages);
          PageArray.push(pages);
        } else {
          console.log(pages);
          fetchWikiPage(PageArray, title, true, pages);
        }
      } else if (pages.length > 0) {
        console.log(pages);
        PageArray.push(pages);
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


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ajax_utils__ = __webpack_require__(3);



const Start = (PageArray) => {
  let canvas = document.getElementById('main');
  ResizeCanvas(canvas);
  var ctx = canvas.getContext('2d');

  let startForm = document.getElementById('start');
  startForm.addEventListener('submit', inputListener(PageArray));
};
/* harmony export (immutable) */ __webpack_exports__["a"] = Start;


const getLinks = (e, PageArray) => {
  e.preventDefault();
  __WEBPACK_IMPORTED_MODULE_0__ui_utils__["a" /* hideHeader */]();
  let query = document.getElementById('start_input');
  query.blur();
  __WEBPACK_IMPORTED_MODULE_1__ajax_utils__["a" /* fetchWikiPage */](PageArray, query.value);
  AddInput();
};

const inputListener = (PageArray) => (e) => getLinks(e, PageArray);

const AddInput = () => {
  let endInput = document.createElement("input");
  endInput.id = "end_input";
  endInput.type = "text";
  endInput.placeholder = "Enter a target page";
  let startForm = document.getElementById('start');
  startForm.append(endInput);
};

const ResizeCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
/* unused harmony export ResizeCanvas */



/***/ })
/******/ ]);