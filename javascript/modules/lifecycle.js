import * as UIUtils from './ui_utils';
import * as AjaxUtils from './ajax_utils';
import PolyHash from './poly_hash';
import * as D3Utils from './d3_utils';

const LinkMap = new PolyHash();
const FetchQue = [];
var targetPages = [];

export const Start = () => {
  let canvas = document.getElementById('main');
  // UIUtils.ResizeCanvas(canvas);
  // var ctx = canvas.getContext('2d');

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
    AjaxUtils.fetchWikiPage(second.value, updateEnd);
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
  LinkMap.get(LinkMap.currentParent).children = pages;
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
    D3Utils.render(LinkMap);
    return;
  }

  D3Utils.render(LinkMap);
  setTimeout(FetchQue[0], 100);
};

const RunFactory = (title) => () => {
  console.log(title);
  LinkMap.currentParent = title;
  AjaxUtils.fetchWikiPage(title, Run);
  FetchQue.shift();
};

const updateEnd = (pages) => {
  console.log("changed");
  if (pages.length === 0){
    UIUtils.changeColor("end_input", "red");
  } else {
    targetPages = pages;
    document.getElementById("end_input").blur();
    UIUtils.changeColor("end_input", "black");
  }
};
