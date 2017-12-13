import * as UIUtils from './ui_utils';
import * as AjaxUtils from './ajax_utils';
import PolyHash from './poly_hash';
import TreeVisualization from './tree_utils';

const Tree = new TreeVisualization();
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
  if (document.getElementById("end_input") === null){
    first.blur();
    AjaxUtils.fetchWikiPage(first.value, setFirstPage);
    UIUtils.addInput();
    return;
  }

  let second = document.getElementById('end_input');

  if (first.value !== LinkMap.origin) {
    first.style.color = "black";
    LinkMap.reset();
    document.getElementById("log").innerHTML = "";
    FetchQue.length = 0;
    AjaxUtils.fetchWikiPage(first.value, setFirstPage);
    return;
  }
  if (second.value !== LinkMap.destination){
    AjaxUtils.fetchWikiPage(second.value, updateEnd);
    return;
  }
};

const setFirstPage = (pages, correctedTitle) => {
  if (pages.length > 0) {
    LinkMap.add(correctedTitle);
    LinkMap.origin = correctedTitle;
    LinkMap.currentParent = correctedTitle;
    document.getElementById("start_input").value = correctedTitle;
    if (LinkMap.destination !== ""){
      FetchQue.length = 0;
      Tree.origin = "";
      Run(pages);
    }
  } else {
    UIUtils.changeColor("start_input", "red");
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
    if (LinkMap.includes(pages[i])
      || LinkMap.includes(pages[i].toLowerCase())) {
      i ++;
      continue;
    }
    if (targetPages.includes(pages[i])) {
      filtered.push(pages[i]);
      LinkMap.add(pages[i]);
      i ++;
      continue;
    }
    if (pages[i].includes(LinkMap.destination) &&
        LinkMap.destination.length > 4) {
      filtered.push(pages[i]);
      LinkMap.add(pages[i]);
      i ++;
      continue;
    }

    if ((50 * Math.random()) + frequency > 50) {
      filtered.push(pages[i]);
      LinkMap.add(pages[i]);
    }

    i ++;
  }

  return filtered;
};

const Run = (pages) => {
  if (pages[pages.length - 1] === "Wiktionary"
    && LinkMap.destination !== "Wiktionary"){
    pages.pop();
  }
  if (FetchQue.length === 0 && pages.length === 0) {
    document.getElementById('start_input').style.color = "red";
    return;
  }

  let finished = LinkMap.currentParent.toLowerCase() === LinkMap.destination.toLowerCase();

  var log = document.getElementById('log');
  pages = filterPages(pages);
  LinkMap.get(LinkMap.currentParent).children = pages;

  if (Tree.origin !== LinkMap.origin) {
    Tree.plant(LinkMap.get(LinkMap.origin));
  } else {
    Tree.addLeaf(LinkMap.get(LinkMap.currentParent), finished);
  }

  UIUtils.addLi(LinkMap.currentParent, pages);

  let i = 0;

  while (i < pages.length) {
    FetchQue.push(RunFactory(pages[i]));
    if (pages[i].toLowerCase() === LinkMap.destination.toLowerCase()) {
      FetchQue.length = 0;
      FetchQue.push(RunFactory(pages[i]));
    }
    i ++;
  }

  if (finished) {
    console.log("FOUND IT");
    console.log(LinkMap.trace(LinkMap.destination));
    FetchQue.length = 0;
    return;
  }

  setTimeout(FetchQue[0], 100);
};

const RunFactory = (title) => () => {
  LinkMap.currentParent = title;
  AjaxUtils.fetchWikiPage(title, Run);
  FetchQue.shift();
};

const updateEnd = (pages, correctedTitle) => {
  let first = document.getElementById('start_input');
  if (LinkMap.destination !== "") {
    LinkMap.reset(first.value);
    LinkMap.add(first.value);
    Tree.origin = "";
    document.getElementById("log").innerHTML = "";
    FetchQue.length = 0;
  }
  if (pages.length === 0){
    UIUtils.changeColor("end_input", "red");
    return;
  } else if (pages[pages.length - 1] === "Wiktionary") {
    UIUtils.disamModal(pages, InputListener);
    return;
  } else {
    LinkMap.destination = correctedTitle;
    targetPages = pages;
    let endInput = document.getElementById("end_input");
    endInput.blur();
    endInput.value = correctedTitle;
    UIUtils.changeColor("end_input", "black");
  }
  if (FetchQue.length === 0) {
    UIUtils.toQueryMode();
    AjaxUtils.fetchWikiPage(first.value, Run);
  }
};
