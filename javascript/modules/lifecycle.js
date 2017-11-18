import * as UIUtils from './ui_utils';
import * as AjaxUtils from './ajax_utils';
import PolyHash from './poly_hash';
import * as D3Utils from './d3_utils';
import * as BasicUtils from './basic_utils';

const LinkMap = new PolyHash();
const FetchQue = [];
var targetPages = [];

export const Start = () => {
  let startForm = document.getElementById('start');
  let close = document.getElementById("close");

  close.addEventListener("click", () => {
    document.getElementById("disam_modal").style.display = "none";
    document.getElementById('end_input').focus();
  });

  startForm.addEventListener('keydown', InputListener);
};

const InputListener = (e) => {
  if (e.keyCode !== 13 && e.type === "keydown") {
    return;
  }
  e.preventDefault();

  let first = document.getElementById('start_input');

  if (LinkMap.origin === "" && LinkMap.destination === ""){
    // first.value = BasicUtils.titleCase(first.value);
    first.blur();
    LinkMap.add(first.value);
    UIUtils.addInput();
    return;
  }

  let second = document.getElementById('end_input');

  if (first.value !== LinkMap.origin) {
    // first.value = BasicUtils.titleCase(first.value);
    console.log(first.value);
    LinkMap.reset(first.value);
    FetchQue.length = 0;
    AjaxUtils.fetchWikiPage(first.value, Run);
    return;
  }
  if (second.value !== LinkMap.destination){
    // second.value = BasicUtils.titleCase(second.value);
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
    if (targetPages.includes(pages[i])) {
      filtered.push(pages[i]);
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
  var test = document.getElementById('test');
  pages = filterPages(pages);
  LinkMap.get(LinkMap.currentParent).children = pages;
  UIUtils.addLi(LinkMap.currentParent, pages);

  let i = 0;

  while (i < pages.length) {
    LinkMap.add(pages[i]);
    FetchQue.push(RunFactory(pages[i]));
    if (pages[i].toLowerCase() === LinkMap.destination.toLowerCase()) {
      FetchQue.unshift(RunFactory(pages[i]));
    }
    i ++;
  }

  if (LinkMap.currentParent.toLowerCase()
    === LinkMap.destination.toLowerCase()) {
    console.log("FOUND IT");
    console.log(LinkMap.trace(LinkMap.destination));
    FetchQue.length = 0;
    D3Utils.drawTree(LinkMap);
    return;
  }

  D3Utils.render(LinkMap);
  setTimeout(FetchQue[0], 100);
};

const RunFactory = (title) => () => {
  LinkMap.currentParent = title;
  AjaxUtils.fetchWikiPage(title, Run);
  FetchQue.shift();
};

const updateEnd = (pages) => {
  if (pages.length === 0){
    UIUtils.changeColor("end_input", "red");
    return;
  } else if (pages[pages.length - 1] === "Wiktionary") {
    UIUtils.disamModal(pages, InputListener);
    return;
  } else {
    targetPages = pages;
    document.getElementById("end_input").blur();
    UIUtils.changeColor("end_input", "black");
  }
  if (FetchQue.length === 0) {
    let first = document.getElementById('start_input');
    UIUtils.hideHeader();
    AjaxUtils.fetchWikiPage(first.value, Run);
  }
};
