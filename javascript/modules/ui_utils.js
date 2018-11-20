export const toQueryMode = () => {
  let body = document.getElementsByTagName("body");
  let header = document.getElementsByTagName("form");
  body = body[0];
  header = header[0];
  body.className = "query_mode";
  header.className = "query_mode";
  document.getElementById("log").className = "query_mode";
  hideHeader();
};

export const showHeader = () => {
  let header = document.getElementsByTagName('header');
  header = header[0];
  header.style.top = "50px";
};

export const hideHeader = () => {
  let header = document.getElementsByTagName('header');
  header = header[0];
  let top = -(header.offsetHeight - 5);
  if (window.innerWidth < 700) top -= 25
  top += "px";
  header.style.top = top;
};

export const addInput = () => {
  let endInput = document.createElement("input");
  endInput.id = "end_input";
  endInput.type = "text";
  endInput.placeholder = "enter a target page";
  let startForm = document.getElementById('start');
  startForm.append(endInput);
  endInput.focus();
};

export const changeColor = (id, color) => {
  document.getElementById(id).style.color = color;
};

export const addLi = (parent, pages) => {
  let newPages = document.createElement("li");
  let bold = document.createElement("span");
  bold.classList.add("bold");
  bold.append(parent + " - ");
  newPages.append(bold);
  newPages.append(pages);
  document.getElementById('log').prepend(newPages);
};

export const disamModal = (pages, callback) => {
  console.log("fired");
  let modal = document.getElementById("disam_modal");
  let pageUl = document.getElementById("disam_helper");
  modal.style.display = "inline";
  let li;
  pages.pop();
  pages.forEach((page) => {
    li = document.createElement("li");
    pageUl.append(li);
    li.append(page);
  });
  pageUl.addEventListener("click", (e) => {
    let input = document.getElementById("end_input");
    input.value = e.target.innerHTML;
    modal.style.display = "none";
    callback(e);
  });
};
