import * as UIUtils from './ui_utils';
import * as AjaxUtils from './ajax_utils';
import PolyHash from './poly_hash';

const LinkMap = new PolyHash();
const FetchQue = [];

export const Start = () => {
  let canvas = document.getElementById('main');
  ResizeCanvas(canvas);
  var ctx = canvas.getContext('2d');

  let startForm = document.getElementById('start');
  startForm.addEventListener('submit', InputListener);
};

const GetLinks = (e) => {
  e.preventDefault();
  UIUtils.hideHeader();
  let query = document.getElementById('start_input');
  query.blur();
  LinkMap.add(query.value);
  AjaxUtils.fetchWikiPage(query.value, Run);
  AddInput();
};

const InputListener = (e) => GetLinks(e);

const AddInput = () => {
  UIUtils.addInput();
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
    AjaxUtils.fetchWikiPage(first.value, Run);
    return;
  }
  if (second.value !== LinkMap.destination){
    LinkMap.destination = second.value;
    return;
  }
};



////////// NOT MINE //////////////
function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

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

  let i = 0;

  while (i < pages.length) {
    Test.append(pages[i] + " ");
    LinkMap.add(pages[i]);
    FetchQue.push(RunFactory(pages[i]));
    // uniques.push(pages[i]);
    if (pages[i] === LinkMap.destination) {
      found = true;
    }
    i ++;
  }

  if (found) {
    console.log("FOUND IT");
    debugger
  }

  setTimeout(FetchQue[0], 200);
};

const RunFactory = (title) => () => {
  console.log(title);
  LinkMap.currentParent = title;
  AjaxUtils.fetchWikiPage(title, Run);
  FetchQue.shift();
};

export const ResizeCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
