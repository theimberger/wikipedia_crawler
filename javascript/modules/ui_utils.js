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

export const ResizeCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

export const changeColor = (id, color) => {
  document.getElementById(id).style.color = color;
};
