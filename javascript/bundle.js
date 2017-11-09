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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_set_up__ = __webpack_require__(1);


document.addEventListener('DOMContentLoaded', () => {
  Object(__WEBPACK_IMPORTED_MODULE_0__modules_set_up__["a" /* SetUp */])();
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ajax_utils__ = __webpack_require__(3);



const SetUp = () => {
  let canvas = document.getElementById('main');
  ResizeCanvas(canvas);
  var ctx = canvas.getContext('2d');

  let startForm = document.getElementById('start');
  startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    __WEBPACK_IMPORTED_MODULE_0__ui_utils__["a" /* hideHeader */]();
    let query = document.getElementById('start_input');
    query.blur();
    __WEBPACK_IMPORTED_MODULE_1__ajax_utils__["a" /* fetchWikiPage */](query.value);
  });
};
/* harmony export (immutable) */ __webpack_exports__["a"] = SetUp;


const ResizeCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
/* unused harmony export ResizeCanvas */



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const hideHeader = () => {
  let header = document.getElementsByTagName('header');
  header = header[0];
  header.style.top = "-200px";
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
const fetchWikiPage = (title) => {
  var wikiRequest = new XMLHttpRequest();

  wikiRequest.open(
    "GET",
    `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=links&pllimit=max&titles=${title}`
  );

  wikiRequest.onreadystatechange = () => {
    if (
      wikiRequest.readyState === XMLHttpRequest.DONE
      && wikiRequest.status === 200
    ) {
      let rjson = JSON.parse(wikiRequest.responseText);
      let page = Object.keys(rjson.query.pages);
      page = page[0];
      console.log(rjson.query.pages[page].links);
      return rjson.query.pages[page].links;
    } else if (wikiRequest.readyState === XMLHttpRequest.DONE) {
      console.log("error");
    }
  };



  wikiRequest.send(null);
};
/* harmony export (immutable) */ __webpack_exports__["a"] = fetchWikiPage;



/***/ })
/******/ ]);