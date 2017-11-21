export const hideHeader = () => {
  let header = document.getElementsByTagName('header');
  header = header[0];
  let top = -(header.offsetHeight - 5);
  top += "px";
  header.style.top = top;
};

export const showHeader = () => {
  let header = document.getElementsByTagName('header');
  header = header[0];
  header.style.top = "50px";
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

// export const ResizeCanvas = (canvas) => {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// };

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
