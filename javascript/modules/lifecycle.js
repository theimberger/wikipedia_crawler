import * as UIUtils from './ui_utils';
import * as AjaxUtils from './ajax_utils';
import PolyHash from './poly_hash';

const LinkMap = new PolyHash();
var FetchQue = [];

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
      if (LinkMap.includes(LinkMap.destination)) {
        console.log("FOUND IT");
      }
      debugger
      AjaxUtils.fetchWikiPage(FetchQue[0], Run);
      FetchQue.shift();
      console.log(LinkMap);
    },
    1000
  );
};


export const ResizeCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
