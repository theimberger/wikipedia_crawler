import * as UIUtils from './ui_utils';
import * as AjaxUtils from './ajax_utils';
import PolyHash from './poly_hash';

const LinkMap = new PolyHash();

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
  UIUtils.addInput()
  let startForm = document.getElementById('start');
  startForm.removeEventListener('submit', InputListener);
  startForm.addEventListener('submit', secondInput);
  startForm.append(endInput);
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
  let i = 0;
  let uniques = [];
  while (i < pages.length) {
    if (!LinkMap.includes(pages[i])) {
      LinkMap.add(pages[i]);
      uniques.push(pages[i]);
    }
    i ++;
  }
};

export const ResizeCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
