import * as UIUtils from './ui_utils';
import * as AjaxUtils from './ajax_utils';

export const SetUp = () => {
  let canvas = document.getElementById('main');
  ResizeCanvas(canvas);
  var ctx = canvas.getContext('2d');

  let startForm = document.getElementById('start');
  startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UIUtils.hideHeader();
    let query = document.getElementById('start_input');
    query.blur();
    AjaxUtils.fetchWikiPage(query.value);
  });
};

export const ResizeCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
