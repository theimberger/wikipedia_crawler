import * as UIUtils from './ui_utils';
import * as AjaxUtils from './ajax_utils';

export const Start = (PageArray) => {
  let canvas = document.getElementById('main');
  ResizeCanvas(canvas);
  var ctx = canvas.getContext('2d');

  let startForm = document.getElementById('start');
  startForm.addEventListener('submit', inputListener(PageArray));
};

const getLinks = (e, PageArray) => {
  e.preventDefault();
  UIUtils.hideHeader();
  let query = document.getElementById('start_input');
  query.blur();
  AjaxUtils.fetchWikiPage(PageArray, query.value);
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

export const ResizeCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
