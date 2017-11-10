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
};

const InputListener = (e) => GetLinks(e);

const AddInput = () => {
  let endInput = document.createElement("input");
  endInput.id = "end_input";
  endInput.type = "text";
  endInput.placeholder = "Enter a target page";
  let startForm = document.getElementById('start');
  startForm.append(endInput);
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

  document.getElementById("test").append(pages);
  document.getElementById("test").append("<br>");

  AddInput();
};

export const ResizeCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
